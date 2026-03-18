import { useState, useRef } from "react";
import { SKILLS } from "../data.js";

const SkillsContent = ({ darkMode, acc }) => {
  const card = darkMode ? "bg-white/5 border-white/10"  : "bg-white/60 border-black/10 shadow-sm";
  const text = darkMode ? "text-white"                   : "text-gray-900";
  const chip = darkMode
    ? `bg-white/10 border-white/10 text-white/80 ${acc?.hoverChip || "hover:bg-violet-500/30"}`
    : `${acc?.chipBg || "bg-gray-100"} ${acc?.chipBorder || "border-gray-200"} ${acc?.chipText || "text-gray-700"} ${acc?.hoverChip || "hover:bg-violet-100"}`;
  const catLabel = acc ? acc.text : "text-violet-400";
  return (
    <div className="p-5 overflow-auto h-full">
      <h2 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${text}`}>
        <span className={catLabel}>⚡</span> Tech Stack & Skills
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {SKILLS.map(({ cat, items }) => (
          <div key={cat} className={`rounded-xl p-4 border ${card}`}>
            <div className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${catLabel}`}>{cat}</div>
            <div className="flex flex-wrap gap-2">
              {items.map(item => (
                <span key={item} className={`transition-colors text-xs px-3 py-1 rounded-full border cursor-default ${chip}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { SkillsContent };
