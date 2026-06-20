import OperatorTopBar from "./OperatorTopBar";
import OperatorBottomNav from "./OperatorBottomNav";

/**
 * @param {{ children: React.ReactNode }} props
 */
export default function OperatorShell({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed left-1/3 top-0 h-[360px] w-[520px] rounded-full bg-primary/[0.06] blur-[150px]" />
      <div className="pointer-events-none fixed bottom-20 right-0 h-[300px] w-[400px] rounded-full bg-sky-500/[0.04] blur-[140px]" />

      <OperatorTopBar />

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 space-y-5 px-5 py-5">
        {children}
      </main>

      <OperatorBottomNav />
    </div>
  );
}
