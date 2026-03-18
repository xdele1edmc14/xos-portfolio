import { useState } from "react";
import { DISCORD_ICON, PFP_URI } from "../assets.js";

const DiscordApp = ({ darkMode }) => {
  const bg       = darkMode ? "#313338" : "#f2f3f5";
  const bgHeader = darkMode ? "#2b2d31" : "#e3e5e8";
  const border   = darkMode ? "border-white/10" : "border-black/10";
  const titleCol = darkMode ? "#ffffff" : "#060607";
  const mutedCol = darkMode ? "#b5bac1" : "#4e5058";

  return (
    <div className="h-full flex flex-col" style={{background: bg}}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${border} flex-shrink-0`} style={{background: bgHeader}}>
        <img src={DISCORD_ICON} alt="Discord" className="w-8 h-8 rounded-xl" />
        <div>
          <div className="font-bold text-sm" style={{color: titleCol}}>My Discord</div>
          <div className="text-xs" style={{color: mutedCol}}>Connect with me on Discord</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start gap-5 p-6 overflow-auto">
        {/* Profile */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#5865f2] flex-shrink-0">
            <img src={PFP_URI} alt="xDele1ed" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-lg font-bold" style={{color: titleCol}}>xDele1ed</div>
            <div className="text-xs" style={{color: mutedCol}}>Minecraft Server Developer · Outcraft WarSMP</div>
          </div>
          <a href="https://discord.com/users/xdele1ed" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{background: "#5865f2"}}>
            Message Me ↗
          </a>
        </div>

        {/* Server widget */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-widest" style={{color: mutedCol}}>My Server</div>
          <div className="rounded-2xl overflow-hidden" style={{border: "1px solid rgba(255,255,255,0.08)"}}>
            <iframe
              src="https://discord.com/widget?id=1456979044062068830&theme=dark"
              width="350"
              height="500"
              allowTransparency="true"
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              style={{display: "block"}}
            />
          </div>
          <a href="https://discord.gg/XPUh4zJagc" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{background: "#5865f2"}}>
            Join Server ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export { DiscordApp };