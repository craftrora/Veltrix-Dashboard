import { cloneElement, isValidElement } from "react";
import { cn } from "../lib/utils";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_0_0_1px_rgba(249,115,22,0.3),0_8px_24px_-8px_rgba(249,115,22,0.5)]",
  secondary: "glass glass-hover text-foreground border-border",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

/**
 * @param {{
 *  variant?: "primary" | "secondary" | "ghost",
 *  size?: "sm" | "md" | "lg",
 *  loading?: boolean,
 *  asChild?: boolean,
 *  className?: string,
 * } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 *
 * When asChild is true, Button clones its single child element (e.g. a
 * react-router-dom <Link>) and merges in the button's classes/props instead
 * of wrapping it in a <button> — this is what lets "Get Started" actually
 * navigate instead of rendering an inert <button> with no onClick/href.
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  asChild = false,
  className,
  children,
  disabled,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(classes, children.props.className),
      ...props,
    });
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
