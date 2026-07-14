import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../atmosphere.jsx";
import { Reveal, LazyImg, ReviewCard, SERVER_ASSETS } from "../shared.jsx";
import { ContactFooter } from "../Contact.jsx";

/* Each block reports itself to the theme controller when it crosses the
   middle of the viewport. The backdrop + particle field (fixed, in App)
   crossfade their theme vars over ~1s, so bg and particles shift together. */
function ThemeSection({ theme, onActive, children, className = "", style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActive(theme);
      },
      // fire when the section owns the middle band of the screen
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [theme, onActive]);
  return (
    <section ref={ref} className={className} style={style}>
      {children}
    </section>
  );
}

function CTA({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-acc inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold"
      style={{ background: "var(--acc)", color: "#0a0612" }}
    >
      {children} <span aria-hidden>→</span>
    </a>
  );
}

const ZOMBIE_COUNT = 13;

/* Faint numbered divider between server sections so each block reads
   as its own chapter rather than one long scroll. */
function SectionDivider({ n, label }) {
  return (
    <div className="max-w-4xl mx-auto flex items-center gap-4 px-5 md:px-8 py-2">
      <span className="text-xs font-mono text-acc">{n}</span>
      <span className="h-px flex-1 border-t border-line" />
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted">{label}</span>
    </div>
  );
}

function Server() {
  const { setTheme } = useTheme();
  // start in hero purple
  useEffect(() => { setTheme("server-hero"); }, [setTheme]);

  return (
    <motion.main
      className="relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── HERO — purple ── */}
      <ThemeSection
        theme="server-hero"
        onActive={setTheme}
        className="min-h-screen flex items-center px-5 md:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-acc mb-4">Server Development</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-body leading-none mb-5">
              I build the servers people <span className="text-acc">can't stop logging into.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed mb-8">
              Four-plus years writing custom Minecraft plugins and running server tech.
              Custom mobs, boss fights, world events, and the 3am bug-fixing that keeps
              a community alive.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="rounded-xl border border-line bg-card px-5 py-3 text-left">
                <div className="text-xs font-mono uppercase tracking-widest text-acc">Lead Developer</div>
                <div className="text-sm font-semibold text-body">DeadLands SMP</div>
              </div>
              <div className="rounded-xl border border-line bg-card px-5 py-3 text-left">
                <div className="text-xs font-mono uppercase tracking-widest text-acc">Assistant Developer</div>
                <div className="text-sm font-semibold text-body">Outcraft Network</div>
              </div>
              <div className="rounded-xl border border-line bg-card px-5 py-3 text-left">
                <div className="text-xs font-mono uppercase tracking-widest text-acc">Experience</div>
                <div className="text-sm font-semibold text-body">4+ years</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="text-xs font-mono text-muted mt-14 animate-pulse">scroll ↓</p>
          </Reveal>
        </div>
      </ThemeSection>

      {/* ── DEVELOPMENT REVIEWS ── */}
      <section className="px-5 pb-24 md:px-8" aria-labelledby="development-reviews">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="mb-5 flex items-center gap-4">
              <p id="development-reviews" className="text-[11px] font-mono uppercase tracking-[0.3em] text-acc whitespace-nowrap">
                Words from collaborators
              </p>
              <span className="h-px flex-1 border-t border-line" />
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="h-full">
              <ReviewCard
                quote="Best 3D model artist I know. This guy can make good-looking 3D Minecraft items and graphics; I also like the way he promotes his stuff."
                name="Kelimek"
                role="Builder of MCRybar"
              />
            </Reveal>
            <Reveal delay={80} className="h-full">
              <ReviewCard
                quote="Really clean and beautiful configs."
                name="Sike"
                role="Owner of Outcraft Network"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── xAPOCALYPSE — post-apocalyptic gray ── */}
      <SectionDivider n="01" label="The Plugin" />
      <ThemeSection
        theme="xapocalypse"
        onActive={setTheme}
        className="min-h-screen py-24 px-5 md:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-line mb-6">
              <LazyImg src={SERVER_ASSETS.xapocalypseBanner} alt="xApocalypse banner" className="w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-body">xApocalypse</h2>
              <span className="text-xs font-mono text-muted uppercase tracking-widest">java · spigot · plugin</span>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-muted max-w-2xl leading-relaxed mb-8">
              A full zombie-apocalypse overhaul for survival servers. Not a mob pack — a system:
              escalating threats, world events, and boss encounters that make night mean something.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {[
              [`${ZOMBIE_COUNT} zombie types`, "Each with its own AI, spawn rules, and reason to ruin your night."],
              ["Custom bosses", "Multi-phase fights — telegraphed attacks, adds, enrage timers."],
              ["Blood moons", "Server-wide event: spawn rates spike, loot tables flip. Survive the night."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 70}>
                <div className="card-hover rounded-xl border border-line bg-card p-5 h-full">
                  <h3 className="font-bold text-body mb-1">{t}</h3>
                  <p className="text-sm text-muted leading-relaxed">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <ReviewCard
              quote="Congratulations on the plugin! It has many great features. 10/10 for the plugin."
              name="MelaniumAS"
              role="SpigotMC Veteran"
              className="mb-8 max-w-2xl"
            />
          </Reveal>

          <Reveal>
            <CTA href="https://www.spigotmc.org/resources/xapocalypse-13-zombie-types-custom-bosses-bloodmoons.136555/">
              View on SpigotMC
            </CTA>
          </Reveal>
        </div>
      </ThemeSection>

      {/* ── DEADLANDS SMP — wasteland desert orange ── */}
      <SectionDivider n="02" label="The Server" />
      <ThemeSection
        theme="deadlands"
        onActive={setTheme}
        className="min-h-screen py-24 px-5 md:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="rounded-2xl overflow-hidden mb-6">
              <LazyImg src={SERVER_ASSETS.deadlandsBanner} alt="DeadLands SMP banner" className="w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-body">DeadLands SMP</h2>
              <span className="text-xs font-mono text-acc uppercase tracking-widest">Lead Developer</span>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-muted max-w-2xl leading-relaxed mb-8">
              A zombie-apocalypse survival RPG server. Scavenge, build, and stay alive across a
              world that wants you dead — with custom questlines, progression, and the same
              apocalypse tech that powers xApocalypse, tuned for a full community.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {[
              ["Survival RPG", "Progression, quests, and gear that mean something."],
              ["Apocalypse world", "Custom zombies and events built for long-haul survival."],
              ["Live community", "Run, maintained, and balanced around real players."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 70}>
                <div className="card-hover rounded-xl border border-line bg-card p-5 h-full">
                  <h3 className="font-bold text-body mb-1">{t}</h3>
                  <p className="text-sm text-muted leading-relaxed">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <CTA href="https://discord.gg/bCBQsbC4N">Join the Discord</CTA>
          </Reveal>
        </div>
      </ThemeSection>

      {/* ── OUTCRAFT NETWORK — electric ── */}
      <SectionDivider n="03" label="The Network" />
      <ThemeSection
        theme="outcraft"
        onActive={setTheme}
        className="min-h-screen flex items-center py-24 px-5 md:px-8"
      >
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left — the pitch */}
          <div>
            <Reveal>
              <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-acc mb-4">Assistant Developer</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-4xl md:text-6xl font-extrabold text-body mb-5 leading-[0.95]">Outcraft Network</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-muted max-w-md leading-relaxed mb-8">
                A 15,000+ member event server. As Assistant Developer I build and maintain the
                plugins and systems behind large-scale community events — the kind that has to
                not fall over when thousands show up at once.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <CTA href="https://discord.gg/outcraft">Join Outcraft</CTA>
            </Reveal>
          </div>

          {/* Right — stylized systems config box */}
          <Reveal delay={120}>
            <div className="rounded-2xl border border-line bg-card overflow-hidden font-mono text-[13px] leading-relaxed shadow-2xl">
              {/* window chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line" style={{ background: "rgba(var(--acc-rgb),0.06)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(var(--acc-rgb),0.5)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(var(--acc-rgb),0.3)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(var(--acc-rgb),0.2)" }} />
                <span className="ml-2 text-muted text-[11px]">outcraft-events.yml</span>
              </div>
              {/* config body */}
              <div className="p-5 space-y-1">
                {[
                  ["network:", null],
                  ["  peak_concurrent", "3,200+"],
                  ["  members", "15,000+"],
                  ["  uptime", "99.9%"],
                  ["events:", null],
                  ["  active_systems", "12"],
                  ["  packet_throttling", "adaptive"],
                  ["  async_scheduler", "enabled"],
                  ["performance:", null],
                  ["  thread_optimization", "true"],
                  ["  tick_time_avg", "< 4ms"],
                  ["  region_threading", "folia"],
                ].map(([k, v], i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <span className={v === null ? "text-acc font-semibold" : "text-muted"}>
                      {k}
                    </span>
                    {v !== null && (
                      <span className="text-body font-semibold whitespace-nowrap">{v}</span>
                    )}
                  </div>
                ))}
                <div className="pt-3 mt-2 border-t border-line flex items-center gap-2 text-muted">
                  <span className="w-2 h-2 rounded-full bg-acc animate-pulse" />
                  <span className="text-[11px]">status: all systems operational</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </ThemeSection>

      <ContactFooter />
    </motion.main>
  );
}

export default Server;
