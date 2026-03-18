import { useState, useRef } from "react";

const ContactContent = ({ darkMode, acc }) => {
  const card  = darkMode ? "bg-white/5 border-white/10"  : "bg-white/60 border-black/10 shadow-sm";
  const text  = darkMode ? "text-white"                  : "text-gray-900";
  const muted = darkMode ? "text-white/50"               : "text-gray-400";
  const hoverBorder = acc
    ? darkMode ? acc.border : acc.border
    : darkMode ? "hover:border-violet-500/50" : "hover:border-violet-400";

  const links = [
    { icon: "💬", label: "Discord",   val: "xdele1ed",                          href: "https://discord.com/users/1181664068680040489" },
    { icon: "🐙", label: "GitHub",    val: "github.com/xdele1edmc14",           href: "https://github.com/xdele1edmc14" },
    { icon: "📷", label: "Instagram", val: "@xdele_1ed",                        href: "https://www.instagram.com/xdele_1ed" },
  ];

  return (
    <div className="p-5 overflow-auto h-full">
      <h2 className={`font-semibold text-sm mb-1 ${text}`}>Get in Touch</h2>
      <p className={`text-xs mb-5 ${muted}`}>Open to collaborations, commissions & plugin work.</p>
      <div className="space-y-3">
        {links.map(c => (
          <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${card} ${hoverBorder} hover:scale-[1.01] active:scale-[0.99]`}>
            <span className="text-xl">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-[10px] ${muted}`}>{c.label}</div>
              <div className={`text-xs font-medium truncate ${text}`}>{c.val}</div>
            </div>
            <span className={`text-[10px] flex-shrink-0 ${muted}`}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export { ContactContent };