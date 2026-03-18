import { useState, useEffect, useRef, useCallback } from "react";
import { DISCORD_ICON, GITHUB_ICON, PFP_URI, WP_DARK_URI, WP_LIGHT_URI } from "./assets.js";
import { WALLPAPERS } from "./data.js";
import { Clock, AppWindow } from "./components/AppWindow.jsx";
import { IntroScreen, BootScreen }   from "./components/BootIntro.jsx";
import { ControlCenter }             from "./components/ControlCenter.jsx";
import { AboutContent }              from "./apps/AboutContent.jsx";
import { ProjectsContent }           from "./apps/ProjectsContent.jsx";
import { SkillsContent }             from "./apps/SkillsContent.jsx";
import { ContactContent }            from "./apps/ContactContent.jsx";
import { SettingsContent }           from "./apps/SettingsContent.jsx";
import { BrowserApp }                from "./apps/BrowserApp.jsx";
import { PaintApp }                  from "./apps/PaintApp.jsx";
import { ExplorerApp }               from "./apps/ExplorerApp.jsx";
import { DiscordApp }                from "./apps/DiscordApp.jsx";
import { GithubApp }                 from "./apps/GithubApp.jsx";
import { InstagramApp }              from "./apps/InstagramApp.jsx";

// ─── APP DEFINITIONS ─────────────────────────────────────────────────────────
// Single source of truth for all apps used across mobile grid, desktop icons,
// taskbar, and the Start Menu pinned list.

const APP_DEFS = [
  { id: "about",     title: "About Me",   desc: "About Me",   emoji: "👤", w: 680, h: 520 },
  { id: "projects",  title: "Projects",   desc: "Projects",   emoji: "📁", w: 780, h: 560 },
  { id: "skills",    title: "Skills",     desc: "Skills",     emoji: "⚡", w: 620, h: 500 },
  { id: "contact",   title: "Contact",    desc: "Contact",    emoji: "✉️", w: 520, h: 440 },
  { id: "settings",  title: "Settings",   desc: "Settings",   emoji: "⚙️", w: 600, h: 500 },
  { id: "discord",   title: "Discord",    desc: "Discord",    emoji: "💬", imgIcon: "discord", w: 500, h: 520 },
  { id: "github",    title: "GitHub",     desc: "GitHub",     emoji: "🐙", imgIcon: "github",  w: 660, h: 560 },
  { id: "instagram", title: "Instagram",  desc: "Instagram",  emoji: "📷", w: 480, h: 620 },
  { id: "browser",   title: "Browser",    desc: "Browser",    emoji: "🌐", w: 720, h: 540 },
  { id: "explorer",  title: "Explorer",   desc: "Explorer",   emoji: "📂", w: 680, h: 500 },
  { id: "paint",     title: "Paint",      desc: "Paint",      emoji: "🎨", w: 700, h: 520 },
];

// All apps — used in taskbar and Start Menu pinned grid
const ALL_APP_DEFS = APP_DEFS;

// Apps shown as desktop icons (left column on desktop)
const DESKTOP_APPS = APP_DEFS.filter(a =>
  ["about", "projects", "skills", "contact", "settings", "discord", "github"].includes(a.id)
);

// ─────────────────────────────────────────────────────────────────────────────

function OSPortfolio() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [forceDesktop, setForceDesktop] = useState(false);
  const [windows, setWindows] = useState([]);
  const [zCounter, setZCounter] = useState(10);
  const [darkMode, setDarkMode] = useState(true);
  const [wallpaper, setWallpaper] = useState("void");
  const [startOpen, setStartOpen] = useState(false);
  const [startClosing, setStartClosing] = useState(false);
  const closeStart = () => {
    if (!startOpen) return;
    setStartClosing(true);
    setTimeout(() => { setStartOpen(false); setStartClosing(false); setStartSearch(""); setStartView("pinned"); }, 180);
  };
  const [startSearch, setStartSearch] = useState("");
  const [startView, setStartView] = useState("pinned");
  const [activeApp, setActiveApp] = useState(null);
  const [mobileRecent, setMobileRecent] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [closingApp, setClosingApp] = useState(false);
  const closingAppDefRef = useRef(null);  // persists app def during close animation
  const taskbarRefs = useRef({});

  // ── Boot + intro sequence: booting → fading → intro → intro-out → done
  const [bootPhase, setBootPhase] = useState("booting");
  useEffect(() => {
    const t1 = setTimeout(() => setBootPhase("fading"), 3400);
    const t2 = setTimeout(() => setBootPhase("intro"),  4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const showNotif = (msg) => {};

  const openApp = useCallback((appDef) => {
    closeStart();
    if (isMobile && !forceDesktop) {
      setActiveApp(appDef.id);
      setShowRecent(false);
      setMobileRecent(prev => {
        const filtered = prev.filter(id => id !== appDef.id);
        return [appDef.id, ...filtered].slice(0, 4);
      });
      return;
    }
    const existing = windows.find(w => w.appId === appDef.id);
    if (existing) {
      if (existing.minimized) {
        setWindows(ws => ws.map(w => w.appId === appDef.id ? { ...w, minimized: false, z: zCounter + 1 } : w));
        setZCounter(z => z + 1);
      } else {
        setWindows(ws => ws.map(w => w.appId === appDef.id ? { ...w, z: zCounter + 1 } : w));
        setZCounter(z => z + 1);
      }
      return;
    }
    const offset = windows.length * 24;
    const size = (isMobile && forceDesktop)
      ? { w: window.innerWidth - 16, h: window.innerHeight - 80 }
      : { w: appDef.w, h: appDef.h };
    const pos = (isMobile && forceDesktop)
      ? { x: 8, y: 8 }
      : { x: 60 + offset, y: 50 + offset };
    const newWin = {
      id: Date.now(), appId: appDef.id, title: appDef.title,
      x: pos.x, y: pos.y,
      w: size.w, h: size.h,
      minimized: false, maximized: false,
      z: zCounter + 1,
    };
    setWindows(ws => [...ws, newWin]);
    setZCounter(z => z + 1);
    showNotif(`Opened ${appDef.title}`);
  }, [windows, zCounter, isMobile, forceDesktop]);

  const closeWin = (id) => setWindows(ws => ws.filter(w => w.id !== id));
  const minimizeWin = (id, targetRect) => setWindows(ws => ws.map(w =>
    w.id === id ? { ...w, minimized: true, minimizeTarget: targetRect || null } : w
  ));
  const maximizeWin = (id) => setWindows(ws => ws.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  const focusWin = (id) => {
    setZCounter(z => z + 1);
    setWindows(ws => ws.map(w => w.id === id ? { ...w, z: zCounter + 1 } : w));
  };

  const wp  = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0];
  const acc = wp.accent;
  const wpBgUrl = wp.dark ? WP_DARK_URI : WP_LIGHT_URI;
  const winContentBg = darkMode ? "bg-black/40 backdrop-blur-2xl" : "bg-white/80 backdrop-blur-2xl";

  const renderAppContent = (appId, mobile = false) => {
    switch (appId) {
      case "about":     return <AboutContent darkMode={darkMode} acc={acc} />;
      case "projects":  return <ProjectsContent mobile={mobile} darkMode={darkMode} acc={acc} />;
      case "skills":    return <SkillsContent darkMode={darkMode} acc={acc} />;
      case "contact":   return <ContactContent darkMode={darkMode} acc={acc} />;
      case "settings":  return <SettingsContent darkMode={darkMode} setDarkMode={setDarkMode} wallpaper={wallpaper} setWallpaper={setWallpaper} acc={acc} />;
      case "discord":   return <DiscordApp darkMode={darkMode} />;
      case "github":    return <GithubApp darkMode={darkMode} />;
      case "instagram": return <InstagramApp darkMode={darkMode} />;
      default: return null;
    }
  };

  // ── Boot / intro gate ──────────────────────────────────────────────────────
  if (bootPhase === "booting" || bootPhase === "fading") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#05020f",
        opacity: bootPhase === "fading" ? 0 : 1,
        transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <BootScreen />
      </div>
    );
  }

  if (bootPhase === "intro" || bootPhase === "intro-out") {
    return (
      <IntroScreen
        fading={bootPhase === "intro-out"}
        onDone={() => setBootPhase("done")}
        onSkip={() => {
          setBootPhase("intro-out");
          setTimeout(() => setBootPhase("done"), 600);
        }}
      />
    );
  }

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile && !forceDesktop) {
    const activeAppDef = APP_DEFS.find(a => a.id === activeApp);
    // Keep ref updated so closing animation still has app def after activeApp → null
    if (activeAppDef) closingAppDefRef.current = activeAppDef;
    const visibleAppDef = activeAppDef || closingAppDefRef.current;

    const recentApps = mobileRecent.map(id => APP_DEFS.find(a => a.id === id)).filter(Boolean);

    const closeApp = () => {
      setClosingApp(true);
      setTimeout(() => { setActiveApp(null); setClosingApp(false); }, 380);
    };

    // App icon positions for zoom-origin tracking
    const APP_POSITIONS = {
      about:    { x: "20%",  y: "55%" },
      projects: { x: "45%",  y: "55%" },
      skills:   { x: "70%",  y: "55%" },
      contact:  { x: "95%",  y: "55%" },
      settings: { x: "20%",  y: "75%" },
    };
    const lastApp = activeApp || (closingApp && closingAppDefRef.current?.id);
    const origin = lastApp ? (APP_POSITIONS[lastApp] || { x: "50%", y: "50%" }) : { x: "50%", y: "50%" };

    return (
      <div className="w-full h-screen overflow-hidden flex flex-col relative font-sans"
        style={{ fontFamily: "'DM Sans', system-ui", background: wp.mobileBg, animation: "osFadeIn 0.5s ease forwards" }}>

        <style>{`
          @keyframes osFadeIn { from { opacity:0 } to { opacity:1 } }
          @keyframes iosOpen {
            0%   { opacity:0; transform: scale(0.92); border-radius: 28px; }
            100% { opacity:1; transform: scale(1);    border-radius: 0px; }
          }
          @keyframes iosClose {
            0%   { opacity:1; transform: scale(1);    border-radius: 0px; }
            100% { opacity:0; transform: scale(0.88); border-radius: 28px; }
          }
          @keyframes homePeekIn {
            0%   { opacity:0; transform: scale(1.04); }
            100% { opacity:1; transform: scale(1); }
          }
          @keyframes iconBounce {
            0%   { transform: scale(1); }
            25%  { transform: scale(0.72, 1.18); }
            55%  { transform: scale(1.18, 0.82); }
            75%  { transform: scale(0.94, 1.06); }
            100% { transform: scale(1); }
          }
          @keyframes ccSlideDown {
            from { transform: translateY(-100%); opacity: 0.6; }
            to   { transform: translateY(0);     opacity: 1;   }
          }
          @keyframes ccSlideUp {
            from { transform: translateY(0);     opacity: 1;   }
            to   { transform: translateY(-100%); opacity: 0;   }
          }
          @keyframes notifSlideIn {
            from { transform: translateY(-110%); opacity: 0; }
            to   { transform: translateY(0);     opacity: 1; }
          }
        `}</style>

        {/* Wallpaper aurora */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: `radial-gradient(ellipse 120% 80% at 20% 10%, ${wp.mobileAccent} 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 80% 90%, ${wp.mobileAccent} 0%, transparent 50%)`,
        }} />
        <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{
          backgroundImage: darkMode ? "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)" : "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />


        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 z-50 relative flex-shrink-0">
          <span className={`text-xs font-semibold ${darkMode ? "text-white/80" : "text-gray-700"}`}>9:41</span>
          <div className="flex gap-2 items-center">
            <button onClick={() => setForceDesktop(true)}
              className={`text-[10px] px-2 py-0.5 rounded-full border ${darkMode ? "border-white/20 text-white/50" : "border-black/15 text-gray-400"}`}>
              🖥
            </button>
            {/* Control Center button — visible pill */}
            <button onClick={() => setShowControlCenter(true)}
              className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border transition-colors ${darkMode ? "border-white/20 text-white/60 hover:bg-white/10" : "border-black/15 text-gray-500 hover:bg-black/5"}`}>
              <span>⚡</span>
            </button>
            <div className="flex gap-0.5 items-end h-3">
              {[2,3,4,4].map((h,i) => <div key={i} className={`w-1 rounded-sm ${darkMode ? "bg-white/70" : "bg-gray-600"}`} style={{height: h*3+'px'}} />)}
            </div>
            <span className={`text-xs ${darkMode ? "text-white/70" : "text-gray-600"}`}>🔋</span>
          </div>
        </div>

        {/* Home screen */}
        <div className={`flex-1 flex flex-col relative z-10 transition-all duration-300 ${activeApp || showRecent || showControlCenter ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}>
          {/* Clock */}
          <div className="text-center select-none mt-8">
            <div className={`text-5xl font-thin tracking-tight ${darkMode ? "text-white" : "text-gray-800"}`}
              style={{textShadow: darkMode ? "0 2px 20px rgba(0,0,0,0.5)" : "none"}}>
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-500"}`}>
              {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Search bar */}
          <div className={`mx-4 mt-6 rounded-full flex items-center gap-2 px-4 border ${darkMode ? "border-white/10" : "border-black/10"}`}
            style={{background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.6)", backdropFilter:"blur(24px)"}}>
            <span className={darkMode ? "text-white/50" : "text-gray-400"}>🔍</span>
            <input type="text" value={mobileSearch} onChange={e => setMobileSearch(e.target.value)}
              placeholder="Search apps..."
              className={`flex-1 bg-transparent py-3 text-sm outline-none ${darkMode ? "text-white placeholder-white/30" : "text-gray-800 placeholder-gray-400"}`} />
            {mobileSearch
              ? <button onClick={() => setMobileSearch("")} className={`text-xs ${darkMode ? "text-white/40" : "text-gray-400"}`}>✕</button>
              : <div className="w-5 h-5 rounded-sm bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">G</div>
            }
          </div>

          {/* App grid */}
          <div className="grid grid-cols-4 gap-4 px-6 mt-6">
            {APP_DEFS.filter(app => app.desc.toLowerCase().includes(mobileSearch.toLowerCase())).map(app => (
              <button key={app.id} onClick={() => { openApp(app); setMobileSearch(""); }}
                className="flex flex-col items-center gap-1.5 group">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl shadow-lg ${darkMode ? "border-white/10" : "border-black/10"}`}
                  style={{
                    background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(16px)",
                    animation: closingApp && lastApp === app.id ? "iconSquish 0.38s cubic-bezier(0.22,1,0.36,1)" : undefined,
                  }}>
                  {app.emoji}
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight ${darkMode ? "text-white" : "text-gray-800"}`}
                  style={{textShadow: darkMode ? "0 1px 4px rgba(0,0,0,0.7)" : "none"}}>
                  {app.desc}
                </span>
              </button>
            ))}
            {APP_DEFS.filter(a => a.desc.toLowerCase().includes(mobileSearch.toLowerCase())).length === 0 && (
              <div className={`col-span-4 text-center text-xs py-8 ${darkMode ? "text-white/30" : "text-gray-400"}`}>No apps found</div>
            )}
          </div>

          {/* Dock */}
          <div className={`mx-6 mt-auto mb-2 rounded-3xl border flex justify-around py-3 px-2 ${darkMode ? "border-white/10" : "border-black/10"}`}
            style={{background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)", backdropFilter:"blur(32px)"}}>
            {APP_DEFS.slice(0, 4).map(app => (
              <button key={app.id} onClick={() => openApp(app)}
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl ${darkMode ? "border-white/10" : "border-black/10"}`}
                style={{
                  background: darkMode ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.7)",
                  animation: closingApp && lastApp === app.id ? "iconSquish 0.38s cubic-bezier(0.22,1,0.36,1)" : undefined,
                }}>
                {app.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Recents screen */}
        {showRecent && (
          <div className="absolute inset-0 flex flex-col pt-10 pb-20 px-4 z-30"
            style={{background: darkMode ? "rgba(15,17,23,0.95)" : "rgba(240,240,245,0.95)", backdropFilter:"blur(20px)"}}>
            <div className={`text-xs text-center mb-5 font-medium ${darkMode ? "text-white/50" : "text-gray-500"}`}>Recent Apps</div>
            {recentApps.length === 0 ? (
              <div className={`flex-1 flex flex-col items-center justify-center gap-3 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                <span className="text-4xl">🕑</span>
                <span className="text-sm">No recent apps</span>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start pt-2">
                {recentApps.map(app => (
                  <button key={app.id} onClick={() => { setActiveApp(app.id); setShowRecent(false); }}
                    className="flex-shrink-0 w-44 flex flex-col active:scale-95 transition-transform">
                    <div className={`h-72 rounded-2xl border overflow-hidden flex flex-col ${darkMode ? "bg-black/50 border-white/15" : "bg-white/80 border-black/10"}`}>
                      <div className={`flex items-center gap-2 p-2.5 border-b flex-shrink-0 ${darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"}`}>
                        <span className="text-base">{app.emoji}</span>
                        <span className={`text-xs font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{app.desc}</span>
                      </div>
                      <div className="flex-1 overflow-hidden opacity-50 pointer-events-none scale-75 origin-top-left">
                        {renderAppContent(app.id, true)}
                      </div>
                    </div>
                    <span className={`mt-2 text-xs text-center ${darkMode ? "text-white/50" : "text-gray-500"}`}>Tap to open</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Home peek layer — visible behind app as it closes */}
        {closingApp && (
          <div className="absolute inset-0 z-[39]"
            style={{ animation: "homePeekIn 0.32s cubic-bezier(0.22,1,0.36,1) forwards" }} />
        )}

        {/* Active app — iOS-style open/close */}
        {(activeApp || closingApp) && visibleAppDef && (
          <div className="absolute inset-0 z-40 flex flex-col overflow-hidden"
            style={{
              background: wp.mobileBg,
              animation: closingApp
                ? "iosClose 0.32s cubic-bezier(0.4,0,0.6,1) forwards"
                : "iosOpen 0.38s cubic-bezier(0.22,1,0.36,1) forwards",
            }}>
            <div className={`flex items-center gap-2 px-4 pt-8 pb-3 border-b flex-shrink-0 ${darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
              <span className="text-lg">{visibleAppDef.emoji}</span>
              <span className={`font-medium text-sm flex-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{visibleAppDef.desc}</span>
              <button onClick={closeApp} className={`text-sm px-3 py-1 ${darkMode ? "text-white/40 hover:text-white/70" : "text-gray-400 hover:text-gray-700"}`}>✕</button>
            </div>
            <div className="flex-1 overflow-auto">{activeApp && renderAppContent(activeApp, true)}</div>
          </div>
        )}

        {/* Control Center */}
        {showControlCenter && <ControlCenter darkMode={darkMode} setDarkMode={setDarkMode} setWallpaper={setWallpaper} onClose={() => setShowControlCenter(false)} acc={acc} />}

        {/* Android nav bar */}
        <div className={`flex items-center justify-around py-3 px-8 border-t flex-shrink-0 z-50 relative ${darkMode ? "border-white/[0.06]" : "border-black/[0.06]"}`}
          style={{background: darkMode ? "rgba(15,17,23,0.95)" : "rgba(240,240,245,0.95)", backdropFilter:"blur(20px)"}}>
          <button onClick={() => {
            if (showControlCenter) { setShowControlCenter(false); }
            else if (showRecent) { setShowRecent(false); }
            else if (activeApp) { closeApp(); }
          }} className={`transition-colors p-3 ${darkMode ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-800"}`}>
            <div className="w-5 h-5 border-2 border-current rounded-sm" />
          </button>
          <button onClick={() => { if (activeApp || closingApp) { closeApp(); } setShowRecent(false); setShowControlCenter(false); }}
            className={`transition-colors p-3 ${darkMode ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-800"}`}>
            <div className="w-5 h-5 border-2 border-current rounded-full" />
          </button>
          <button onClick={() => { setActiveApp(null); setShowRecent(!showRecent); setShowControlCenter(false); }}
            className={`transition-colors p-3 ${darkMode ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-800"}`}>
            <div className="w-5 h-3 border-2 border-current rounded-sm" />
          </button>
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  const renderDesktopApp = (appId) => {
    const props = { darkMode, acc };
    switch (appId) {
      case "about":     return <AboutContent {...props} />;
      case "projects":  return <ProjectsContent {...props} />;
      case "skills":    return <SkillsContent {...props} />;
      case "contact":   return <ContactContent {...props} />;
      case "settings":  return <SettingsContent darkMode={darkMode} setDarkMode={setDarkMode} wallpaper={wallpaper} setWallpaper={setWallpaper} acc={acc} />;
      case "browser":   return <BrowserApp darkMode={darkMode} />;
      case "explorer":  return <ExplorerApp darkMode={darkMode} openApp={openDesktopApp} />;
      case "discord":   return <DiscordApp darkMode={darkMode} />;
      case "github":    return <GithubApp darkMode={darkMode} />;
      case "paint":     return <PaintApp darkMode={darkMode} />;
      case "instagram": return <InstagramApp darkMode={darkMode} />;
      default: return <div className="p-8 text-white/40 text-sm">App not found</div>;
    }
  };

  // Helper to open a desktop app
  const openDesktopApp = (appDef) => {
    closeStart();
    const existing = windows.find(w => w.appId === appDef.id);
    if (existing) {
      if (existing.minimized) {
        setWindows(ws => ws.map(w => w.appId === appDef.id ? { ...w, minimized: false, z: zCounter + 1 } : w));
      } else {
        setWindows(ws => ws.map(w => w.appId === appDef.id ? { ...w, z: zCounter + 1 } : w));
      }
      setZCounter(z => z + 1);
      return;
    }
    const offset = windows.length * 24;
    const size = (isMobile && forceDesktop)
      ? { w: window.innerWidth - 16, h: window.innerHeight - 80 }
      : { w: appDef.w || 700, h: appDef.h || 500 };
    const pos = (isMobile && forceDesktop) ? { x: 8, y: 8 } : { x: 60 + offset, y: 40 + offset };
    setWindows(ws => [...ws, {
      id: Date.now(), appId: appDef.id, title: appDef.title,
      x: pos.x, y: pos.y, w: size.w, h: size.h,
      minimized: false, maximized: false, z: zCounter + 1,
    }]);
    setZCounter(z => z + 1);
  };

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  const taskbarApps = ALL_APP_DEFS;

  const AppIcon = ({ app, onOpen, dblClick = false }) => {
    const [hovered, setHovered] = useState(false);
    const win = windows.find(w => w.appId === app.id);
    const isOpen = !!win;
    const isActive = isOpen && !win?.minimized;
    return (
      <button
        title={app.title}
        onDoubleClick={dblClick ? () => onOpen(app) : undefined}
        onClick={dblClick ? undefined : () => onOpen(app)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative flex flex-col items-center gap-1 w-20 p-2 rounded-lg transition-all group ${hovered ? "bg-blue-500/20" : ""}`}>
        {app.imgIcon === "discord"
          ? <img src={DISCORD_ICON} alt="" className="w-8 h-8 drop-shadow-lg" />
          : app.imgIcon === "github"
          ? <img src={GITHUB_ICON}  alt="" className="w-8 h-8 drop-shadow-lg" style={{filter: darkMode ? "invert(1) brightness(1.2)" : "none"}} />
          : <div className="text-3xl drop-shadow-lg">{app.emoji}</div>
        }
        <span className="text-[11px] text-center text-white font-medium leading-tight drop-shadow-md w-full truncate">{app.title}</span>
        {isOpen && <div className={`absolute bottom-0.5 h-1 rounded-full bg-blue-400 ${isActive ? "w-4" : "w-1"}`} />}
      </button>
    );
  };

  return (
    <div
      className={`w-full h-screen bg-gradient-to-br ${wp.desktopBg} overflow-hidden flex flex-col relative select-none`}
      style={{ fontFamily: "'DM Sans', system-ui", animation: "osFadeIn 0.5s ease forwards" }}
      onClick={() => { if (startOpen) closeStart(); }}>

      {/* Wallpaper image */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        backgroundImage: `url("${wpBgUrl}")`,
        backgroundSize: "cover", backgroundPosition: "center",
        zIndex: 0, pointerEvents: "none",
      }} />

      <style>{`
        @keyframes osFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes startMenuOpen {
          from { opacity:0; transform: translateX(-50%) translateY(20px) scale(0.96); }
          to   { opacity:1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes startMenuClose {
          from { opacity:1; transform: translateX(-50%) translateY(0) scale(1); }
          to   { opacity:0; transform: translateX(-50%) translateY(16px) scale(0.96); }
        }
        .start-open  { animation: startMenuOpen  0.25s cubic-bezier(0.22,1,0.36,1) forwards; }
        .start-close { animation: startMenuClose 0.18s cubic-bezier(0.4,0,1,1) forwards; }
      `}</style>

      {/* Wallpaper grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        backgroundImage: darkMode
          ? "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)"
          : "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
        backgroundSize: "48px 48px"
      }} />


      {/* Desktop area */}
      <div className="flex-1 relative overflow-hidden" style={{zIndex: 2}} onClick={() => { if (startOpen) closeStart(); }}>
        {/* Desktop icons */}
        {isMobile && forceDesktop ? (
          <div className="absolute top-3 left-0 right-0 flex gap-3 px-4 overflow-x-auto z-10 pb-1" style={{scrollbarWidth:"none"}}>
            {DESKTOP_APPS.map(app => (
              <button key={app.id} onClick={(e) => { e.stopPropagation(); openDesktopApp(app); }}
                className="flex flex-col items-center gap-1 flex-shrink-0 active:scale-90 transition-transform hover:bg-blue-500/20 rounded-lg p-1">
                {app.imgIcon === "discord"
                  ? <img src={DISCORD_ICON} alt="" className="w-10 h-10" />
                  : app.imgIcon === "github"
                  ? <img src={GITHUB_ICON}  alt="" className="w-10 h-10" style={{filter: darkMode ? "invert(1) brightness(1.2)" : "none"}} />
                  : <div className="text-3xl">{app.emoji}</div>}
                <span className="text-[10px] text-white text-center drop-shadow">{app.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="absolute top-4 left-4 grid grid-cols-1 gap-0.5 z-10">
            {DESKTOP_APPS.map(app => (
              <AppIcon key={app.id} app={app} onOpen={openDesktopApp} dblClick />
            ))}
          </div>
        )}

        {/* Windows */}
        {windows.map(win => (
          <AppWindow key={win.id} win={win} zIndex={win.z}
            winContentBg={winContentBg}
            onClose={() => closeWin(win.id)}
            onMinimize={(e) => {
              e && e.stopPropagation && e.stopPropagation();
              const btn = taskbarRefs.current[win.appId];
              const r = btn ? btn.getBoundingClientRect() : null;
              minimizeWin(win.id, r ? { x: r.left + r.width/2, y: r.top + r.height/2 } : null);
            }}
            onMaximize={() => maximizeWin(win.id)}
            onFocus={() => focusWin(win.id)}>
            {renderDesktopApp(win.appId)}
          </AppWindow>
        ))}
      </div>

      {/* Taskbar */}
      <div className="flex items-center h-12 px-3 flex-shrink-0 z-50 relative"
        style={{
          background: darkMode ? "rgba(20,20,30,0.82)" : "rgba(238,238,248,0.88)",
          backdropFilter: "blur(28px)",
          borderTop: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)"
        }}>

        {/* Left: weather / mobile back */}
        <div className="flex items-center gap-2 w-28 flex-shrink-0">
          {isMobile && forceDesktop && (
            <button onClick={() => { setForceDesktop(false); setWindows([]); closeStart(); }}
              className={`px-2 py-1.5 rounded-lg text-xs ${darkMode ? "bg-white/10 text-white/70" : "bg-black/10 text-gray-600"}`}>📱</button>
          )}
          <div className={`text-[10px] leading-tight ${darkMode ? "text-white/40" : "text-gray-500"}`}>
            <div>72°F</div><div>Sunny</div>
          </div>
        </div>

        {/* Center: Start + pinned apps */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {/* Start button */}
          <button
            onClick={(e) => { e.stopPropagation(); if (startOpen) { closeStart(); } else { setStartOpen(true); } }}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all hover:bg-blue-500/20 ${startOpen ? (darkMode ? "bg-white/20" : "bg-black/15") : ""}`}>
            <div className="grid grid-cols-2 gap-0.5">
              {[0,1,2,3].map(i => <div key={i} className="w-2 h-2 bg-blue-500 rounded-sm" />)}
            </div>
          </button>

          <div className={`w-px h-6 mx-1 ${darkMode ? "bg-white/15" : "bg-black/10"}`} />

          {/* All app icons */}
          {taskbarApps.map(app => {
            const win = windows.find(w => w.appId === app.id);
            const isOpen = !!win;
            const isActive = isOpen && !win?.minimized;
            const handleTaskbarClick = (e) => {
              e.stopPropagation();
              if (!isOpen) { openDesktopApp(app); return; }
              if (win.minimized) {
                setWindows(ws => ws.map(w => w.appId === app.id ? { ...w, minimized: false, z: zCounter + 1 } : w));
                setZCounter(z => z + 1);
              } else {
                const btn = taskbarRefs.current[app.id];
                const r = btn ? btn.getBoundingClientRect() : null;
                minimizeWin(win.id, r ? { x: r.left + r.width/2, y: r.top + r.height/2 } : null);
              }
            };
            return (
              <button key={app.id} ref={el => taskbarRefs.current[app.id] = el} onClick={handleTaskbarClick} title={app.title}
                className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-all hover:bg-blue-500/15 ${isActive ? "bg-blue-500/25" : ""}`}>
                {app.imgIcon === "discord"
                  ? <img src={DISCORD_ICON} alt="" className="w-5 h-5" />
                  : app.imgIcon === "github"
                  ? <img src={GITHUB_ICON}  alt="" className="w-5 h-5" style={{filter: darkMode ? "invert(1) brightness(1.2)" : "none"}} />
                  : <span className="text-xl">{app.emoji}</span>}
                {isOpen && <div className={`absolute bottom-0.5 h-1 rounded-full bg-blue-400 transition-all ${isActive ? "w-4" : "w-1"}`} />}
              </button>
            );
          })}
        </div>

        {/* Right: system tray + clock */}
        <div className="flex items-center gap-2 w-28 justify-end flex-shrink-0">
          <div className={`hidden sm:flex gap-1.5 items-center text-xs ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            <span>📶</span><span>🔊</span><span>🔋</span>
          </div>
          <Clock darkMode={darkMode} />
        </div>
      </div>

      {/* Start Menu */}
      {(startOpen || startClosing) && (
        <div
          className={`absolute bottom-12 left-1/2 z-[9998] rounded-2xl shadow-2xl flex flex-col ${startClosing ? "start-close" : "start-open"}`}
          style={{
            width: 580, maxWidth: "95vw", maxHeight: "70vh",
            background: darkMode ? "rgba(28,28,38,0.97)" : "rgba(243,243,252,0.97)",
            backdropFilter: "blur(48px)",
            border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
          onClick={e => e.stopPropagation()}>

          {/* Search */}
          <div className="px-7 pt-6 pb-4 flex-shrink-0">
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full border ${darkMode ? "bg-white/8 border-white/15" : "bg-white border-gray-200 shadow-sm"}`}>
              <span className={`text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>🔍</span>
              <input autoFocus value={startSearch}
                onChange={e => { setStartSearch(e.target.value); setStartView("pinned"); }}
                placeholder="Search for apps..."
                className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? "text-white placeholder-white/30" : "text-gray-700 placeholder-gray-400"}`} />
              {startSearch.length > 0 && (
                <button onClick={() => setStartSearch("")} className={`text-xs px-1 ${darkMode ? "text-white/30 hover:text-white/60" : "text-gray-300 hover:text-gray-500"}`}>✕</button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto min-h-0">

            {/* Search results */}
            {startSearch.trim().length > 0 && (
              <div className="px-7 pb-4">
                <div className={`text-[10px] uppercase tracking-widest mb-3 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                  {ALL_APP_DEFS.filter(a => a.title.toLowerCase().includes(startSearch.trim().toLowerCase())).length} results
                </div>
                {ALL_APP_DEFS.filter(a => a.title.toLowerCase().includes(startSearch.trim().toLowerCase())).length === 0
                  ? <div className={`text-center py-10 text-sm ${darkMode ? "text-white/25" : "text-gray-300"}`}>No apps match &ldquo;{startSearch}&rdquo;</div>
                  : ALL_APP_DEFS.filter(a => a.title.toLowerCase().includes(startSearch.trim().toLowerCase())).map(app => (
                    <button key={app.id} onClick={(e) => { e.stopPropagation(); openDesktopApp(app); closeStart(); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-blue-500/15 active:scale-[0.98]">
                      {app.imgIcon === "discord" ? <img src={DISCORD_ICON} alt="" className="w-8 h-8 flex-shrink-0" />
                        : app.imgIcon === "github" ? <img src={GITHUB_ICON} alt="" className="w-8 h-8 flex-shrink-0" style={{filter: darkMode ? "invert(1) brightness(1.2)" : "none"}} />
                        : <span className="text-2xl flex-shrink-0 w-8 text-center">{app.emoji}</span>}
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{app.title}</div>
                        <div className={`text-[10px] ${darkMode ? "text-white/35" : "text-gray-400"}`}>Application</div>
                      </div>
                      <span className={`ml-auto text-[10px] ${darkMode ? "text-white/25" : "text-gray-300"}`}>↵</span>
                    </button>
                  ))
                }
              </div>
            )}

            {/* All apps */}
            {startSearch.trim().length === 0 && startView === "all" && (
              <div className="px-7 pb-4">
                <div className={`text-[10px] uppercase tracking-widest mb-3 ${darkMode ? "text-white/30" : "text-gray-400"}`}>All Apps</div>
                {ALL_APP_DEFS.slice().sort((a,b) => a.title.localeCompare(b.title)).map(app => (
                  <button key={app.id} onClick={(e) => { e.stopPropagation(); openDesktopApp(app); closeStart(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-blue-500/15 active:scale-[0.98]">
                    {app.imgIcon === "discord" ? <img src={DISCORD_ICON} alt="" className="w-8 h-8 flex-shrink-0" />
                      : app.imgIcon === "github" ? <img src={GITHUB_ICON} alt="" className="w-8 h-8 flex-shrink-0" style={{filter: darkMode ? "invert(1) brightness(1.2)" : "none"}} />
                      : <span className="text-2xl flex-shrink-0 w-8 text-center">{app.emoji}</span>}
                    <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{app.title}</span>
                    <span className={`ml-auto text-[10px] ${darkMode ? "text-white/25" : "text-gray-300"}`}>↵</span>
                  </button>
                ))}
              </div>
            )}

            {/* Pinned */}
            {startSearch.trim().length === 0 && startView === "pinned" && (
              <>
                <div className="px-7 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Pinned</span>
                    <button onClick={() => setStartView("all")}
                      className={`text-xs px-3 py-1 rounded-lg flex items-center gap-1 transition-colors ${darkMode ? "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white" : "bg-black/5 text-gray-500 hover:bg-black/10"}`}>
                      All apps <span className="text-[10px]">›</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {ALL_APP_DEFS.map(app => (
                      <button key={app.id} onClick={(e) => { e.stopPropagation(); openDesktopApp(app); closeStart(); }}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:bg-blue-500/15 active:scale-95">
                        {app.imgIcon === "discord" ? <img src={DISCORD_ICON} alt="" className="w-7 h-7" />
                          : app.imgIcon === "github" ? <img src={GITHUB_ICON} alt="" className="w-7 h-7" style={{filter: darkMode ? "invert(1) brightness(1.2)" : "none"}} />
                          : <span className="text-2xl">{app.emoji}</span>}
                        <span className={`text-[10px] text-center leading-tight w-full truncate ${darkMode ? "text-white/80" : "text-gray-700"}`}>{app.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`px-7 py-4 border-t ${darkMode ? "border-white/8" : "border-black/5"}`}>
                  <div className={`text-sm font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>Recommended</div>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { icon: "📄", name: "os-portfolio.jsx",    sub: "3h ago" },
                      { icon: "📁", name: "Outcraft Config",      sub: "Recently modified" },
                      { icon: "🧟", name: "Zombpocalypse Plugin", sub: "Yesterday" },
                      { icon: "🔫", name: "DeadLands SMP",        sub: "In development" },
                    ].map(r => (
                      <button key={r.name} className="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:bg-blue-500/10">
                        <span className="text-xl flex-shrink-0">{r.icon}</span>
                        <div className="min-w-0">
                          <div className={`text-xs font-medium truncate ${darkMode ? "text-white" : "text-gray-800"}`}>{r.name}</div>
                          <div className={`text-[10px] ${darkMode ? "text-white/40" : "text-gray-400"}`}>{r.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className={`px-7 py-3 flex items-center justify-between border-t flex-shrink-0 ${darkMode ? "border-white/8 bg-white/4" : "border-black/5 bg-black/3"}`}>
            <div className="flex items-center gap-3">
              {startView === "all" && startSearch.trim().length === 0 && (
                <button onClick={() => setStartView("pinned")}
                  className={`text-xs px-3 py-1 rounded-lg flex items-center gap-1 mr-1 transition-colors ${darkMode ? "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white" : "bg-black/5 text-gray-500 hover:bg-black/10"}`}>
                  ‹ Back
                </button>
              )}
              <img src={PFP_URI} alt="" className="w-8 h-8 rounded-full flex-shrink-0" style={{background:"#7c3aed"}} />
              <span className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>Tahmid Bin Nur</span>
            </div>
            <button onClick={() => { setWindows([]); closeStart(); }}
              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${darkMode ? "text-white/40 hover:bg-white/8 hover:text-red-400" : "text-gray-400 hover:bg-black/5 hover:text-red-500"}`}>
              <span>⏻</span> Shut down
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OSPortfolio;