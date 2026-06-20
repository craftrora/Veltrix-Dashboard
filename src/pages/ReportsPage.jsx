import { FileText, Download, ShieldCheck, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/DashboardTopBar";
import SectionHeader from "../components/SectionHeader";
import { AVAILABLE_REPORTS, SAFETY_METRICS } from "../data/supervisorData";
import { cn } from "../lib/utils";

const TYPE_ACCENT = {
  Production: "bg-primary/15 text-primary",
  Fleet: "bg-sky-500/15 text-sky-400",
  Maintenance: "bg-violet-500/15 text-violet-400",
  Safety: "bg-emerald-500/15 text-emerald-400",
};

export default function ReportsPage() {
  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none fixed left-1/4 top-0 h-[420px] w-[600px] rounded-full bg-primary/[0.06] blur-[160px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[360px] w-[480px] rounded-full bg-sky-500/[0.04] blur-[150px]" />

      <Sidebar />

      <div className="relative z-10 min-w-0 flex-1">
        <DashboardTopBar title="Reports" subtitle="Generated reports and site safety summary" />

        <main className="space-y-6 px-8 py-6">
          {/* Safety metrics strip */}
          <div className="glass animate-fade-up rounded-xl p-5">
            <SectionHeader title="Safety Snapshot" description="Site 4 — month to date" actions={<ShieldCheck className="h-4 w-4 text-success" />} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SAFETY_METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className="hover-lift animate-fade-up rounded-lg border border-border bg-foreground/[0.02] p-4"
                  style={{ animationDelay: `${80 + i * 60}ms` }}
                >
                  <p className="font-display font-mono-data text-xl font-bold text-foreground">{m.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Report list */}
          <div>
            <SectionHeader title="Available Reports" description="Download or generate a new report" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {AVAILABLE_REPORTS.map((report, i) => (
                <div
                  key={report.id}
                  className="glass glass-hover hover-lift animate-fade-up flex flex-col rounded-xl p-5"
                  style={{ animationDelay: `${320 + i * 60}ms` }}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", TYPE_ACCENT[report.type])}>
                      {report.type}
                    </span>
                  </div>
                  <p className="mb-1 text-sm font-semibold text-foreground">{report.title}</p>
                  <p className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {report.period}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:gap-2.5 hover:text-primary-hover">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
