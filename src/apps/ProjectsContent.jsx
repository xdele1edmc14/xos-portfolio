import { useState } from "react";
import { PROJECTS } from "../data.js";

const ProjectsContent = ({ mobile, darkMode, acc }) => {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("grid");
  const card       = darkMode ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-black/10 bg-white/60 hover:bg-white/80 shadow-sm";
  const text       = darkMode ? "text-white"    : "text-gray-900";
  const muted      = darkMode ? "text-white/40" : "text-gray-400";
  const activeBtn  = acc ? `${acc.bg} text-white` : "bg-violet-600 text-white";
  const tagCls     = acc ? `${acc.chipBg} ${acc.chipBorder} ${acc.chipText}` : "bg-violet-500/20 border-violet-500/30 text-violet-300";
  const accentText = acc ? acc.text : "text-violet-400";

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className={`flex items-center gap-2 px-4 py-2 border-b flex-shrink-0 ${darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setView("grid")} className={`px-2 py-1 rounded text-xs ${view === "grid" ? activeBtn : `${muted} hover:text-white/70`}`}>⊞ Grid</button>
          <button onClick={() => setView("list")} className={`px-2 py-1 rounded text-xs ${view === "list" ? activeBtn : `${muted} hover:text-white/70`}`}>☰ List</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Project list */}
        <div className={`${selected && !mobile ? "w-1/2" : "w-full"} overflow-auto p-4`}>
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {PROJECTS.map(p => (
                <button key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)}
                  className={`text-left p-3 rounded-xl border transition-all ${selected?.id === p.id ? `${acc?.chipBg || "bg-violet-500/20"} ${acc?.border || "border-violet-500"}` : `border ${card}`}`}>
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className={`text-xs font-semibold leading-tight ${text}`}>{p.name}</div>
                  <div className={`text-[10px] mt-1 ${muted}`}>{p.type}</div>
                  {!p.url && (
                    <div className={`text-[9px] mt-1.5 px-1.5 py-0.5 rounded-full inline-block ${darkMode ? "bg-white/8 text-white/30" : "bg-black/5 text-gray-400"}`}>🔒 Coming Soon</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {PROJECTS.map(p => (
                <button key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${selected?.id === p.id ? `${acc?.chipBg || "bg-violet-500/30"} border ${acc?.border || "border-violet-500/50"}` : darkMode ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                  <span className="text-xl">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${text}`}>{p.name}</div>
                    <div className={`text-[10px] ${muted}`}>{p.type}</div>
                  </div>
                  {p.url
                    ? <div className="text-[10px] text-green-400 flex-shrink-0">● Live</div>
                    : <div className={`text-[9px] flex-shrink-0 ${darkMode ? "text-white/25" : "text-gray-300"}`}>🔒 Soon</div>
                  }
                  <div className={`text-[10px] ${muted}`}>{p.date}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className={`${mobile ? "absolute inset-0 backdrop-blur-xl z-10 p-4" : "w-1/2 border-l"} p-4 overflow-auto ${darkMode ? "bg-black/100 border-white/10" : "bg-white/90 border-black/10"}`}>
            {mobile && <button onClick={() => setSelected(null)} className={`text-sm mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>← Back</button>}
            <div className="text-4xl mb-3">{selected.icon}</div>
            <h3 className={`font-semibold text-sm mb-1 ${text}`}>{selected.name}</h3>
            <div className={`text-xs mb-3 ${accentText}`}>{selected.type}</div>
            <p className={`text-xs leading-relaxed mb-4 ${muted}`}>{selected.desc}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {selected.tags.map(t => <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${tagCls}`}>{t}</span>)}
            </div>
            {selected.url ? (
              <a href={selected.url} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium mb-4 transition-opacity hover:opacity-80 ${acc ? `${acc.bg} text-white` : "bg-violet-600 text-white"}`}>
                View on GitHub ↗
              </a>
            ) : (
              <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg mb-4 ${darkMode ? "bg-white/8 text-white/30" : "bg-black/5 text-gray-400"}`}>
                🔒 Repo coming soon
              </div>
            )}
            <div className={`space-y-1 text-xs ${muted}`}>
              <div className="flex justify-between"><span>Size</span><span>{selected.size}</span></div>
              <div className="flex justify-between"><span>Modified</span><span>{selected.date}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProjectsContent };