import { useState, useRef, useEffect } from "react";

const BOOKMARKS = [
  { icon: "🧟", label: "Zombpocalypse", url: "https://github.com/xDele1ed/zombpocalypse-plugin" },
  { icon: "🤖", label: "xEconomy",      url: "https://github.com/xDele1ed/xEconomy" },
  { icon: "🐙", label: "GitHub",        url: "https://github.com/xDele1ed" },
  { icon: "⚔️",  label: "Outcraft",      url: "https://discord.gg/placeholder" },
  { icon: "📖", label: "Wikipedia",     url: "https://en.wikipedia.org/wiki/Special:Random" },
  { icon: "🔍", label: "Search",        url: "https://www.bing.com/search?q=xDele1ed" },
];

// Sites known to block iframes — show fallback instead of blank white box
const BLOCKED_HOSTS = [
  "google.com","youtube.com","duckduckgo.com","twitter.com","x.com","facebook.com",
  "instagram.com","discord.com","discord.gg","reddit.com","twitch.tv",
  "netflix.com","tiktok.com","linkedin.com","amazon.com",
];

function isBlocked(url) {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    return BLOCKED_HOSTS.some(b => host === b || host.endsWith("." + b));
  } catch { return false; }
}

function normalise(raw) {
  const t = raw.trim();
  if (!t) return "";
  // looks like a URL?
  if (/^https?:\/\//i.test(t)) return t;
  if (/^[\w-]+\.[\w]{2,}(\/|$)/.test(t)) return "https://" + t;
  // treat as search
  return `https://www.bing.com/search?q=${encodeURIComponent(t)}`;
}

const BrowserApp = ({ darkMode }) => {
  const [addressBar, setAddressBar] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading]       = useState(false);
  const [blocked, setBlocked]       = useState(false);
  const [history, setHistory]       = useState([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const iframeRef = useRef(null);
  const inputRef  = useRef(null);

  const navigate = (raw) => {
    const url = normalise(raw);
    if (!url) return;
    setAddressBar(url);
    if (isBlocked(url)) {
      setCurrentUrl(url);
      setBlocked(true);
      setLoading(false);
    } else {
      setBlocked(false);
      setLoading(true);
      setCurrentUrl(url);
    }
    // push history
    const newHist = [...history.slice(0, histIdx + 1), url];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
  };

  const goBack = () => {
    if (histIdx <= 0) return;
    const idx = histIdx - 1;
    const url = history[idx];
    setHistIdx(idx);
    setAddressBar(url);
    setBlocked(isBlocked(url));
    setLoading(!isBlocked(url));
    setCurrentUrl(url);
  };

  const goForward = () => {
    if (histIdx >= history.length - 1) return;
    const idx = histIdx + 1;
    const url = history[idx];
    setHistIdx(idx);
    setAddressBar(url);
    setBlocked(isBlocked(url));
    setLoading(!isBlocked(url));
    setCurrentUrl(url);
  };

  const reload = () => {
    if (!currentUrl) return;
    setLoading(true);
    setBlocked(false);
    // remount iframe by briefly clearing then restoring
    setCurrentUrl("");
    setTimeout(() => setCurrentUrl(currentUrl), 50);
  };

  // colour scheme
  const bg      = darkMode ? "#1e1e2e" : "#f5f5f5";
  const toolbar = darkMode ? "#16161e" : "#e8e8e8";
  const border  = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const inputBg = darkMode ? "rgba(255,255,255,0.07)" : "#fff";
  const text    = darkMode ? "#e0e0e0" : "#1a1a1a";
  const muted   = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const btnHov  = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const canBack    = histIdx > 0;
  const canForward = histIdx < history.length - 1;
  const isHome     = !currentUrl;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: bg, fontFamily: "'DM Sans', system-ui" }}>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ background: toolbar, borderBottom: `1px solid ${border}` }}>

        {/* Nav buttons */}
        {[
          { label: "←", action: goBack,    enabled: canBack },
          { label: "→", action: goForward, enabled: canForward },
          { label: "↺", action: reload,    enabled: !!currentUrl },
          { label: "⌂", action: () => { setCurrentUrl(""); setAddressBar(""); setBlocked(false); }, enabled: true },
        ].map(({ label, action, enabled }) => (
          <button key={label} onClick={action} disabled={!enabled}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "none",
              background: "transparent", color: enabled ? text : muted,
              cursor: enabled ? "pointer" : "default", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => enabled && (e.currentTarget.style.background = btnHov)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            {label}
          </button>
        ))}

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5"
          style={{ background: inputBg, border: `1px solid ${border}` }}>
          {loading && (
            <div style={{
              width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${muted}`, borderTopColor: "#3b82f6",
              animation: "spin 0.7s linear infinite",
            }} />
          )}
          {!loading && currentUrl && !blocked && <span style={{ fontSize: 11, color: "#22c55e", flexShrink: 0 }}>🔒</span>}
          {!loading && blocked     && <span style={{ fontSize: 11, color: "#ef4444", flexShrink: 0 }}>⚠️</span>}
          {!loading && isHome      && <span style={{ fontSize: 11, color: muted, flexShrink: 0 }}>🔍</span>}
          <input
            ref={inputRef}
            value={addressBar}
            onChange={e => setAddressBar(e.target.value)}
            onKeyDown={e => e.key === "Enter" && navigate(addressBar)}
            onFocus={e => e.target.select()}
            placeholder="Search or enter URL..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 12, color: text, minWidth: 0,
            }}
          />
          {addressBar && (
            <button onClick={() => navigate(addressBar)}
              style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 14, padding: 0 }}>→</button>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Spinner keyframe */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Home / new tab page */}
        {isHome && (
          <div className="absolute inset-0 overflow-auto flex flex-col items-center justify-start pt-12 px-6"
            style={{ background: bg }}>
            <div style={{ fontSize: 13, color: muted, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>xOS Browser</div>
            {/* Big search */}
            <div className="w-full max-w-md flex items-center gap-2 rounded-full px-5 py-3 mb-10"
              style={{ background: inputBg, border: `1px solid ${border}` }}>
              <span style={{ color: muted }}>🔍</span>
              <input
                value={addressBar}
                onChange={e => setAddressBar(e.target.value)}
                onKeyDown={e => e.key === "Enter" && navigate(addressBar)}
                placeholder="Search Bing or enter a URL..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: text }}
              />
            </div>
            {/* Bookmarks */}
            <div style={{ color: muted, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12, alignSelf: "flex-start", maxWidth: 448 }}>Bookmarks</div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {BOOKMARKS.map(b => (
                <button key={b.label} onClick={() => navigate(b.url)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-[1.04] active:scale-95"
                  style={{ background: inputBg, border: `1px solid ${border}`, color: text, cursor: "pointer" }}>
                  <span style={{ fontSize: 22 }}>{b.icon}</span>
                  <span style={{ fontSize: 11 }}>{b.label}</span>
                </button>
              ))}
            </div>
            <p style={{ marginTop: 24, fontSize: 10, color: muted, textAlign: "center" }}>
              Most sites block iframes — if a page goes blank, it'll show a fallback with a direct link.
            </p>
          </div>
        )}

        {/* Blocked-site fallback */}
        {!isHome && blocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8"
            style={{ background: bg }}>
            <div style={{ fontSize: 40 }}>🚫</div>
            <div style={{ color: text, fontWeight: 600, fontSize: 15 }}>Can't embed this site</div>
            <div style={{ color: muted, fontSize: 12, textAlign: "center", maxWidth: 340 }}>
              <strong style={{ color: text }}>{(() => { try { return new URL(currentUrl).hostname; } catch { return currentUrl; } })()}</strong> blocks embedding in iframes — this is a browser security restriction, not a bug.
            </div>
            <a href={currentUrl} target="_blank" rel="noopener noreferrer"
              style={{
                padding: "10px 24px", borderRadius: 10, background: "#3b82f6",
                color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
              Open in real browser ↗
            </a>
            <button onClick={() => { setCurrentUrl(""); setAddressBar(""); setBlocked(false); }}
              style={{ background: "none", border: "none", color: muted, cursor: "pointer", fontSize: 12 }}>
              ← Back to home
            </button>
          </div>
        )}

        {/* Iframe */}
        {!isHome && !blocked && currentUrl && (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: bg }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `3px solid ${border}`, borderTopColor: "#3b82f6",
                  animation: "spin 0.7s linear infinite",
                }} />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={currentUrl}
              className="absolute inset-0 w-full h-full"
              style={{ border: "none", opacity: loading ? 0 : 1, transition: "opacity 0.2s" }}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setBlocked(true); }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              title="browser"
            />
          </>
        )}
      </div>
    </div>
  );
};

export { BrowserApp };