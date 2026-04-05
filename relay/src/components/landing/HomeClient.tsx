"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Zap, Shield, Code2, ArrowRight, Terminal, ChevronDown, Sparkles, User, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/layout/Footer";
import { dictionaries, Language } from "@/lib/i18n";

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

export default function HomeClient({ initialUser, initialLang }: HomeClientProps) {
    const [lang, setLang] = useState<Language>(initialLang);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(initialUser);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

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
        checkUser();
    }, []);

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

    return (
        <main ref={containerRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden bg-[#05070a]">
            {/* Dynamic Background Elements */}
            <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[150px] rounded-full"></div>
                <div className="absolute top-[20%] right-[10%] w-px h-[60vh] bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
            </motion.div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center glass border-b border-white/5 rounded-b-3xl max-w-7xl mx-auto shadow-2xl">
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)] animate-pulse">
                        <Zap className="text-white w-6 h-6" fill="currentColor" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tighter">RELAY</span>
                </Link>

                <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 items-center">
                    <a href="#features" className="hover:text-white transition-all hover:tracking-[0.3em]">{d.nav.features}</a>
                    <Link href="/docs" className="hover:text-white transition-all hover:tracking-[0.3em]">{d.nav.docs}</Link>
                    <Link href="/pricing" className="hover:text-white transition-all hover:tracking-[0.3em] flex items-center gap-2">
                        {d.nav.pricing} <Sparkles className="w-3 h-3 text-accent" />
                    </Link>

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
                            <div className="flex flex-col">
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
                        className="fixed top-[85px] left-0 right-0 z-40 px-6 md:hidden"
                    >
                        <div className="glass rounded-[30px] p-8 border border-white/5 shadow-2xl flex flex-col gap-6 text-center">
                            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black uppercase tracking-widest text-sm hover:text-accent transition-colors">{d.nav.features}</a>
                            <Link href="/docs" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black uppercase tracking-widest text-sm hover:text-accent transition-colors">{d.nav.docs}</Link>
                            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black uppercase tracking-widest text-sm hover:text-accent transition-colors flex items-center justify-center gap-2">
                                {d.nav.pricing} <Sparkles className="w-4 h-4 text-accent" />
                            </Link>
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

            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="min-h-screen flex flex-col items-center justify-center max-w-5xl text-center z-10 pt-20"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black tracking-[0.2em] mb-10 uppercase">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-accent opacity-40"></span>
                        <span className="relative rounded-full h-3 w-3 bg-accent"></span>
                    </span>
                    {d.hero.phase}
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-black mb-10 leading-[1.1] tracking-tighter"
                >
                    {d.hero.title1}<br /><span className="text-gradient drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]">{d.hero.highlight}</span><br />{d.hero.title2}
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl text-slate-500 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                    {d.hero.desc}
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:row gap-6 justify-center items-center">
                    {!user ? (
                        <Link href="/auth" className="px-10 py-5 rounded-2xl bg-accent text-white font-black text-xl flex items-center gap-3 group hover:shadow-[0_0_50px_var(--accent-glow)] transition-all active:scale-[0.98]">
                            {d.hero.start} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    ) : (
                        <Link href="/dashboard" className="px-10 py-5 rounded-2xl bg-accent text-white font-black text-xl flex items-center gap-3 group hover:shadow-[0_0_50px_var(--accent-glow)] transition-all active:scale-[0.98]">
                            {d.hero.dashboardLink || "Dashboard"} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    )}
                    <a href="#api" className="text-slate-500 font-bold hover:text-white transition-colors flex items-center gap-2 group">
                        <Terminal className="w-5 h-5 text-accent" /> {d.hero.viewDocs}
                    </a>
                </motion.div>
            </motion.div>

            {/* Feature Grid - Re-imagined for Luxury */}
            <div id="features" className="mt-20 max-w-7xl w-full z-10 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {d.features.items.map((feature: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.15, duration: 0.8 }}
                            className="p-12 rounded-[48px] glass group relative cursor-pointer hover:bg-white/[0.03] transition-all"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-accent/20 transition-colors">
                                <Sparkles className="w-12 h-12" />
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-accent mb-10 group-hover:scale-110 group-hover:bg-accent/10 transition-all shadow-inner">
                                {i === 0 ? <Zap className="w-8 h-8" /> : i === 1 ? <Shield className="w-8 h-8" /> : <Code2 className="w-8 h-8" />}
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 text-lg leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* API Preview - Dark, Cinematic */}
            <div id="api" className="mt-60 max-w-5xl w-full z-10 px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-4xl font-black mb-6 tracking-tighter"
                >
                    {d.api.title}
                </motion.h2>
                <p className="text-slate-500 text-lg mb-16">{d.api.desc}</p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative group h-fit md:h-[400px]"
                >
                    <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="bg-[#010409] rounded-[48px] p-5 md:p-10 font-mono text-sm md:text-lg overflow-hidden border border-white/5 shadow-2xl relative z-20 h-full flex flex-col justify-center">
                        <div className="flex gap-4 mb-6 md:mb-10 border-b border-white/5 pb-6">
                            <span className="text-accent font-black">POST</span>
                            <span className="text-slate-600 truncate">relay.aether.digital/api/relay</span>
                        </div>
                        <pre className="text-slate-400 leading-normal md:leading-loose overflow-x-auto scrollbar-hide py-2">
                            {`{
  "apiKey": "RELAY_PK_X892V...",
  "platform": "telegram",
  "target": "@my_channel",
  
  // Dynamic Template Integration
  "template_id": "usr_tmp_9x8z",
  "variables": {
    "revenue": "549.00",
    "currency": "USD",
    "plan": "Enterprise"
  },

  // Brand Whitelabeling (Enterprise Only)
  "botName": "Sales Shield",
  "botAvatar": "https://cdn.example.com/logo.png"
}`}
                        </pre>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
