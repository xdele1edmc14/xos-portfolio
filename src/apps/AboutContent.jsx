import { useState, useRef } from "react";
import { PFP_URI } from "../assets.js";

const AboutContent = ({ darkMode, acc }) => {
  const bg   = darkMode ? "bg-[#12121a]"              : "bg-transparent";
  const card = darkMode ? "bg-white/5 border-white/10" : "bg-white/60 border-black/10 shadow-sm";
  const text = darkMode ? "text-white"                 : "text-gray-900";
  const muted= darkMode ? "text-white/50"              : "text-gray-500";
  const tag  = acc ? `${acc.chipBg} ${acc.chipBorder} ${acc.chipText}` : "bg-violet-500/20 border-violet-500/30 text-violet-300";
  const highlight = acc ? acc.text : "text-violet-400";

  return (
    <div className={`h-full overflow-auto p-5 space-y-4 ${bg}`}>
      {/* Profile header */}
      <div className={`rounded-2xl border p-4 flex items-center gap-4 ${card}`}>
        <img src={PFP_URI} alt="xDele1ed" className="w-14 h-14 rounded-full flex-shrink-0 shadow-lg object-cover border-2 border-white/10" />
        <div>
          <div className={`font-bold text-base ${text}`}>xDele1ed</div>
          <div className={`text-sm ${muted}`}>Minecraft Server Developer</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
            <span className={`text-xs ${muted}`}>Open to commissions & collabs</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={`rounded-2xl border p-4 ${card}`}>
        <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${muted}`}>About</div>
        <p className={`text-sm leading-relaxed ${text}`}>
          I'm a Minecraft server developer with <span className={`font-medium ${highlight}`}>3+ years of experience</span> building custom plugins, economy systems, and full server ecosystems from scratch. Currently developing at Outcraft WarSMP and leading DeadLands SMP — a post-apocalyptic survival experience with a custom gun system, hardcore zombie AI, and a full player-driven economy. I care about the details: configs that are clean, systems that scale, and servers that feel alive.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[["3+", "Years Exp."], ["12k+", "Server Members"], ["4+", "Projects Built"]].map(([val, lbl]) => (
          <div key={lbl} className={`rounded-xl border p-3 text-center ${card}`}>
            <div className={`text-lg font-bold ${acc ? acc.text : "text-violet-400"}`}>{val}</div>
            <div className={`text-[10px] ${muted} leading-tight mt-0.5`}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Specialities */}
      <div className={`rounded-2xl border p-4 ${card}`}>
        <div className={`text-xs font-semibold uppercase tracking-widest mb-3 ${muted}`}>Specialities</div>
        <div className="flex flex-wrap gap-2">
          {["Custom Plugins", "Plugin Architecture", "Economy Design", "Server Ecosystems", "Discord Bots"].map(s => (
            <span key={s} className={`text-xs px-3 py-1 rounded-full border ${tag}`}>{s}</span>
          ))}
        </div>
      </div>

      {/* Currently working on */}
      <div className={`rounded-2xl border p-4 ${card}`}>
        <div className={`text-xs font-semibold uppercase tracking-widest mb-3 ${muted}`}>Currently Working On</div>
        <div className="space-y-2">
          {[
            { icon: "⚔️", name: "Outcraft WarSMP", role: "Developer · 12k+ members" },
            { icon: "🔫", name: "DeadLands SMP", role: "Lead Dev · In Progress" },
          ].map(w => (
            <div key={w.name} className={`flex items-center gap-3 rounded-xl p-2.5 ${acc ? acc.chipBg : darkMode ? "bg-white/5" : "bg-black/5"}`}>
              <span className="text-xl">{w.icon}</span>
              <div>
                <div className={`text-xs font-semibold ${text}`}>{w.name}</div>
                <div className={`text-[11px] ${muted}`}>{w.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className={`rounded-2xl border p-4 ${card}`}>
        <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${muted}`}>Philosophy</div>
        <p className={`text-sm italic ${darkMode ? "text-white/70" : "text-gray-600"}`}>
          "Every config is a design artifact. Every server is a world worth building."
        </p>
      </div>
    </div>
  );
};

export { AboutContent };