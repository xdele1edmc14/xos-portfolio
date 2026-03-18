import { useState, useRef } from "react";
import { PFP_URI } from "../assets.js";

const InstagramApp = ({ darkMode }) => {
  const bg       = darkMode ? "#000000" : "#fafafa";
  const bgCard   = darkMode ? "#1c1c1c" : "#ffffff";
  const border   = darkMode ? "border-white/10" : "border-gray-200";
  const titleCol = darkMode ? "#ffffff" : "#000000";
  const mutedCol = darkMode ? "#c7c7c7" : "#737373";
  const btnBorder= darkMode ? "border-white/20" : "border-gray-300";
  const posts = [
    {emoji:"⚔️", caption:"Outcraft WarSMP update just dropped 🔥 #minecraft #server", likes:247, time:"2h"},
    {emoji:"🧟", caption:"Zombpocalypse v2 — bloodmoon mechanics showcase #plugin #dev", likes:189, time:"1d"},
    {emoji:"🔫", caption:"DeadLands SMP coming soon... stay tuned 👀 #comingsoon", likes:412, time:"3d"},
    {emoji:"🎮", caption:"Config looking exceptionally beautiful rn #yaml #minecraft", likes:156, time:"1w"},
  ];
  return (
    <div className="h-full flex flex-col overflow-hidden" style={{background:bg, color:titleCol}}>
      <div className={`flex items-center justify-between px-4 py-3 border-b ${border} flex-shrink-0`}>
        <span className="font-bold text-lg" style={{fontFamily:"serif",letterSpacing:"-0.5px"}}>My Instagram</span>
        <div className="flex gap-4 text-lg">
          <span>＋</span><span>☰</span>
        </div>
      </div>
      <div className="px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 flex-shrink-0">
            <img src={PFP_URI} alt="xdele1ed" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="flex gap-5 text-center">
            {[["4","Posts"],["12k+","Followers"],["38","Following"]].map(([n,l]) => (
              <div key={l}>
                <div className="font-bold text-sm" style={{color:titleCol}}>{n}</div>
                <div className="text-xs" style={{color:mutedCol}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm font-semibold" style={{color:titleCol}}>xdele1ed</div>
        <div className="text-xs" style={{color:mutedCol}}>Minecraft Server Developer 🎮</div>
        <div className="text-xs" style={{color:mutedCol}}>Building Outcraft WarSMP • DeadLands SMP</div>
        <a href="https://instagram.com/xdele_1ed" target="_blank" rel="noopener noreferrer"
          className={`mt-3 w-full py-1.5 rounded-lg border ${btnBorder} text-xs font-semibold text-center block hover:opacity-70 transition-opacity`}
          style={{color:titleCol}}>
          Follow
        </a>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-px">
          {posts.map((p,i) => (
            <div key={i} className="aspect-square flex items-center justify-center text-4xl cursor-pointer hover:opacity-80 transition-opacity"
              style={{background: darkMode ? "linear-gradient(135deg,#1a0530,#000)" : "linear-gradient(135deg,#f0e6fa,#fce4ec)"}}>
              {p.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { InstagramApp };
