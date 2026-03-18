import { useState, useRef } from "react";
import { GITHUB_ICON, PFP_URI } from "../assets.js";

const GithubApp = ({ darkMode }) => {
  const repos = [
    {
      name: "Zombpocalypse",
      desc: "Minecraft zombie apocalypse plugin — 12+ zombie types, blood moon events, boss encounters.",
      lang: "Java", stars: null, updated: "Active",
      url: "https://github.com/xdele1edmc14/Zombpocalypse/tree/main",
      live: true,
    },
    {
      name: "xEconomy",
      desc: "Discord economy bot with stocks system, minigames, daily streaks, and MongoDB persistence.",
      lang: "JS", stars: null, updated: "Coming Soon",
      url: null, live: false,
    },
    {
      name: "outcraft-configs",
      desc: "Complete server configuration suite for Outcraft WarSMP — crate tiers, economy, warcoin systems.",
      lang: "YAML", stars: null, updated: "Active",
      url: "https://discord.gg/outcraft", live: true,
    },
    {
      name: "deadlands-smp",
      desc: "Post-apocalyptic Minecraft SMP with custom gun system, hardcore zombie AI, and full economy.",
      lang: "Java", stars: null, updated: "Coming Soon",
      url: null, live: false,
    },
  ];

  const bg   = darkMode ? "#0d1117" : "#f6f8fa";
  const card = darkMode ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-200";
  const text = darkMode ? "text-white" : "text-gray-900";
  const mutedStyle = darkMode ? {color:"#b0bec5"} : {color:"#6b7280"};

  return (
    <div className="h-full flex flex-col overflow-auto" style={{background:bg}}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b flex-shrink-0"
        style={{background: darkMode?"#161b22":"#f6f8fa", borderColor: darkMode?"#30363d":"#d0d7de"}}>
        <img src={GITHUB_ICON} alt="GitHub" className="w-6 h-6" style={{filter: darkMode ? "invert(1) brightness(1.2)" : "none"}} />
        <span className={`text-sm font-semibold ${text}`}>My GitHub</span>
        <a href="https://github.com/xdele1edmc14" target="_blank" rel="noopener noreferrer"
          className="ml-auto text-xs px-3 py-1 rounded-lg border font-medium hover:opacity-80 transition-opacity"
          style={{background: darkMode?"#21262d":"#f6f8fa", borderColor: darkMode?"#30363d":"#d0d7de", color: darkMode?"#e6edf3":"#24292f"}}>
          View Profile ↗
        </a>
      </div>

      <div className="p-5">
        {/* Profile */}
        <div className="flex items-center gap-3 mb-5">
          <img src={PFP_URI} alt="xDele1ed" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className={`font-bold ${text}`}>xdele1edmc14</div>
            <div className="text-xs" style={mutedStyle}>Minecraft Server Developer</div>
          </div>
        </div>

        {/* Repos */}
        <div className="space-y-3">
          {repos.map(r => (
            <div key={r.name} className={`rounded-xl border p-4 ${card}`}>
              <div className="flex items-center gap-2 mb-1">
                {r.live ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-400 text-xs font-semibold hover:underline">
                    {r.name} ↗
                  </a>
                ) : (
                  <span className="text-xs font-semibold" style={mutedStyle}>{r.name}</span>
                )}
                <span className={`text-[10px] border rounded-full px-1.5 ${darkMode ? "border-[#30363d] text-[#8b949e]" : "border-gray-300 text-gray-500"}`}>
                  {r.live ? "Public" : "Private"}
                </span>
              </div>
              <p className="text-xs mb-3" style={mutedStyle}>{r.desc}</p>
              <div className="flex gap-4 text-[10px] items-center">
                <span className="flex items-center gap-1" style={mutedStyle}>
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"/>{r.lang}
                </span>
                {r.live ? (
                  <span className="flex items-center gap-1 text-green-400">● Active</span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                    style={{background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", color: darkMode ? "rgba(255,255,255,0.35)" : "#888"}}>
                    🔒 Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { GithubApp };