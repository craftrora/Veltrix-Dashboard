import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import FormField from "../components/FormField";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/useAuth";
import miningLogin from "../assets/mining-login.jpg";

const FLEET_STATS = [
  { label: "Active units", value: "27" },
  { label: "Sites online", value: "4" },
  { label: "Uptime", value: "98.6%" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Enter your work email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulated auth call — replace with real API integration.
    setTimeout(() => {
      login({ email });
      setSubmitting(false);
      navigate("/select-role");
    }, 900);
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Full-bleed background image */}
      <img
        src={miningLogin}
        alt="Open-pit mining operation"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Black → orange gradient wash over the whole viewport */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-orange-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-grid opacity-[0.07]" />

      {/* Ambient glows for depth */}
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-[100px] sm:h-96 sm:w-96 sm:blur-[140px]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-[100px] sm:h-96 sm:w-96 sm:blur-[140px]" />

      <ThemeToggle className="absolute right-4 top-4 z-20 bg-background/40 backdrop-blur-sm sm:right-8 sm:top-8" />

      {/* Page content */}
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-5 sm:px-8 sm:py-8 lg:px-16 lg:py-12">
        <Logo size="sm" className="shrink-0 [&_span]:text-white sm:hidden" />
        <Logo size="lg" className="hidden shrink-0 [&_span]:text-white sm:flex" />

        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-6 sm:gap-12 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          {/* Left — brand copy, hidden on small screens to avoid crowding the card */}
          <div className="hidden max-w-md lg:block">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
              <span className="font-mono-data text-xs font-medium tracking-wider text-primary">
                LIVE OPERATIONS · 27 ACTIVE UNITS
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-white xl:text-5xl">
              Command your entire
              <span className="text-gradient-orange"> mining operation</span>
              <span className="text-white">.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70">
              Sign in to access real-time fleet intelligence, predictive maintenance, and production analytics for your site.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {FLEET_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact live-ops pill + stats for mobile, shown above the card
              since the full brand panel above is hidden below lg */}
          <div className="flex flex-col items-center gap-4 text-center lg:hidden">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
              <span className="font-mono-data text-[10px] font-medium tracking-wider text-primary sm:text-xs">
                LIVE OPERATIONS · 27 ACTIVE UNITS
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold leading-[1.15] text-white sm:text-3xl">
              Command your entire
              <span className="text-gradient-orange"> mining operation</span>
              <span className="text-white">.</span>
            </h1>
          </div>

          {/* Right — glass form card, overlaid on the full-bleed image */}
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-background/90 p-5 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-9">
            <div className="mb-6 sm:mb-8">
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">Sign in</h2>
              <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              <FormField
                label="Email"
                type="email"
                placeholder="you@gmail.com"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                autoComplete="email"
              />

              <FormField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => {
                  if (password && password.length < 6) {
                    setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters." }));
                  }
                }}
                error={errors.password}
                hint={!errors.password ? "Minimum 6 characters." : undefined}
                autoComplete="current-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1">
                <label className="flex cursor-pointer items-center gap-2.5 select-none">
                  <span className="relative flex h-4.5 w-4.5 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="h-4 w-4 rounded border border-border bg-input-background transition-colors peer-checked:border-primary peer-checked:bg-primary" />
                    <svg
                      className="pointer-events-none absolute h-3 w-3 scale-0 text-primary-foreground transition-transform peer-checked:scale-100"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path d="M2.5 6.5 5 9l4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>

                <Link to="/forgot-password" className="text-sm font-medium text-primary transition-colors hover:text-primary-hover">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" loading={submitting} className="w-full">
                {submitting ? "Signing in…" : (<>Sign In <ArrowRight className="h-4 w-4" /></>)}
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-3 sm:mt-8">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">Need access?</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Link
              to="/signup"
              className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover sm:mt-6"
            >
              Create a new VELTRIX account
            </Link>
          </div>
        </div>

        <p className="relative z-10 pb-2 pt-4 text-center text-[11px] text-white/50 sm:pt-2 sm:text-xs lg:text-left">
          © 2026 Veltrix Industrial Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
}
