import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Eye, LogOut, Mic, TrendingUp, ArrowRight, AlertTriangle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fmtFCFA, products } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Nafa+" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const lowStock = products.filter((p) => p.status !== "ok");

  return (
    <div>
      {/* Header */}
      <header className="relative overflow-hidden rounded-b-[28px] bg-[var(--primary-deep)] px-5 pb-8 pt-[max(env(safe-area-inset-top),16px)] text-white">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative flex items-center justify-between pt-3">
          <button
            onClick={signOut}
            aria-label="Se déconnecter"
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <button className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>
        <div className="relative mt-4">
          <h1 className="text-2xl font-extrabold">
            Bonjour, Adama <span>👋</span>
          </h1>
          <p className="mt-1 text-sm text-white/75">Marché central de Bobo</p>
          <span className="mt-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
            Aujourd'hui, 4 juin 2026
          </span>
        </div>
      </header>

      {/* Summary card */}
      <section className="-mt-6 px-4">
        <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Résumé du jour</h2>
            <button className="text-muted-foreground"><Eye className="h-4 w-4" /></button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Metric label="Ventes" value="12 450" unit="FCFA" />
            <Metric label="Bénéfice net" value="38 750" unit="FCFA" highlight />
            <Metric label="Transactions" value="24" />
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-success">
            <TrendingUp className="h-3.5 w-3.5" /> +12% vs hier
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="mt-4 px-4">
        <Link
          to="/ventes"
          className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-[var(--gradient-primary)] p-4 text-white shadow-[var(--shadow-elevated)]"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-[var(--gold-foreground)]">
              <Plus className="h-6 w-6" strokeWidth={2.6} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70">Action rapide</p>
              <p className="text-lg font-bold">Nouvelle Vente</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/20 text-gold">
              <Mic className="h-5 w-5" />
            </span>
            <VoiceWave />
          </div>
        </Link>
      </section>

      {/* KPI grid */}
      <section className="mt-4 grid grid-cols-2 gap-3 px-4">
        <KpiCard tone="cream" label="Créances clients" value={fmtFCFA(22000)} sub="12 clients" to="/dettes" />
        <KpiCard tone="rose" label="Total dettes" value={fmtFCFA(3500)} sub="3 fournisseurs" />
        <KpiCard tone="mint" label="Ventes du mois" value={fmtFCFA(1245000)} sub="↑ 18% vs Mai" />
        <KpiCard tone="gold" label="Bénéfice net" value={fmtFCFA(312400)} sub="↑ 16% vs Mai" />
      </section>

      {/* Stock alert */}
      <section className="mt-4 px-4">
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-warning/15 text-warning">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Alertes stock faible</p>
                <p className="text-xs text-muted-foreground">{lowStock.length} produits critiques</p>
              </div>
            </div>
            <Link to="/stock" className="text-xs font-semibold text-primary">
              Voir →
            </Link>
          </div>
          <ul className="mt-3 space-y-1.5">
            {lowStock.slice(0, 3).map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-card px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-lg">{p.emoji}</span>
                  <span className="font-medium">{p.name}</span>
                </span>
                <span className={p.status === "out" ? "text-destructive font-bold" : "text-warning font-semibold"}>
                  {p.stock} {p.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Score teaser */}
      <section className="mt-4 px-4">
        <Link to="/score" className="flex items-center justify-between rounded-2xl bg-[var(--primary-deep)] p-4 text-white shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xs uppercase tracking-wider text-gold">Score de confiance</p>
            <p className="mt-1 text-2xl font-extrabold">760<span className="text-sm font-medium text-white/60">/1000</span></p>
            <p className="text-xs text-white/75">Tu es éligible à <span className="font-semibold text-gold">250 000 FCFA</span> de crédit</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/20">
            <ArrowRight className="h-5 w-5 text-gold" />
          </div>
        </Link>
      </section>
    </div>
  );
}

function Metric({ label, value, unit, highlight }: { label: string; value: string; unit?: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-extrabold leading-tight ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      {unit && <p className="text-[10px] text-muted-foreground">{unit}</p>}
    </div>
  );
}

function KpiCard({
  tone,
  label,
  value,
  sub,
  to,
}: {
  tone: "cream" | "rose" | "mint" | "gold";
  label: string;
  value: string;
  sub: string;
  to?: string;
}) {
  const toneClass = {
    cream: "bg-[oklch(0.96_0.04_85)]",
    rose: "bg-[oklch(0.95_0.04_25)]",
    mint: "bg-[oklch(0.95_0.05_160)]",
    gold: "bg-gold/15",
  }[tone];
  const inner = (
    <div className={`rounded-2xl p-3.5 ${toneClass}`}>
      <p className="text-[11px] font-medium text-foreground/70">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-foreground">{value}</p>
      <p className="mt-0.5 text-[11px] text-foreground/60">{sub}</p>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function VoiceWave() {
  return (
    <div className="flex items-end gap-0.5">
      {[10, 16, 22, 14, 8].map((h, i) => (
        <span
          key={i}
          className="w-0.5 rounded-full bg-gold"
          style={{ height: h, animation: `wv 1s ease-in-out ${i * 0.1}s infinite alternate` }}
        />
      ))}
      <style>{`@keyframes wv{from{transform:scaleY(.4)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}