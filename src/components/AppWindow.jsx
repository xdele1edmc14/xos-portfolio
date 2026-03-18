import { useState, useEffect, useRef, useCallback } from "react";

const Clock = ({ darkMode = true }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="text-right text-xs leading-tight select-none">
      <div className={`font-semibold ${darkMode ? "text-white/90" : "text-gray-800"}`}>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      <div className={darkMode ? "text-white/50" : "text-gray-400"}>{time.toLocaleDateString([], { month: "short", day: "numeric" })}</div>
    </div>
  );
};

// ─── WINDOW COMPONENT ────────────────────────────────────────────────────────

const AppWindow = ({ win, onClose, onMinimize, onMaximize, onFocus, zIndex, winContentBg, children }) => {
  const ref     = useRef(null);
  const dragRef = useRef(null);
  // phase: "entering" | "idle" | "minimizing" | "hidden"
  const [phase, setPhase] = useState("entering");
  // computed CSS for the minimize fly-to-taskbar animation
  const [minimizeStyle, setMinimizeStyle] = useState({});
  const prevMinimized = useRef(win.minimized);

  // Open animation
  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 260);
    return () => clearTimeout(t);
  }, []);

  // Detect minimize / restore changes
  useEffect(() => {
    // Restore
    if (prevMinimized.current === true && win.minimized === false) {
      setMinimizeStyle({});
      setPhase("entering");
      const t = setTimeout(() => setPhase("idle"), 260);
      prevMinimized.current = false;
      return () => clearTimeout(t);
    }
    // Minimize
    if (win.minimized === true && phase !== "minimizing" && phase !== "hidden") {
      // Calculate translate from window centre to taskbar icon centre
      if (ref.current && win.minimizeTarget) {
        const wr = ref.current.getBoundingClientRect();
        const winCX = wr.left + wr.width  / 2;
        const winCY = wr.top  + wr.height / 2;
        const dx = win.minimizeTarget.x - winCX;
        const dy = win.minimizeTarget.y - winCY;
        setMinimizeStyle({ "--tx": `${dx}px`, "--ty": `${dy}px` });
      } else {
        // fallback: just shrink downward
        setMinimizeStyle({ "--tx": "0px", "--ty": "60px" });
      }
      setPhase("minimizing");
      const t = setTimeout(() => {
        setPhase("hidden");
        prevMinimized.current = true;
      }, 220);
      return () => clearTimeout(t);
    }
    prevMinimized.current = win.minimized;
  }, [win.minimized, win.minimizeTarget]);

  const handleMouseDown = useCallback((e) => {
    if (win.maximized) return;
    if (e.type === "touchstart") return;
    onFocus();
    const rect = ref.current.getBoundingClientRect();
    dragRef.current = { startX: e.clientX - rect.left, startY: e.clientY - rect.top };
    const onMove = (e) => {
      if (!dragRef.current) return;
      ref.current.style.left = (e.clientX - dragRef.current.startX) + "px";
      ref.current.style.top  = Math.max(0, e.clientY - dragRef.current.startY) + "px";
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [win.maximized, onFocus]);

  if (phase === "hidden") return null;

  const posStyle = win.maximized
    ? { position: "absolute", top: 0, left: 0, width: "100%", height: "calc(100% - 48px)", zIndex }
    : { position: "absolute", top: win.y, left: win.x, width: win.w, height: win.h, zIndex };

  return (
    <>
      <style>{`
        @keyframes winEnter {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes winMinimize {
          from { opacity: 1; transform: scale(1)    translate(0, 0); }
          to   { opacity: 0; transform: scale(0.15) translate(var(--tx), var(--ty)); }
        }
        .win-enter    { animation: winEnter    0.24s cubic-bezier(0.22,1,0.36,1) forwards; }
        .win-minimize { animation: winMinimize 0.22s cubic-bezier(0.4,0,1,1)     forwards; }
      `}</style>
      <div
        ref={ref}
        style={{ ...posStyle, ...minimizeStyle }}
        className={`flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 ${
          phase === "entering"   ? "win-enter"    :
          phase === "minimizing" ? "win-minimize" : ""
        }`}
        onMouseDown={onFocus}>

        {/* Title bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2 backdrop-blur-2xl border-b cursor-grab select-none flex-shrink-0 ${
            winContentBg?.includes("white/80") ? "bg-black/10 border-black/10" : "bg-white/10 border-white/10"
          }`}
          onMouseDown={handleMouseDown}>
          <div className="flex gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-red-900 font-bold">✕</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); onMinimize(); }}
              className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-yellow-900 font-bold">−</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-green-900 font-bold">⛶</span>
            </button>
          </div>
          <span className={`text-xs font-medium ml-1 ${winContentBg?.includes("white/80") ? "text-gray-700" : "text-white/70"}`}>
            {win.title}
          </span>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-auto ${winContentBg || "bg-black/40 backdrop-blur-2xl"}`}>
          {children}
        </div>
      </div>
    </>
  );
};

export { Clock, AppWindow };