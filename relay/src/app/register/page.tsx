"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Mail, Lock, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { dictionaries, Language } from "@/lib/i18n";

export default function RegisterPage() {
    const [lang, setLang] = useState<Language>('en');
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const savedLang = localStorage.getItem('relay-lang') as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        }
    }, []);

    const d = dictionaries[lang].auth;

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = d.validation?.required || "Required field";
        if (!company.trim()) newErrors.company = d.validation?.required || "Required field";
        if (!email.trim()) {
            newErrors.email = d.validation?.required || "Required field";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = d.validation?.invalidEmail || "Invalid email";
        }
        if (!password) {
            newErrors.password = d.validation?.required || "Required field";
        } else if (password.length < 6) {
            newErrors.password = d.validation?.passwordTooShort || "Min. 6 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [resent, setResent] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, company, email, password, lang }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error || "Failed to register" });
                setLoading(false);
            } else {
                setShowSuccess(true);
                setLoading(false);
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error. Please try again." });
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, lang }),
            });

            if (!res.ok) {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || "Failed to resend" });
            } else {
                setResent(true);
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error." });
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/15 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md glass p-10 rounded-[48px] border border-white/10 shadow-3xl relative z-10"
            >
                <Link
                    href="/"
                    className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </Link>

                <AnimatePresence mode="wait">
                    {!showSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="flex flex-col items-center mb-8 text-center pt-4">
                                <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">{d.registerTitle || "Create Account"}</h1>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
                                    Join Relay and start delivering ultra-low latency alerts worldwide.
                                </p>
                            </div>

                            <form onSubmit={handleRegister} noValidate className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-6 top-5 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: '' }); }}
                                        placeholder={d.name || "Full Name"}
                                        className={`w-full bg-white/5 border ${errors.name ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-sm font-medium text-white`}
                                    />
                                    {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-6 mt-1 uppercase tracking-wider">{errors.name}</p>}
                                </div>

                                <div className="relative group">
                                    <Building2 className="absolute left-6 top-5 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => { setCompany(e.target.value); if (errors.company) setErrors({ ...errors, company: '' }); }}
                                        placeholder={d.company || "Company / Project Name"}
                                        className={`w-full bg-white/5 border ${errors.company ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-sm font-medium text-white`}
                                    />
                                    {errors.company && <p className="text-[10px] text-rose-500 font-bold ml-6 mt-1 uppercase tracking-wider">{errors.company}</p>}
                                </div>

                                <div className="relative group">
                                    <Mail className="absolute left-6 top-5 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
                                        placeholder={d.email || "Email Address"}
                                        className={`w-full bg-white/5 border ${errors.email ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-sm font-medium text-white`}
                                    />
                                    {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-6 mt-1 uppercase tracking-wider">{errors.email}</p>}
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-6 top-5 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                                        placeholder={d.password || "Secure Password"}
                                        className={`w-full bg-white/5 border ${errors.password ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-sm font-medium text-white`}
                                    />
                                    {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-6 mt-1 uppercase tracking-wider">{errors.password}</p>}
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full py-5 mt-2 rounded-full bg-accent text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_var(--accent-glow)] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (d.loading || "Processing...") : (d.signUp || "Create Account")} <ArrowRight className="w-5 h-5" />
                                </button>

                                {message && message.type === 'error' && (
                                    <p className="mt-4 text-center text-xs font-bold text-rose-400">
                                        {message.text}
                                    </p>
                                )}

                                <div className="mt-8 text-center text-sm">
                                    <p className="text-slate-500">
                                        {d.alreadyHaveAccount || "Already have an account?"} <Link href="/auth" className="text-white font-bold hover:underline">{d.signIn || "Sign In"}</Link>
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center py-12"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30">
                                <Mail className="text-emerald-400 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase mb-4">{d.checkEmail || "Check your inbox"}</h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                {d.verificationSent || "We've sent a verification link to your email. Please click it to activate your account."}
                            </p>

                            {!resent ? (
                                <button
                                    onClick={handleResendEmail}
                                    disabled={loading}
                                    className="text-xs font-bold text-accent uppercase tracking-widest hover:text-white transition-colors mb-10 disabled:opacity-50"
                                >
                                    {loading ? (d.loading || "Processing...") : (d.resendEmail || "Resend verification email")}
                                </button>
                            ) : (
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-10">
                                    {d.emailResent || "Verification email sent again."}
                                </p>
                            )}

                            <Link
                                href="/auth"
                                className="w-full py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-center"
                            >
                                {d.backToLogin || "Back to Login"}
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}
