import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar,
  BarChart3,
  Wrench,
  BrainCircuit,
  Map,
  Navigation,
  ShieldCheck,
  Gauge,
  ArrowRight,
  LogOut,
} from "lucide-react";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/useAuth";
import { cn } from "../lib/utils";

const ROLES = [
  {
    id: "supervisor",
    title: "Supervisor Intelligence",
    description: "Command-center oversight of fleet, production, and site-wide AI decisions.",
    route: "/dashboard/supervisor",
    accent: "from-orange-500/20 to-orange-500/0",
    capabilities: [
      { icon: Radar, label: "Fleet Monitoring" },
      { icon: BarChart3, label: "Production Analytics" },
      { icon: Wrench, label: "Predictive Maintenance" },
      { icon: BrainCircuit, label: "AI Decision Support" },
    ],
  },
  {
    id: "operator",
    title: "Operator Intelligence",
    description: "In-cab guidance, safety alerts, and performance tracking for your shift.",
    route: "/dashboard/operator",
    accent: "from-sky-500/20 to-sky-500/0",
    capabilities: [
      { icon: Map, label: "Mission Assignment" },
      { icon: Navigation, label: "Route Guidance" },
      { icon: ShieldCheck, label: "Safety Guardian" },
      { icon: Gauge, label: "Performance Tracking" },
    ],
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { session, selectRole, logout } = useAuth();
  const [pendingId, setPendingId] = useState(null);

  function handleSelect(role) {
    setPendingId(role.id);
    selectRole(role.id);
    setTimeout(() => {
      navigate(role.route);
    }, 500);
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-[0.05]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-orange-400/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-sky-400/[0.06] blur-[130px]" />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-8 sm:px-10">
        <div className="mb-12 text-center">
          {session?.name && (
            <p className="mb-3 text-sm text-muted-foreground">
              Welcome back, <span className="text-foreground capitalize">{session.name}</span>
            </p>
          )}
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Choose Your <span className="text-gradient-orange">Intelligence Workspace</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Select the workspace that matches your role on site. You can switch
            anytime from your account settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ROLES.map((role, index) => {
            const isPending = pendingId === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleSelect(role)}
                disabled={pendingId !== null}
                style={{ animationDelay: `${index * 120}ms` }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-card p-7 text-left animate-fade-up",
                  "transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-foreground/[0.05] hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.25)]",
                  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                    role.accent
                  )}
                />

                <div className="relative">
                  <div className="mb-5 flex items-start justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">{role.title}</h2>
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-foreground/5 text-muted-foreground transition-all duration-300",
                        "group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground"
                      )}
                    >
                      {isPending ? (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                        </svg>
                      ) : (
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      )}
                    </span>
                  </div>

                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {role.capabilities.map((cap) => (
                      <div
                        key={cap.label}
                        className="flex items-center gap-2.5 rounded-lg border border-border/60 px-3 py-2.5 transition-colors duration-300 group-hover:border-primary/15"
                        style={{ background: "rgba(var(--glass-tint), 0.06)" }}
                      >
                        <cap.icon className="h-4 w-4 shrink-0 text-primary" />
                        <span className="text-xs font-medium text-foreground/90">{cap.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
