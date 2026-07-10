import { lazy, Suspense, useEffect, useState } from "react";

// The old xOS desktop portfolio — lazy so its (heavy) code only loads if
// someone finds the secret. Kept as the hidden easter-egg payload.
const OSPortfolio = lazy(() => import("../OSPortfolio.jsx"));

/* Hidden easter egg: a faint blinking terminal prompt.
   Clicking it types `xos --boot`, then opens the full xOS desktop overlay.
   Desktop only — the draggable-windows sim doesn't translate to touch. */
export function TerminalEgg() {
  const [typed, setTyped] = useState("");
  const [booting, setBooting] = useState(false);
  const [open, setOpen] = useState(false);
  const CMD = "xos --boot";

  useEffect(() => {
    if (!booting) return;
    if (typed.length < CMD.length) {
      const t = setTimeout(() => setTyped(CMD.slice(0, typed.length + 1)), 70);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setOpen(true), 450);
    return () => clearTimeout(t);
  }, [booting, typed]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setBooting(false);
    setTyped("");
  };

  return (
    <>
      <button
        onClick={() => setBooting(true)}
        aria-label="Boot xOS desktop"
        className="egg-trigger hidden md:inline-flex items-center gap-2 font-mono text-xs text-muted select-none rounded-lg border border-line bg-card px-3 py-1.5"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <span className="text-acc">λ</span>
        <span>{booting ? typed : "xos --boot"}</span>
        <span className="egg-cursor inline-block w-[7px] h-[13px] bg-current" />
      </button>

      {open && (
        <div className="xos-overlay fixed inset-0 z-[60] bg-black">
          <button
            onClick={close}
            className="absolute top-3 right-4 z-[10000] px-3 py-1.5 rounded-lg text-xs font-mono text-white/70 bg-white/10 hover:bg-white/20 hover:text-white transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            exit xOS [esc]
          </button>
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center text-white/50 font-mono text-sm">
                mounting xOS…
              </div>
            }
          >
            <OSPortfolio />
          </Suspense>
        </div>
      )}
    </>
  );
}
