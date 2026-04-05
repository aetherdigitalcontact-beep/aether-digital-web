"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Zap,
    AlertTriangle,
    Activity,
    Terminal as TerminalIcon,
    Database,
    Cpu,
    Globe,
    ArrowLeft,
    Play,
    CheckCircle2,
    XCircle,
    Server,
    Wifi,
    Lock
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const INCIDENTS = [
    {
        id: "shopify-sale",
        name: "Shopify Store Webhook",
        type: "WEBHOOK",
        description: "Simulates an 'Order Paid' event from a Shopify store. Tests the Shopify-to-Relay adapter.",
        color: "blue",
        icon: Zap,
        endpoint: "/api/webhooks/shopify"
    },
    {
        id: "server-down",
        name: "Infrastructure Alarm",
        type: "DIRECT_RELAY",
        description: "Simulates a server downtime event. Sends high-priority variables to the Relay engine.",
        color: "red",
        icon: Server,
        endpoint: "/api/relay"
    },
    {
        id: "intrusion-detect",
        name: "Intrusion Detection",
        type: "CUSTOM_EVENT",
        description: "Simulates a brute-force attack or unauthorized access attempt. Validates emergency alerts.",
        color: "amber",
        icon: Lock,
        endpoint: "/api/relay"
    }
];

export default function SentinelTerminal() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [templateId, setTemplateId] = useState("");
    const [platforms, setPlatforms] = useState("telegram,discord");
    const [target, setTarget] = useState("@admin");
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch API key for testing
        fetch('/api/keys')
            .then(res => res.json())
            .then(data => {
                if (data.keys?.[0]) setApiKey(data.keys[0].key_hash);
            });
    }, []);

    const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [{ time, msg, type }, ...prev].slice(0, 50));
    };

    const triggerIncident = async (incident: typeof INCIDENTS[0]) => {
        if (!apiKey) {
            addLog("ERROR: No API Key found. Please create one in the dashboard.", "error");
            return;
        }

        setIsLoading(true);
        addLog(`Initiating test protocol: ${incident.name}...`);

        try {
            let url = incident.endpoint;
            let options: any = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            };

            if (incident.id === 'shopify-sale') {
                // Shopify specific mock
                url += `?api_key=${apiKey}&platforms=${platforms}&target=${target}&template_id=${templateId || 'TPL-TEST'}`;
                options.body = JSON.stringify({
                    id: 123456,
                    order_number: 1001,
                    total_price: "249.00",
                    currency: "USD",
                    customer: { first_name: "Exequiel", last_name: "Test" },
                    line_items: [{ title: "Relay Node" }],
                    source_name: "sentinel-terminal"
                });
            } else {
                // Direct Relay
                options.body = JSON.stringify({
                    platform: platforms.split(','),
                    target: target,
                    targets: {
                        discord: target.includes('discord.com') ? target : undefined,
                        telegram: (!target.includes('http') && target.length > 0) ? target : undefined
                    },
                    category: incident.id === 'server-down' ? 'Infrastructure' : 'Security',
                    variables: {
                        node: "AWS-Mendoza-01",
                        status: incident.id === 'server-down' ? "OFFLINE" : "UNAUTHORIZED ACCESS",
                        severity: "CRITICAL",
                        action: "Quarantine Initiated",
                        timestamp: new Date().toISOString()
                    },
                    template_id: templateId // Optional
                });
            }

            const res = await fetch(url, options);
            const result = await res.json();

            if (res.ok) {
                addLog(`Success: ${incident.name} processed by Relay Engine.`, "success");
            } else {
                addLog(`Failed: ${result.error || 'Uplink rejected'}`, "error");
            }
        } catch (err) {
            addLog("Fatal: Network connection lost to Relay.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#05070a] text-slate-300 font-mono selection:bg-accent/30 selection:text-white p-6 overflow-hidden flex flex-col md:flex-row gap-6">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-pulse" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#05070a_100%)]" />
                <div className="absolute w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
            </div>

            {/* Left Panel: Controls */}
            <div className="w-full md:w-[450px] flex flex-col gap-6 relative z-10">
                <header className="flex items-center justify-between glass p-6 rounded-[32px] border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">SENTINEL</h1>
                            <span className="text-[9px] font-bold text-accent tracking-[0.2em] uppercase">Test Laboratory</span>
                        </div>
                    </div>
                    <Link href="/dashboard" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                </header>

                <div className="glass p-8 rounded-[36px] border-white/5 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Uplink Configuration</label>
                        <div className="space-y-3">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold uppercase tracking-widest">Auth</span>
                                <input
                                    readOnly
                                    value={apiKey ? `Relay_PK_********${apiKey.slice(-4)}` : "Login required"}
                                    className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl pl-20 pr-4 text-xs font-bold text-slate-400 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Platforms</span>
                                    <input
                                        value={platforms}
                                        onChange={(e) => setPlatforms(e.target.value)}
                                        placeholder="Comma separated"
                                        className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-accent/40 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Target ID</span>
                                    <input
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                        placeholder="@channel_id"
                                        className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-accent/40 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Active Template (Optional)</span>
                                <input
                                    value={templateId}
                                    onChange={(e) => setTemplateId(e.target.value)}
                                    placeholder="Paste Template ID from Dashboard"
                                    className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-accent outline-none focus:border-accent/40 transition-colors placeholder:text-slate-700"
                                />
                                <p className="text-[9px] text-slate-500 italic mt-1 px-1">If set, Relay will use the blueprint to format the signal.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Available Scenarios</label>
                        <div className="space-y-3">
                            {INCIDENTS.map((inc) => (
                                <button
                                    key={inc.id}
                                    onClick={() => triggerIncident(inc)}
                                    disabled={isLoading}
                                    className="w-full group relative overflow-hidden"
                                >
                                    <div className="relative glass border-white/5 bg-white/[0.01] p-5 rounded-2xl flex items-center gap-4 text-left hover:border-accent/30 hover:bg-white/[0.03] transition-all">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-white transition-colors`}>
                                            <inc.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-black text-white italic uppercase tracking-tighter truncate">{inc.name}</h3>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-normal mt-0.5 line-clamp-1">{inc.type}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-4 h-4 text-accent" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border-white/5 flex items-center gap-4">
                    <div className="relative w-3 h-3">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                        <div className="relative w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Status: Stable</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Direct Link to Main Relay Cluster: ACTIVE</p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Terminal Output */}
            <div className="flex-1 flex flex-col glass rounded-[44px] border-white/5 bg-black/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between relative z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <TerminalIcon className="w-6 h-6 text-slate-600" />
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Uplink_Telemetry_Stream</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard/?tab=logs"
                            className="flex items-center gap-2 text-[9px] font-black text-accent hover:text-white uppercase tracking-widest bg-accent/5 px-4 py-2 rounded-full border border-accent/20 hover:border-accent transition-all"
                        >
                            <Activity className="w-3 h-3" />
                            Inspect Relay Logs
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Encryption: AES-256</span>
                        </div>
                        <button
                            onClick={() => setLogs([])}
                            className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest border-b border-transparent hover:border-white/20 transition-all"
                        >
                            Purge Output
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto font-mono text-[11px] leading-relaxed relative z-10 custom-scrollbar scroll-smooth">
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-4 group"
                                >
                                    <span className="text-slate-700 shrink-0 select-none">[{log.time}]</span>
                                    <span className={`
                                        ${log.type === 'success' ? 'text-emerald-400' : ''}
                                        ${log.type === 'error' ? 'text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.2)]' : ''}
                                        ${log.type === 'info' ? 'text-slate-400' : ''}
                                    `}>
                                        <span className="text-slate-600 group-hover:text-accent transition-colors mr-2">➜</span>
                                        {log.msg}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {logs.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-44">
                                <Activity className="w-16 h-16 mb-4 text-slate-700 animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-[0.2em] max-w-[200px]">Waiting for uplink signal transmission...</p>
                            </div>
                        )}
                    </div>
                    <div ref={logEndRef} />
                </div>

                <div className="px-10 py-6 border-t border-white/5 flex items-center justify-between bg-black/40 relative z-10 shrink-0">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <Wifi className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Network Latency: 12ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Database className="w-3 h-3 text-accent" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">DB SYNC: 100%</span>
                        </div>
                    </div>
                    <p className="text-[8px] text-slate-700 font-bold uppercase tracking-[0.3em]">Authorized Access Only • Relay Protocol 2026</p>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                }
            `}</style>
        </main>
    );
}
