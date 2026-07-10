import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLockTheme } from "../atmosphere.jsx";
import { ContactRow } from "../Contact.jsx";
import { TerminalEgg } from "../TerminalEgg.jsx";

/* A path option. On click it expands to fill the viewport, then we navigate
   once the expand animation settles — no hard cut into the route. */
function PathOption({ cfg, expanding, onPick }) {
  const isMe = expanding === cfg.id;
  const other = expanding && !isMe;
  return (
    <motion.button
      type="button"
      onClick={() => onPick(cfg)}
      aria-label={cfg.title}
      className="path-option group relative flex-1 min-h-[52vh] md:min-h-[74vh] overflow-hidden rounded-3xl border border-line text-left"
      style={{ background: cfg.bg }}
      initial={false}
      animate={
        isMe
          ? { flexGrow: 40, opacity: 1 }
          : other
          ? { flexGrow: 0.0001, opacity: 0 }
          : { flexGrow: 1, opacity: 1 }
      }
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      whileHover={expanding ? undefined : { scale: 1.015 }}
    >
      {/* accent wash that intensifies on hover */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
        style={{ background: cfg.glow }}
      />
      {/* oversized watermark glyph so the card isn't empty space */}
      <span
        className="pointer-events-none absolute -right-6 -top-10 text-[13rem] md:text-[18rem] font-extrabold leading-none select-none opacity-[0.07] group-hover:opacity-[0.13] transition-opacity duration-500"
        style={{ color: "#fff" }}
        aria-hidden
      >
        {cfg.glyph}
      </span>

      <div className="relative z-10 flex h-full flex-col p-7 md:p-10">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em]" style={{ color: cfg.acc }}>
            {cfg.kicker}
          </span>
          <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.14)" }} />
        </div>

        <div className="mt-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-[0.95] mb-4" style={{ color: "#fff" }}>
            {cfg.title}
          </h2>
          <p className="max-w-sm text-sm md:text-base leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.74)" }}>
            {cfg.blurb}
          </p>

          {/* feature tags */}
          <ul className="flex flex-wrap gap-2 mb-5">
            {cfg.tags.map((t) => (
              <li
                key={t}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.8)" }}
              >
                {t}
              </li>
            ))}
          </ul>

          {/* mini stat row */}
          <div className="flex gap-6 mb-6">
            {cfg.stats.map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-extrabold" style={{ color: cfg.acc }}>{n}</div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</div>
              </div>
            ))}
          </div>

          <span
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full border px-4 py-2 opacity-80 group-hover:opacity-100 group-hover:gap-3 transition-all"
            style={{ color: cfg.acc, borderColor: cfg.acc }}
          >
            Enter {cfg.title} <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

const OPTIONS = [
  {
    id: "graphics",
    to: "/graphics",
    kicker: "Path A · The Look",
    title: "Graphics Design",
    glyph: "✦",
    blurb: "Minecraft profile pictures, renders, and business posters. The face the work shows the world.",
    tags: ["Profile art", "Renders", "Posters"],
    stats: [["3", "galleries"], ["Custom", "commissions"]],
    acc: "#f0abfc",
    bg: "linear-gradient(150deg, #1c0930, #2a0b3f)",
    glow: "radial-gradient(circle at 70% 20%, rgba(217,70,239,0.45), transparent 60%)",
  },
  {
    id: "server",
    to: "/server",
    kicker: "Path B · The Code",
    title: "Server Development",
    glyph: "⌘",
    blurb: "Four years of custom plugins, zombie apocalypses, and servers built to survive their own player counts.",
    tags: ["Custom plugins", "Boss systems", "World events"],
    stats: [["4+", "years"], ["15k+", "players"], ["3", "servers"]],
    acc: "#c4b5fd",
    bg: "linear-gradient(150deg, #130a2e, #201152)",
    glow: "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.45), transparent 60%)",
  },
];

function Landing() {
  useLockTheme("home");
  const navigate = useNavigate();
  const [expanding, setExpanding] = useState(null);

  const pick = (cfg) => {
    if (expanding) return;
    setExpanding(cfg.id);
    // navigate after the card finishes filling the screen
    setTimeout(() => navigate(cfg.to), 640);
  };

  return (
    <motion.main
      className="relative min-h-screen flex flex-col items-center justify-center px-5 py-14 md:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-8 md:mb-12 max-w-3xl"
        animate={{ opacity: expanding ? 0 : 1, y: expanding ? -20 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-acc mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-acc animate-pulse" />
          xDele1ed · portfolio
        </motion.span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-body leading-[0.95] mb-5">
          Where do you<br className="hidden md:block" /> wanna go?
        </h1>
        <p className="text-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          I build Minecraft servers, then design the art that sells them.
          Two halves of the same obsession — pick a door.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-6xl">
        {OPTIONS.map((o) => (
          <PathOption key={o.id} cfg={o} expanding={expanding} onPick={pick} />
        ))}
      </div>

      <motion.div
        className="mt-10 flex flex-col items-center gap-3"
        animate={{ opacity: expanding ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted">or reach me directly</span>
        <ContactRow compact />
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <TerminalEgg />
          <span className="text-[10px] font-mono text-muted/70">psst — there's a hidden desktop in here</span>
        </div>
      </motion.div>
    </motion.main>
  );
}

export default Landing;
