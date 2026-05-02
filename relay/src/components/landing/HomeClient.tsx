"use client";

import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Zap, Shield, Code2, ArrowRight, Check, Terminal, ChevronDown, Sparkles, User, LogOut, Menu, X, BarChart3, Activity } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Footer from "@/components/layout/Footer";
import { dictionaries, Language } from "@/lib/i18n";
import dynamic from "next/dynamic";
import Image from "next/image";

const LiveShowcase = dynamic(() => import("./LiveShowcase"), { ssr: false });
const GlobalMap = dynamic(() => import("./GlobalMap"), { ssr: false });
const DiagnosticInspector = dynamic(() => import("./DiagnosticInspector"), { ssr: false });

const languages = [
    { code: 'en', name: 'English', flag: 'us' },
    { code: 'es', name: 'Español', flag: 'es' },
    { code: 'pt', name: 'Português', flag: 'br' },
    { code: 'ru', name: 'Русский', flag: 'ru' },
    { code: 'fr', name: 'Français', flag: 'fr' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'zh', name: '中文', flag: 'cn' },
    { code: 'ja', name: '日本語', flag: 'jp' },
    { code: 'it', name: 'Italiano', flag: 'it' },
] as const;

interface HomeClientProps {
    initialUser: any | null;
    initialLang: Language;
}

const StarField = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const stars = useMemo(() => {
        if (!mounted) return [];
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            size: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        y: [-100, -500],
                        x: [0, Math.random() * 50 - 25]
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        left: star.left,
                        bottom: 0,
                        width: star.size,
                        height: star.size,
                        background: 'white',
                        borderRadius: '50%',
                        filter: 'blur(1px) shadow(0 0 5px white)'
                    }}
                />
            ))}
        </div>
    );
};

function useWaitlistCount() {
    const [count, setCount] = useState<number | null>(null);
    const refresh = async () => {
        try {
            const res = await fetch('/api/waitlist/count');
            const data = await res.json();
            setCount(data.count ?? null);
        } catch { }
    };
    useEffect(() => { refresh(); }, []);
    return { count, refresh };
}

const WaitlistForm = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const { count, refresh } = useWaitlistCount();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        setStatus('loading');
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setMessage(data.message);
                setEmail("");
                refresh();
                setTimeout(() => setMessage(""), 5000);
            } else {
                setStatus('error');
                setMessage(data.error || "Something went wrong.");
            }
        } catch (err) {
            setStatus('error');
            setMessage("Connection error. Try again later.");
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="relative group">
            {/* Waitlist counter */}
            {count !== null && count > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mb-5"
                >
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="tabular-nums text-emerald-400">{count.toLocaleString()}</span>
                        <span>developers already on the waitlist</span>
                    </span>
                </motion.div>
            )}
            <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="relative flex-1 group">
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20 disabled:opacity-50"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity blur-xl"></div>
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="h-14 px-8 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap min-w-[160px] shadow-lg shadow-blue-900/20"
                >
                    {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : status === 'success' ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <>
                            <span>Keep me updated</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 flex flex-col items-center gap-2"
                    >
                        <p className={`text-[10px] md:text-xs font-medium text-center ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                            {status === 'error'
                                ? "We couldn't save your email right now. If the error persists, contact support."
                                : message
                            }
                        </p>
                        {status === 'error' && (
                            <a
                                href="mailto:aetherdigital.contact@gmail.com"
                                className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-full px-3 py-1 transition-all"
                            >
                                Contact Support
                            </a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
};

const CinematicBackground = ({
    videoSrc,
    opacity = 0.5,
    blendMode = "normal",
    className = ""
}: {
    videoSrc?: string,
    opacity?: number,
    blendMode?: string,
    className?: string
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { amount: 0.1 });

    return (
        <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden h-full z-0 ${className}`}>
            {videoSrc ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                    {isInView ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="none"
                            className={`absolute inset-0 w-full h-full object-cover saturate-[1.1] transition-opacity duration-1000 scale-105`}
                            style={{ opacity, mixBlendMode: blendMode as any }}
                        >
                            <source src={encodeURI(videoSrc)} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="absolute inset-0 bg-black opacity-100" />
                    )}
                    {/* Panoramic Vignette & Blur */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020408] via-transparent to-[#020408] opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020408] via-transparent to-[#020408] opacity-50" />
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                </div>
            ) : (
                <>
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-accent/20 blur-[180px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 100, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 blur-[180px] rounded-full"
                    />
                </>
            )}
        </div>
    );
};

export default function HomeClient({ initialUser, initialLang }: HomeClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020408]" />}>
            <HomeContent initialUser={initialUser} initialLang={initialLang} />
        </Suspense>
    );
}

function HomeContent({ initialUser, initialLang }: HomeClientProps) {
    const searchParams = useSearchParams();
    const isDev = searchParams?.get('dev') === 'true';

    const [lang, setLang] = useState<Language>(initialLang);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(initialUser);
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(!isDev);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [stats, setStats] = useState({
        uptime: "99.99%",
        latency: "24ms",
        protocol: "TLS 1.3",
        edge: "Vercel Edge",
        history: Array.from({ length: 40 }).map(() => 'OPERATIONAL'),
        nodes_online: 12
    });

    const [terminalMode, setTerminalMode] = useState<'Node.js' | 'Python' | 'Go'>('Node.js');
    const [terminalStatus, setTerminalStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
    const [integrationType, setIntegrationType] = useState<'SDK' | 'API'>('SDK');

    const getChartDays = () => {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            result.push({
                name: days[d.getDay()],
                isToday: i === 0
            });
        }
        return result;
    };
    const chartDays = getChartDays();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // Sync language with localStorage
    useEffect(() => {
        localStorage.setItem('relay-lang', lang);
    }, [lang]);

    // Refresh user data client-side for consistency (silent)
    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.user) setUser(data.user);
                else setUser(null);
            } catch (err) { }
        };

        const fetchStats = async () => {
            try {
                const startTime = Date.now();
                const res = await fetch('/api/system/stats');
                const endTime = Date.now();
                const measuredLatency = endTime - startTime;

                const data = await res.json();
                if (data.uptime) {
                    setStats(prev => ({
                        ...prev,
                        ...data,
                        protocol: data.protocol || "TLS 1.3",
                        edge: data.edge || "Vercel Edge",
                        clientLatency: measuredLatency + 'ms'
                    }));
                }
            } catch (err) { }
        };

        checkUser();
        fetchStats();
        const interval = setInterval(fetchStats, 15000); // Polling cada 15s para más frescura
        return () => clearInterval(interval);
    }, []);

    // Bfcache fix: when browser restores page from cache, Framer Motion
    // animations stay frozen at opacity:0. Reload to get a fresh render.
    useEffect(() => {
        const handlePageshow = (e: PageTransitionEvent) => {
            if (e.persisted) window.location.reload();
        };
        window.addEventListener('pageshow', handlePageshow);
        return () => window.removeEventListener('pageshow', handlePageshow);
    }, []);

    const [selectedSdk, setSelectedSdk] = useState('Node.js');

    const sdkSnippets: Record<string, { install: any, code: any, lang: string }> = {
        'Node.js': {
            lang: 'javascript',
            install: <p className="font-mono text-sm"><span className="text-purple-400">npm</span> install <span className="text-amber-200">@relay/core</span></p>,
            code: (
                <div className="space-y-1">
                    <p><span className="text-purple-400">const</span> <span className="text-emerald-400">relay</span> = <span className="text-purple-400">new</span> <span className="text-blue-400">Relay</span>(<span className="text-amber-200">'RELAY_PK_X89'</span>);</p>
                    <p className="mt-4"><span className="text-purple-400">await</span> relay.<span className="text-blue-400">send</span>({`{`}</p>
                    <p className="ml-4"><span className="text-slate-300">platform</span>: <span className="text-amber-200">'whatsapp'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">target</span>: <span className="text-amber-200">'+5491112345678'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">template</span>: <span className="text-amber-200">'sales_alert'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">variables</span>: {`{`} <span className="text-slate-300">name</span>: <span className="text-amber-200">'Exequiel'</span> {`}`}</p>
                    <p>{`}`});</p>
                </div>
            )
        },
        'Python': {
            lang: 'python',
            install: <p className="font-mono text-sm"><span className="text-purple-400">pip</span> install <span className="text-amber-200">relay-sdk</span></p>,
            code: (
                <div className="space-y-1">
                    <p><span className="text-purple-400">from</span> relay <span className="text-purple-400">import</span> Relay</p>
                    <p className="mt-4">client = <span className="text-blue-400">Relay</span>(<span className="text-amber-200">'RELAY_PK_X89'</span>)</p>
                    <p className="mt-4">client.<span className="text-blue-400">send</span>(</p>
                    <p className="ml-4"><span className="text-slate-300">platform</span>=<span className="text-amber-200">'whatsapp'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">target</span>=<span className="text-amber-200">'+5491112345678'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">template</span>=<span className="text-amber-200">'sales_alert'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">variables</span>={`{`}<span className="text-amber-200">'name'</span>: <span className="text-amber-200">'Exequiel'</span>{`}`}</p>
                    <p>)</p>
                </div>
            )
        },
        'Go': {
            lang: 'go',
            install: <p className="font-mono text-sm"><span className="text-purple-400">go get</span> <span className="text-amber-200">github.com/relay/relay-go</span></p>,
            code: (
                <div className="space-y-1">
                    <p><span className="text-purple-400">import</span> <span className="text-amber-200">"github.com/relay/relay-go"</span></p>
                    <p className="mt-4">client := relay.<span className="text-blue-400">New</span>(<span className="text-amber-200">"RELAY_PK_X89"</span>)</p>
                    <p className="mt-4">err := client.<span className="text-blue-400">Send</span>(relay.Payload{`{`}</p>
                    <p className="ml-4"><span className="text-slate-300">Platform</span>: <span className="text-amber-200">"whatsapp"</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">Target</span>:   <span className="text-amber-200">"+5491112345678"</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">Template</span>: <span className="text-amber-200">"sales_alert"</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">Variables</span>: <span className="text-purple-400">map</span>[<span className="text-purple-400">string</span>]<span className="text-purple-400">string</span>{`{`}<span className="text-amber-200">"name"</span>: <span className="text-amber-200">"Exequiel"</span>{`}`},</p>
                    <p>{`}`})</p>
                </div>
            )
        },
        'PHP': {
            lang: 'php',
            install: <p className="font-mono text-sm"><span className="text-purple-400">composer require</span> <span className="text-amber-200">relay/relay-php</span></p>,
            code: (
                <div className="space-y-1">
                    <p><span className="text-emerald-400">$relay</span> = <span className="text-purple-400">new</span> \<span className="text-blue-400">Relay\Client</span>(<span className="text-amber-200">'RELAY_PK_X89'</span>);</p>
                    <p className="mt-4"><span className="text-emerald-400">$relay</span>-&gt;<span className="text-blue-400">send</span>([</p>
                    <p className="ml-4"><span className="text-amber-200">'platform'</span> =&gt; <span className="text-amber-200">'whatsapp'</span>,</p>
                    <p className="ml-4"><span className="text-amber-200">'target'</span>   =&gt; <span className="text-amber-200">'+5491112345678'</span>,</p>
                    <p className="ml-4"><span className="text-amber-200">'template'</span> =&gt; <span className="text-amber-200">'sales_alert'</span>,</p>
                    <p className="ml-4"><span className="text-amber-200">'variables'</span> =&gt; [<span className="text-amber-200">'name'</span> =&gt; <span className="text-amber-200">'Exequiel'</span>]</p>
                    <p>]);</p>
                </div>
            )
        },
        'Ruby': {
            lang: 'ruby',
            install: <p className="font-mono text-sm"><span className="text-purple-400">gem install</span> <span className="text-amber-200">relay-ruby</span></p>,
            code: (
                <div className="space-y-1">
                    <p><span className="text-purple-400">require</span> <span className="text-amber-200">'relay'</span></p>
                    <p className="mt-4">client = <span className="text-blue-400">Relay::Client</span>.<span className="text-purple-400">new</span>(<span className="text-amber-200">'RELAY_PK_X89'</span>)</p>
                    <p className="mt-4">client.<span className="text-blue-400">send</span>(</p>
                    <p className="ml-4"><span className="text-slate-300">platform</span>: <span className="text-amber-200">'whatsapp'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">target</span>: <span className="text-amber-200">'+5491112345678'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">template</span>: <span className="text-amber-200">'sales_alert'</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">variables</span>: {`{`} <span className="text-slate-300">name</span>: <span className="text-amber-200">'Exequiel'</span> {`}`}</p>
                    <p>)</p>
                </div>
            )
        },
        'Rust': {
            lang: 'rust',
            install: <p className="font-mono text-sm"><span className="text-purple-400">cargo add</span> <span className="text-amber-200">relay-rs</span></p>,
            code: (
                <div className="space-y-1">
                    <p><span className="text-purple-400">use</span> relay::<span className="text-blue-400">Client</span>;</p>
                    <p className="mt-4"><span className="text-purple-400">let</span> client = <span className="text-blue-400">Client</span>::<span className="text-purple-400">new</span>(<span className="text-amber-200">"RELAY_PK_X89"</span>);</p>
                    <p className="mt-4">client.<span className="text-blue-400">send</span>(relay::<span className="text-blue-400">Payload</span> {`{`}</p>
                    <p className="ml-4"><span className="text-slate-300">platform</span>: <span className="text-amber-200">"whatsapp"</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">target</span>: <span className="text-amber-200">"+5491112345678"</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">template</span>: <span className="text-amber-200">"sales_alert"</span>,</p>
                    <p className="ml-4"><span className="text-slate-300">variables</span>: [<span className="text-amber-200">("name", "Exequiel")</span>],</p>
                    <p>{`}`}).<span className="text-purple-400">await</span>?;</p>
                </div>
            )
        },
        'cURL': {
            lang: 'bash',
            install: <p className="font-mono text-sm font-black text-slate-500 underline underline-offset-4 decoration-white/10 uppercase tracking-widest">Global Endpoints: relay.aether.digital</p>,
            code: (
                <div className="space-y-1">
                    <p><span className="text-purple-400">curl</span> -X <span className="text-emerald-400">POST</span> <span className="text-amber-200">https://relay.aether.digital/api/relay</span> \</p>
                    <p className="ml-4">-H <span className="text-amber-200">"Authorization: Bearer RELAY_PK_X89"</span> \</p>
                    <p className="ml-4">-H <span className="text-amber-200">"Content-Type: application/json"</span> \</p>
                    <p className="ml-4">-d <span className="text-amber-200">'{`{`}</span></p>
                    <p className="ml-8"><span className="text-emerald-400">"platform"</span>: <span className="text-amber-200">"whatsapp"</span>,</p>
                    <p className="ml-8"><span className="text-emerald-400">"target"</span>: <span className="text-amber-200">"+5491112345678"</span></p>
                    <p className="ml-4"><span className="text-amber-200">{`}`}</span>'</p>
                </div>
            )
        }
    };

    const d = dictionaries[lang];
    const currentLang = languages.find(l => l.code === lang);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    // ── Maintenance mode: early return so the real page NEVER renders ──────
    if (isMaintenanceMode) {
        return (
            <div className="fixed inset-0 bg-[#020408] flex items-center justify-center p-6 text-center overflow-hidden">
                <CinematicBackground videoSrc="/videos/The Global Routing Hub.mp4" opacity={0.5} blendMode="screen" />
                <StarField />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 max-w-4xl flex flex-col items-center pb-24"
                >
                    {/* ALPHA badge — above logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.25em] text-white mb-6"
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        Relay Protocol Phase: ALPHA
                    </motion.div>

                    {/* Logo */}
                    <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_rgba(16,185,129,0.6)] relative group">
                        <Zap className="text-white w-10 h-10 z-10" fill="currentColor" />
                        <div className="absolute inset-0 bg-white opacity-20 blur-xl animate-pulse rounded-3xl"></div>
                    </div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl md:text-[8rem] lg:text-[10rem] font-black text-white tracking-tighter mb-8 leading-[0.8] text-center"
                    >
                        <span className="block opacity-30 select-none">UNDER</span>
                        <span className="block text-accent italic -mt-4 md:-mt-8 pr-4 md:pr-8">CONSTRUCTION</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-xl mx-auto px-6"
                    >
                        We are developing a professional notification infrastructure. The official Relay Protocol launch date will be announced very soon.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="w-full max-w-md mx-auto"
                    >
                        <WaitlistForm />
                    </motion.div>

                    {/* Roadmap button — centered, larger */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-10 flex items-center justify-center"
                    >
                        <Link
                            href="/roadmap"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 text-base font-bold text-white/80 hover:text-white transition-all group"
                        >
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            View Engineering Roadmap
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Top corner branding */}
                <motion.div
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-3 opacity-50 cursor-default group transition-opacity"
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 transition-all">
                        <Zap className="text-white w-4 h-4" fill="currentColor" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-white group-hover:text-blue-400 transition-colors">RELAY</span>
                    <motion.div className="absolute -inset-2 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 rounded-full transition-opacity" initial={false} />
                </motion.div>

                {/* Contact Support — top right */}
                <motion.a
                    href="mailto:aetherdigital.contact@gmail.com"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(99,102,241,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    className="absolute top-8 right-8 md:top-12 md:right-12 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-sm text-white z-20 cursor-pointer select-none overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 0 16px rgba(99,102,241,0.35)' }}
                >
                    <motion.span className="absolute inset-0 bg-white/10" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }} style={{ skewX: '-20deg' }} />
                    <span className="relative flex items-center justify-center w-4 h-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-300 opacity-50" />
                        <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-white" />
                    </span>
                    <span className="relative">Contact Support</span>
                </motion.a>

                {/* Footer: social + policy */}
                <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-2 py-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">Follow us</span>
                        <div className="h-px w-8 bg-white/[0.07]" />
                        <a href="https://www.linkedin.com/in/aether-digital/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.07] text-slate-600 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 transition-all">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </a>
                        <a href="https://github.com/aetherdigitalcontact-beep" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.07] text-slate-600 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                        <a href="https://x.com/Relaynotify" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.07] text-slate-600 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 5.84zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        <a href="/terms" className="text-[9px] text-slate-700 hover:text-slate-400 transition-colors">Terms</a>
                        <span className="text-slate-800 text-[9px]">·</span>
                        <a href="/privacy" className="text-[9px] text-slate-700 hover:text-slate-400 transition-colors">Privacy</a>
                        <span className="text-slate-800 text-[9px]">·</span>
                        <a href="/refund" className="text-[9px] text-slate-700 hover:text-slate-400 transition-colors">Refund</a>
                        <span className="text-slate-800 text-[9px]">·</span>
                        <span className="text-[9px] text-slate-700">© {new Date().getFullYear()} Relay</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main ref={containerRef} className="w-full bg-[#020408] relative overflow-hidden">

            <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[110] px-4 md:px-8 py-2 md:py-3 flex justify-between items-center glass border border-white/10 rounded-full w-[calc(100%-1.5rem)] md:w-[calc(100%-3rem)] max-w-5xl mx-auto shadow-2xl backdrop-blur-2xl">
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] relative group">
                        <Zap className="text-white w-6 h-6 z-10" fill="currentColor" />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-xl"></div>
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-white">RELAY</span>
                </Link>

                <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 items-center">
                    <a href="#features" className="hover:text-white transition-all">{d.nav.features}</a>
                    <Link href="/docs" className="hover:text-white transition-all">{d.nav.docs}</Link>
                    {/* <Link href="/pricing" className="hover:text-white transition-all flex items-center gap-2">
                        {d.nav.pricing} <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                    </Link> */}

                    <div className="relative">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all active:scale-95"
                        >
                            <img src={`https://flagcdn.com/w40/${currentLang?.flag}.png`} alt={currentLang?.name} className="w-5 h-auto rounded-sm" />
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLangOpen && (
                                <>
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsLangOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        className="absolute top-full right-0 mt-4 w-12 glass border border-white/10 rounded-3xl overflow-hidden p-2 z-50 flex flex-col gap-2"
                                    >
                                        {languages.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                                                className={`w-full aspect-square flex items-center justify-center rounded-2xl transition-all ${lang === l.code ? 'bg-accent/20 scale-110' : 'hover:bg-white/10 hover:scale-125'}`}
                                            >
                                                <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt={l.name} className="w-5 h-auto rounded-sm" />
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Link
                        href={user ? "/dashboard" : "/auth"}
                        className="flex items-center gap-2 md:gap-3 p-1 pr-3 md:p-1.5 md:pr-5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all active:scale-95 group relative"
                        title={user ? "Dashboard" : "Log In"}
                    >
                        <div className="p-1.5 md:p-2 bg-white/5 rounded-full">
                            <User className={`w-3.5 h-3.5 md:w-4 md:h-4 ${user ? 'text-accent' : 'text-slate-400'} group-hover:text-white transition-colors`} />
                        </div>
                        {user ? (
                            <div className="hidden sm:flex flex-col">
                                <span className="text-[9px] md:text-[10px] font-bold text-white tracking-tight leading-none whitespace-nowrap mb-0.5 md:mb-1">{user.name?.split(' ')[0] || 'User'}</span>
                                <span className="text-[7px] md:text-[8px] font-black text-accent tracking-[0.1em] uppercase leading-none">{user.plan || 'FREE'}</span>
                            </div>
                        ) : (
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-[0.2em] px-2">{d.nav.getStarted}</span>
                        )}
                        {user && (
                            <span className="absolute top-0.5 left-0.5 md:top-1 md:left-1 w-2 md:w-2.5 h-2 md:h-2.5 bg-emerald-500 rounded-full border-2 border-[#05070a] animate-pulse" />
                        )}
                    </Link>

                    {user && (
                        <button
                            onClick={async () => {
                                await fetch('/api/auth/logout', { method: 'POST' });
                                window.location.reload();
                            }}
                            className="p-2 md:p-3 rounded-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-95 group cursor-pointer"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4 md:w-5 md:h-5 text-rose-400 group-hover:text-rose-300 transition-colors" />
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 text-slate-300"
                    >
                        {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-[85px] left-0 right-0 z-[100] px-4 md:hidden"
                    >
                        <div className="glass rounded-[30px] p-8 border border-white/5 shadow-2xl flex flex-col gap-6 text-center">
                            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black uppercase tracking-widest text-sm hover:text-accent transition-colors">{d.nav.features}</a>
                            <Link href="/docs" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black uppercase tracking-widest text-sm hover:text-accent transition-colors">{d.nav.docs}</Link>
                            {/* <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black uppercase tracking-widest text-sm hover:text-accent transition-colors flex items-center justify-center gap-2">
                                {d.nav.pricing} <Sparkles className="w-4 h-4 text-accent" />
                            </Link> */}
                            <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-white/10">
                                {languages.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { setLang(l.code); setIsMobileMenuOpen(false); }}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${lang === l.code ? 'bg-accent border border-accent text-white scale-110 shadow-[0_0_15px_var(--accent-glow)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt={l.name} className="w-5 h-auto rounded-sm" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Hero Section Container */}
            <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-10">
                <CinematicBackground
                    videoSrc="/videos/The Global Routing Hub.mp4"
                    opacity={0.4}
                    blendMode="screen"
                />

                {/* Hero Section - Split Layout */}
                <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center max-w-7xl w-full mx-auto px-6 z-10 pt-32 lg:pt-24 gap-12 lg:gap-20">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">10,000 Free alerts included</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-8 leading-none md:leading-[0.9] tracking-[-0.05em] text-white font-heading"
                        >
                            <span className="block">Deliver alerts</span>
                            <span className="block text-accent underline decoration-white/10 underline-offset-4 md:underline-offset-8 italic mt-1 md:mt-0">instantly</span>
                            <span className="block mt-1 md:mt-2">to any channel.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-8 md:mb-12 max-w-xl leading-relaxed font-medium">
                            {d.hero.desc}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 items-stretch sm:items-center">
                            {!user ? (
                                <Link href="/auth" className="w-full sm:w-auto justify-center px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-accent text-white font-black text-lg md:text-xl flex items-center gap-3 group hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98]">
                                    {d.hero.start} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            ) : (
                                <Link href="/dashboard" className="w-full sm:w-auto justify-center px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-accent text-white font-black text-lg md:text-xl flex items-center gap-3 group hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98]">
                                    {d.hero.dashboardLink || "Dashboard"} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            )}
                            <Link href="/docs" className="w-full sm:w-auto justify-center px-6 md:px-8 py-4 md:py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-3 group">
                                <Terminal className="w-5 h-5 text-accent" /> {d.hero.viewDocs}
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="flex-1 w-full lg:w-auto mt-12 lg:mt-0 relative"
                    >
                        <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full opacity-50 animate-pulse"></div>
                        <div className="relative glass-card border border-white/10 rounded-[40px] p-1 shadow-2xl group">
                            <div className="bg-[#0b0f1a] rounded-[39px] p-10 font-mono text-sm leading-relaxed relative overflow-hidden">
                                {/* Terminal Header */}
                                <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-6">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => {
                                                setTerminalStatus('IDLE');
                                                setTerminalMode('Node.js');
                                            }}
                                            className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600 transition-all hover:scale-125 active:scale-90"
                                            title="Reset Terminal"
                                        ></button>
                                        <button
                                            onClick={() => {
                                                const modes: ('Node.js' | 'Python' | 'Go')[] = ['Node.js', 'Python', 'Go'];
                                                const next = modes[(modes.indexOf(terminalMode) + 1) % modes.length];
                                                setTerminalMode(next);
                                            }}
                                            className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 transition-all hover:scale-125 active:scale-90"
                                            title="Switch Language"
                                        ></button>
                                        <button
                                            onClick={() => {
                                                setTerminalStatus('SENDING');
                                                setTimeout(() => setTerminalStatus('SUCCESS'), 1200);
                                            }}
                                            className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 transition-all hover:scale-125 active:scale-90"
                                            title="Execute Simulation"
                                        ></button>
                                    </div>
                                    <div className="ml-4 text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">relay-terminal v2.0 - {terminalMode}</div>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={terminalMode + terminalStatus}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-1"
                                    >
                                        {terminalStatus === 'SUCCESS' ? (
                                            <div className="flex flex-col items-center justify-center py-10 gap-4">
                                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                                    <Zap className="text-emerald-400 w-8 h-8" fill="currentColor" />
                                                </div>
                                                <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Protocol Pulse Injected Successfully</p>
                                                <p className="text-slate-500 text-[10px]">Latency: 24ms | Target: WhatsApp</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-slate-600"># {terminalStatus === 'SENDING' ? 'Processing Request...' : 'Send a lightning-fast notification'}</p>
                                                {terminalMode === 'Node.js' && (
                                                    <>
                                                        <p><span className="text-purple-400">const</span> <span className="text-emerald-400">relay</span> = <span className="text-blue-400">require</span>(<span className="text-amber-200">'@relay/core'</span>);</p>
                                                        <p className="mt-4"><span className="text-emerald-400">await</span> relay.<span className="text-blue-400">pulse</span>({`{`}</p>
                                                        <p className="ml-4"><span className="text-slate-300">target</span>: <span className="text-amber-200">'@whatsapp/marketing'</span>,</p>
                                                        <p className="ml-4"><span className="text-slate-300">trigger</span>: <span className="text-amber-200">'SALE_DETECTED'</span>,</p>
                                                        <p className="ml-4"><span className="text-slate-300">payload</span>: {`{`}</p>
                                                        <p className="ml-8 text-emerald-400">"amount": "1,250.00",</p>
                                                        <p className="ml-8 text-emerald-400">"customer": "Elon"</p>
                                                        <p className="ml-4 text-slate-300">{`}`}</p>
                                                        <p className="text-slate-300">{`}`});</p>
                                                    </>
                                                )}
                                                {terminalMode === 'Python' && (
                                                    <>
                                                        <p><span className="text-purple-400">from</span> relay <span className="text-purple-400">import</span> Relay</p>
                                                        <p className="mt-4">client = <span className="text-blue-400">Relay</span>(<span className="text-amber-200">'RELAY_PK_X89'</span>)</p>
                                                        <p className="mt-4">client.<span className="text-blue-400">send</span>(</p>
                                                        <p className="ml-4"><span className="text-slate-300">target</span>=<span className="text-amber-200">'@whatsapp/marketing'</span>,</p>
                                                        <p className="ml-4"><span className="text-slate-300">trigger</span>=<span className="text-amber-200">'SALE_DETECTED'</span>,</p>
                                                        <p className="ml-4"><span className="text-slate-300">variables</span>={`{`}<span className="text-amber-200">'customer'</span>: <span className="text-amber-200">'Elon'</span>{`}`}</p>
                                                        <p className="text-slate-300">)</p>
                                                    </>
                                                )}
                                                {terminalMode === 'Go' && (
                                                    <>
                                                        <p><span className="text-purple-400">import</span> <span className="text-amber-200">"github.com/relay/relay-go"</span></p>
                                                        <p className="mt-4">client := relay.<span className="text-blue-400">New</span>(<span className="text-amber-200">"RELAY_PK_X89"</span>)</p>
                                                        <p className="mt-4">err := client.<span className="text-blue-400">Send</span>(relay.Payload{`{`}</p>
                                                        <p className="ml-4"><span className="text-slate-300">Target</span>: <span className="text-amber-200">"@whatsapp/marketing"</span>,</p>
                                                        <p className="ml-4"><span className="text-slate-300">Trigger</span>: <span className="text-amber-200">"SALE_DETECTED"</span>,</p>
                                                        <p className="text-slate-300">{`}`})</p>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Decorative Elements */}
                                <motion.div
                                    animate={{
                                        opacity: terminalStatus === 'SUCCESS' ? 0.8 : 0.2,
                                        scale: terminalStatus === 'SUCCESS' ? 1.2 : 1
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className={`absolute bottom-0 right-0 p-10 ${terminalStatus === 'SUCCESS' ? 'text-accent' : 'text-accent/10'}`}
                                >
                                    <Zap className="w-40 h-40" strokeWidth={0.5} />
                                </motion.div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <GlobalMap
                                nodes_online={(stats as any).nodes_online}
                                uptime={stats.uptime}
                                latency={(stats as any).latency_raw ? `${(stats as any).latency_raw}ms` : stats.latency}
                            />
                        </div>

                        {/* Badge Element */}
                        <div className="w-full flex justify-center mt-6 md:mt-8 relative z-30 pointer-events-none">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="glass border border-white/10 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto"
                            >
                                <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white/10" />
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Global Delivery: <span className="text-emerald-400">Stable</span></div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Cinematic Visual Showcase Section (Inspired by Novu) */}
            <section className="relative w-full py-40 overflow-hidden bg-[#020408]">
                <div className="relative z-10 w-full flex flex-col items-center justify-center mx-auto px-6">
                    <CinematicBackground
                        videoSrc="/videos/Neural Protocol.mp4"
                        opacity={0.4}
                        blendMode="screen"
                    />
                    <StarField />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative z-10 max-w-6xl w-full px-6"
                    >
                        {/* Glowing Aura */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-accent/20 blur-[160px] rounded-full pointer-events-none opacity-50" />

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-600 rounded-[42px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                                <Image
                                    src="/images/assets/inbox-preview.png"
                                    alt="Relay Dashboard Preview"
                                    width={1200}
                                    height={675}
                                    className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                        <LiveShowcase />

                        {/* Scale to Code Section */}
                        <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className="relative glass border border-white/10 p-6 rounded-3xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-blue-500/10 pointer-events-none rounded-3xl" />
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                </div>
                                <div className="font-mono text-sm leading-relaxed p-4 bg-black/40 rounded-xl border border-white/5 overflow-x-auto">
                                    <div className="space-y-1">
                                        <p><span className="text-purple-400">import</span> <span className="text-emerald-400">relay</span> <span className="text-purple-400">from</span> <span className="text-amber-200">'@relay/core'</span>;</p>
                                        <p className="mt-4"><span className="text-purple-400">export async function</span> <span className="text-blue-400">POST</span>(req: <span className="text-blue-400">Request</span>) {`{`}</p>
                                        <p className="ml-4"><span className="text-purple-400">const</span> {`{`} <span className="text-slate-300">userId</span>, <span className="text-slate-300">plan</span> {`}`} = <span className="text-purple-400">await</span> req.<span className="text-blue-400">json</span>();</p>
                                        <p className="mt-4 ml-4 text-slate-600">// Route intelligently with 3 lines of code</p>
                                        <p className="ml-4"><span className="text-purple-400">await</span> relay.<span className="text-blue-400">pulse</span>({`{`}</p>
                                        <p className="ml-8"><span className="text-emerald-400">target</span>: [<span className="text-amber-200">'@email/onboarding'</span>, <span className="text-amber-200">'@slack/alerts'</span>, <span className="text-amber-200">'@sms/support'</span>],</p>
                                        <p className="ml-8"><span className="text-emerald-400">trigger</span>: <span className="text-amber-200">'SUBSCRIPTION_CREATED'</span>,</p>
                                        <p className="ml-8"><span className="text-emerald-400">payload</span>: {`{`} <span className="text-slate-300">user</span>: <span className="text-slate-300">userId</span>, <span className="text-slate-300">tier</span>: <span className="text-slate-300">plan</span> {`}`},</p>
                                        <p className="ml-4">{`}`});</p>
                                        <p className="mt-4 ml-4"><span className="text-purple-400">return</span> <span className="text-blue-400">Response</span>.<span className="text-blue-400">json</span>({`{`} <span className="text-slate-300">success</span>: <span className="text-purple-400">true</span> {`}`});</p>
                                        <p>{`}`}</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/30 blur-3xl pointer-events-none" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
                                    Visual Logic,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Infinite Control.</span>
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-medium">
                                    Orchestrate complex notification flows using our low-code blueprint canvas, then break into the SDK when you need granular run-time control. It's the ultimate bridge between design and engineering.
                                </p>
                                <Link href="/docs" className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex items-center gap-3">
                                    <Code2 className="w-5 h-5 text-accent" />
                                    EXPLORE DOCS
                                </Link>
                            </motion.div>
                        </div>

                        {/* Background Decorative Sparkles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/30 blur-[60px] rounded-full animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full animate-pulse " style={{ animationDelay: '1s' }} />
                    </motion.div>
                </div>
            </section>

            {/* Feature Grid - Re-imagined for Luxury */}
            <section id="features" className="relative w-full py-40 overflow-hidden bg-[#020408]">
                <CinematicBackground
                    videoSrc="/videos/Automation Flow.mp4"
                    opacity={0.3}
                    blendMode="lighten"
                />
                <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {d.features.items.map((feature: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: i * 0.15, duration: 0.8 }}
                                className="p-10 rounded-[40px] glass group relative cursor-pointer hover:bg-white/[0.04] transition-all border border-white/5"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
                                    {i === 0 ? <Zap className="w-8 h-8" /> : i === 1 ? <Shield className="w-8 h-8" /> : <Code2 className="w-8 h-8" />}
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight text-white">{feature.title}</h3>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Universal Integration Section */}
            <section id="integration" className="relative w-full py-40 overflow-hidden bg-[#020408]">
                <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black mb-6 leading-[0.95] tracking-tight text-white"
                        >
                            Universal Integration for<br />
                            <span className="text-slate-500">every stack.</span>
                        </motion.h2>
                        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Connect your application to the Relay network using our high-performance SDKs or directly via REST API.
                        </p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <div className="p-1.5 bg-white/5 border border-white/10 rounded-2xl flex gap-1">
                            <button
                                onClick={() => setIntegrationType('SDK')}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${integrationType === 'SDK' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                Native SDKs
                            </button>
                            <button
                                onClick={() => setIntegrationType('API')}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${integrationType === 'API' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                Direct REST API
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                        {integrationType === 'SDK' ? (
                            <div className="flex-1 w-full animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Node.js', icon: <div className="w-8 h-8 bg-[#339933]/10 rounded-lg flex items-center justify-center text-[#339933] font-bold">JS</div> },
                                        { name: 'Python', icon: <div className="w-8 h-8 bg-[#3776AB]/10 rounded-lg flex items-center justify-center text-[#3776AB] font-bold">PY</div> },
                                        { name: 'Go', icon: <div className="w-8 h-8 bg-[#00ADD8]/10 rounded-lg flex items-center justify-center text-[#00ADD8] font-bold">GO</div> },
                                        { name: 'PHP', icon: <div className="w-8 h-8 bg-[#777BB4]/10 rounded-lg flex items-center justify-center text-[#777BB4] font-bold">PHP</div> },
                                        { name: 'Ruby', icon: <div className="w-8 h-8 bg-[#CC342D]/10 rounded-lg flex items-center justify-center text-[#CC342D] font-bold">RB</div> },
                                        { name: 'Rust', icon: <div className="w-8 h-8 bg-[#DEA584]/10 rounded-lg flex items-center justify-center text-[#DEA584] font-bold">RS</div> },
                                        { name: 'cURL', icon: <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold opacity-60">$_</div> },
                                    ].map((sdk) => {
                                        const isActive = selectedSdk === sdk.name;
                                        return (
                                            <motion.div
                                                key={sdk.name}
                                                onClick={() => setSelectedSdk(sdk.name)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer shadow-sm
                                                    ${isActive ? 'bg-accent/10 border-accent/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'}`}
                                            >
                                                {sdk.icon}
                                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{sdk.name}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 w-full animate-in fade-in slide-in-from-left-4 duration-500">
                                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">RESTful Protocol</h3>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
                                    No dependencies required. Send a single POST request from any environment to trigger your notification scenarios instantly.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">Endpoint</div>
                                        <div className="text-white font-mono text-xs break-all">https://relay.aether.digital/api/relay</div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Auth Header</div>
                                        <div className="text-white font-mono text-xs italic">Authorization: Bearer YOUR_PK_KEY</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex-[1.5] w-full max-w-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={integrationType + selectedSdk}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass border border-white/10 rounded-[40px] p-8 relative overflow-hidden group shadow-2xl min-h-[450px]"
                                >
                                    <div className="absolute top-0 right-0 p-10 opacity-5">
                                        <Code2 className="w-40 h-40 text-accent" />
                                    </div>

                                    <div className="relative z-10 h-full flex flex-col">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                                                {integrationType === 'SDK' ? <Terminal className="text-accent w-6 h-6" /> : <Activity className="text-accent w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-tight">
                                                    {integrationType === 'SDK' ? 'Implementation' : 'REST Engine'}
                                                </h4>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    {integrationType === 'SDK' ? `${sdkSnippets[selectedSdk].lang} SDK & Library` : 'Standard HTTP/1.1 Payload'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            {integrationType === 'SDK' ? (
                                                <>
                                                    <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                            # Install the Relay core engine
                                                        </div>
                                                        <div className="text-white font-mono">
                                                            {sdkSnippets[selectedSdk].install}
                                                        </div>
                                                    </div>

                                                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5 relative group/code overflow-hidden">
                                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                                                            # Initialize & Send
                                                        </div>
                                                        <div className="text-sm leading-relaxed font-mono relative z-10">
                                                            {sdkSnippets[selectedSdk].code}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="bg-[#0b0f1a]/80 rounded-[32px] p-8 font-mono text-sm overflow-hidden border border-white/5 relative h-full">
                                                    <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
                                                        <span className="text-accent font-black">POST</span>
                                                        <span className="text-slate-600 truncate text-xs">/api/relay</span>
                                                    </div>
                                                    <div className="space-y-1 text-xs md:text-sm">
                                                        <p className="text-slate-400">{`{`}</p>
                                                        <p className="ml-4"><span className="text-emerald-400">"apiKey"</span>: <span className="text-amber-200">"RELAY_PK_X892V..."</span>,</p>
                                                        <p className="ml-4"><span className="text-emerald-400">"platform"</span>: <span className="text-amber-200">"whatsapp"</span>,</p>
                                                        <p className="ml-4"><span className="text-emerald-400">"target"</span>: <span className="text-amber-200">"+54 9 11 1234 5678"</span>,</p>
                                                        <p className="ml-4 mt-2"><span className="text-emerald-400">"template"</span>: <span className="text-amber-200">"sales_alert"</span>,</p>
                                                        <p className="ml-4"><span className="text-emerald-400">"variables"</span>: {`{`}</p>
                                                        <p className="ml-8"><span className="text-emerald-400">"product"</span>: <span className="text-amber-200">"AirPods Pro"</span>,</p>
                                                        <p className="ml-8"><span className="text-emerald-400">"revenue"</span>: <span className="text-amber-200">"$249.00"</span></p>
                                                        <p className="ml-4">{`}`}</p>
                                                        <p className="text-slate-400">{`}`}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* Universal Inbox Section - New (Image 1 Aesthetics) */}
            <section className="relative w-full py-40 overflow-hidden bg-[#020408]">
                {/* Manual ambient lighting instead of background video */}
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full translate-x-1/3 pointer-events-none" />

                <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex-1"
                        >
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[0.95] tracking-tight text-white">
                                One inbox.<br />
                                <span className="text-slate-500">Every channel.</span>
                            </h2>
                            <p className="text-slate-400 text-xl font-medium mb-12 max-w-lg leading-relaxed">
                                Experience the future of notification management. A unified command center to orchestrate, monitor, and respond to every signal across your entire stack.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { title: "Multi-Platform Sync", desc: "WhatsApp, Slack, Discord, and Email in one fluid interface." },
                                    { title: "Real-time Telemetry", desc: "Instant status updates on delivery and engagement rates." },
                                    { title: "Smart Filtering", desc: "AI-powered prioritization for mission-critical alerts." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-lg">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="flex-1 w-full lg:w-[75%] lg:max-w-none relative scale-110 lg:scale-125 lg:origin-right mt-16 lg:mt-0 z-10"
                        >
                            <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full opacity-30 animate-pulse"></div>
                            <div className="relative glass border border-white/10 rounded-[40px] p-2 bg-black/40 overflow-hidden shadow-2xl group">
                                <video
                                    src="/videos/universal-inbox.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="none"
                                    className="w-full h-auto rounded-[38px] opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Status</div>
                                            <div className="text-white font-bold">Delivery Completed Successfully</div>
                                        </div>
                                        <div className="px-4 py-2 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            Live Monitor
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Routing Architecture Section - New (Image 3 Aesthetics) */}
            <section className="relative w-full py-40 overflow-hidden bg-[#020408] border-t border-white/5">
                <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-7xl font-black mb-8 leading-[0.85] tracking-tighter text-white">
                            Scenario Engine<br />
                            <span className="text-accent italic">Core Architecture.</span>
                        </h2>
                        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            A powerful, high-performance orchestration layer designed to route millions of events per second with zero message loss.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="relative w-full max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.1)] group"
                    >
                        <video
                            src="/videos/relay-scenario-engine.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="none"
                            className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24">
                        {[
                            { label: "Intelligence Layer", value: "AI-Driven" },
                            { label: "Processing Latency", value: "< 2ms" },
                            { label: "Daily Throughput", value: "Unlimited" },
                            { label: "Carrier Uptime", value: "99.99%" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{stat.label}</div>
                                <div className="text-3xl font-black text-white">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section - The Kill Shot */}
            <section className="relative w-full py-40 overflow-hidden bg-black border-y border-white/5">
                <CinematicBackground
                    videoSrc="/videos/20260418_055056_UTC_0.mp4"
                    opacity={0.3}
                    blendMode="screen"
                />
                <div className="relative z-10 max-w-6xl w-full mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">Built for speed.<br /><span className="text-slate-500">Priced for growth.</span></h2>
                        <p className="text-slate-400 text-xl font-medium">Relay offers more power for less, without the enterprise bloat.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative group bg-black/20"
                    >
                        <img
                            src="/images/assets/built-for-speed.png"
                            alt="Relay Evolution vs The Giants"
                            className="w-full h-auto opacity-95 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </motion.div>

                    {/* Manual Brand Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 opacity-40 hover:opacity-100 transition-all duration-700 pb-10"
                    >
                        <div className="flex items-center gap-3">
                            <Zap className="w-6 h-6 text-accent fill-accent" />
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Relay</span>
                        </div>
                        <div className="hidden md:block h-4 w-px bg-white/20" />
                        <p className="text-slate-400 text-lg font-medium tracking-tight">
                            Smarter notifications. <span className="text-white/80">Stronger growth.</span>
                        </p>
                    </motion.div>
                </div>
            </section>


            {/* Analytics & Diagnostics Section - New */}
            <section className="relative w-full py-40 overflow-hidden bg-[#020408]">
                <CinematicBackground
                    videoSrc="/videos/20260418_033946_UTC_0.mp4"
                    opacity={0.3}
                    blendMode="screen"
                />
                <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">Full visibility into<br /><span className="text-slate-500">every transmission.</span></h2>
                        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Relay doesn't just send messages. We provide professional-grade diagnostics and real-time telemetry to ensure your systems are always in sync.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Performance Metrics Chart */}
                        <div className="glass border border-white/10 rounded-[40px] p-10 flex flex-col justify-between group">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight">Network Stability</h4>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">7-Day Operational Uptime Pulse</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                                    <Activity className="text-accent w-6 h-6" />
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 h-16 mb-8 group/ribbon">
                                {(stats as any).history ? (stats as any).history.map((status: string, i: number) => {
                                    const isOperational = status === 'OPERATIONAL';
                                    const isDegraded = status === 'DEGRADED';
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ scaleY: 0 }}
                                            whileInView={{ scaleY: 1 }}
                                            transition={{ delay: i * 0.01, duration: 0.5 }}
                                            className={`flex-1 h-full rounded-sm relative group/block cursor-help
                                            ${isOperational ? 'bg-emerald-500/40 hover:bg-emerald-400' :
                                                    isDegraded ? 'bg-amber-500/60 hover:bg-amber-400' : 'bg-rose-500/80 hover:bg-rose-400'}`}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/block:opacity-100 transition-all z-20 pointer-events-none">
                                                <div className="glass px-3 py-1.5 rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest text-white whitespace-nowrap shadow-2xl">
                                                    T-{(40 - i) * 4}H: <span className={isOperational ? 'text-emerald-400' : 'text-amber-400'}>{status}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                }) : (
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing Telemetry stream...</div>
                                )}
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                <span>7 Days Ago</span>
                                <span className="text-accent">Live Feed</span>
                            </div>
                        </div>

                        {/* Diagnostic Inspector - Cinematic View */}
                        <div className="bg-[#0b0f1a]/50 border border-white/10 rounded-[40px] p-1 shadow-2xl overflow-hidden relative group">
                            <div className="bg-[#05070a] h-full rounded-[39px] p-10 overflow-hidden relative">
                                <DiagnosticInspector />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live System Status Section */}
            <section className="relative w-full py-32 overflow-hidden bg-[#0b0f1a] border-y border-white/5">
                <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
                    <div className="rounded-[40px] bg-white/[0.02] border border-white/5 p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-1000 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-white flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    {lang === 'es' ? 'ESTADO DEL SISTEMA: OPERATIVO' : 'SYSTEM STATUS: OPERATIONAL'}
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md">
                                    {lang === 'es'
                                        ? `Nuestra infraestructura global es monitoreada 24/7. El tiempo de actividad actual es del ${stats.uptime}.`
                                        : `Our global notification infrastructure is monitored 24/7. Current uptime is holding steady at ${stats.uptime}.`}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full md:w-auto">
                                {[
                                    { label: 'Latency', value: (stats as any).clientLatency || stats.latency },
                                    { label: 'Uptime', value: stats.uptime },
                                    { label: 'Protocol', value: stats.protocol },
                                    { label: 'Edge', value: stats.edge }
                                ].map((stat, i) => (
                                    <div key={i} className="text-center md:text-left px-6 border-l border-white/5 first:border-0">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{stat.label}</div>
                                        <div className="text-lg font-black text-white">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative w-full pt-40 pb-60 overflow-hidden bg-black">
                <CinematicBackground
                    videoSrc="/videos/The Hyper-Speed Data Tunnel.mp4"
                    opacity={0.4}
                    blendMode="screen"
                />
                <div className="relative z-10 max-w-4xl w-full mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase italic text-white">
                            {d.faq.title}
                        </h2>
                        <div className="w-20 h-1.5 bg-accent mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="space-y-4">
                        {d.faq.items.map((item: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full text-left p-6 rounded-[24px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all flex justify-between items-center group/btn backdrop-blur-[2px]"
                                >
                                    <span className="font-bold text-white group-hover:text-accent transition-colors pr-8">
                                        {item.q}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-slate-600 group-hover/btn:text-accent transition-all ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-8 pt-2 text-white/70 leading-relaxed text-left font-medium backdrop-blur-[1px]">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main >
    );
}
