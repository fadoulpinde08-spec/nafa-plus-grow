import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import listDebtsTool from "./tools/list-debts";
import salesSummaryTool from "./tools/sales-summary";
import createSaleTool from "./tools/create-sale";
import addProductTool from "./tools/add-product";
import markDebtPaidTool from "./tools/mark-debt-paid";

const supabaseUrl = (
  process.env['SUPABASE_URL'] ??
  import.meta.env['VITE_SUPABASE_URL'] ??
  ''
).replace(/\/+$/, "");

export default defineMcp({
  name: "nafa-plus-mcp",
  title: "Nafa+ MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Nafa+ commerce app: inspect product inventory, outstanding customer debts (créances clients), and daily sales KPIs, and record sales, products and debt repayments.",
  auth: auth.oauth.issuer({
    issuer: `${supabaseUrl}/auth/v1`,
    acceptedAudiences: "authenticated",
    jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
    resourceName: "Nafa+ MCP",
  }),

  tools: [
    listProductsTool,
    listDebtsTool,
    salesSummaryTool,
    createSaleTool,
    addProductTool,
    markDebtPaidTool,
  ],
});