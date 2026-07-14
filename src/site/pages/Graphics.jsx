import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLockTheme } from "../atmosphere.jsx";
import { GALLERIES, Reveal, LazyImg, ReviewCard } from "../shared.jsx";
import { ContactFooter } from "../Contact.jsx";

const SECTIONS = [
  {
    key: "pfps",
    title: "Minecraft Profile Pictures",
    tag: "Avatars",
    blurb: "Character-focused renders and avatars — clean lighting, sharp silhouettes, built to read at any size.",
    layout: "compact",     // tidy grid of squares
    aspect: "aspect-square",
  },
  {
    key: "renders",
    title: "Minecraft Renders",
    tag: "Scenes & thumbnails",
    blurb: "Full scene renders and server thumbnails. Composition and mood that make a click feel earned.",
    layout: "wide",        // full-width cinematic rows
    aspect: "aspect-video",
  },
  {
    key: "posters",
    title: "Business Posters",
    tag: "Print layouts",
    blurb: "Print-ready layouts for clients — type, hierarchy, and polish beyond the blocky world it comes from.",
    layout: "poster",      // tall side-by-side, text flipped right
    aspect: "aspect-[3/4]",
  },
];

/* One image tile. Shared by every layout so hover/lightbox behavior is
   identical no matter the size. */
function Tile({ src, section, index, list, onOpen, aspect, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ section: section.title, src, index, list })}
      className={`tile card-hover group relative w-full rounded-2xl border border-line bg-card overflow-hidden ${aspect} block ${className}`}
      aria-label={`Open ${section.title} image ${index + 1}`}
    >
      <div className="placeholder-art absolute inset-0" />
      <LazyImg
        src={src}
        alt={`${section.title} ${index + 1}`}
        className="relative w-full h-full object-cover"
      />
      <span
        className="tile-label absolute inset-x-0 bottom-0 px-4 py-3 text-left flex items-center justify-between"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82), transparent)" }}
      >
        <span className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">{section.tag}</span>
          <span className="text-sm font-semibold text-white">{section.title} · {String(index + 1).padStart(2, "0")}</span>
        </span>
        <span className="text-white/80 text-lg opacity-0 group-hover:opacity-100 transition-opacity">⤢</span>
      </span>
    </button>
  );
}

/* Placeholder cards so an empty folder still shows a themed grid. */
function Placeholders({ n = 3, aspect }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className={`placeholder-art tile relative rounded-2xl border border-line ${aspect} flex items-center justify-center`}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-muted opacity-60">
            coming soon
          </span>
        </div>
      ))}
    </>
  );
}

function SectionHeader({ section, count, align = "left" }) {
  return (
    <>
      <Reveal>
        <div className={`flex items-center gap-4 mb-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-acc px-2.5 py-1 rounded-full border border-line bg-card whitespace-nowrap">
            {section.tag}
          </span>
          <span className="h-px flex-1 border-t border-line" />
          <span className="text-xs font-mono text-muted whitespace-nowrap">
            {count ? `${count} piece${count > 1 ? "s" : ""}` : "gallery"}
          </span>
        </div>
      </Reveal>
      <Reveal delay={60}>
        <h2 className={`text-2xl md:text-4xl font-extrabold text-body mb-2 ${align === "right" ? "text-right" : ""}`}>
          {section.title}
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <p className={`text-muted max-w-2xl leading-relaxed mb-7 ${align === "right" ? "ml-auto text-right" : ""}`}>
          {section.blurb}
        </p>
      </Reveal>
    </>
  );
}

function Gallery({ section, onOpen }) {
  const imgs = GALLERIES[section.key] || [];
  const empty = imgs.length === 0;

  // Business posters flip the header to the right to break the down-page flow.
  const headerAlign = section.layout === "poster" ? "right" : "left";

  return (
    <section className="mb-24">
      <SectionHeader section={section} count={imgs.length} align={headerAlign} />

      {empty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <Placeholders aspect={section.aspect} />
        </div>
      )}

      {/* COMPACT — tidy square grid, good for many small avatars */}
      {!empty && section.layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {imgs.map((src, i) => (
            <Reveal key={src} delay={(i % 4) * 60}>
              <Tile src={src} section={section} index={i} list={imgs} onOpen={onOpen} aspect="aspect-square" />
            </Reveal>
          ))}
        </div>
      )}

      {/* WIDE — full-width cinematic rows so thumbnail detail/text is legible */}
      {!empty && section.layout === "wide" && (
        <div className="space-y-6">
          {imgs.map((src, i) => (
            <Reveal key={src} delay={i * 80}>
              <Tile src={src} section={section} index={i} list={imgs} onOpen={onOpen} aspect="aspect-video" />
            </Reveal>
          ))}
        </div>
      )}

      {/* POSTER — tall portrait tiles, capped width so they don't tower */}
      {!empty && section.layout === "poster" && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {imgs.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 70}>
              <Tile src={src} section={section} index={i} list={imgs} onOpen={onOpen} aspect="aspect-[3/4]" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

/* Featured showcase — the single biggest magnet on the page. Pulls the first
   render (falls back to first pfp) into a large split hero with story text. */
function Featured({ onOpen }) {
  const renders = GALLERIES.renders || [];
  const pfps = GALLERIES.pfps || [];
  const src = renders[0] || pfps[0];
  if (!src) return null;
  const from = renders[0] ? "renders" : "pfps";
  const list = GALLERIES[from];

  return (
    <Reveal>
      <section className="mb-24 grid lg:grid-cols-[1.6fr_1fr] gap-6 md:gap-8 items-start">
        <button
          type="button"
          onClick={() => onOpen({ section: "Featured", src, index: 0, list })}
          className="tile card-hover group relative rounded-3xl border border-line bg-card overflow-hidden aspect-video block"
          aria-label="Open featured piece"
        >
          <div className="placeholder-art absolute inset-0" />
          <LazyImg src={src} alt="Featured piece" className="relative w-full h-full object-contain" />
          <span className="absolute top-4 left-4 text-[11px] font-mono uppercase tracking-[0.25em] text-white px-3 py-1 rounded-full"
            style={{ background: "rgba(var(--acc-rgb),0.85)" }}>
            ★ Featured
          </span>
          <span className="absolute bottom-4 right-4 text-white/80 text-xl opacity-0 group-hover:opacity-100 transition-opacity">⤢</span>
        </button>

        <div className="flex flex-col justify-center rounded-3xl border border-line bg-card p-7 md:p-9">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-acc mb-3">The one to look at first</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-body mb-4 leading-tight">
            Where the game and the <span className="text-acc">marketing meet.</span>
          </h2>
          <p className="text-muted leading-relaxed mb-6">
            My favourite kind of brief: a scene that has to sell a server in a single
            frame. Lighting, composition, and post all tuned so the thumbnail earns the
            click before anyone reads a word.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Composition", "Lighting", "Post-processing"].map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
          <div className="my-6 h-px border-t border-line" />
          <ReviewCard
            quote="W Thumbnail"
            name="Nigel"
            role="Founder, Outcraft Network"
            className="p-5 md:p-5"
          />
        </div>
      </section>
    </Reveal>
  );
}

/* Lightbox modal with prev/next + keyboard nav. */
function Lightbox({ data, onClose, onNav }) {
  const { src, index, list, section } = data;
  useEffect(() => {
    document.body.classList.add("modal-open");
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(5,2,10,0.9)", backdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-5 z-20 w-10 h-10 rounded-full border border-line text-body/80 hover:text-body hover:border-acc transition-colors"
      >
        ✕
      </button>
      {list.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNav(-1); }}
            aria-label="Previous"
            className="absolute left-3 md:left-8 z-20 w-11 h-11 rounded-full border border-line text-body/80 hover:text-body hover:border-acc transition-colors"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNav(1); }}
            aria-label="Next"
            className="absolute right-3 md:right-8 z-20 w-11 h-11 rounded-full border border-line text-body/80 hover:text-body hover:border-acc transition-colors"
          >
            ›
          </button>
        </>
      )}
      <motion.figure
        key={src}
        className="relative max-w-5xl max-h-[85vh]"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={`${section} ${index + 1}`} className="max-h-[80vh] w-auto rounded-xl border border-line" />
        <figcaption className="text-center text-xs font-mono text-muted mt-3">
          {section} · {index + 1} / {list.length}
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

function Graphics() {
  useLockTheme("graphics");
  const [box, setBox] = useState(null);

  const nav = useCallback(
    (dir) => {
      setBox((b) => {
        if (!b) return b;
        const len = b.list.length;
        const next = (b.index + dir + len) % len;
        return { ...b, index: next, src: b.list[next] };
      });
    },
    []
  );

  return (
    <motion.main
      className="relative min-h-screen pt-8 md:pt-24 px-5 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-acc mb-3">Graphics Design</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-body mb-4 leading-tight">
            The work that shows the world <span className="text-acc">your best face.</span>
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-muted max-w-2xl leading-relaxed mb-14">
            I design the visual half of Minecraft projects — profile pictures, scene renders,
            and print-ready business posters. Same person who writes the plugins, which is why
            the art always matches the game it's selling.
          </p>
        </Reveal>

        <Featured onOpen={setBox} />

        {SECTIONS.map((s) => (
          <Gallery key={s.key} section={s} onOpen={setBox} />
        ))}

        <Reveal>
          <p className="text-center text-sm text-muted mb-4">
            Want the other half of the story?{" "}
            <Link to="/server" className="text-acc font-semibold hover:underline">
              See the servers →
            </Link>
          </p>
        </Reveal>
      </div>

      <ContactFooter />

      <AnimatePresence>
        {box && <Lightbox data={box} onClose={() => setBox(null)} onNav={nav} />}
      </AnimatePresence>
    </motion.main>
  );
}

export default Graphics;
