import { Wifi, Battery, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/useAuth";
import { CURRENT_OPERATOR } from "../data/operatorData";

export default function OperatorTopBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Logo size="sm" markOnly className="shrink-0" />
        <div className="h-8 w-px surface-divider" />
        <div>
          <p className="font-mono-data text-sm font-bold text-foreground">{CURRENT_OPERATOR.unitId}</p>
          <p className="text-[11px] text-muted-foreground">{CURRENT_OPERATOR.unitModel}</p>
        </div>
      </div>

      <div className="hidden flex-col items-center sm:flex">
        <p className="font-display font-mono-data text-lg font-bold text-foreground">{now}</p>
        <p className="text-[11px] text-muted-foreground">
          {CURRENT_OPERATOR.shift} · {CURRENT_OPERATOR.shiftStart}–{CURRENT_OPERATOR.shiftEnd}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-success">
          <Wifi className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium">Connected</span>
        </div>
        <div className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
          <Battery className="h-4 w-4" />
          <span className="text-[11px] font-medium">87%</span>
        </div>
        <ThemeToggle />
        <button
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
