import { NavLink } from "react-router-dom";
import { Target, Navigation2, Gauge, Sparkles, ShieldAlert } from "lucide-react";
import { cn } from "../lib/utils";

const TABS = [
  { label: "Mission", icon: Target, href: "/dashboard/operator" },
  { label: "Route", icon: Navigation2, href: "/dashboard/operator/route" },
  { label: "Performance", icon: Gauge, href: "/dashboard/operator/performance" },
  { label: "Coaching", icon: Sparkles, href: "/dashboard/operator/coaching" },
  { label: "Safety", icon: ShieldAlert, href: "/dashboard/operator/safety" },
];

export default function OperatorBottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto grid max-w-3xl grid-cols-5">
        {TABS.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.href}
            end={tab.href === "/dashboard/operator"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                    isActive && "bg-primary/15 scale-105"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                </span>
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
