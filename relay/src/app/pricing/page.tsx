"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, ChevronDown, ArrowLeft } from "lucide-react";
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

    // Mercado Pago Loader
    const [isMPLoading, setIsMPLoading] = useState(false);

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
                    setUserPlan(data.user.plan?.toLowerCase() || null);
                    setUserEmail(data.user.email || null);
                }
            })
            .catch(() => { });
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

    const handleMPCheckout = async (planKey: 'starter' | 'pro') => {
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
            <main className="min-h-screen flex flex-col items-center py-20 px-6 relative overflow-hidden bg-[#05070a]">
                {/* Background Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/15 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full"></div>

                {/* Navbar (Simplified for Pricing) */}
                <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center glass border-b-0 rounded-b-2xl max-w-7xl mx-auto left-0 right-0 mt-4 px-8">
                    <Link href="/" className="flex items-center gap-2 group translate-x-0 hover:translate-x-[-4px] transition-transform">
                        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        <span className="font-bold text-lg tracking-tight">RELAY</span>
                    </Link>

                    {/* Language Selector Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                            {currentLang?.name}
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
                                        className="absolute top-full right-0 mt-2 w-14 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1.5 z-50 flex flex-col gap-1"
                                    >
                                        {languages.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => {
                                                    setLang(l.code);
                                                    setIsLangOpen(false);
                                                }}
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
                </nav>

                {/* Header */}
                <div className="max-w-3xl text-center mt-20 mb-20 z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
                    >
                        {d.pricing.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg leading-relaxed"
                    >
                        {d.pricing.desc}
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4 mt-8"
                    >
                        <span className={`text-sm tracking-widest ${!isAnnual ? 'text-white font-bold' : 'text-slate-500'}`}>
                            {d.pricing.billing.monthly.toUpperCase()}
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-14 h-7 bg-slate-900 border border-slate-800 rounded-full p-1 relative transition-all hover:border-slate-700"
                        >
                            <motion.div
                                animate={{ x: isAnnual ? 28 : 0 }}
                                className="w-5 h-5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </button>
                        <span className={`text-sm tracking-widest flex items-center gap-2 ${isAnnual ? 'text-white font-bold' : 'text-slate-500'}`}>
                            {d.pricing.billing.yearly.toUpperCase()}
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-black rounded-full border border-green-500/20">
                                {d.pricing.billing.save}
                            </span>
                        </span>
                    </motion.div>
                </div>

                {/* Regional Banner Removed for integrated UI */}

                {/* Pricing Grid */}
                <div className="max-w-7xl w-full z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start pb-32">
                    {/* Hobby Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-[40px] glass border border-white/5 flex flex-col hover:border-white/10 transition-all h-full"
                    >
                        <div className="mb-10">
                            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">{d.pricing.hobby.name}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">{d.pricing.hobby.desc}</p>
                        </div>
                        <div className="text-5xl font-black mb-12 text-white">
                            {isAnnual ? d.pricing.hobby.yearlyPrice : d.pricing.hobby.price}
                            <span className="text-lg text-slate-600 font-bold ml-1">/mo</span>
                        </div>

                        <div className="w-full py-4 rounded-3xl bg-white/5 border border-white/10 text-slate-500 font-bold text-center text-[10px] uppercase tracking-widest mb-10 flex items-center justify-center gap-2">
                            <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                            {lang === 'es' ? 'Incluido por Defecto' : 'Included by Default'}
                        </div>

                        <ul className="space-y-4 mt-auto">
                            {d.pricing.hobby.features.map((f: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm font-medium text-slate-400 group">
                                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                                        <Check className="text-accent w-3 h-3" strokeWidth={3} />
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
                        className="p-8 rounded-[40px] glass border border-white/5 flex flex-col hover:border-white/10 transition-all h-full"
                    >
                        <div className="mb-10">
                            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">{d.pricing.starter.name}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">{d.pricing.starter.desc}</p>
                        </div>
                        <div className="text-5xl font-black mb-12 text-white">
                            {isAnnual ? d.pricing.starter.yearlyPrice : d.pricing.starter.price}
                            <span className="text-lg text-slate-600 font-bold ml-1">/mo</span>
                        </div>

                        <div className="flex flex-col gap-3 w-full mb-10 w-full relative z-20">
                            <button
                                onClick={() => handlePlanSelect('starter')}
                                className="w-full py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-black text-center text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                {d.pricing.ctaLemon || d.pricing.cta}
                            </button>

                            <div className="h-[40px] w-full rounded-full overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                                <PayPalButtons
                                    style={{ shape: "pill", color: "gold", label: "subscribe", height: 40 }}
                                    createSubscription={(data, actions) => handlePayPalCreateSubscription('starter', actions)}
                                    onApprove={async () => { window.location.href = '/dashboard?payment=success'; }}
                                />
                            </div>

                            {isArgentina && (
                                <button
                                    onClick={() => handleMPCheckout('starter')}
                                    disabled={isMPLoading}
                                    className="w-full py-3.5 mt-1 rounded-full bg-[#009EE3] hover:bg-[#0089C7] text-white font-black text-center text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,158,227,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isMPLoading ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : d.pricing.ctaMP || "Mercado Pago"}
                                </button>
                            )}

                            <button
                                onClick={() => handleCryptoCheckout('starter')}
                                className="w-full py-3.5 mt-1 rounded-full bg-[#F3BA2F] hover:bg-[#E2AD27] text-black font-black text-center text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(243,186,47,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {d.pricing.ctaCrypto || "⚡ Crypto (USDT)"}
                            </button>
                        </div>

                        <ul className="space-y-4 mt-auto">
                            {d.pricing.starter.features.map((f: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm font-medium text-slate-400 group">
                                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                                        <Check className="text-accent w-3 h-3" strokeWidth={3} />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Pro Plan (Highlighted) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-0.5 rounded-[42px] bg-gradient-to-b from-accent/40 to-transparent relative shadow-[0_0_80px_rgba(59,130,246,0.15)] h-full"
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap z-20">
                            Most Popular
                        </div>
                        <div className="bg-[#05070a] p-8 rounded-[40px] h-full flex flex-col">
                            <div className="mb-10">
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">{d.pricing.pro.name}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{d.pricing.pro.desc}</p>
                            </div>
                            <div className="text-5xl font-black mb-12 text-white">
                                {isAnnual ? d.pricing.pro.yearlyPrice : d.pricing.pro.price}
                                <span className="text-lg text-slate-600 font-bold ml-1">/mo</span>
                            </div>

                            <div className="flex flex-col gap-3 w-full mb-10 w-full relative z-20">
                                <button
                                    onClick={() => handlePlanSelect('pro')}
                                    className="w-full py-4 rounded-full bg-accent text-white font-black text-center text-[10px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all active:scale-[0.98]"
                                >
                                    {d.pricing.ctaLemon || d.pricing.cta}
                                </button>

                                <div className="h-[40px] w-full rounded-full overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                                    <PayPalButtons
                                        style={{ shape: "pill", color: "gold", label: "subscribe", height: 40 }}
                                        createSubscription={(data, actions) => handlePayPalCreateSubscription('pro', actions)}
                                        onApprove={async () => { window.location.href = '/dashboard?payment=success'; }}
                                    />
                                </div>

                                {isArgentina && (
                                    <button
                                        onClick={() => handleMPCheckout('pro')}
                                        disabled={isMPLoading}
                                        className="w-full py-3.5 mt-1 rounded-full bg-[#009EE3] hover:bg-[#0089C7] text-white font-black text-center text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,158,227,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isMPLoading ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : d.pricing.ctaMP || "Mercado Pago"}
                                    </button>
                                )}

                                <button
                                    onClick={() => handleCryptoCheckout('pro')}
                                    className="w-full py-3.5 mt-1 rounded-full bg-[#F3BA2F] hover:bg-[#E2AD27] text-black font-black text-center text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(243,186,47,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {d.pricing.ctaCrypto || "⚡ Crypto (USDT)"}
                                </button>
                            </div>

                            <ul className="space-y-4 mt-auto">
                                {d.pricing.pro.features.map((f: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm font-bold text-white group">
                                        <div className="w-5 h-5 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
                                            <Check className="text-accent w-3 h-3" strokeWidth={4} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Enterprise Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 rounded-[40px] glass border border-white/5 flex flex-col hover:border-white/10 transition-all h-full relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 blur-[50px] rounded-full opacity-50"></div>
                        <div className="mb-10 relative z-10">
                            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">{d.pricing.enterprise.name}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">{d.pricing.enterprise.desc}</p>
                        </div>
                        <div className={`font-black mb-12 text-white relative z-10 uppercase transition-all ${(isAnnual ? d.pricing.enterprise.yearlyPrice : d.pricing.enterprise.price).length > 10 ? 'text-2xl' : 'text-5xl'
                            }`}>
                            {isAnnual ? d.pricing.enterprise.yearlyPrice : d.pricing.enterprise.price}
                            {!(isAnnual ? d.pricing.enterprise.yearlyPrice : d.pricing.enterprise.price).toLowerCase().includes('custom') &&
                                !(isAnnual ? d.pricing.enterprise.yearlyPrice : d.pricing.enterprise.price).toLowerCase().includes('person') && (
                                    <span className="text-lg text-slate-600 font-bold ml-1">/mo</span>
                                )}
                        </div>

                        <a
                            href="mailto:aetherdigital.contact@gmail.com?subject=Relay Enterprise Inquiry"
                            onClick={() => {
                                navigator.clipboard.writeText('aetherdigital.contact@gmail.com');
                                alert(d.pricing.alerts.contactCopied || "Email copied to clipboard!");
                            }}
                            className="w-full py-4 rounded-full bg-white text-black font-black text-center text-[10px] uppercase tracking-widest hover:bg-slate-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all mb-10 relative z-10 active:scale-[0.98] block"
                        >
                            {d.pricing.contact}
                        </a>

                        <ul className="space-y-4 mt-auto relative z-10 text-left">
                            {d.pricing.enterprise.features.map((f: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm font-medium text-slate-400 group">
                                    <div className="w-5 h-5 rounded-md bg-amber-400/10 flex items-center justify-center shrink-0">
                                        <Check className="text-amber-400 w-3 h-3" strokeWidth={3} />
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
