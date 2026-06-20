import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../components/Logo";
import { Phone, Smile, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nafa+ — Ton business, plus de profit" },
      { name: "description", content: "Gestion commerciale et inclusion financière pour les micro-commerçants d'Afrique de l'Ouest." },
    ],
  }),
  component: Splash,
});

function Splash() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden bg-[var(--primary-deep)] text-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-16 text-center">
        <Logo size={96} />
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
          Nafa<span className="text-gold">+</span>
        </h1>
        <p className="mt-2 text-base text-white/80">Ton business, plus de profit.</p>

        <div className="mt-12 grid w-full gap-3 text-left">
          <Feature icon={<Smile className="h-5 w-5" />} title="Simple" desc="Facile à utiliser, même hors-ligne." />
          <Feature icon={<Phone className="h-5 w-5" />} title="Rapide" desc="Enregistre une vente en 1 action — à la voix." />
          <Feature icon={<Shield className="h-5 w-5" />} title="Sécurisé" desc="Tes données sont protégées." />
        </div>
      </div>

      <div className="relative px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-6">
        <Link
          to="/dashboard"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-gold text-base font-bold text-[var(--gold-foreground)] shadow-[var(--shadow-gold)] transition-transform active:scale-[0.98]"
        >
          Continuer avec mon téléphone
        </Link>
        <Link
          to="/dashboard"
          className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-sm font-semibold text-white/90"
        >
          Se connecter
        </Link>
        <p className="mt-4 text-center text-xs text-white/50">
          En continuant tu acceptes nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/20 text-gold">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/70">{desc}</p>
      </div>
    </div>
  );
}
