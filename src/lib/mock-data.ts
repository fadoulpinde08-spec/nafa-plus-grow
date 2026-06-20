export const fmtFCFA = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n);

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  emoji: string;
  status: "ok" | "low" | "out";
};

export const products: Product[] = [
  { id: "p1", name: "Riz parfumé 5kg", price: 3500, stock: 45, unit: "kg", emoji: "🍚", status: "ok" },
  { id: "p2", name: "Huile Palm 1L", price: 1750, stock: 12, unit: "pcs", emoji: "🛢️", status: "ok" },
  { id: "p3", name: "Sucre 1kg", price: 600, stock: 0, unit: "kg", emoji: "🍬", status: "out" },
  { id: "p4", name: "Lait concentré", price: 1200, stock: 8, unit: "pcs", emoji: "🥛", status: "low" },
  { id: "p5", name: "Savon Citronné BF", price: 350, stock: 24, unit: "pcs", emoji: "🧼", status: "ok" },
  { id: "p6", name: "Savon 250g", price: 250, stock: 3, unit: "pcs", emoji: "🧴", status: "low" },
  { id: "p7", name: "Tomate concentrée", price: 450, stock: 18, unit: "pcs", emoji: "🥫", status: "ok" },
  { id: "p8", name: "Pâtes spaghetti", price: 500, stock: 32, unit: "pcs", emoji: "🍝", status: "ok" },
];

export type Debt = {
  id: string;
  name: string;
  initials: string;
  amount: number;
  lastSale: string;
  phone: string;
};

export const debts: Debt[] = [
  { id: "d1", name: "Moussa Traoré", initials: "MT", amount: 45000, lastSale: "2 juin 2026", phone: "+226 70 11 22 33" },
  { id: "d2", name: "Awa Diallo", initials: "AD", amount: 32500, lastSale: "31 mai 2026", phone: "+226 70 11 22 34" },
  { id: "d3", name: "Issa Zongo", initials: "IZ", amount: 25000, lastSale: "30 mai 2026", phone: "+226 70 11 22 35" },
  { id: "d4", name: "Binta Kaboré", initials: "BK", amount: 22000, lastSale: "28 mai 2026", phone: "+226 70 11 22 36" },
  { id: "d5", name: "Bakary Sanou", initials: "BS", amount: 18500, lastSale: "25 mai 2026", phone: "+226 70 11 22 37" },
  { id: "d6", name: "Fatou Ouédraogo", initials: "FO", amount: 12000, lastSale: "22 mai 2026", phone: "+226 70 11 22 38" },
];
