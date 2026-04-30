"use client";

import { motion } from 'framer-motion';
import { Shield, Zap, Code2, Clock, Globe, Database, Cpu, Activity } from 'lucide-react';

export default function DiagnosticInspector() {
    const trace = [
        { label: 'Auth Check', time: '272ms', value: 27, icon: Shield, color: 'text-blue-400' },
        { label: 'Protocol Init', time: '12ms', value: 5, icon: Cpu, color: 'text-emerald-400' },
        { label: 'Cloud Scenarios', time: '488ms', value: 55, icon: Database, color: 'text-purple-400' },
        { label: 'Message Delivery', time: '377ms', value: 42, icon: Zap, color: 'text-amber-400' },
    ];

    const payload = {
        "target": "+54 9 11 1234 5678",
        "platform": "whatsapp",
        "template": "sales_alert",
        "variables": {
            "product": "AirPods Pro",
            "revenue": "$249.00"
        },
        "telemetry": {
            "auth": 272,
            "delivery": 377,
            "total": 1278
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 font-sans">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Diagnostic Session #86ECZ</h5>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-slate-500">
                    Internal Trace v2.1
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left: Execution Trace */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Execution Trace</span>
                    </div>

                    <div className="space-y-5">
                        {trace.map((item, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                        <span className="text-[10px] font-black text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-600 font-bold">{item.time}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full bg-current ${item.color} opacity-40`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-6">
                        <div className="flex justify-between text-[10px] font-black">
                            <span className="text-slate-600 uppercase tracking-widest">Total Relay Time</span>
                            <span className="text-white">1,278 ms</span>
                        </div>
                    </div>
                </div>

                {/* Right: Payload Inspector */}
                <div className="bg-black/40 rounded-3xl border border-white/5 p-6 flex flex-col group/payload overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/payload:opacity-10 transition-opacity">
                        <Code2 className="w-20 h-20 text-accent" />
                    </div>
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Code2 className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Inbound Payload</span>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide font-mono text-[10px] relative z-10">
                        <pre className="text-slate-400 leading-relaxed text-xs">
                            <span className="text-blue-400">{"{"}</span>{"\n"}
                            <span className="pl-4 text-purple-400">"platform"</span>: <span className="text-emerald-400">"whatsapp"</span>,{"\n"}
                            <span className="pl-4 text-purple-400">"target"</span>: <span className="text-emerald-400">"+54911..."</span>,{"\n"}
                            <span className="pl-4 text-purple-400">"template"</span>: <span className="text-emerald-400">"sales_alert"</span>,{"\n"}
                            <span className="pl-4 text-purple-400">"variables"</span>: <span className="text-blue-400">{"{"}</span>{"\n"}
                            <span className="pl-8 text-purple-400">"product"</span>: <span className="text-emerald-400">"AirPods Pro"</span>,{"\n"}
                            <span className="pl-8 text-purple-400">"revenue"</span>: <span className="text-emerald-400">"$249.00"</span>{"\n"}
                            <span className="pl-4 text-blue-400">{"}"}</span>,{"\n"}
                            <span className="pl-4 text-purple-400">"category"</span>: <span className="text-emerald-400">"ecommerce"</span>{"\n"}
                            <span className="text-blue-400">{"}"}</span>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
