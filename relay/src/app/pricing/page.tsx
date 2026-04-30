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
                <div className="max-w-7xl w-full z-10 flex flex-col items-center justify-center pb-32 px-4 text-center">
                    <div className="p-12 rounded-[48px] glass border border-white/10 bg-white/[0.02] max-w-2xl">
                        <Zap className="w-12 h-12 text-accent mx-auto mb-6 animate-pulse" fill="currentColor" />
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                            {lang === 'es' ? 'Planes próximamente' : 'Plans Coming Soon'}
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                            {lang === 'es'
                                ? 'Estamos finalizando los detalles de nuestra infraestructura de pagos para ofrecerte la mejor experiencia. Vuelve pronto.'
                                : 'We are finalizing the details of our payment infrastructure to offer you the best experience. Check back soon.'}
                        </p>
                        <Link href="/" className="px-8 py-3 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                            {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
                        </Link>
                    </div>

                    {/* Original Pricing Grid Commented Out
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch w-full mt-20 opacity-20 pointer-events-none grayscale">
                        ... (Pricing cards left intact but hidden)
                    </div>
                    */}
                </div>


                <Footer />
            </main>
        </PayPalScriptProvider>
    );
}
