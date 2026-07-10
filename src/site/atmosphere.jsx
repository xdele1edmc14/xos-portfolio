import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { SERVER_ASSETS } from "./shared.jsx";

/* ─────────────── Theme context ───────────────
   One source of truth for the active section theme. Routes set it on
   mount; the Server page overrides it on scroll. The <div data-theme>
   lives in App, so the fixed Backdrop + ParticleField inherit its vars. */

const ThemeCtx = createContext({ theme: "home", setTheme: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("home");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

/* Convenience: lock a static theme for a whole page (Landing/Graphics). */
export function useLockTheme(theme) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
}

/* ─────────────── Backdrop ───────────────
   Fixed gradient layer + an optional wasteland/desert texture that
   crossfades per theme. Sits BELOW the particle field so spores/dust
   render on top of the texture instead of being hidden behind section
   background images. */
const TEXTURES = {
  xapocalypse: SERVER_ASSETS.xapocalypseBg,
  deadlands: SERVER_ASSETS.deadlandsBg,
};

export function Backdrop() {
  const { theme } = useTheme();
  const texture = TEXTURES[theme];
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <AnimatePresence>
        {texture && (
          <motion.div
            key={theme}
            className="backdrop-texture"
            aria-hidden="true"
            style={{ backgroundImage: `url(${texture})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────── ParticleField ───────────────
   Fixed, theme-tinted. Ambient drifting embers/orbs + soft blurred glows.
   Density scales down on small screens. Optional cursor reactivity nudges
   the glow layer via a spring for a subtle parallax. */

function useParticleCount(base) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setCount(Math.round(base * 0.4));
      else if (w < 1024) setCount(Math.round(base * 0.7));
      else setCount(base);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [base]);
  return count;
}

/* Per-variant particle geometry.
   drift = ambient orbs, spore = big glowing rising motes,
   dust  = many small mostly-sideways specks. */
function buildParticles(n, variant, i0 = 0) {
  return Array.from({ length: n }, (_, k) => {
    const i = k + i0;
    const base = {
      left: `${(i * 37 + 13) % 100}%`,
      size: 1.5 + ((i * 7) % 5),
      duration: 15 + ((i * 13) % 20),
      delay: -((i * 5) % 24),
      opacity: 0.14 + ((i * 11) % 5) / 12,
      driftX: ((i % 5) - 2) * 26,
    };
    if (variant === "spore") {
      return {
        ...base,
        size: 4 + ((i * 5) % 7),          // bigger motes
        duration: 22 + ((i * 9) % 22),    // slow rise
        opacity: 0.35 + ((i * 7) % 5) / 12,
        sway: ((i % 5) - 2) * 34,
      };
    }
    if (variant === "dust") {
      return {
        ...base,
        left: `${(i * 23 + 5) % 100}%`,
        top: `${(i * 41 + 9) % 100}%`,    // seeded across full height
        size: 2.5 + ((i * 3) % 4),        // visible specks
        duration: 9 + ((i * 7) % 10),     // quicker
        opacity: 0.45 + ((i * 5) % 5) / 9,
        driftX: (((i % 7) - 3) * 40) + 55, // biased sideways
        rise: -(20 + ((i * 11) % 45)),     // shallow rise (vh)
      };
    }
    return base;
  });
}

export function ParticleField({
  count = 26,
  variant = "drift",
  cursorReactive = false,
  bloodMoon = false,
}) {
  const n = useParticleCount(count);

  // Deterministic layout so particles don't reshuffle on re-render.
  const particles = useMemo(() => buildParticles(n, variant), [n, variant]);

  // Cursor parallax for the glow layer (graphics route).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 40, damping: 20 });
  const gy = useSpring(my, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (!cursorReactive) return;
    const onMove = (e) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 40;
      const cy = (e.clientY / window.innerHeight - 0.5) * 40;
      mx.set(cx);
      my.set(cy);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorReactive, mx, my]);

  return (
    <div className="particle-field" aria-hidden="true">
      <motion.div
        className="ambient-glow w-[46rem] h-[46rem] -top-56 -left-40 opacity-[0.16]"
        style={cursorReactive ? { x: gx, y: gy } : undefined}
      />
      <motion.div
        className="ambient-glow w-[38rem] h-[38rem] bottom-[-8rem] -right-40 opacity-[0.14]"
        style={{
          animationDelay: "-9s",
          ...(cursorReactive ? { x: gy, y: gx } : {}),
        }}
      />

      {bloodMoon && (
        <div className="blood-moon w-[26rem] h-[26rem] top-[10%] right-[8%]" />
      )}

      {particles.map((p, i) => (
        <span
          key={i}
          className={`particle ${variant === "spore" ? "is-spore" : variant === "dust" ? "is-dust" : ""}`}
          style={{
            left: p.left,
            top: p.top,
            bottom: p.top != null ? "auto" : undefined,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--p-op": p.opacity,
            "--p-x": `${p.driftX}px`,
            "--p-sway": p.sway != null ? `${p.sway}px` : undefined,
            "--p-rise": p.rise != null ? `${p.rise}vh` : undefined,
          }}
        />
      ))}
    </div>
  );
}
