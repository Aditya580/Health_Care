import React, { useState } from "react";

export default function Draw() {
  const [selectedColor, setSelectedColor] = useState("#38bdf8");
  const [filledParts, setFilledParts] = useState({});
  const [selectedDrawing, setSelectedDrawing] = useState("mandala");

  const handlePartClick = (id) => {
    setFilledParts((prev) => ({
      ...prev,
      [id]: selectedColor,
    }));
  };

  const handleClear = () => setFilledParts({});

  // ---------- MANDALA HELPERS ----------
  const Petal = ({ id, angle, rx = 16, ry = 36, cx = 100, cy = 60, stroke = "#94a3b8" }) => (
    <ellipse
      transform={`rotate(${angle} 100 100)`}
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={filledParts[id] || "#fde68a"}         // soft amber default
      stroke={stroke}
      strokeWidth="1.5"
      onClick={() => handlePartClick(id)}
      className="cursor-pointer transition-[filter,transform] hover:brightness-110 hover:scale-[1.02]"
    />
  );

  const Diamond = ({ id, cx, cy, size = 14, stroke = "#a5b4fc" }) => {
    const points = [
      [cx, cy - size],
      [cx + size, cy],
      [cx, cy + size],
      [cx - size, cy],
    ]
      .map((p) => p.join(","))
      .join(" ");
    return (
      <polygon
        points={points}
        fill={filledParts[id] || "#e0e7ff"}       // indigo-100 default
        stroke={stroke}
        strokeWidth="1.5"
        onClick={() => handlePartClick(id)}
        className="cursor-pointer transition hover:brightness-110"
      />
    );
  };

  const Leaf = ({ id, angle, cx = 100, cy = 20, rx = 10, ry = 24, stroke = "#93c5fd" }) => (
    <ellipse
      transform={`rotate(${angle} 100 100)`}
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={filledParts[id] || "#bae6fd"}        // sky-200 default
      stroke={stroke}
      strokeWidth="1.5"
      onClick={() => handlePartClick(id)}
      className="cursor-pointer transition hover:brightness-110"
    />
  );

  const SmallDot = ({ id, cx, cy, r = 5, stroke = "#60a5fa" }) => (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={filledParts[id] || "#bfdbfe"}        // sky-200/300 default
      stroke={stroke}
      strokeWidth="1.25"
      onClick={() => handlePartClick(id)}
      className="cursor-pointer transition hover:brightness-110"
    />
  );

  const drawings = {
    mandala: (
      <svg
        viewBox="0 0 200 200"
        className="w-[min(90vw,520px)] h-[min(90vw,520px)] mx-auto drop-shadow-sm"
      >
        {/* BACKBOARD (clickable ring segments) */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill={filledParts["bgRing"] || "#f0f9ff"}      // very light sky
          stroke="#c7d2fe"
          strokeWidth="2"
          onClick={() => handlePartClick("bgRing")}
          className="cursor-pointer"
        />
        <circle
          cx="100"
          cy="100"
          r="78"
          fill={filledParts["midRing"] || "#eef2ff"}     // very light indigo
          stroke="#c7d2fe"
          strokeWidth="1.5"
          onClick={() => handlePartClick("midRing")}
          className="cursor-pointer"
        />
        <circle
          cx="100"
          cy="100"
          r="58"
          fill={filledParts["innerRing"] || "#faf5ff"}   // very light purple
          stroke="#e9d5ff"
          strokeWidth="1.25"
          onClick={() => handlePartClick("innerRing")}
          className="cursor-pointer"
        />

        {/* CENTER */}
        <circle
          cx="100"
          cy="100"
          r="16"
          fill={filledParts["core"] || "#fef3c7"}        // amber-100
          stroke="#f59e0b"
          strokeWidth="1.5"
          onClick={() => handlePartClick("core")}
          className="cursor-pointer transition hover:brightness-110"
        />
        <circle
          cx="100"
          cy="100"
          r="26"
          fill="none"
          stroke={filledParts["coreRing"] || "#60a5fa"}  // sky-400 as stroke color
          strokeWidth="3"
          onClick={() => handlePartClick("coreRing")}
          className="cursor-pointer"
        />

        {/* 8 LARGE PETALS */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Petal key={`petal-${i + 1}`} id={`petal-${i + 1}`} angle={i * 45} />
        ))}

        {/* 8 DIAMONDS BETWEEN PETALS */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const cx = 100 + Math.cos(angle) * 46;
          const cy = 100 + Math.sin(angle) * 46;
          return (
            <Diamond key={`diamond-${i + 1}`} id={`diamond-${i + 1}`} cx={cx} cy={cy} size={10} />
          );
        })}

        {/* 16 SMALL DOTS ON INNER RING */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * Math.PI) / 8;
          const cx = 100 + Math.cos(angle) * 68;
          const cy = 100 + Math.sin(angle) * 68;
          return (
            <SmallDot key={`dot-${i + 1}`} id={`dot-${i + 1}`} cx={cx} cy={cy} r={4.5} />
          );
        })}

        {/* 12 OUTER LEAVES */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Leaf key={`leaf-${i + 1}`} id={`leaf-${i + 1}`} angle={i * 30} />
        ))}
      </svg>
    ),

    // Keep your existing "flower" if you want both options:
    flower: (
      <svg viewBox="0 0 200 200" className="w-[min(90vw,520px)] h-[min(90vw,520px)] mx-auto">
        {/* Stem */}
        <rect
          x="95"
          y="60"
          width="10"
          height="80"
          fill={filledParts["stem"] || "#d1fae5"}
          onClick={() => handlePartClick("stem")}
          className="cursor-pointer"
        />
        {/* Leaves */}
        <ellipse
          cx="80"
          cy="100"
          rx="20"
          ry="10"
          fill={filledParts["leaf1"] || "#bbf7d0"}
          onClick={() => handlePartClick("leaf1")}
          className="cursor-pointer"
        />
        <ellipse
          cx="120"
          cy="120"
          rx="20"
          ry="10"
          fill={filledParts["leaf2"] || "#bbf7d0"}
          onClick={() => handlePartClick("leaf2")}
          className="cursor-pointer"
        />
        {/* Petals */}
        <circle
          cx="100"
          cy="40"
          r="20"
          fill={filledParts["petal"] || "#fecaca"}
          onClick={() => handlePartClick("petal")}
          className="cursor-pointer"
        />
        <circle
          cx="80"
          cy="60"
          r="20"
          fill={filledParts["petal2"] || "#fecaca"}
          onClick={() => handlePartClick("petal2")}
          className="cursor-pointer"
        />
        <circle
          cx="120"
          cy="60"
          r="20"
          fill={filledParts["petal3"] || "#fecaca"}
          onClick={() => handlePartClick("petal3")}
          className="cursor-pointer"
        />
        {/* Center */}
        <circle
          cx="100"
          cy="60"
          r="15"
          fill={filledParts["center"] || "#fde047"}
          onClick={() => handlePartClick("center")}
          className="cursor-pointer"
        />
      </svg>
    ),
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 py-16 px-6" id="draw">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold font-[Poppins] text-sky-800 mb-2">Relax & Draw 🎨</h2>
        <p className="text-sky-600 mb-8">Click any segment to color it. Mindful coloring = calmer mind 💙</p>

        {/* Drawing selector */}
        <div className="mb-6">
          <select
            value={selectedDrawing}
            onChange={(e) => setSelectedDrawing(e.target.value)}
            className="p-2 rounded-lg border border-sky-300 shadow focus:ring-2 focus:ring-sky-400"
          >
            <option value="mandala">🌀 Mandala</option>
            <option value="flower">🌸 Flower</option>
          </select>
        </div>

        {/* Drawing */}
        <div className="mb-6">{drawings[selectedDrawing]}</div>

        {/* Palette */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {[
            "#38bdf8", // sky-400
            "#60a5fa", // sky-400+
            "#a5b4fc", // indigo-300
            "#c7d2fe", // indigo-200
            "#e9d5ff", // purple-200
            "#fde68a", // amber-200
            "#bbf7d0", // green-200
            "#fecaca", // rose-200
             // 🌈 Bright vibrant colors
            "#ef4444", // red-500
             "#f97316", // orange-500
             "#facc15", // yellow-400
              "#22c55e", // green-500
              "#0ea5e9", // sky-500
              "#3b82f6", // blue-500
            "#8b5cf6", // violet-500
            "#ec4899", // pink-500
          ].map((color) => (
            <button
              key={color}
              className={`w-9 h-9 rounded-full border-2 shadow transition transform hover:scale-110 ${
                selectedColor === color ? "ring-4 ring-sky-400" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleClear}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition"
          >
            Reset Drawing ♻️
          </button>
        </div>
      </div>
    </div>
  );
}
