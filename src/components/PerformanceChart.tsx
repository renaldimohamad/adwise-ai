"use client";

import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

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
  height = 250
}: PerformanceChartProps) {
  // Map data to recharts format
  const chartData = data.map(d => ({
    name: d.label,
    value: d.value
  }));

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="currentColor" 
            strokeOpacity={0.05} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "currentColor", opacity: 0.2, fontSize: 9, fontWeight: 900 }}
            dy={10}
          />
          <YAxis hide domain={[0, 'dataMax + 10']} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">
                      {payload[0].payload.name}
                    </p>
                    <p className="text-xl font-black text-primary tracking-tighter">
                      {payload[0].value}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={2000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
