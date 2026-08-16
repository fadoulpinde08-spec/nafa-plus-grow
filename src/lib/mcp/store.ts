import { products as seedProducts, debts as seedDebts, type Product, type Debt } from "@/lib/mock-data";

export type Sale = {
  id: string;
  createdAt: string;
  items: { productId: string; name: string; qty: number; unitPrice: number }[];
  total: number;
  paymentMethod: "cash" | "mobile_money" | "credit";
  customer?: string;
};

type Store = { products: Product[]; debts: Debt[]; sales: Sale[] };

const globalStore = globalThis as typeof globalThis & { __nafaStore?: Store };

export function store(): Store {
  if (!globalStore.__nafaStore) {
    globalStore.__nafaStore = {
      products: seedProducts.map((p) => ({ ...p })),
      debts: seedDebts.map((d) => ({ ...d })),
      sales: [],
    };
  }
  return globalStore.__nafaStore;
}

export function stockStatus(stock: number): Product["status"] {
  if (stock <= 0) return "out";
  if (stock <= 10) return "low";
  return "ok";
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
