import { useId } from "react";
import { cn } from "../lib/utils";

/**
 * VELTRIX brand mark: hexagonal "VX" badge + wordmark.
 * @param {{ className?: string, markOnly?: boolean, size?: "sm" | "md" | "lg" }} props
 */
export default function Logo({ className, markOnly = false, size = "md" }) {
  const dims = {
    sm: { box: 28, text: "text-sm", tracking: "tracking-wide" },
    md: { box: 36, text: "text-lg", tracking: "tracking-wide" },
    lg: { box: 48, text: "text-2xl", tracking: "tracking-wider" },
  }[size];

  // Each <Logo> instance needs its own gradient id — multiple instances on
  // the same page (nav + footer, for example) previously all shared the
  // hardcoded id "veltrix-grad", which is invalid SVG (duplicate ids) and
  // caused the fill to drop out on some renders, especially noticeable in
  // light mode where there's no dark background to mask the broken fill.
  const gradientId = useId();

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={dims.box}
        height={dims.box}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M20 1.5 36.6 11v18L20 38.5 3.4 29V11Z" fill={`url(#${gradientId})`} />
        <path
          d="M13 13.5 20 27l7-13.5"
          stroke="#0a0a0a"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <defs>
          <linearGradient id={gradientId} x1="3.4" y1="1.5" x2="36.6" y2="38.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb923c" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
      {!markOnly && (
        <span className={cn("font-display font-bold text-foreground", dims.text, dims.tracking)}>
          VELTRIX
        </span>
      )}
    </div>
  );
}
