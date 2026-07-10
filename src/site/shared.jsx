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
