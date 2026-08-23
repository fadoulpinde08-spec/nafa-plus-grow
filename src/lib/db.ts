import { supabase } from "@/integrations/supabase/client";

export const fmtFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

export type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  low_stock_threshold: number;
  unit: string;
  emoji: string;
};

export type CustomerBalance = {
  id: string;
  name: string;
  phone: string | null;
  photo_url: string | null;
  balance: number;
  last_sale_at: string | null;
};

export type Sale = {
  id: string;
  total: number;
  cost_total: number;
  payment_method: "cash" | "mobile_money" | "credit";
  created_at: string;
  customer_id: string | null;
};

export const stockStatus = (p: Pick<Product, "stock" | "low_stock_threshold">) =>
  p.stock <= 0 ? "out" : p.stock <= p.low_stock_threshold ? "low" : "ok";

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,cost,stock,low_stock_threshold,unit,emoji")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    price: Number(p.price),
    cost: Number(p.cost),
    stock: Number(p.stock),
    low_stock_threshold: Number(p.low_stock_threshold),
  }));
}

export async function fetchCustomerBalances(): Promise<CustomerBalance[]> {
  const { data, error } = await supabase
    .from("customer_balances")
    .select("id,name,phone,photo_url,balance,last_sale_at")
    .order("balance", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id as string,
    name: c.name as string,
    phone: (c.phone ?? null) as string | null,
    photo_url: (c.photo_url ?? null) as string | null,
    balance: Number(c.balance ?? 0),
    last_sale_at: (c.last_sale_at ?? null) as string | null,
  }));
}

export async function fetchSales(sinceISO?: string): Promise<Sale[]> {
  let q = supabase
    .from("sales")
    .select("id,total,cost_total,payment_method,created_at,customer_id")
    .order("created_at", { ascending: false });
  if (sinceISO) q = q.gte("created_at", sinceISO);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((s) => ({
    ...s,
    total: Number(s.total),
    cost_total: Number(s.cost_total),
  })) as Sale[];
}

export async function fetchProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,shop_name,phone")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function recordSale(input: {
  items: { product_id: string; qty: number }[];
  payment_method: "cash" | "mobile_money" | "credit";
  customer_name?: string | undefined;
  customer_phone?: string | undefined;
}) {
  const { data, error } = await supabase.rpc("record_sale", {
    p_items: input.items,
    p_payment_method: input.payment_method,
    p_customer_name: input.customer_name ?? null,
    p_customer_phone: input.customer_phone ?? null,
    p_note: null,
  });
  if (error) throw error;
  return data as string;
}

export async function upsertProduct(
  p: Partial<Product> & { name: string; price: number },
  userId: string,
) {
  if (p.id) {
    const { error } = await supabase.from("products").update(p as never).eq("id", p.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("products").insert({ ...p, user_id: userId } as never);
  if (error) throw error;
}

export async function payDebt(customerId: string, amount: number) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Non authentifié");
  const { error } = await supabase
    .from("debt_payments")
    .insert({ user_id: userId, customer_id: customerId, amount });
  if (error) throw error;
}

export const STARTER_PRODUCTS = [
  { name: "Riz parfumé 5kg", price: 3500, cost: 2900, stock: 45, unit: "kg", emoji: "🍚" },
  { name: "Huile Palm 1L", price: 1750, cost: 1400, stock: 12, unit: "pcs", emoji: "🛢️" },
  { name: "Sucre 1kg", price: 600, cost: 470, stock: 0, unit: "kg", emoji: "🍬" },
  { name: "Lait concentré", price: 1200, cost: 950, stock: 8, unit: "pcs", emoji: "🥛" },
  { name: "Savon Citronné BF", price: 350, cost: 250, stock: 24, unit: "pcs", emoji: "🧼" },
  { name: "Tomate concentrée", price: 450, cost: 330, stock: 18, unit: "pcs", emoji: "🥫" },
  { name: "Pâtes spaghetti", price: 500, cost: 380, stock: 32, unit: "pcs", emoji: "🍝" },
];

export async function seedStarterProducts(userId: string) {
  const { error } = await supabase
    .from("products")
    .insert(STARTER_PRODUCTS.map((p) => ({ ...p, user_id: userId })));
  if (error) throw error;
}
