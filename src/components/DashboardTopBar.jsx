import { Bell, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

/**
 * @param {{ title: string, subtitle?: string }} props
 */
export default function DashboardTopBar({ title, subtitle }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-8 py-5 backdrop-blur-xl">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">{subtitle ?? today}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search units, sites…"
            className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <ThemeToggle />
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
