import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardTopBar from "./DashboardTopBar";
import { cn } from "../lib/utils";

/**
 * Shared responsive layout for all supervisor pages.
 *
 * Desktop (lg+): static sidebar in the flex row + content column.
 * Mobile/tablet (<lg): sidebar collapses to an off-canvas drawer opened
 * from a hamburger in the top bar, with a tap-to-dismiss backdrop. This
 * stops the fixed 256px sidebar from crushing the content on small screens.
 *
 * @param {{ title: string, subtitle?: string, mainClassName?: string, children: React.ReactNode }} props
 */
export default function DashboardShell({ title, subtitle, mainClassName = "space-y-6", children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [sidebarOpen]);

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Ambient glows — purely decorative, sit behind everything */}
      <div className="pointer-events-none fixed left-1/4 top-0 h-[420px] w-[600px] rounded-full bg-primary/[0.06] blur-[160px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[360px] w-[480px] rounded-full bg-sky-500/[0.04] blur-[150px]" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <DashboardTopBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className={cn("px-4 py-5 sm:px-6 sm:py-6 lg:px-8", mainClassName)}>
          {children}
        </main>
      </div>
    </div>
  );
}
