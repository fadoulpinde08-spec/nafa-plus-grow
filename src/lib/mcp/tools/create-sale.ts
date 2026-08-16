import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { store, stockStatus, initials, type Sale } from "../store";

export default defineTool({
  name: "create_sale",
  title: "Create a sale",
  description:
    "Record a new sale in Nafa+, decrement stock, and create/extend a customer debt when paid on credit.",
  inputSchema: {
    items: z
      .array(
        z.object({
          productId: z.string().describe("Product id, e.g. p1."),
          qty: z.number().int().positive().describe("Quantity sold."),
        }),
      )
      .min(1)
      .describe("Items sold."),
    paymentMethod: z
      .enum(["cash", "mobile_money", "credit"])
      .default("cash")
      .describe("How the sale was paid."),
    customer: z
      .string()
      .trim()
      .optional()
      .describe("Customer name. Required when paymentMethod is credit."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: ({ items, paymentMethod, customer }) => {
    const db = store();
    const lines = items.map((item) => {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) throw new ToolError(`Produit introuvable: ${item.productId}`);
      if (product.stock < item.qty)
        throw new ToolError(`Stock insuffisant pour ${product.name} (${product.stock} restant).`);
      return { product, qty: item.qty };
    });

    if (paymentMethod === "credit" && !customer)
      throw new ToolError("Un nom de client est requis pour une vente à crédit.");

    for (const line of lines) {
      line.product.stock -= line.qty;
      line.product.status = stockStatus(line.product.stock);
    }

    const sale: Sale = {
      id: `s${db.sales.length + 1}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        qty: l.qty,
        unitPrice: l.product.price,
      })),
      total: lines.reduce((s, l) => s + l.product.price * l.qty, 0),
      paymentMethod,
      ...(customer ? { customer } : {}),
    };
    db.sales.push(sale);

    if (paymentMethod === "credit" && customer) {
      const existing = db.debts.find((d) => d.name.toLowerCase() === customer.toLowerCase());
      const lastSale = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      if (existing) {
        existing.amount += sale.total;
        existing.lastSale = lastSale;
      } else {
        db.debts.push({
          id: `d${db.debts.length + 1}-${Date.now()}`,
          name: customer,
          initials: initials(customer),
          amount: sale.total,
          lastSale,
          phone: "",
        });
      }
    }

    return {
      content: [{ type: "text", text: `Vente enregistrée: ${sale.total} FCFA (${paymentMethod}).` }],
      structuredContent: { sale, currency: "FCFA" },
    };
  },
});
