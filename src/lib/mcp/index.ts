import { defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import listDebtsTool from "./tools/list-debts";
import salesSummaryTool from "./tools/sales-summary";

export default defineMcp({
  name: "nafa-plus-mcp",
  title: "Nafa+ MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Nafa+ commerce app: inspect product inventory, outstanding customer debts (créances clients), and daily sales KPIs.",
  tools: [listProductsTool, listDebtsTool, salesSummaryTool],
});