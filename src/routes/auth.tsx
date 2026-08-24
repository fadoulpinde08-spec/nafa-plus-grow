import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail, Store, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Connexion commerçant — Nafa+" },
      {
        name: "description",
        content:
          "Connecte-toi à Nafa+ pour gérer tes ventes, ton stock et les dettes de tes clients en toute sécurité.",
      },
      { property: "og:title", content: "Connexion commerçant — Nafa+" },
      {
        property: "og:description",
        content: "Accède à ton compte Nafa+ : ventes, stock, créances et score de confiance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, shop_name: shopName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Compte créé — confirme ton email pour continuer.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connexion Google impossible");
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background">
      <div className="relative overflow-hidden rounded-b-[28px] bg-[var(--primary-deep)] px-6 pb-10 pt-[max(env(safe-area-inset-top),32px)] text-white">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative flex flex-col items-center text-center">
          <Logo size={64} />
          <h1 className="mt-4 text-2xl font-extrabold">
            Nafa<span className="text-gold">+</span>
          </h1>
          <p className="mt-1 text-sm text-white/75">Ton business, plus de profit.</p>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 rounded-2xl bg-muted p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-xl py-2 text-sm font-semibold ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {m === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          ))}
        </div>
      </div>

      {sent ? (
        <div className="mt-6 px-5">
          <div className="rounded-2xl border border-success/30 bg-success/5 p-4 text-sm text-foreground">
            <p className="font-bold">Vérifie ta boîte mail</p>
            <p className="mt-1 text-muted-foreground">
              On a envoyé un lien de confirmation à {email}. Clique dessus puis reviens ici pour te connecter.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-3 px-5">
          {mode === "signup" && (
            <>
              <Field icon={<User className="h-4 w-4" />}>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ton nom complet"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </Field>
              <Field icon={<Store className="h-4 w-4" />}>
                <input
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Nom de la boutique"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </Field>
            </>
          )}
          <Field icon={<Mail className="h-4 w-4" />}>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>
          <Field icon={<Lock className="h-4 w-4" />}>
            <input
              required
              minLength={6}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gold text-base font-bold text-[var(--gold-foreground)] shadow-[var(--shadow-gold)] transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>

          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">ou</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={onGoogle}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground"
          >
            Continuer avec Google
          </button>
        </form>
      )}

      <p className="mt-auto px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-6 text-center text-[11px] text-muted-foreground">
        Tes données de boutique sont privées et protégées.
      </p>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3.5 text-muted-foreground">
      {icon}
      {children}
    </div>
  );
}
