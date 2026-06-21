import { Bell, Search, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

/**
 * @param {{ title: string, subtitle?: string, onMenuClick?: () => void }} props
 */
export default function DashboardTopBar({ title, subtitle, onMenuClick }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur-xl sm:px-6 sm:py-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-base font-bold text-foreground sm:text-xl">
            {title}
          </h1>
          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
            {subtitle ?? today}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search units, sites…"
            className="w-32 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 lg:w-44"
          />
        </div>
        <ThemeToggle />
        <button className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
