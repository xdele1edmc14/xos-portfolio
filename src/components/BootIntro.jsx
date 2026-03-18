import { useState, useEffect } from "react";

const INTRO_MESSAGE = "Hi, I'm Tahmid\nMinecraft Server Developer\nBuilding worlds, one config at a time.";

const BOOT_LINES = [
  { text: "Initializing xOS kernel...",      delay: 0    },
  { text: "Loading portfolio modules...",     delay: 260  },
  { text: "Mounting filesystem...",           delay: 520  },
  { text: "Starting window manager...",       delay: 780  },
  { text: "Loading app registry...",          delay: 1040 },
  { text: "Applying theme: Void...",          delay: 1300 },
  { text: "Ready. Welcome, xDele1ed.",        delay: 1600 },
];

const IntroScreen = ({ fading, onDone, onSkip }) => {
  const [displayed, setDisplayed] = useState("");
  const [lineIdx, setLineIdx]     = useState(0);
  const [charIdx, setCharIdx]     = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showCta, setShowCta]       = useState(false);
  const lines = INTRO_MESSAGE.split("\n");
  const fullText = lines.join("\n");

  // Typewriter
  useEffect(() => {
    if (displayed.length >= fullText.length) {
      setTimeout(() => setShowCta(true), 500);
      return;
    }
    const delay = displayed.length === 0 ? 300 : fullText[displayed.length] === "\n" ? 180 : 45;
    const t = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length + 1)), delay);
    return () => clearTimeout(t);
  }, [displayed, fullText]);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Auto-advance after text + pause
  useEffect(() => {
    if (!showCta) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [showCta, onDone]);

  const displayLines = displayed.split("\n");

  return (
    <div
      onClick={onSkip}
      style={{
        position: "fixed", inset: 0, background: "#05020f",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", fontFamily: "'DM Sans', system-ui",
        opacity: fading ? 0 : 1, transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer", userSelect: "none",
      }}>

      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,60,200,0.12) 0%, transparent 70%)" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 2rem", maxWidth: 480 }}>

        {/* Thin divider line that grows in */}
        <div style={{
          width: displayed.length > 5 ? "3rem" : 0, height: 2, margin: "0 auto 2rem",
          background: "linear-gradient(90deg, #7b3fe4, #9d5af7)",
          borderRadius: 2, transition: "width 0.6s ease",
        }} />

        {/* Typewriter text */}
        <div style={{ fontFamily: "'Syne', system-ui", fontWeight: 800,
          fontSize: "clamp(1.8rem, 6vw, 3rem)", lineHeight: 1.15,
          letterSpacing: "-0.03em", color: "#f5f0ff" }}>
          {displayLines.map((line, i) => {
            const PREFIX = "Hi, I'm ";
            const pastPrefix = i === 0 && line.length > PREFIX.length;
            const atPrefix   = i === 0 && line.length <= PREFIX.length;
            return (
              <div key={i}>
                {i === 0 ? (
                  // Only split into two coloured spans once typing has passed "Hi, I'm "
                  // so the static prefix never flashes alone before the name appears
                  pastPrefix ? (
                    <>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>{PREFIX}</span>
                      <span style={{ color: "#9d5af7" }}>{line.slice(PREFIX.length)}</span>
                    </>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>{line}</span>
                  )
                ) : (
                  <span style={{ color: i === displayLines.length - 1 && displayed.length < fullText.length ? "#c49dff" : "#f5f0ff" }}>
                    {line}
                  </span>
                )}
                {/* cursor on last visible line */}
                {i === displayLines.length - 1 && displayed.length < fullText.length && (
                  <span style={{ color: "#9d5af7", opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }}>|</span>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: "2.5rem", opacity: showCta ? 1 : 0,
          transform: showCta ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem",
            letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Tap anywhere to continue
          </div>
          {/* Animated dots */}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.4rem", justifyContent: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: "50%", background: "#7b3fe4",
                animation: `introDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        body { background: #05020f !important; margin: 0; }
        @keyframes introDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes osFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

// ─── BOOT SCREEN ─────────────────────────────────────────────────────────────

const BootScreen = () => {
  const [phase, setPhase]           = useState("logo");   // logo → terminal → done
  const [visibleLines, setVisible]  = useState(0);
  const [barWidth, setBarWidth]     = useState(0);
  const [cursorOn, setCursorOn]     = useState(true);

  useEffect(() => {
    // Phase 1: show logo for 900ms
    const t1 = setTimeout(() => setPhase("terminal"), 900);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "terminal") return;
    // Drip in each line on its own delay
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisible(i + 1), line.delay);
    });
    // Progress bar
    const totalMs = 1900;
    const steps = 60;
    for (let i = 1; i <= steps; i++) {
      setTimeout(() => setBarWidth(Math.round((i / steps) * 100)), (i / steps) * totalMs);
    }
    // Cursor blink
    const blink = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(blink);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#05020f", fontFamily: "'DM Sans', system-ui" }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,60,200,0.18) 0%, transparent 70%)" }} />

      {/* Pixel grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: "linear-gradient(rgba(123,63,228,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(123,63,228,0.3) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,#000 2px,#000 4px)" }} />

      {/* ── LOGO PHASE ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700"
        style={{ opacity: phase === "logo" ? 1 : 0, transform: phase === "logo" ? "scale(1)" : "scale(0.92) translateY(-20px)", pointerEvents: "none" }}>
        <div style={{ fontSize: "5rem", filter: "drop-shadow(0 0 60px rgba(157,90,247,0.9))",
          animation: "logoPulse 1.2s ease-in-out infinite alternate" }}>🪟</div>
        <div className="mt-4" style={{ fontFamily: "'Syne',system-ui", fontWeight: 800, fontSize: "2.5rem",
          color: "#f5f0ff", letterSpacing: "-0.04em" }}>
          x<span style={{ color: "#9d5af7" }}>OS</span>
        </div>
        <div className="mt-2" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem",
          letterSpacing: "0.4em", textTransform: "uppercase" }}>Portfolio Operating System</div>
      </div>

      {/* ── TERMINAL PHASE ── */}
      <div className="relative z-10 w-full max-w-md px-6 transition-all duration-500"
        style={{ opacity: phase === "terminal" ? 1 : 0, transform: phase === "terminal" ? "translateY(0)" : "translateY(16px)" }}>

        {/* Terminal window chrome */}
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", marginLeft: "0.5rem", fontFamily: "monospace" }}>
              xOS Boot Sequence — v1.0
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 min-h-[220px]" style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="space-y-1.5" style={{ fontFamily: "monospace", fontSize: "0.72rem" }}>
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
                const isLast = i === visibleLines - 1;
                const isDone = i < BOOT_LINES.length - 1;
                return (
                  <div key={i} className="flex items-center gap-2"
                    style={{ animation: "fadeSlideIn 0.18s ease forwards",
                      color: isLast ? "#c49dff" : "rgba(255,255,255,0.38)" }}>
                    <span style={{ color: isLast ? "#9d5af7" : "rgba(123,63,228,0.6)", flexShrink: 0 }}>
                      {isDone && !isLast ? "✓" : ">"}
                    </span>
                    <span>{line.text}</span>
                    {isLast && <span style={{ color: "#9d5af7", opacity: cursorOn ? 1 : 0 }}>█</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="rounded-full overflow-hidden" style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full"
              style={{ width: `${barWidth}%`, transition: "width 0.08s linear",
                background: "linear-gradient(90deg,#7b3fe4,#9d5af7,#c49dff)",
                boxShadow: "0 0 16px rgba(157,90,247,0.7)" }} />
          </div>
          <div className="flex justify-between mt-1.5" style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>
            <span>xOS v1.0 — by xDele1ed</span>
            <span>{barWidth}%</span>
          </div>
        </div>
      </div>

      <style>{`
        body { background: #05020f !important; margin: 0; }
        @keyframes logoPulse {
          from { filter: drop-shadow(0 0 24px rgba(157,90,247,0.5)); }
          to   { filter: drop-shadow(0 0 70px rgba(157,90,247,1)); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// ─── CONTROL CENTER ──────────────────────────────────────────────────────────

export { IntroScreen, BootScreen };