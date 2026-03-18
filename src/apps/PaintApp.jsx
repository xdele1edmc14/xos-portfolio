import { useState, useRef } from "react";

// Crosshair cursor SVG with dark outline so it's visible on white canvas
const CURSOR_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><line x1='12' y1='2' x2='12' y2='22' stroke='black' stroke-width='2.5'/><line x1='2' y1='12' x2='22' y2='12' stroke='black' stroke-width='2.5'/><line x1='12' y1='2' x2='12' y2='22' stroke='white' stroke-width='1'/><line x1='2' y1='12' x2='22' y2='12' stroke='white' stroke-width='1'/><circle cx='12' cy='12' r='2' fill='black'/></svg>`;
const CURSOR_URL = `url("data:image/svg+xml,${encodeURIComponent(CURSOR_SVG)}") 12 12, crosshair`;

const PaintApp = ({ darkMode }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#7b3fe4");
  const [size, setSize] = useState(4);
  const colors = ["#7b3fe4","#ef4444","#3b82f6","#10b981","#f59e0b","#ec4899","#000000","#ffffff","#6b7280"];

  // Scale mouse coords from CSS pixels → canvas pixels
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / r.width;
    const scaleY = canvas.height / r.height;
    return [
      (e.clientX - r.left) * scaleX,
      (e.clientY - r.top)  * scaleY,
    ];
  };

  const start = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    const [x, y] = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const onMove = (moveEvt) => {
      const [mx, my] = getPos(moveEvt);
      ctx.lineTo(mx, my);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx, my);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  };

  const clear = () => {
    const c = canvasRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-[#2a2a2a]" : "bg-[#f0f0f0]"}`}>
      <div className={`flex items-center gap-3 px-4 py-2 border-b flex-shrink-0 ${darkMode ? "bg-[#1e1e1e] border-white/10" : "bg-white border-gray-200"}`}>
        <div className="flex gap-1.5">
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
              style={{ backgroundColor: c, borderColor: color === c ? (darkMode ? "#fff" : "#333") : "transparent",
                boxShadow: color === c ? "0 0 0 1px rgba(0,0,0,0.3)" : "none" }} />
          ))}
        </div>
        <input type="range" min={1} max={20} value={size}
          onChange={e => setSize(+e.target.value)}
          className="w-20 accent-violet-500" />
        <span className={`text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>{size}px</span>
        <button onClick={clear}
          className={`ml-auto text-xs px-3 py-1 rounded-lg ${darkMode ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-600"} hover:opacity-80`}>
          Clear
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1600}
          height={1200}
          className="absolute inset-0 w-full h-full"
          style={{ background: "white", cursor: CURSOR_URL }}
          onMouseDown={start}
        />
      </div>
    </div>
  );
};

export { PaintApp };