import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Truck,
  BarChart3,
  Wrench,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/useAuth";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard/supervisor" },
  { label: "Fleet", icon: Truck, href: "/dashboard/supervisor/fleet" },
  { label: "Production", icon: BarChart3, href: "/dashboard/supervisor/production" },
  { label: "Maintenance", icon: Wrench, href: "/dashboard/supervisor/maintenance" },
  { label: "Reports", icon: FileText, href: "/dashboard/supervisor/reports" },
  { label: "Settings", icon: Settings, href: "/dashboard/supervisor/settings" },
];

/**
 * Navigation sidebar.
 *
 * lg+         : static column inside the dashboard flex row.
 * below lg    : fixed off-canvas drawer toggled via `open` / `onClose`,
 *               with a backdrop. Keeps the 256px rail from eating the
 *               viewport on phones/tablets.
 *
 * @param {{ open?: boolean, onClose?: () => void }} props
 */
export default function Sidebar({ open = false, onClose }) {
  const { session, logout } = useAuth();

  return (
    <>
      {/* Backdrop — mobile only, tap to dismiss */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 max-w-[82vw] shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-out",
          "lg:sticky lg:top-0 lg:z-auto lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo size="md" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === "/dashboard/supervisor"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground surface-chip-hover hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-4">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold uppercase text-primary">
              {session?.name?.[0] ?? "S"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium capitalize text-foreground">
                {session?.name ?? "Supervisor"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session?.email ?? "supervisor@veltrix-mining.com"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors surface-chip-hover hover:text-foreground"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
