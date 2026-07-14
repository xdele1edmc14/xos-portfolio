import { useEffect, useRef, useState } from "react";

/* ─────────── Auto-loaded galleries ───────────
   Vite eagerly globs every file in each folder at build time, so dropping
   new images into assets/pfps etc. picks them up with zero code changes.
   Returns a sorted array of URL strings (empty if the folder has none). */

const pfpMods     = import.meta.glob("../../assets/pfps/*.{png,jpg,jpeg,webp,gif}",    { eager: true, query: "?url", import: "default" });
const renderMods  = import.meta.glob("../../assets/renders/*.{png,jpg,jpeg,webp,gif}", { eager: true, query: "?url", import: "default" });
const posterMods  = import.meta.glob("../../assets/posters/*.{png,jpg,jpeg,webp,gif}", { eager: true, query: "?url", import: "default" });

const toSortedUrls = (mods) =>
  Object.keys(mods)
    .sort()
    .map((k) => mods[k]);

export const GALLERIES = {
  pfps:    toSortedUrls(pfpMods),
  renders: toSortedUrls(renderMods),
  posters: toSortedUrls(posterMods),
};

/* Single named assets referenced by the server page. */
export const SERVER_ASSETS = {
  xapocalypseBg:     new URL("../../assets/xapocalypse_backround.jpg", import.meta.url).href,
  xapocalypseBanner: new URL("../../assets/xapocalypse_banner.png",    import.meta.url).href,
  deadlandsBg:       new URL("../../assets/deadlands_backround.jpg",   import.meta.url).href,
  deadlandsBanner:   new URL("../../assets/deadlands_banner.png",      import.meta.url).href,
};

/* ─────────── Scroll reveal ─────────── */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* Shared testimonial card. Initials keep reviews personal without requiring
   portrait assets, while the active page theme supplies the accent colour. */
export function ReviewCard({ quote, name, role, className = "" }) {
  const initial = name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <figure className={`testimonial-card card-hover h-full rounded-2xl border border-line p-6 md:p-7 ${className}`}>
      <div className="relative z-10 flex h-full flex-col">
        <span
          aria-hidden="true"
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card font-serif text-2xl leading-none text-acc"
        >
          “
        </span>
        <blockquote className="text-base font-medium leading-relaxed text-body md:text-lg">
          {quote}
        </blockquote>
        <figcaption className="mt-auto flex items-center gap-3 pt-6">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-sm font-bold text-acc"
            style={{ background: "rgba(var(--acc-rgb), 0.12)" }}
          >
            {initial}
          </span>
          <span className="min-w-0">
            <span className="block font-bold text-body">{name}</span>
            <span className="block text-xs font-mono uppercase tracking-wider text-muted">{role}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

/* ─────────── Lazy image with fade-in + placeholder fallback ───────────
   If the image fails to load (missing asset), we keep the parent's
   placeholder gradient visible instead of a broken-image icon. */
export function LazyImg({ src, alt, className = "", onError, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed || !src) return null;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      className={`lazy-img ${loaded ? "loaded" : ""} ${className}`}
      {...rest}
    />
  );
}
