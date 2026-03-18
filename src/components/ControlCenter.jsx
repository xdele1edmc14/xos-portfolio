import { useState } from "react";
import { WALLPAPERS } from "../data.js";

const ControlCenter = ({ darkMode, setDarkMode, setWallpaper, onClose, acc }) => {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume]         = useState(60);
  const [wifi, setWifi]             = useState(true);
  const [bluetooth, setBluetooth]   = useState(false);
  const [airplane, setAirplane]     = useState(false);
  const [closing, setClosing]       = useState(false);

  const close = () => { setClosing(true); setTimeout(onClose, 280); };



  const bg = darkMode ? "rgba(18,18,28,0.97)" : "rgba(235,235,245,0.97)";
  const card = darkMode ? "bg-white/8 border-white/10" : "bg-black/5 border-black/8";
  const text = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-white/40" : "text-gray-400";
  const toggleOn = acc ? acc.toggle : "bg-violet-600";

  const Toggle = ({ on, onClick, icon, label }) => (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-95 ${on ? (acc ? `${acc.chipBg} ${acc.chipBorder}` : "bg-violet-500/20 border-violet-500/30") : (darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10")}`}>
      <span className="text-xl">{icon}</span>
      <span className={`text-[10px] font-medium ${on ? (acc ? acc.chipText : "text-violet-300") : muted}`}>{label}</span>
    </button>
  );

  const Slider = ({ icon, value, onChange, label }) => (
    <div className={`rounded-2xl border p-3 ${darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{icon}</span>
        <span className={`text-[10px] flex-1 ${muted}`}>{label}</span>
        <span className={`text-[10px] font-mono ${muted}`}>{value}%</span>
      </div>
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{width: `${value}%`, background: acc ? `var(--acc, #9d5af7)` : "#9d5af7",
            backgroundImage: acc ? `linear-gradient(90deg, #7b3fe4, #9d5af7)` : undefined}} />
      </div>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
        className="absolute inset-0 opacity-0 w-full cursor-pointer" style={{position:"relative", marginTop: -6, height: 24}} />
    </div>
  );

  return (
    <div className="absolute inset-0 z-[60]" onClick={close}>
      <div className="absolute inset-0" style={{background: "rgba(0,0,0,0.4)", backdropFilter:"blur(8px)"}} />
      <div className="absolute inset-x-3 top-0 rounded-b-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{
          background: bg, backdropFilter: "blur(40px)",
          animation: closing ? "ccSlideUp 0.28s cubic-bezier(0.4,0,1,1) forwards" : "ccSlideDown 0.32s cubic-bezier(0.22,1,0.36,1) forwards",
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-10 pb-3">
          <div className={`text-sm font-semibold ${text}`}>Control Center</div>
          <button onClick={close} className={`text-xs px-3 py-1 rounded-full border ${darkMode ? "border-white/15 text-white/50" : "border-black/10 text-gray-500"}`}>Done</button>
        </div>

        <div className="px-4 pb-6 space-y-3">
          {/* Toggle grid */}
          <div className="grid grid-cols-4 gap-2">
            <Toggle on={wifi}      onClick={() => setWifi(!wifi)}           icon="📶" label="Wi-Fi" />
            <Toggle on={bluetooth} onClick={() => setBluetooth(!bluetooth)} icon="🔷" label="BT" />
            <Toggle on={airplane}  onClick={() => setAirplane(!airplane)}   icon="✈️" label="Airplane" />
            <Toggle on={darkMode}  onClick={() => {
              const newDark = !darkMode;
              setDarkMode(newDark);
              const firstMatch = WALLPAPERS.find(w => w.dark === newDark);
              if (firstMatch) setWallpaper(firstMatch.id);
            }} icon={darkMode ? "🌙" : "☀️"} label={darkMode ? "Dark" : "Light"} />          </div>

          {/* Brightness slider */}
          <div className={`rounded-2xl border p-3 ${darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">☀️</span>
              <span className={`text-[10px] flex-1 ${muted}`}>Brightness</span>
              <span className={`text-[10px] font-mono ${muted}`}>{brightness}%</span>
            </div>
            <div className="relative">
              <div className="h-2 rounded-full overflow-hidden" style={{background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}}>
                <div className="h-full rounded-full" style={{width:`${brightness}%`, background:"linear-gradient(90deg,#7b3fe4,#9d5af7)"}} />
              </div>
              <input type="range" min={0} max={100} value={brightness} onChange={e => setBrightness(Number(e.target.value))}
                className="absolute inset-0 opacity-0 w-full cursor-pointer" />
            </div>
          </div>

          {/* Volume slider */}
          <div className={`rounded-2xl border p-3 ${darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🔊</span>
              <span className={`text-[10px] flex-1 ${muted}`}>Volume</span>
              <span className={`text-[10px] font-mono ${muted}`}>{volume}%</span>
            </div>
            <div className="relative">
              <div className="h-2 rounded-full overflow-hidden" style={{background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}}>
                <div className="h-full rounded-full" style={{width:`${volume}%`, background:"linear-gradient(90deg,#7b3fe4,#9d5af7)"}} />
              </div>
              <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))}
                className="absolute inset-0 opacity-0 w-full cursor-pointer" />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export { ControlCenter };
