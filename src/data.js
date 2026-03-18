// Static data
const PROJECTS = [
  {
    id: 1, name: "Zombpocalypse Plugin", type: "Java / Spigot", size: "4.2 MB",
    date: "2024-11-12", icon: "🧟", url: "https://github.com/xdele1edmc14/Zombpocalypse/tree/main",
    desc: "A massive zombie apocalypse Minecraft plugin featuring 12+ zombie types, dynamic blood moon events, boss encounters, and deeply configurable survival mechanics.",
    tags: ["Java", "Spigot", "Minecraft", "Plugin"],
  },
  {
    id: 2, name: "xEconomy Bot", type: "Node.js / Discord.js", size: "1.8 MB",
    date: "2024-10-03", icon: "🤖",
    desc: "Full-featured Discord economy bot with stocks system, minigames, daily streaks, leaderboards, and MongoDB persistence. 12 parody companies with live price ticking.",
    tags: ["Node.js", "Discord.js", "MongoDB", "Cron"],
  },
  {
    id: 3, name: "Outcraft WarSMP Config", type: "YAML / Config", size: "892 KB",
    date: "2025-01-15", icon: "⚔️",
    desc: "Helped with the development of Outcraft Network's flagship WarSMP server. Designed and implemented custom economy, progression, and menu systems using advanced YAML architecture and Skript/Deluxemenus.",
    tags: ["YAML", "PicoJobs", "Skript", "Deluxemenus"],
  },
  {
    id: 4, name: "DeadLands SMP", type: "In Development", size: "—",
    date: "2025-03-01", icon: "🔫",
    desc: "Upcoming post-apocalyptic Minecraft SMP. Massive open world, custom gun system with recoil and ammo types, hardcore zombie AI, and full economy infrastructure.",
    tags: ["Java", "Spigot", "Custom Plugin", "WIP"],
  },
];

const SKILLS = [
  { cat: "Languages", items: ["Java", "Batch", "YAML", "Python"] },
  { cat: "Minecraft", items: ["Spigot API", "Paper", "MythicMobs", "ExcellentCrates", "ProtocolLib"] },
  { cat: "Backend", items: ["Node.js", "Discord.js", "MongoDB", "node-cron"] },
  { cat: "Config & Ops", items: ["YAML Architecture", "Economy Design", "Server Admin", "Git"] },
];

const WALLPAPERS = [
  // ── Dark ──────────────────────────────────────────────────────────────────
  { id: "void",   label: "Void",        dark: true,  desktopBg: "from-[#05020f] via-[#1a0a3e] to-[#0b0618]", mobileBg: "#0f1117", mobileAccent: "rgba(99,60,200,0.22)",  accent: { bg: "bg-violet-600",  text: "text-violet-400",  border: "border-violet-500/40",  chipBg: "bg-violet-500/20",  chipBorder: "border-violet-500/30",  chipText: "text-violet-300",  hoverChip: "hover:bg-violet-500/30",  toggle: "bg-violet-600"  } },
  { id: "abyss",  label: "Abyss",       dark: true,  desktopBg: "from-[#020b18] via-[#0a2a4a] to-[#051020]", mobileBg: "#0a0f18", mobileAccent: "rgba(30,100,180,0.25)", accent: { bg: "bg-cyan-600",    text: "text-cyan-400",    border: "border-cyan-500/40",    chipBg: "bg-cyan-500/20",    chipBorder: "border-cyan-500/30",    chipText: "text-cyan-300",    hoverChip: "hover:bg-cyan-500/30",    toggle: "bg-cyan-600"    } },
  { id: "canopy", label: "Canopy",      dark: true,  desktopBg: "from-[#020f05] via-[#0a2a10] to-[#051008]", mobileBg: "#0a100a", mobileAccent: "rgba(30,120,50,0.22)",  accent: { bg: "bg-emerald-600", text: "text-emerald-400", border: "border-emerald-500/40", chipBg: "bg-emerald-500/20", chipBorder: "border-emerald-500/30", chipText: "text-emerald-300", hoverChip: "hover:bg-emerald-500/30", toggle: "bg-emerald-600" } },
  { id: "ember",  label: "Ember",       dark: true,  desktopBg: "from-[#0f0502] via-[#2a0f05] to-[#180802]", mobileBg: "#120a06", mobileAccent: "rgba(180,60,20,0.22)",  accent: { bg: "bg-orange-600",  text: "text-orange-400",  border: "border-orange-500/40",  chipBg: "bg-orange-500/20",  chipBorder: "border-orange-500/30",  chipText: "text-orange-300",  hoverChip: "hover:bg-orange-500/30",  toggle: "bg-orange-600"  } },
  // ── Light ─────────────────────────────────────────────────────────────────
  { id: "moonlit",label: "Moonlit",      dark: false, desktopBg: "from-[#c8a8d8] via-[#b890cc] to-[#a070b8]", mobileBg: "#f5f0e8", mobileAccent: "rgba(180,120,60,0.15)",  accent: { bg: "bg-amber-600",   text: "text-amber-700",   border: "border-amber-400",          chipBg: "bg-amber-100",      chipBorder: "border-amber-300",      chipText: "text-amber-800",   hoverChip: "hover:bg-amber-200",      toggle: "bg-amber-500"   } },
  { id: "sky",    label: "Sky",         dark: false, desktopBg: "from-[#dff0fa] via-[#c8e4f5] to-[#b8d8f0]", mobileBg: "#dff0fa", mobileAccent: "rgba(30,120,200,0.12)",  accent: { bg: "bg-blue-500",    text: "text-blue-700",    border: "border-blue-400",           chipBg: "bg-blue-100",       chipBorder: "border-blue-300",       chipText: "text-blue-800",    hoverChip: "hover:bg-blue-200",       toggle: "bg-blue-500"    } },
  { id: "sage",   label: "Sage",        dark: false, desktopBg: "from-[#e8f2ec] via-[#d4e8da] to-[#c8e0d0]", mobileBg: "#e8f2ec", mobileAccent: "rgba(40,140,80,0.12)",   accent: { bg: "bg-green-600",   text: "text-green-700",   border: "border-green-400",          chipBg: "bg-green-100",      chipBorder: "border-green-300",      chipText: "text-green-800",   hoverChip: "hover:bg-green-200",      toggle: "bg-green-500"   } },
  { id: "blush",  label: "Blush",       dark: false, desktopBg: "from-[#faeaf0] via-[#f2d8e4] to-[#eeccd8]", mobileBg: "#faeaf0", mobileAccent: "rgba(200,60,120,0.12)",  accent: { bg: "bg-rose-500",    text: "text-rose-700",    border: "border-rose-400",           chipBg: "bg-rose-100",       chipBorder: "border-rose-300",       chipText: "text-rose-800",    hoverChip: "hover:bg-rose-200",       toggle: "bg-rose-500"    } },
];



// ─── HELPERS ─────────────────────────────────────────────────────────────────

export { PROJECTS, SKILLS, WALLPAPERS };