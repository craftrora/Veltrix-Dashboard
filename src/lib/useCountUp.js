import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value counting up from 0 to `target` over `duration` ms.
 * Non-numeric values (e.g. "82%" already formatted strings) are returned as-is.
 * @param {number} target
 * @param {number} duration
 * @param {number} decimals
 */
export function useCountUp(target, duration = 900, decimals = 0) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof target !== "number" || Number.isNaN(target)) {
      // Defer to a microtask so we're not calling setState synchronously
      // within the effect body (avoids cascading-render lint warning).
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }

    startRef.current = null;

    function tick(timestamp) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  if (typeof target !== "number" || Number.isNaN(target)) return target;
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value);
}
