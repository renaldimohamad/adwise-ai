"use client";

import { motion } from "framer-motion";

type ChartData = {
  label: string;
  value: number;
};

interface PerformanceChartProps {
  data: ChartData[];
  color?: string;
  height?: number;
}

export function PerformanceChart({
  data,
  color = "var(--primary)",
  height = 200
}: PerformanceChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / max) * 100
  }));

  const pathData = points.reduce((acc, point, i) => {
    return i === 0
      ? `M ${point.x},${point.y}`
      : `${acc} L ${point.x},${point.y}`;
  }, "");

  const areaData = `${pathData} L 100,100 L 0,100 Z`;

  return (
    <div className="w-full relative" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <line
            key={v}
            x1="0"
            y1={v}
            x2="100"
            y2={v}
            stroke="currentColor"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          />
        ))}

        {/* Area */}
        <motion.path
          d={areaData}
          fill={color}
          fillOpacity="0.1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="1.5"
              fill="white"
              stroke={color}
              strokeWidth="0.5"
            />
          </motion.g>
        ))}
      </svg>

      <div className="flex justify-between mt-6 px-2 overflow-x-auto no-scrollbar gap-4 sm:gap-0">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center shrink-0 min-w-[50px] sm:min-w-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/20 mb-1 whitespace-nowrap">
              {d.label}
            </span>
            <span className="text-[10px] font-bold text-foreground/40">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
