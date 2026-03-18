import { useState, useRef } from "react";
import { WALLPAPERS } from "../data.js";

const SettingsContent = ({ darkMode, setDarkMode, wallpaper, setWallpaper, acc }) => {
  const card   = darkMode ? "bg-white/5 border-white/10"  : "bg-white/70 border-black/10 shadow-sm";
  const text   = darkMode ? "text-white"                  : "text-gray-900";
  const muted  = darkMode ? "text-white/50"               : "text-gray-500";
  const row    = darkMode ? "text-white/40"               : "text-gray-400";
  const val    = darkMode ? "text-white/70"               : "text-gray-700";
  const toggleOn  = acc ? acc.toggle : "bg-violet-600";
  const toggleOff = darkMode ? "bg-white/20" : "bg-gray-300";

  // Only show themes that match the current mode
  const visibleThemes = WALLPAPERS.filter(w => w.dark === darkMode);
  const activeTheme   = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0];

  return (
    <div className="p-5 overflow-auto h-full space-y-4">

      {/* Dark Mode toggle */}
      <div className={`rounded-xl p-4 border ${card}`}>
        <div className={`text-[10px] uppercase tracking-widest mb-3 ${muted}`}>Mode</div>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs font-medium ${text}`}>{darkMode ? "Dark Mode" : "Light Mode"}</div>
            <div className={`text-[10px] ${muted}`}>Switch to {darkMode ? "light" : "dark"} mode</div>
          </div>
          <button
            onClick={() => {
              const newDark = !darkMode;
              setDarkMode(newDark);
              // Auto-switch to the first theme of the new mode
              const firstMatch = WALLPAPERS.find(w => w.dark === newDark);
              if (firstMatch) setWallpaper(firstMatch.id);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${darkMode ? toggleOn : toggleOff}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${darkMode ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Active theme preview */}
      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <div className={`text-[10px] uppercase tracking-widest px-4 pt-4 pb-2 ${muted}`}>Active Theme</div>
        {/* Mini desktop mockup */}
        <div className={`mx-4 mb-3 rounded-lg overflow-hidden border ${darkMode ? "border-white/10" : "border-black/10"}`} style={{height: 90}}>
          <div className={`w-full h-full bg-gradient-to-br ${activeTheme.desktopBg} relative flex flex-col`}>
            {/* Mini desktop area */}
            <div className="flex-1 p-2 flex gap-1.5 items-start">
              {/* Fake desktop icons */}
              {[0,1,2].map(i => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className={`w-4 h-4 rounded-sm ${darkMode ? "bg-white/20" : "bg-white/60"}`} />
                  <div className={`w-5 h-0.5 rounded-full ${darkMode ? "bg-white/20" : "bg-black/15"}`} />
                </div>
              ))}
              {/* Fake window */}
              <div className={`ml-2 rounded flex-1 max-w-[60%] ${darkMode ? "bg-black/40" : "bg-white/60"} border ${darkMode ? "border-white/10" : "border-black/10"} overflow-hidden`} style={{height:55}}>
                <div className={`flex items-center gap-1 px-1.5 py-1 border-b ${darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <div className={`ml-1 h-1 w-10 rounded-full ${darkMode ? "bg-white/10" : "bg-black/10"}`} />
                </div>
                <div className="p-1.5 space-y-1">
                  {[0.7,0.5,0.4].map((o,i) => (
                    <div key={i} className={`h-1 rounded-full ${darkMode ? "bg-white/20" : "bg-black/10"}`} style={{width:`${60+i*15}%`, opacity: o}} />
                  ))}
                </div>
              </div>
            </div>
            {/* Mini taskbar */}
            <div className={`h-4 px-2 flex items-center gap-1 ${darkMode ? "bg-black/40" : "bg-white/50"} border-t ${darkMode ? "border-white/10" : "border-black/10"}`}>
              <div className={`w-5 h-2 rounded-sm ${darkMode ? "bg-white/20" : "bg-black/10"}`} />
              <div className={`w-8 h-2 rounded-sm ${acc ? acc.chipBg : "bg-violet-500/20"}`} />
              <div className="flex-1" />
              <div className={`w-6 h-1.5 rounded-full ${darkMode ? "bg-white/15" : "bg-black/10"}`} />
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 flex items-center justify-between">
          <div>
            <div className={`text-xs font-medium ${text}`}>{activeTheme.label}</div>
            <div className={`text-[10px] ${muted}`}>{darkMode ? "Dark theme" : "Light theme"}</div>
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded-full border ${acc ? `${acc.chipBg} ${acc.chipBorder} ${acc.chipText}` : "bg-violet-500/20 border-violet-500/30 text-violet-300"}`}>Active</div>
        </div>
      </div>

      {/* Theme picker — only shows themes matching current mode */}
      <div className={`rounded-xl p-4 border ${card}`}>
        <div className={`text-[10px] uppercase tracking-widest mb-3 ${muted}`}>{darkMode ? "Dark Themes" : "Light Themes"}</div>
        <div className="grid grid-cols-2 gap-2">
          {visibleThemes.map(w => {
            const isActive = wallpaper === w.id;
            return (
              <button key={w.id} onClick={() => setWallpaper(w.id)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${isActive ? (darkMode ? "border-white/60 scale-[0.97]" : "border-gray-500 scale-[0.97]") : (darkMode ? "border-transparent hover:border-white/20" : "border-transparent hover:border-gray-300")}`}>
                {/* Mini gradient swatch */}
                <div className={`h-12 w-full bg-gradient-to-br ${w.desktopBg} relative`}>
                  {/* Tiny accent dot */}
                  <div className={`absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full ${w.accent.bg}`} />
                  {/* Fake mini icons */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    {[0,1].map(i => <div key={i} className={`w-2 h-2 rounded-sm ${w.dark ? "bg-white/25" : "bg-white/70"}`} />)}
                  </div>
                </div>
                {/* Label row */}
                <div className={`px-2 py-1.5 flex items-center justify-between ${darkMode ? "bg-black/20" : "bg-white/50"}`}>
                  <span className={`text-[10px] font-medium ${darkMode ? "text-white/80" : "text-gray-700"}`}>{w.label}</span>
                  {isActive && <span className={`text-[8px] ${acc ? acc.text : "text-violet-400"}`}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Info */}
      <div className={`rounded-xl p-4 border ${card}`}>
        <div className={`text-[10px] uppercase tracking-widest mb-3 ${muted}`}>System Info</div>
        <div className="space-y-2">
          {[["OS", "xOS v1.0"], ["Developer", "xDele1ed"], ["Build", "2025.03.17"], ["Engine", "React 18"]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className={row}>{k}</span>
              <span className={val}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── APP DEFINITIONS ─────────────────────────────────────────────────────────

export { SettingsContent };
