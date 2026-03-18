import { useState, useRef } from "react";

const ExplorerApp = ({ darkMode, openApp }) => {
  const [selected, setSelected] = useState(null);
  const folders = [
    { name: "Projects", icon: "📁", items: ["Zombpocalypse Plugin","xEconomy Bot","Outcraft Config","DeadLands SMP"] },
    { name: "Skills", icon: "⚡", items: ["Java","Node.js","YAML","Spigot"] },
    { name: "Contact", icon: "📬", items: ["discord.gg/placeholder","github.com/xDele1ed","xdele1ed@gmail.com"] },
  ];
  const bg = darkMode ? "bg-[#1c1c1c]" : "bg-[#fafafa]";
  const sidebar = darkMode ? "bg-[#252525] border-white/10" : "bg-[#f3f3f3] border-gray-200";
  const item = darkMode ? "hover:bg-white/5 text-white/80" : "hover:bg-black/5 text-gray-700";
  const sel = darkMode ? "bg-blue-600/30 text-white" : "bg-blue-100 text-blue-800";
  return (
    <div className={`h-full flex ${bg}`}>
      <div className={`w-48 border-r flex flex-col p-3 gap-1 flex-shrink-0 ${sidebar}`}>
        <div className={`text-[10px] uppercase tracking-widest mb-2 ${darkMode?"text-white/30":"text-gray-400"}`}>Quick Access</div>
        {folders.map(f => (
          <button key={f.name} onClick={() => setSelected(f)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all text-left ${selected?.name===f.name ? sel : item}`}>
            <span>{f.icon}</span>{f.name}
          </button>
        ))}
        <div className={`mt-4 text-[10px] uppercase tracking-widest mb-2 ${darkMode?"text-white/30":"text-gray-400"}`}>Apps</div>
        <button onClick={() => openApp && openApp({id:"about",title:"About Me",w:680,h:520})}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all text-left ${item}`}>
          <span>👤</span> About Me
        </button>
      </div>
      <div className="flex-1 p-5 overflow-auto">
        {!selected ? (
          <div className={`flex items-center justify-center h-full text-sm ${darkMode?"text-white/20":"text-gray-300"}`}>
            Select a folder
          </div>
        ) : (
          <div>
            <div className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode?"text-white":"text-gray-800"}`}>
              <span>{selected.icon}</span>{selected.name}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {selected.items.map(item => (
                <div key={item} className={`p-3 rounded-xl border text-xs text-center ${darkMode?"bg-white/5 border-white/10 text-white/70":"bg-white border-gray-200 text-gray-700"}`}>
                  <div className="text-2xl mb-1">📄</div>{item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ExplorerApp };
