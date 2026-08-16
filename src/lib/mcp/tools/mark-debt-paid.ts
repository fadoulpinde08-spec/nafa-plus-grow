import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { store } from "../store";

export default defineTool({
  name: "mark_debt_paid",
  title: "Mark a customer debt paid",
  description:
    "Record a repayment on a customer credit (créance). Pays the full balance unless an amount is given.",
  inputSchema: {
    customer: z.string().trim().min(1).describe("Customer name or debt id."),
    amount: z
      .number()
      .positive()
      .optional()
      .describe("Amount repaid in FCFA. Omit to settle the full balance."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false },
  handler: ({ customer, amount }) => {
    const db = store();
    const key = customer.toLowerCase();
    const index = db.debts.findIndex((d) => d.id === customer || d.name.toLowerCase() === key);
    if (index === -1) throw new ToolError(`Aucune créance trouvée pour "${customer}".`);
    const debt = db.debts[index]!;
    const paid = amount ?? debt.amount;
    if (paid > debt.amount)
      throw new ToolError(`Le montant dépasse la créance de ${debt.name} (${debt.amount} FCFA).`);
    debt.amount -= paid;
    const settled = debt.amount === 0;
    if (settled) db.debts.splice(index, 1);
    return {
      content: [
        {
          type: "text",
          text: settled
            ? `Créance soldée: ${debt.name} (${paid} FCFA).`
            : `Paiement de ${paid} FCFA enregistré pour ${debt.name}. Reste ${debt.amount} FCFA.`,
        },
      ],
      structuredContent: { customer: debt.name, paid, remaining: debt.amount, settled, currency: "FCFA" },
    };
  },
});
