import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "../components/BottomNav";

export const Route = createFileRoute("/_authenticated")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-background pb-24">
      <Outlet />
      <BottomNav />
    </div>
  );
}
