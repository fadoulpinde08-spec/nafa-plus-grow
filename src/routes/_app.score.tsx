import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, HelpCircle, Check, Circle, Star, FileText, CreditCard, Shield, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/score")({
  head: () => ({ meta: [{ title: "Score de confiance — Nafa+" }] }),
  component: ScorePage,
});

function ScorePage() {
  const score = 760;
  const pct = score / 1000;

  return (
    <div>
      <header className="flex items-center justify-between bg-background px-4 py-3">
        <Link to="/dashboard" className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-bold">Mon score</h1>
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
          <HelpCircle className="h-5 w-5" />
        </button>
      </header>

      {/* Score dial */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--primary-deep)] p-6 pb-8 text-white shadow-[var(--shadow-elevated)]">
          <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
          <p className="text-center text-xs uppercase tracking-wider text-gold">Score de confiance</p>
          <Gauge value={pct} />
          <p className="-mt-4 text-center">
            <span className="text-5xl font-extrabold">{score}</span>
            <span className="text-base font-medium text-white/60">/1000</span>
          </p>
          <div className="mt-2 flex items-center justify-center gap-1 text-gold">
            <Star className="h-4 w-4 fill-gold" /> <span className="text-sm font-bold">Bon</span>
          </div>
          <p className="mt-3 text-center text-sm text-white/85">
            Ton business est fiable. Tu es éligible à
            <br />
            <span className="font-extrabold text-gold">250 000 FCFA</span> de stock à crédit.
          </p>

          <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gold text-sm font-bold text-[var(--gold-foreground)] shadow-[var(--shadow-gold)]">
            <CreditCard className="h-4 w-4" /> Demander stock à crédit
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* What improves */}
      <section className="mt-4 px-4">
        <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-bold">Ce qui améliore ton score</h3>
          <ul className="mt-3 space-y-2">
            {[
              ["Enregistre tes ventes chaque jour", true],
              ["Règle tes dettes à temps", true],
              ["Maintiens ton stock à jour", true],
              ["Évite les retards de paiement", false],
            ].map(([label, done]) => (
              <li key={label as string} className="flex items-center gap-3 text-sm">
                {done ? (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Circle className="h-3.5 w-3.5" />
                  </span>
                )}
                <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Unlocked perks */}
      <section className="mt-4 px-4">
        <h3 className="mb-2 text-sm font-bold">Avantages débloqués</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: FileText, label: "Rapports avancés", color: "primary" },
            { icon: CreditCard, label: "Accès crédit prioritaire", color: "gold" },
            { icon: Shield, label: "Offres fournisseurs", color: "primary" },
            { icon: Award, label: "Badge commerçant", color: "gold" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  color === "gold" ? "bg-gold/15 text-[var(--gold-foreground)]" : "bg-primary/10 text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-1.5 text-[10px] font-medium leading-tight text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Passport */}
      <section className="mt-4 px-4">
        <div className="flex items-start gap-3 rounded-2xl bg-[var(--gradient-primary)] p-4 text-white shadow-[var(--shadow-card)]">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-[var(--gold-foreground)]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold">Ton passeport financier</p>
            <p className="text-xs text-white/80">
              Construis ta réputation, accède à plus de crédit et développe ton activité.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const r = 90;
  const c = Math.PI * r;
  const offset = c * (1 - value);
  return (
    <div className="mx-auto mt-3 w-[220px]">
      <svg viewBox="0 0 220 130" className="w-full overflow-visible">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.21 25)" />
            <stop offset="50%" stopColor="oklch(0.81 0.16 85)" />
            <stop offset="100%" stopColor="oklch(0.62 0.16 155)" />
          </linearGradient>
        </defs>
        <path
          d={`M 20 110 A ${r} ${r} 0 0 1 200 110`}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M 20 110 A ${r} ${r} 0 0 1 200 110`}
          stroke="url(#g)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
        />
      </svg>
    </div>
  );
}