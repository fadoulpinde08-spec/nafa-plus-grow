import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mic, Plus, Search } from "lucide-react";
import { useState } from "react";
import { fmtFCFA, products } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/stock")({
  head: () => ({ meta: [{ title: "Stock — Nafa+" }] }),
  component: StockPage,
});

function StockPage() {
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const list = products.filter((p) =>
    filter === "all" ? true : filter === "low" ? p.status === "low" : p.status === "out",
  );

  return (
    <div>
      <header className="flex items-center justify-between bg-background px-4 py-3">
        <Link to="/dashboard" className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-bold">Stock</h1>
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </button>
      </header>

      <div className="px-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher un produit"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Mic className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="mt-3 flex gap-2 px-4">
        {([
          ["all", "Tous"],
          ["low", "Stock faible"],
          ["out", "Rupture"],
        ] as const).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === k
                ? k === "out"
                  ? "bg-destructive text-destructive-foreground"
                  : k === "low"
                  ? "bg-warning/20 text-warning"
                  : "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <ul className="mt-3 space-y-2 px-4">
        {list.map((p) => {
          const statusLabel =
            p.status === "out" ? "Rupture de stock" : p.status === "low" ? "Stock faible" : "En stock";
          const statusColor =
            p.status === "out" ? "text-destructive" : p.status === "low" ? "text-warning" : "text-success";
          const stockColor =
            p.status === "out" ? "text-destructive" : p.status === "low" ? "text-warning" : "text-foreground";
          return (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">{p.emoji}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.name}</p>
                <p className={`text-xs font-medium ${statusColor}`}>{statusLabel}</p>
                <p className="text-[11px] text-muted-foreground">Valeur: {fmtFCFA(p.price * p.stock)} FCFA</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-extrabold ${stockColor}`}>{p.stock}</p>
                <p className="text-[10px] text-muted-foreground">{p.unit}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}