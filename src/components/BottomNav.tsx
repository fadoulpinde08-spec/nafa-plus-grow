import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingCart, Package, Wallet, BarChart3 } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Accueil", icon: Home },
  { to: "/ventes", label: "Ventes", icon: ShoppingCart },
  { to: "/stock", label: "Stock", icon: Package },
  { to: "/dettes", label: "Dettes", icon: Wallet },
  { to: "/score", label: "Score", icon: BarChart3 },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="flex items-stretch justify-between px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors"
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span className={active ? "text-primary" : "text-muted-foreground"}>{label}</span>
                {active && <span className="h-1 w-1 rounded-full bg-gold" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
