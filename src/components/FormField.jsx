import { forwardRef, useState } from "react";
import { cn } from "../lib/utils";

/**
 * @param {{
 *  label: string,
 *  icon?: React.ReactNode,
 *  type?: string,
 *  endAdornment?: React.ReactNode,
 *  error?: string,
 *  hint?: string,
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
const FormField = forwardRef(function FormField(
  { label, icon, type = "text", endAdornment, error, hint, className, id, ...props },
  ref
) {
  const [focused, setFocused] = useState(false);
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border bg-input-background px-3.5 py-3 transition-colors",
          focused ? "border-primary/60 ring-2 ring-primary/15" : "border-border",
          error && "border-destructive/60",
          props.disabled && "opacity-50",
          className
        )}
      >
        {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
        <input
          ref={ref}
          id={fieldId}
          type={type}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80 disabled:cursor-not-allowed"
          {...props}
        />
        {endAdornment && <span className="shrink-0">{endAdornment}</span>}
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  );
});

export default FormField;
