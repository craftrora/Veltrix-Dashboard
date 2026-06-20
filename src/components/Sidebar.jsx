import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Truck,
  BarChart3,
  Wrench,
  FileText,
  Settings,
  LogOut,
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

export default function Sidebar() {
  const { session, logout } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center px-6 py-6">
        <Logo size="md" />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === "/dashboard/supervisor"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground surface-chip-hover hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4.5 w-4.5" />
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
          <LogOut className="h-4.5 w-4.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
