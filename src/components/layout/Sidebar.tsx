import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Upload,
  Zap,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/home",
    icon: LayoutDashboard,
  },
  {
    id: "upload",
    label: "Upload Document",
    path: "/home/upload",
    icon: Upload,
  },
  {
    id: "documents",
    label: "My Documents",
    path: "/home/documents",
    icon: FileText,
  },
  {
    id: "chat",
    label: "Chat with Docs",
    path: "/home/chat",
    icon: MessageSquare,
  },
] as const;

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { logout, principalId } = useAuth();
  const location = useLocation();

  const displayId = principalId
    ? `${principalId.slice(0, 5)}…${principalId.slice(-4)}`
    : "Anonymous";

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border h-full",
        "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        collapsed ? "w-16" : "w-64",
      )}
      data-ocid="sidebar-nav"
    >
      {/* Logo / Brand */}
      <div
        className={cn(
          "flex items-center gap-3 h-16 px-4 border-b border-sidebar-border flex-shrink-0",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-display font-bold text-sidebar-foreground leading-none truncate">
              DocMind AI
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Document Intelligence
            </p>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "absolute -right-3 top-[4.5rem] z-20 h-6 w-6 rounded-full",
          "bg-sidebar border border-sidebar-border flex items-center justify-center",
          "text-muted-foreground hover:text-foreground hover:bg-card",
          "transition-smooth shadow-xs",
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-ocid="sidebar-toggle"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {NAV_ITEMS.map(({ id, label, path, icon: Icon }) => {
          const isActive =
            path === "/home"
              ? location.pathname === "/home"
              : location.pathname.startsWith(path);

          return (
            <Link
              key={id}
              to={path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium",
                "transition-smooth group relative",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground border border-transparent",
              )}
              data-ocid={`nav-${id}`}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 h-4.5 w-4.5",
                  isActive ? "text-primary" : "text-current",
                )}
                style={{ height: 18, width: 18 }}
              />
              {!collapsed && <span className="truncate">{label}</span>}
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <span
                  className={cn(
                    "absolute left-full ml-3 whitespace-nowrap rounded-md",
                    "bg-card border border-border px-2.5 py-1.5 text-xs font-medium text-foreground",
                    "opacity-0 pointer-events-none group-hover:opacity-100",
                    "transition-opacity duration-150 z-50 shadow-xs",
                  )}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile / logout */}
      <div className="border-t border-sidebar-border p-3 flex-shrink-0">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-lg p-2",
            collapsed && "justify-center",
          )}
        >
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex-shrink-0 flex items-center justify-center text-xs font-bold text-background">
            U
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {displayId}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => logout()}
            className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-smooth"
            aria-label="Log out"
            data-ocid="logout-btn"
          >
            <LogOut style={{ height: 15, width: 15 }} />
          </button>
        </div>
      </div>
    </aside>
  );
}
