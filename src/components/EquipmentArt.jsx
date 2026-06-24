/**
 * Clean side-profile illustrations of mining equipment.
 * Monochrome (inherits `currentColor`) with an orange brand accent,
 * so they adapt to light/dark and any tint the parent sets via text color.
 *
 * @param {{ type: "haul-truck" | "excavator" | "dozer" | "drill", className?: string }} props
 */
export default function EquipmentArt({ type, className }) {
  const accent = "var(--color-primary)";
  const body = "currentColor";

  const common = {
    viewBox: "0 0 200 120",
    className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
  };

  if (type === "haul-truck") {
    return (
      <svg {...common} aria-hidden="true">
        {/* dump bed */}
        <path d="M58 26 L150 26 L162 58 L46 58 Z" fill={body} opacity="0.28" />
        <path d="M58 26 L150 26 L162 58 L46 58 Z" stroke={body} strokeWidth="2.5" opacity="0.5" />
        {/* cab + chassis */}
        <path d="M40 58 L172 58 L172 84 L150 84 L150 70 L34 70 L34 50 L46 50 L46 58 Z" fill={body} opacity="0.5" />
        <rect x="34" y="50" width="14" height="14" rx="2" fill={accent} />
        {/* hazard stripe */}
        <rect x="46" y="60" width="118" height="5" fill={accent} opacity="0.85" />
        {/* wheels */}
        <circle cx="62" cy="90" r="17" fill={body} opacity="0.85" />
        <circle cx="62" cy="90" r="7" fill={body} opacity="0.4" />
        <circle cx="138" cy="90" r="17" fill={body} opacity="0.85" />
        <circle cx="138" cy="90" r="7" fill={body} opacity="0.4" />
      </svg>
    );
  }

  if (type === "excavator") {
    return (
      <svg {...common} aria-hidden="true">
        {/* boom + arm */}
        <path d="M86 60 L120 30 L150 46" stroke={accent} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        {/* bucket */}
        <path d="M150 46 L168 44 L170 62 L150 64 Z" fill={accent} />
        <path d="M150 64 L154 72 L162 72 L166 64" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        {/* house/cab */}
        <path d="M40 50 L92 50 L92 78 L40 78 Z" fill={body} opacity="0.5" />
        <rect x="46" y="55" width="20" height="16" rx="2" fill={accent} opacity="0.85" />
        {/* tracks */}
        <path d="M30 90 L102 90 L96 104 L36 104 Z" fill={body} opacity="0.85" />
        <circle cx="42" cy="97" r="6" fill={body} opacity="0.4" />
        <circle cx="90" cy="97" r="6" fill={body} opacity="0.4" />
        <rect x="40" y="78" width="52" height="6" fill={body} opacity="0.35" />
      </svg>
    );
  }

  if (type === "dozer") {
    return (
      <svg {...common} aria-hidden="true">
        {/* blade */}
        <path d="M30 48 L46 48 L46 96 L30 96 Z" fill={accent} />
        <path d="M30 96 L20 104 L30 104 Z" fill={accent} opacity="0.7" />
        {/* body + cab */}
        <path d="M52 52 L150 52 L150 84 L52 84 Z" fill={body} opacity="0.5" />
        <path d="M96 32 L140 32 L150 52 L96 52 Z" fill={body} opacity="0.42" />
        <rect x="104" y="36" width="30" height="14" rx="2" fill={accent} opacity="0.85" />
        <rect x="52" y="76" width="98" height="5" fill={accent} opacity="0.85" />
        {/* track */}
        <path d="M50 86 L162 86 L156 106 L56 106 Z" fill={body} opacity="0.85" />
        <circle cx="66" cy="96" r="7" fill={body} opacity="0.4" />
        <circle cx="146" cy="96" r="7" fill={body} opacity="0.4" />
      </svg>
    );
  }

  // drill rig
  return (
    <svg {...common} aria-hidden="true">
      {/* mast */}
      <rect x="120" y="14" width="12" height="74" rx="2" fill={accent} />
      <path d="M122 20 L130 30 M122 34 L130 44 M122 48 L130 58 M122 62 L130 72" stroke={body} strokeWidth="2" opacity="0.5" />
      {/* deck/body */}
      <path d="M34 56 L150 56 L150 86 L34 86 Z" fill={body} opacity="0.5" />
      <rect x="40" y="60" width="24" height="18" rx="2" fill={accent} opacity="0.85" />
      <rect x="34" y="78" width="116" height="5" fill={accent} opacity="0.85" />
      {/* tracks */}
      <path d="M30 88 L154 88 L148 106 L36 106 Z" fill={body} opacity="0.85" />
      <circle cx="46" cy="97" r="6" fill={body} opacity="0.4" />
      <circle cx="138" cy="97" r="6" fill={body} opacity="0.4" />
    </svg>
  );
}
