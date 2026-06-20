import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Search, Mic, MessageSquare, Users } from "lucide-react";
import { useState } from "react";
import { debts, fmtFCFA } from "../lib/mock-data";

export const Route = createFileRoute("/_app/dettes")({
  head: () => ({ meta: [{ title: "Dettes clients — Nafa+" }] }),
  component: DettesPage,
});

function DettesPage() {
  const [tab, setTab] = useState<"tous" | "me" | "je">("tous");
  const total = debts.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <header className="flex items-center justify-between bg-background px-4 py-3">
        <Link to="/dashboard" className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-bold">Dettes clients</h1>
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </button>
      </header>

      <div className="mx-4 grid grid-cols-3 rounded-2xl bg-muted p-1">
        {([
          ["tous", "Tous"],
          ["me", "Me doivent"],
          ["je", "Je dois"],
        ] as const).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-xl py-2 text-xs font-semibold ${
              tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-4 px-4">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--primary-deep)] p-4 text-white shadow-[var(--shadow-elevated)]">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs text-white/70">Total à me devoir</p>
              <p className="mt-1 text-3xl font-extrabold">
                {fmtFCFA(total)} <span className="text-sm font-medium text-gold">FCFA</span>
              </p>
              <p className="mt-1 text-xs text-white/70">{debts.length} clients</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-[var(--gold-foreground)]">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher un client"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <ul className="mt-3 space-y-2 px-4">
        {debts.map((d) => (
          <li key={d.id} className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--gradient-primary)] text-sm font-bold text-white">
                {d.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="text-xs text-muted-foreground">Dernière vente: {d.lastSale}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-destructive">{fmtFCFA(d.amount)}</p>
                <p className="text-[10px] text-muted-foreground">FCFA</p>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted py-2 text-xs font-semibold text-foreground">
                <Mic className="h-3.5 w-3.5 text-primary" /> Relance vocale
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold/15 py-2 text-xs font-semibold text-[var(--gold-foreground)]">
                <MessageSquare className="h-3.5 w-3.5" /> Relance SMS
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 px-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-success/30 bg-success/5 py-3 text-sm font-bold text-success">
          <MessageSquare className="h-4 w-4" /> Envoyer rappels WhatsApp à tous
        </button>
      </div>
    </div>
  );
}