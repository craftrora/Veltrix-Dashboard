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
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* Left — brand / imagery panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={miningLogin} alt="Open-pit mining operation" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Logo size="lg" />

          <div className="max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5">
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
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Sign in to access real-time fleet intelligence, predictive maintenance, and production analytics for your site.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {FLEET_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70">
            © 2026 Veltrix Industrial Systems. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="relative flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/[0.07] blur-[140px]" />
        <ThemeToggle className="absolute right-6 top-6 sm:right-10 sm:top-8" />

        <div className="relative w-full max-w-sm">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField
              label="Email"
              type="email"
              placeholder="you@veltrix-mining.com"
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
              error={errors.password}
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

            <div className="flex items-center justify-between pt-1">
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

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Need access?</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Contact your site administrator to request a Veltrix account.
          </p>
        </div>
      </div>
    </div>
  );
}
