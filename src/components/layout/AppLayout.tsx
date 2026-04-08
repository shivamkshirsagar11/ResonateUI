import { Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useEffect } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-body">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <main className="flex-1 overflow-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
