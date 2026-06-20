import { cn } from "../lib/utils";

const TONE_STYLES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-foreground/8 text-muted-foreground",
  primary: "bg-primary/10 text-primary",
};

/**
 * @param {{ tone?: keyof typeof TONE_STYLES, children: React.ReactNode, className?: string }} props
 */
export default function StatusBadge({ tone = "neutral", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE_STYLES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
