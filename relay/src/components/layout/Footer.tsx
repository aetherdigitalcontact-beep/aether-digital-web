"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { dictionaries, Language } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Mail, Zap } from "lucide-react";

export default function Footer() {
    const [lang, setLang] = useState<Language>("en");
    const [latency, setLatency] = useState<number>(0);
    const [status, setStatus] = useState<"STABLE" | "OFFLINE" | "DEGRADED">("STABLE");
    const [bars, setBars] = useState([6, 8, 12]);
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("aetherdigital.contact@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const savedLang = localStorage.getItem("relay-lang") as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        }

        // Listen for language changes (custom event or interval)
        const checkLang = setInterval(() => {
            const currentLang = localStorage.getItem("relay-lang") as Language;
            if (currentLang && currentLang !== lang && dictionaries[currentLang]) {
                setLang(currentLang);
            }
        }, 1000);

        let mounted = true;
        const pingInterval = setInterval(async () => {
            if (!mounted) return;
            const start = performance.now();
            try {
                // Ping a lightweight endpoint to measure actual API latency
                const res = await fetch('/api/auth/me', { method: 'HEAD', cache: 'no-store' });
                const time = Math.round(performance.now() - start);
                if (mounted) {
                    setLatency(time);
                    setBars([Math.random() * 8 + 4, Math.random() * 10 + 2, Math.random() * 12 + 2]);
                    if (time > 1000) setStatus("DEGRADED");
                    else setStatus("STABLE");
                }
            } catch (error) {
                if (mounted) {
                    setLatency(999);
                    setBars([2, 2, 2]);
                    setStatus("OFFLINE");
                }
            }
        }, 2500);

        return () => {
            mounted = false;
            clearInterval(checkLang);
            clearInterval(pingInterval);
        };
    }, [lang]);

    const d = dictionaries[lang];

    return (
        <footer className="w-full py-20 px-6 border-t border-white/5 bg-[#05070a] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
                    <Link href="/" className="flex items-center gap-3 mb-6 active:scale-95 transition-transform group">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] relative overflow-hidden">
                            <Zap className="text-white w-5 h-5 z-10" fill="currentColor" />
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-white">RELAY</span>
                    </Link>
                    <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                        {d.hero.desc}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleCopyEmail}
                            className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-full bg-accent text-white hover:bg-blue-600 transition-all shadow-[0_0_20px_var(--accent-glow)] active:scale-95 group relative overflow-hidden"
                        >
                            <AnimatePresence mode="wait">
                                {copied ? (
                                    <motion.span
                                        key="copied"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        {lang === 'es' ? '¡COPIADO!' : 'COPIED!'}
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="default"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                        {d.legal?.support || "Contact Support"}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">Protocols</h4>
                    <ul className="space-y-4">
                        <li><Link href="/docs" className="text-sm text-slate-500 hover:text-white transition-colors">{d.nav.docs}</Link></li>
                        {/* <li><Link href="/pricing" className="text-sm text-slate-500 hover:text-white transition-colors">{d.nav.pricing}</Link></li> */}
                        <li><Link href="/auth" className="text-sm text-slate-500 hover:text-white transition-colors">{d.nav.getStarted}</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">Legal</h4>
                    <ul className="space-y-4">
                        <li><Link href="/terms" className="text-sm text-slate-500 hover:text-white transition-colors">{d.legal?.terms || "Terms of Service"}</Link></li>
                        <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">{d.legal?.privacy || "Privacy Policy"}</Link></li>
                        <li><Link href="/refund" className="text-sm text-slate-500 hover:text-white transition-colors">{d.legal?.refund || "Refund Policy"}</Link></li>
                        <li><Link href="/dpa" className="text-sm text-slate-500 hover:text-white transition-colors">DPA</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest text-center md:text-left">
                    &copy; 2026 {d.footer}
                </p>
                <div className="flex items-center gap-6 md:gap-8 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>

                    {/* Live Equalizer */}
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="flex items-end gap-[3px] h-3.5 opacity-80">
                            <motion.div animate={{ height: bars[0] }} className={`w-1 rounded-sm ${status === 'STABLE' ? 'bg-accent' : status === 'OFFLINE' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            <motion.div animate={{ height: bars[1] }} className={`w-1 rounded-sm ${status === 'STABLE' ? 'bg-accent' : status === 'OFFLINE' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            <motion.div animate={{ height: bars[2] }} className={`w-1 rounded-sm ${status === 'STABLE' ? 'bg-accent' : status === 'OFFLINE' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 w-12 text-left">
                            {latency > 0 ? `${latency}MS` : '--MS'}
                        </span>
                    </div>

                    {/* Status Dot */}
                    <div className="flex items-center gap-2.5 relative z-10 border-l border-white/10 pl-6">
                        <span className="relative flex h-2.5 w-2.5">
                            {status === 'STABLE' && <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60"></span>}
                            <span className={`relative rounded-full h-full w-full shadow-[0_0_10px_currentColor] ${status === 'STABLE' ? 'bg-emerald-500 text-emerald-500' : status === 'OFFLINE' ? 'bg-rose-500 text-rose-500' : 'bg-amber-500 text-amber-500'}`}></span>
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${status === 'STABLE' ? 'text-emerald-500' : status === 'OFFLINE' ? 'text-rose-500' : 'text-amber-500'}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
