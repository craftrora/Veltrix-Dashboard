import { Link } from "react-router-dom";
import { Play, ArrowRight, ChevronRight } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";
import miningHero from "../assets/mining-hero.jpg";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Solutions", href: "#solutions" },
  { label: "Analytics", href: "#analytics" },
  { label: "Safety", href: "#safety" },
  { label: "Contact", href: "#contact" },
];

const STATS = [
  { label: "Active units", value: "27" },
  { label: "Sites online", value: "4" },
  { label: "Uptime", value: "98.6%" },
  { label: "Tonnes today", value: "18.4K" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background image + layered overlay for depth */}
      <img
        src={miningHero}
        alt="Open-pit mining operation at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/60" />
      <div className="absolute inset-0 bg-grid opacity-[0.08]" />

      {/* Ambient orange glow for color depth, not just flat dark */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-orange-400/10 blur-[120px]" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
        <Logo size="md" />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle className="border-white/15 text-white/70 hover:text-white" />
          <Link to="/login" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-white sm:block">
            Sign in
          </Link>
          <Button size="md" className="rounded-full">
            Get Started <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex min-h-[calc(100vh-92px)] flex-col justify-center px-8 lg:px-16">
        <div className="max-w-2xl py-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            <span className="font-mono-data text-xs font-medium tracking-wider text-primary">
              LIVE OPERATIONS · 27 ACTIVE UNITS
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Smart Mining.
            <br />
            <span className="text-gradient-orange">Stronger</span> Future.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            VELTRIX unifies your entire mining operation into one AI-powered
            intelligence layer — real-time fleet tracking, failure
            prediction, and production optimization at scale.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button size="lg">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" className="rounded-full">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <Play className="h-3 w-3 fill-current" />
              </span>
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stat strip — adds horizontal rhythm and breaks up the empty lower half */}
        <div className="mt-16 max-w-2xl border-t border-white/10 pt-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
