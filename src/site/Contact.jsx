import { Reveal } from "./shared.jsx";

/* Inline SVG icons — no icon-font dependency, all inherit currentColor. */
const Icon = {
  discord: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.42 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.42 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419Z" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  ),
  instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const CONTACTS = [
  { key: "discord",   label: "Discord",   value: "xDele1ed",              href: "https://discord.com/users/", copy: "xDele1ed" },
  { key: "mail",      label: "Email",     value: "xdele1edmc@gmail.com",  href: "mailto:xdele1edmc@gmail.com" },
  { key: "instagram", label: "Instagram", value: "@xdele_1ed",            href: "https://www.instagram.com/xdele_1ed?igsh=ajlxa3E5bzR2aXMz" },
];

export function ContactRow({ compact = false }) {
  return (
    <div className={`flex flex-wrap ${compact ? "gap-2 justify-center" : "gap-3 justify-center"}`}>
      {CONTACTS.map((c) => {
        const IconEl = Icon[c.key];
        const isCopy = c.key === "discord";
        const common =
          "btn-acc group inline-flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-left";
        const inner = (
          <>
            <span className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: "rgba(var(--acc-rgb),0.14)", color: "var(--acc)" }}>
              <IconEl className="w-5 h-5" />
            </span>
            {!compact && (
              <span className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted">{c.label}</span>
                <span className="text-sm font-semibold text-body">{c.value}</span>
              </span>
            )}
          </>
        );
        return isCopy ? (
          <button
            key={c.key}
            type="button"
            aria-label={`Copy Discord handle ${c.copy}`}
            onClick={() => navigator.clipboard?.writeText(c.copy)}
            className={common}
            title="Click to copy"
          >
            {inner}
          </button>
        ) : (
          <a
            key={c.key}
            href={c.href}
            target={c.key === "mail" ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={c.label}
            className={common}
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}

/* Footer contact block reused on every route. */
export function ContactFooter() {
  return (
    <footer id="contact" className="relative mt-24 border-t border-line pt-14 pb-10 px-5">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-acc mb-3">Get in touch</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-2xl md:text-3xl font-bold text-body mb-2">
            Got a server to build or a thumbnail to sell it?
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Fastest on Discord. Business enquiries welcome by email.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <ContactRow />
        </Reveal>
        <p className="text-xs text-muted mt-12">© {"xDele1ed"} — servers &amp; graphics.</p>
      </div>
    </footer>
  );
}
