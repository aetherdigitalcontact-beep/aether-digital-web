"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const dots = [
    { x: 200, y: 120, label: "San Francisco" },
    { x: 280, y: 140, label: "New York" },
    { x: 500, y: 110, label: "London" },
    { x: 550, y: 130, label: "Frankfurt" },
    { x: 700, y: 150, label: "Tokyo" },
    { x: 680, y: 220, label: "Singapore" },
    { x: 320, y: 300, label: "São Paulo" },
    { x: 580, y: 350, label: "Cape Town" },
    { x: 750, y: 380, label: "Sydney" },
    { x: 450, y: 150, label: "Madrid" },
];

interface GlobalMapProps {
    nodes_online?: number;
    uptime?: string;
    latency?: string;
}

export default function GlobalMap({ nodes_online = 12, uptime = "99.99%", latency = "24ms" }: GlobalMapProps) {
    const pings = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            dotIndex: Math.floor(Math.random() * dots.length),
            delay: Math.random() * 5,
        }));
    }, []);

    return (
        <div className="relative w-full aspect-[2/1] bg-white/[0.02] rounded-[40px] border border-white/5 overflow-hidden p-8 group">
            <div className="absolute top-6 left-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Infrastructure Network</h4>
                <p className="text-white text-xs font-bold font-heading">Real-time Global Delivery</p>
            </div>

            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20 grayscale brightness-200">
                <path
                    d="M200,100 L250,110 L280,140 L300,200 L320,300 L350,320 L380,300 L400,250 L420,180 L450,150 L500,110 L550,130 L600,150 L650,180 L700,150 L750,180 L800,220 L750,380 L700,400 L650,380 L600,350 L550,360 L500,400 L450,420 L400,430 L350,400 L300,380 L250,350 L200,320 L180,250 L150,200 L180,150 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                />
                {/* Simple world map path representation */}
                <path
                    d="M50 250 Q 250 50 450 250 T 850 250"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.2"
                    strokeDasharray="1 5"
                />
            </svg>

            {/* Real Dots */}
            <div className="absolute inset-0">
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                    {/* Connection Lines (Pulse) */}
                    {dots.map((dot, i) => (
                        <motion.line
                            key={`line-${i}`}
                            x1="500"
                            y1="250"
                            x2={dot.x}
                            y2={dot.y}
                            stroke="var(--accent)"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.15 }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                        />
                    ))}

                    {dots.map((dot, i) => (
                        <g key={i}>
                            <circle cx={dot.x} cy={dot.y} r="3" fill="#1e293b" />
                            <circle cx={dot.x} cy={dot.y} r="1.5" fill="var(--accent)" />
                            <motion.circle
                                cx={dot.x}
                                cy={dot.y}
                                r="1.5"
                                fill="var(--accent)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                            />
                        </g>
                    ))}
                </svg>
            </div>

            {/* Floating Status Cards */}
            <div className="absolute bottom-6 left-8 flex gap-4">
                <div className="glass px-4 py-2 rounded-xl border border-white/10">
                    <span className="text-[8px] font-black text-slate-500 uppercase block tracking-widest">Active Nodes</span>
                    <span className="text-white text-[10px] font-black">{nodes_online} Connectors Ready</span>
                </div>
                <div className="glass px-4 py-2 rounded-xl border border-white/10">
                    <span className="text-[8px] font-black text-slate-500 uppercase block tracking-widest">Health (7D)</span>
                    <span className="text-emerald-500 text-[10px] font-black">{uptime} Uptime</span>
                </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-[500px] h-[500px] bg-accent blur-[150px] rounded-full" />
            </div>
        </div>
    );
}
