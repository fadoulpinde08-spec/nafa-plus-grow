import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { store, stockStatus } from "../store";

export default defineTool({
  name: "add_product",
  title: "Add or restock a product",
  description:
    "Add a new product to the Nafa+ inventory, or add stock to an existing product with the same name.",
  inputSchema: {
    name: z.string().trim().min(1).describe("Product name, e.g. Riz parfumé 5kg."),
    price: z.number().positive().describe("Unit price in FCFA."),
    stock: z.number().int().nonnegative().default(0).describe("Quantity in stock to add."),
    unit: z.string().trim().default("pcs").describe("Unit label, e.g. kg or pcs."),
    emoji: z.string().trim().default("📦").describe("Emoji shown in the inventory list."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: ({ name, price, stock, unit, emoji }) => {
    if (price <= 0) throw new ToolError("Le prix doit être supérieur à 0.");
    const db = store();
    const existing = db.products.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.stock += stock;
      existing.price = price;
      existing.status = stockStatus(existing.stock);
      return {
        content: [{ type: "text", text: `Réapprovisionné: ${existing.name} → ${existing.stock} ${existing.unit}.` }],
        structuredContent: { product: existing, created: false },
      };
    }
    const product = {
      id: `p${db.products.length + 1}-${Date.now()}`,
      name,
      price,
      stock,
      unit,
      emoji,
      status: stockStatus(stock),
    };
    db.products.push(product);
    return {
      content: [{ type: "text", text: `Produit ajouté: ${name} (${price} FCFA, ${stock} ${unit}).` }],
      structuredContent: { product, created: true },
    };
  },
});
