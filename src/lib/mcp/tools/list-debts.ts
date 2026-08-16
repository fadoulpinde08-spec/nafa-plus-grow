import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { store } from "../store";

export default defineTool({
  name: "list_customer_debts",
  title: "List customer debts",
  description: "List outstanding customer credits (créances clients) tracked in Nafa+.",
  inputSchema: {
    minAmount: z
      .number()
      .nonnegative()
      .optional()
      .describe("Only return debts greater than or equal to this amount in FCFA."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ minAmount }) => {
    const debts = store().debts;
    const rows = minAmount ? debts.filter((d) => d.amount >= minAmount) : debts;
    const total = rows.reduce((s, d) => s + d.amount, 0);
    return {
      content: [
        {
          type: "text",
          text: `${rows.length} client(s), total ${total} FCFA\n${JSON.stringify(rows, null, 2)}`,
        },
      ],
      structuredContent: { debts: rows, total, currency: "FCFA" },
    };
  },
});