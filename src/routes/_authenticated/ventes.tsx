import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mic, Plus, Minus, Search, ScanLine, Save, CreditCard } from "lucide-react";
import { useState } from "react";
import { fmtFCFA, products } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/ventes")({
  head: () => ({ meta: [{ title: "Nouvelle vente — Nafa+" }] }),
  component: VentesPage,
});

function VentesPage() {
  const [mode, setMode] = useState<"rapide" | "credit">("rapide");
  const [qty, setQty] = useState<Record<string, number>>({ p1: 2, p2: 1, p3: 1, p4: 1 });

  const updateQty = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

  const total = products.reduce((sum, p) => sum + (qty[p.id] ?? 0) * p.price, 0);

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/dashboard" className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-bold">Nouvelle vente</h1>
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Mic className="h-5 w-5" />
        </button>
      </header>

      {/* Tabs */}
      <div className="mx-4 mt-2 grid grid-cols-2 rounded-2xl bg-muted p-1">
        {(["rapide", "credit"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
              mode === m ? "bg-[var(--primary-deep)] text-white shadow-[var(--shadow-card)]" : "text-muted-foreground"
            }`}
          >
            {m === "rapide" ? "Vente rapide" : "Vente à crédit"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher un produit"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Mic className="h-4 w-4 text-primary" />
        </div>
        <button className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card">
          <ScanLine className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Products */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Produits fréquents</h2>
          <button className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Plus className="h-3.5 w-3.5" /> Ajouter
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {products.slice(0, 5).map((p) => {
            const q = qty[p.id] ?? 0;
            return (
              <li key={p.id} className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">{p.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{fmtFCFA(p.price)} FCFA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(p.id, -1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{q}</span>
                    <button
                      onClick={() => updateQty(p.id, 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {q > 0 && (
                  <p className="mt-1.5 text-right text-sm font-bold text-primary">
                    {fmtFCFA(q * p.price)} FCFA
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Total + actions */}
      <div className="fixed bottom-20 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between rounded-2xl bg-[var(--gradient-primary)] px-4 py-3 text-white shadow-[var(--shadow-elevated)]">
          <span className="text-sm font-medium">Total {mode === "credit" ? "à crédit" : "vente"}</span>
          <span className="text-xl font-extrabold">
            {fmtFCFA(total)} <span className="text-xs font-medium text-gold">FCFA</span>
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-semibold">
            <Save className="h-4 w-4" /> Enregistrer
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-gold py-3 text-sm font-bold text-[var(--gold-foreground)] shadow-[var(--shadow-gold)]">
            <CreditCard className="h-4 w-4" /> Encaisser
          </button>
        </div>
      </div>
    </div>
  );
}