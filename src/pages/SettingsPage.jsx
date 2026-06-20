import { useState } from "react";
import { User, Bell, Globe, Shield, Save } from "lucide-react";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/DashboardTopBar";
import SectionHeader from "../components/SectionHeader";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useAuth } from "../context/useAuth";
import { cn } from "../lib/utils";

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground/90">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full surface-track transition-colors duration-200 peer-checked:bg-primary" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  const { session } = useAuth();
  const [notifs, setNotifs] = useState({
    fleetAlerts: true,
    maintenanceDue: true,
    productionDigest: false,
    safetyIncidents: true,
  });
  const [units, setUnits] = useState("metric");

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none fixed left-1/4 top-0 h-[420px] w-[600px] rounded-full bg-primary/[0.06] blur-[160px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[360px] w-[480px] rounded-full bg-sky-500/[0.04] blur-[150px]" />

      <Sidebar />

      <div className="relative z-10 min-w-0 flex-1">
        <DashboardTopBar title="Settings" subtitle="Account, notifications, and site preferences" />

        <main className="mx-auto max-w-3xl space-y-6 px-8 py-6">
          {/* Profile */}
          <div className="glass animate-fade-up rounded-xl p-5">
            <SectionHeader title="Profile" description="Your account information" actions={<User className="h-4 w-4 text-muted-foreground" />} />
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-lg font-bold uppercase text-primary">
                {session?.name?.[0] ?? "S"}
              </div>
              <div>
                <p className="text-sm font-semibold capitalize text-foreground">{session?.name ?? "Supervisor"}</p>
                <p className="text-xs text-muted-foreground">{session?.email ?? "supervisor@veltrix-mining.com"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Full name" defaultValue={session?.name ?? ""} />
              <FormField label="Email" type="email" defaultValue={session?.email ?? ""} />
              <FormField label="Site" defaultValue="Site 4 — North Operations" />
              <FormField label="Role" defaultValue="Supervisor" disabled />
            </div>
          </div>

          {/* Notifications */}
          <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "80ms" }}>
            <SectionHeader title="Notifications" description="Choose what you want to be alerted about" actions={<Bell className="h-4 w-4 text-muted-foreground" />} />
            <div className="divide-y divide-border/60">
              <Toggle
                label="Fleet alerts"
                description="Status changes, idle units, geofence events"
                checked={notifs.fleetAlerts}
                onChange={(e) => setNotifs((s) => ({ ...s, fleetAlerts: e.target.checked }))}
              />
              <Toggle
                label="Maintenance due"
                description="Upcoming and overdue service reminders"
                checked={notifs.maintenanceDue}
                onChange={(e) => setNotifs((s) => ({ ...s, maintenanceDue: e.target.checked }))}
              />
              <Toggle
                label="Production digest"
                description="Daily summary email at end of shift"
                checked={notifs.productionDigest}
                onChange={(e) => setNotifs((s) => ({ ...s, productionDigest: e.target.checked }))}
              />
              <Toggle
                label="Safety incidents"
                description="Immediate alert for any reported incident"
                checked={notifs.safetyIncidents}
                onChange={(e) => setNotifs((s) => ({ ...s, safetyIncidents: e.target.checked }))}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "160ms" }}>
            <SectionHeader title="Preferences" description="Units and regional display" actions={<Globe className="h-4 w-4 text-muted-foreground" />} />
            <div className="mb-1">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Measurement units</span>
              <div className="flex gap-2">
                {["metric", "imperial"].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnits(u)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all duration-200",
                      units === u ? "bg-primary text-primary-foreground" : "surface-chip text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "240ms" }}>
            <SectionHeader title="Security" description="Password and session management" actions={<Shield className="h-4 w-4 text-muted-foreground" />} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="New password" type="password" placeholder="••••••••" />
              <FormField label="Confirm password" type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="lg">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
