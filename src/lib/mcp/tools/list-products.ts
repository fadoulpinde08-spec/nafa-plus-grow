import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { store } from "../store";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List Nafa+ inventory products, optionally filtered by stock status.",
  inputSchema: {
    status: z
      .enum(["ok", "low", "out"])
      .optional()
      .describe("Filter products by stock status."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status }) => {
    const products = store().products;
    const rows = status ? products.filter((p) => p.status === status) : products;
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { products: rows },
    };
  },
});