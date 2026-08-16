import { defineTool } from "@lovable.dev/mcp-js";
import { store } from "../store";

export default defineTool({
  name: "sales_summary",
  title: "Sales & stock summary",
  description: "Return a snapshot of today's sales KPIs and low/out-of-stock alerts for Nafa+.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const { products, sales } = store();
    const lowStock = products.filter((p) => p.status !== "ok");
    const summary = {
      currency: "FCFA",
      recordedSales: sales.length,
      today: { sales: 12450, netProfit: 38750, transactions: 24, vsYesterdayPct: 12 },
      month: { sales: 1245000, netProfit: 312400, vsPreviousMonthPct: 18 },
      trustScore: { value: 760, max: 1000, creditEligibleFCFA: 250000 },
      lowStock,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});