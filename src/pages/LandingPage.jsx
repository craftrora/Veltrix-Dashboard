import { Link } from "react-router-dom";
import { Play, ArrowRight, Crosshair, Activity, Gauge, ShieldCheck, Bell, HeartPulse } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";
import miningHero from "../assets/mining-hero.jpg";

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Fleet Intelligence", href: "#solutions" },
  { label: "Safety", href: "#safety" },
];

const STATS = [
  { label: "Active units tracked", value: "27" },
  { label: "Sites under VELTRIX", value: "4" },
  { label: "Fleet uptime", value: "98.6%" },
  { label: "Tonnes moved today", value: "18.4K" },
];

const FEATURES = [
  {
    icon: Crosshair,
    title: "Fleet Intelligence",
    description: "Live GPS positioning and utilization tracking across every excavator, hauler, and support vehicle on site.",
    accent: "bg-orange-500/15 text-orange-400",
  },
  {
    icon: Activity,
    title: "Failure Prediction",
    description: "Machine-learning models flag bearing wear, hydraulic faults, and engine anomalies before they cause downtime.",
    accent: "bg-sky-500/15 text-sky-400",
  },
  {
    icon: Gauge,
    title: "Production Optimization",
    description: "Cycle-time analytics and load-balancing recommendations that turn idle minutes into tonnes hauled.",
    accent: "bg-emerald-500/15 text-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "Safety Compliance",
    description: "Automated incident logging and geofence alerts keep every operator and site within compliance standards.",
    accent: "bg-violet-500/15 text-violet-400",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background">
      {/* ============ HERO ============ */}
      <div className="relative overflow-hidden">
        {/* Full-bleed background image with a theme-aware gradient wash:
            black → orange in dark mode, white → orange in light mode
            (driven by --hero-overlay-* tokens, which flip with the .light
            class — see globals.css). This replaces the previous overlay,
            which only referenced `background` and read as washed-out/pale
            in light mode since it had no orange tint at all. */}
        <img
          src={miningHero}
          alt="Open-pit mining operation at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-hero-overlay-from via-hero-overlay-via to-hero-overlay-to" />
        <div className="absolute inset-0 bg-gradient-to-t from-hero-overlay-from via-transparent to-hero-overlay-from/40" />
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />

        {/* Ambient orange glow for color depth, not just flat dark */}
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-orange-400/10 blur-[120px]" />

        {/* Nav */}
        <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-5 sm:px-8 sm:py-6 lg:px-16">
          <Logo size="sm" className="shrink-0 sm:hidden" />
          <Logo size="md" className="hidden shrink-0 sm:flex" />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle className="h-9 w-9 shrink-0" />
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="hidden shrink-0 rounded-full min-[420px]:inline-flex sm:h-11 sm:px-5 sm:text-sm"
            >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="shrink-0 rounded-full sm:h-11 sm:px-5 sm:text-sm">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </header>

        {/* Hero content + floating instrument cards */}
        <main className="relative z-10 px-5 pb-16 pt-6 sm:px-8 sm:pb-20 lg:px-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-primary" />
                <span className="font-mono-data text-[11px] font-medium tracking-wider text-primary sm:text-xs">
                  LIVE · 27 UNITS ON SHIFT
                </span>
              </div>

              <h1 className="font-display text-[2.4rem] font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gradient-orange">The intelligence layer</span>
                <br />
                <span className="text-foreground">for modern mining operations.</span>
              </h1>

              <p className="mt-6 max-w-md text-balance text-[15px] leading-relaxed text-muted-foreground sm:max-w-xl sm:text-lg">
                Fleet tracking, predictive maintenance, and production
                analytics, unified in one platform for real-time site
                visibility.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/signup">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <a
                  href="#platform"
                  className="glass glass-hover inline-flex h-13 w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-foreground transition-all duration-200 sm:w-auto"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                    <Play className="h-3 w-3 fill-current" />
                  </span>
                  Watch Demo
                </a>
              </div>

              {/* Stat strip */}
              <div className="mt-12 max-w-2xl border-t border-border pt-6 sm:mt-16">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-6">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display font-mono-data text-2xl font-bold text-foreground sm:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating instrument cards — desktop only; on mobile these
                compete with the headline for space, so they're hidden below lg.
                Stacked in a flex column (instead of hardcoded absolute
                positions) so the cards never overlap regardless of viewport
                height or content length. */}
            <div className="hidden flex-col gap-5 lg:flex">
              <div className="glass-elevated animate-fade-up w-full max-w-[220px] self-start rounded-2xl p-4" style={{ animationDelay: "100ms" }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Fleet Health</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <HeartPulse className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="font-display font-mono-data text-3xl font-bold text-foreground">96.2%</p>
                <p className="mt-1 text-xs font-medium text-success">↑ 2.1% vs last week</p>
              </div>

              <div className="glass-elevated animate-fade-up w-full max-w-[220px] self-end rounded-2xl p-4" style={{ animationDelay: "180ms" }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Tonnes Today</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success">
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="font-display font-mono-data text-3xl font-bold text-foreground">18.4K</p>
                <p className="mt-1 text-xs text-muted-foreground">Across 4 active sites</p>
              </div>

              <div className="glass-elevated animate-fade-up w-full max-w-[190px] self-start rounded-2xl p-4" style={{ animationDelay: "260ms" }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Active Alerts</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
                    <Bell className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="font-display font-mono-data text-3xl font-bold text-foreground">3</p>
                <p className="mt-1 text-xs text-muted-foreground">Predictive maintenance flags</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ============ FEATURES ============ */}
      <section id="platform" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:px-16">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="font-mono-data text-xs font-semibold tracking-widest text-primary">
            ONE PLATFORM, EVERY SITE
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Everything your control room needs
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            VELTRIX brings fleet, maintenance, production, and safety data
            into a single intelligence layer, built for supervisors and
            operators who can't afford blind spots.
          </p>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="glass glass-hover hover-lift animate-fade-up flex flex-col rounded-2xl p-6"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className={`mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.accent}`}>
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mb-2 font-display text-base font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border px-5 py-8 sm:px-8 sm:py-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-left">
          <Logo size="sm" className="shrink-0" />

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Sign in
            </Link>
          </nav>

          <p className="shrink-0 text-xs text-muted-foreground/70">
            © 2026 Veltrix Industrial Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
