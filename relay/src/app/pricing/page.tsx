"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, ChevronDown, ArrowLeft, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { dictionaries, Language } from "@/lib/i18n";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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

export default function PricingPage() {
    const [lang, setLang] = useState<Language>('en');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);
    const [isArgentina, setIsArgentina] = useState(false);

    // User Session State
    const [userPlan, setUserPlan] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // Mercado Pago Loader
    const [isMPLoading, setIsMPLoading] = useState(false);
    const [stats, setStats] = useState({
        uptime: "99.98%",
        latency: "42ms",
        protocol: "TLS 1.3",
        edge: "Active"
    });

    // Load saved settings
    useEffect(() => {
        const savedLang = localStorage.getItem('relay-lang') as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        }

        // Basic Argentina detection (simulated or via browser)
        if (navigator.language.includes('es-AR') || Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Buenos_Aires')) {
            setIsArgentina(true);
        }

        // Fetch user session to prevent downgrades and prefill email
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.user) {
                    setUser(data.user);
                    setUserPlan(data.user.plan?.toLowerCase() || null);
                    setUserEmail(data.user.email || null);
                }
            })
            .catch(() => { });

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/system/stats');
                const data = await res.json();
                if (data.uptime) setStats(data);
            } catch (err) { }
        };
        fetchStats();
    }, []);

    // Save language whenever it changes
    useEffect(() => {
        localStorage.setItem('relay-lang', lang);
    }, [lang]);

    const d = dictionaries[lang];
    const currentLang = languages.find(l => l.code === lang);

    const CHECKOUT_LINKS = {
        starter: {
            monthly: process.env.NEXT_PUBLIC_LS_STARTER_MONTHLY || "https://relaydigital.lemonsqueezy.com/checkout/buy/7e4e23f9-ccc5-4dbc-be74-a4f2be21894e?enabled=1491416",
            yearly: process.env.NEXT_PUBLIC_LS_STARTER_YEARLY || "https://relaydigital.lemonsqueezy.com/checkout/buy/cd5be614-670f-4125-af13-7d4b2d12cc44?enabled=1491351"
        },
        pro: {
            monthly: process.env.NEXT_PUBLIC_LS_PRO_MONTHLY || "https://relaydigital.lemonsqueezy.com/checkout/buy/7c94943f-c154-4bd3-9b8d-98f84bfcfcef?enabled=1491474",
            yearly: process.env.NEXT_PUBLIC_LS_PRO_YEARLY || "https://relaydigital.lemonsqueezy.com/checkout/buy/b0105b3a-2fc8-4a3c-9da0-2ee0c200137c?enabled=1491454"
        }
    };

    const handlePlanSelect = (planKey: 'starter' | 'pro') => {
        if (!userEmail) {
            alert(d.pricing.alerts.mpAuth || "Please login to purchase a subscription.");
            return;
        }

        // Prevent Downgrade or Redundant Purchases
        if (userPlan) {
            const planValue: Record<string, number> = {
                free: 0,
                hobby: 0,
                starter: 1,
                pro: 2,
                enterprise: 3
            };

            const targetValue = planValue[planKey] || 0;
            const userValue = planValue[userPlan] || 0;

            if (userValue > targetValue) {
                alert(d.pricing.alerts.downgrade.replace('{userPlan}', userPlan.toUpperCase()).replace('{targetPlan}', planKey.toUpperCase()));
                return;
            } else if (userValue === targetValue && targetValue > 0) {
                alert(d.pricing.alerts.alreadyActive.replace('{targetPlan}', planKey.toUpperCase()));
                return;
            }
        }

        let url = CHECKOUT_LINKS[planKey][isAnnual ? 'yearly' : 'monthly'];

        // Auto-fill the email in the Lemon Squeezy checkout if the user is logged in
        if (userEmail) {
            url += `&checkout[email]=${encodeURIComponent(userEmail)}`;
        }


        window.location.href = url;
    };

    // Generic PayPal subscription creation handler
    const handlePayPalCreateSubscription = (planKey: 'starter' | 'pro', actions: any) => {
        if (!userEmail) {
            alert(d.pricing.alerts.mpAuth || "Please login to purchase a subscription.");
            return null;
        }

        // Validation for Downgrades
        if (userPlan) {
            const planValue: Record<string, number> = { free: 0, hobby: 0, starter: 1, pro: 2, enterprise: 3 };
            const targetValue = planValue[planKey] || 0;
            const userValue = planValue[userPlan] || 0;

            if (userValue > targetValue) {
                alert(d.pricing.alerts.downgrade.replace('{userPlan}', userPlan.toUpperCase()).replace('{targetPlan}', planKey.toUpperCase()));
                return null;
            } else if (userValue === targetValue && targetValue > 0) {
                alert(d.pricing.alerts.alreadyActive.replace('{targetPlan}', planKey.toUpperCase()));
                return null;
            }
        }

        const PAYPAL_PLANS = {
            starter: {
                monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_STARTER_MONTHLY || '',
                yearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_STARTER_YEARLY || ''
            },
            pro: {
                monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY || '',
                yearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY || ''
            }
        };

        const planId = PAYPAL_PLANS[planKey][isAnnual ? 'yearly' : 'monthly'];
        if (!planId) {
            alert("PayPal subscription plan ID not configured for this tier yet.");
            return null;
        }

        return actions.subscription.create({
            plan_id: planId,
            custom_id: `${userEmail || 'guest@relay.app'}|${planKey}`
        });
    };

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleMPCheckout = async (planKey: 'starter' | 'pro') => {
        if (!userEmail) {
            alert(d.pricing.alerts.mpAuth || "Please login to purchase a subscription.");
            return;
        }

        // Validation for Downgrades
        if (userPlan) {
            const planValue: Record<string, number> = { free: 0, hobby: 0, starter: 1, pro: 2, enterprise: 3 };
            const targetValue = planValue[planKey] || 0;
            const userValue = planValue[userPlan] || 0;

            if (userValue > targetValue) {
                alert(d.pricing.alerts.downgrade.replace('{userPlan}', userPlan.toUpperCase()).replace('{targetPlan}', planKey.toUpperCase()));
                return;
            } else if (userValue === targetValue && targetValue > 0) {
                alert(d.pricing.alerts.alreadyActive.replace('{targetPlan}', planKey.toUpperCase()));
                return;
            }
        }

        setIsMPLoading(true);
        try {
            const res = await fetch('/api/checkout/mercadopago', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planKey })
            });
            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                if (data.error === 'AUTH_REQUIRED') {
                    alert(d.pricing.alerts.mpAuth);
                } else {
                    alert(d.pricing.alerts.mpError);
                }
                setIsMPLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert(d.pricing.alerts.critical);
            setIsMPLoading(false);
        }
    };

    const handleCryptoCheckout = async (planKey: 'starter' | 'pro') => {
        if (!userEmail) {
            alert(d.pricing.alerts.mpAuth || "Please login to purchase a subscription.");
            return;
        }

        // Validation for Downgrades
        if (userPlan) {
            const planValue: Record<string, number> = { free: 0, hobby: 0, starter: 1, pro: 2, enterprise: 3 };
            const targetValue = planValue[planKey] || 0;
            const userValue = planValue[userPlan] || 0;

            if (userValue > targetValue) {
                alert(d.pricing.alerts.downgrade.replace('{userPlan}', userPlan.toUpperCase()).replace('{targetPlan}', planKey.toUpperCase()));
                return;
            } else if (userValue === targetValue && targetValue > 0) {
                alert(d.pricing.alerts.alreadyActive.replace('{targetPlan}', planKey.toUpperCase()));
                return;
            }
        }

        setIsMPLoading(true);
        try {
            const res = await fetch('/api/checkout/nowpayments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planKey, isAnnual })
            });
            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                if (data.error === 'AUTH_REQUIRED') {
                    alert(d.pricing.alerts.mpAuth);
                } else {
                    alert(d.pricing.alerts.binanceError || "Error connecting to Crypto provider.");
                }
                setIsMPLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert(d.pricing.alerts.critical);
            setIsMPLoading(false);
        }
    };

    return (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", vault: true, intent: "subscription" }}>
            <main className="min-h-screen flex flex-col items-center py-20 px-6 relative overflow-hidden bg-[#020408]">
                {/* High-Impact Mesh Gradient */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-accent/20 blur-[180px] rounded-full"
                    />

                </div>

                {/* Navbar (Implementation of floating nav) */}
                <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-3 flex justify-between items-center glass border border-white/10 rounded-full w-[calc(100%-3rem)] max-w-5xl mx-auto shadow-2xl backdrop-blur-2xl">
                    <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        <span className="font-black text-xl tracking-tighter text-white">RELAY</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all font-black text-[10px] uppercase tracking-widest"
                            >
                                <img src={`https://flagcdn.com/w40/${currentLang?.flag}.png`} alt={currentLang?.name} className="w-4 h-auto rounded-sm" />
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsLangOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-3 w-14 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1.5 z-50 flex flex-col gap-1.5"
                                        >
                                            {languages.map((l) => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                                                    className={`w-full aspect-square flex items-center justify-center rounded-xl transition-all ${lang === l.code ? 'bg-accent/20 scale-105' : 'hover:bg-white/10 hover:scale-110'}`}
                                                >
                                                    <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt={l.name} className="w-6 h-auto rounded-sm" />
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            href={user ? "/dashboard" : "/auth"}
                            className="flex items-center gap-3 p-1 pr-4 rounded-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all active:scale-95 group relative"
                        >
                            <div className="p-1.5 bg-white/5 rounded-full">
                                <User className={`w-3.5 h-3.5 ${user ? 'text-accent' : 'text-slate-400'} group-hover:text-white transition-colors`} />
                            </div>
                            {user && (
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-white tracking-tight leading-none mb-0.5">{user.name?.split(' ')[0] || 'User'}</span>
                                    <span className="text-[7px] font-black text-accent tracking-[0.1em] uppercase leading-none">{user.plan || 'FREE'}</span>
                                </div>
                            )}
                        </Link>
                    </div>
                </nav>

                {/* Header */}
                <div className="max-w-3xl text-center mt-32 mb-20 z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white"
                    >
                        {d.pricing.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-xl leading-relaxed font-medium"
                    >
                        {d.pricing.desc}
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-6 mt-12 bg-white/5 p-2 rounded-full border border-white/10 w-fit mx-auto"
                    >
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!isAnnual ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            {d.pricing.billing.monthly}
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            {d.pricing.billing.yearly}
                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-[9px] font-black rounded-full border border-accent/20 animate-pulse">
                                {d.pricing.billing.save}
                            </span>
                        </button>
                    </motion.div>
                </div>

                {/* Pricing Grid */}
                <div className="max-w-7xl w-full z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pb-32 px-4">
                    {/* Hobby Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-10 rounded-[48px] glass border border-white/5 flex flex-col hover:bg-white/[0.02] transition-all"
                    >
                        <div className="mb-10">
                            <h3 className="text-2xl font-black mb-3 uppercase tracking-tight text-white">{d.pricing.hobby.name}</h3>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed">{d.pricing.hobby.desc}</p>
                        </div>
                        <div className="text-6xl font-black mb-12 text-white tracking-tighter">
                            {isAnnual ? d.pricing.hobby.yearlyPrice : d.pricing.hobby.price}
                            <span className="text-lg text-slate-700 font-bold ml-1">/mo</span>
                        </div>

                        <div className="w-full py-4 rounded-3xl bg-white/5 border border-white/10 text-slate-400 font-black text-center text-[10px] uppercase tracking-[0.2em] mb-10 flex items-center justify-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-accent" fill="currentColor" />
                            {lang === 'es' ? 'GRATIS POR SIEMPRE' : 'FOREVER FREE'}
                        </div>

                        <ul className="space-y-5">
                            {d.pricing.hobby.features.map((f: string, i: number) => (
                                <li key={i} className="flex gap-4 text-sm font-medium text-slate-400 group">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Check className="text-emerald-400 w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Starter Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-10 rounded-[48px] glass border border-white/10 flex flex-col hover:bg-white/[0.04] transition-all shadow-2xl"
                    >
                        <div className="mb-10">
                            <h3 className="text-2xl font-black mb-3 uppercase tracking-tight text-white">{d.pricing.starter.name}</h3>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed">{d.pricing.starter.desc}</p>
                        </div>
                        <div className="text-6xl font-black mb-12 text-white tracking-tighter">
                            {isAnnual ? d.pricing.starter.yearlyPrice : d.pricing.starter.price}
                            <span className="text-lg text-slate-700 font-bold ml-1">/mo</span>
                        </div>

                        <div className="space-y-3 mb-12">
                            <div className="h-[44px] w-full rounded-full overflow-hidden hover:shadow-[0_0_30px_rgba(255,196,57,0.3)] transition-all">
                                <PayPalButtons
                                    style={{ shape: "pill", color: "gold", label: "subscribe", height: 44 }}
                                    createSubscription={(data, actions) => handlePayPalCreateSubscription('starter', actions)}
                                    onApprove={async () => { window.location.href = '/dashboard?payment=success'; }}
                                />
                            </div>

                            {isArgentina && (
                                <button
                                    onClick={() => handleMPCheckout('starter')}
                                    disabled={isMPLoading}
                                    className="w-full h-[44px] rounded-full bg-[#009EE3] hover:bg-[#0089C7] text-white font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,158,227,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isMPLoading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : d.pricing.ctaMP || "Mercado Pago"}
                                </button>
                            )}

                            <button
                                onClick={() => handleCryptoCheckout('starter')}
                                className="w-full h-[44px] rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                ⚡ CRYPTO (USDT)
                            </button>
                        </div>

                        <ul className="space-y-5">
                            {d.pricing.starter.features.map((f: string, i: number) => (
                                <li key={i} className="flex gap-4 text-sm font-medium text-slate-400 group">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Check className="text-emerald-400 w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Pro Plan (Highlighted) */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-b from-accent to-purple-600 rounded-[52px] blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative p-10 rounded-[48px] bg-[#0b0f1a] border border-white/20 flex flex-col h-full shadow-2xl"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl z-20">
                                Most Popular
                            </div>

                            <div className="mb-10">
                                <h3 className="text-2xl font-black mb-3 uppercase tracking-tight text-white">{d.pricing.pro.name}</h3>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed">{d.pricing.pro.desc}</p>
                            </div>
                            <div className="text-6xl font-black mb-12 text-white tracking-tighter">
                                {isAnnual ? d.pricing.pro.yearlyPrice : d.pricing.pro.price}
                                <span className="text-lg text-slate-700 font-bold ml-1">/mo</span>
                            </div>

                            <div className="space-y-3 mb-12">
                                <div className="h-[48px] w-full rounded-full overflow-hidden hover:shadow-[0_0_30px_rgba(255,196,57,0.4)] transition-all">
                                    <PayPalButtons
                                        style={{ shape: "pill", color: "gold", label: "subscribe", height: 48 }}
                                        createSubscription={(data, actions) => handlePayPalCreateSubscription('pro', actions)}
                                        onApprove={async () => { window.location.href = '/dashboard?payment=success'; }}
                                    />
                                </div>

                                {isArgentina && (
                                    <button
                                        onClick={() => handleMPCheckout('pro')}
                                        disabled={isMPLoading}
                                        className="w-full h-[48px] rounded-full bg-[#009EE3] hover:bg-[#0089C7] text-white font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,158,227,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isMPLoading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : d.pricing.ctaMP || "Mercado Pago"}
                                    </button>
                                )}

                                <button
                                    onClick={() => handleCryptoCheckout('pro')}
                                    className="w-full h-[48px] rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    ⚡ CRYPTO (USDT)
                                </button>
                            </div>

                            <ul className="space-y-5">
                                {d.pricing.pro.features.map((f: string, i: number) => (
                                    <li key={i} className="flex gap-4 text-sm font-black text-white group">
                                        <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                                            <Check className="text-accent w-3.5 h-3.5" strokeWidth={4} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Enterprise Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-10 rounded-[48px] glass border border-white/5 flex flex-col hover:bg-white/[0.02] transition-all"
                    >
                        <div className="mb-10">
                            <h3 className="text-2xl font-black mb-3 uppercase tracking-tight text-white">{d.pricing.enterprise.name}</h3>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed">{d.pricing.enterprise.desc}</p>
                        </div>
                        <div className="text-5xl font-black mb-12 text-white tracking-tighter">
                            {isAnnual ? d.pricing.enterprise.yearlyPrice : d.pricing.enterprise.price}
                        </div>

                        <a
                            href="mailto:aetherdigital.contact@gmail.com?subject=Relay Enterprise Inquiry"
                            className="w-full h-[52px] rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 hover:shadow-2xl transition-all flex items-center justify-center mb-12"
                        >
                            {d.pricing.contact}
                        </a>

                        <ul className="space-y-5">
                            {d.pricing.enterprise.features.map((f: string, i: number) => (
                                <li key={i} className="flex gap-4 text-sm font-medium text-slate-400 group">
                                    <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                        <Check className="text-amber-400 w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <Footer />
            </main>
        </PayPalScriptProvider>
    );
}
