"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, ArrowRight, X, Lock, ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { dictionaries, Language } from "@/lib/i18n";

// High-fidelity Brand SVGs
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const GithubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
    </svg>
);

function AuthContent() {
    const [lang, setLang] = useState<Language>('en');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showResend, setShowResend] = useState(false);
    const [totpCode, setTotpCode] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const searchParams = useSearchParams();
    const router = useRouter();

    // Sync language from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('relay-lang') as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        }
    }, []);

    // Handle status parameters
    useEffect(() => {
        const status = searchParams.get('status');
        const errorMsg = searchParams.get('message');

        if (status === 'confirmed') {
            setMessage({ type: 'success', text: "Account confirmed successfully! You can now sign in." });
            // Remove params from URL
            const url = new URL(window.location.href);
            url.searchParams.delete('status');
            url.searchParams.delete('message');
            window.history.replaceState({}, '', url.pathname);
        } else if (status === 'error' && errorMsg) {
            setMessage({ type: 'error', text: errorMsg.replace(/\+/g, ' ') });
            const url = new URL(window.location.href);
            url.searchParams.delete('status');
            url.searchParams.delete('message');
            window.history.replaceState({}, '', url.pathname);
        }
    }, [searchParams]);

    const d = dictionaries[lang].auth;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!email.trim()) {
            newErrors.email = d.validation?.required || "Required field";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = d.validation?.invalidEmail || "Invalid email";
        }
        if (!password) {
            newErrors.password = d.validation?.required || "Required field";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [view, setView] = useState<'login' | 'forgot' | '2fa'>('login');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setMessage(null);
        setShowResend(false);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                let errorText = data.error || "Invalid login credentials";

                if (errorText.toLowerCase().includes('confirm')) {
                    errorText = d.errorUnconfirmed || "Please confirm your email before signing in.";
                    setShowResend(true);
                } else if (errorText.toLowerCase().includes('invalid')) {
                    errorText = d.errorInvalidCredentials || "Invalid login credentials.";
                }

                setMessage({ type: 'error', text: errorText });
                setLoading(false);
            } else if (data.require2FA) {
                setView('2fa');
                setLoading(false);
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error. Please try again." });
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: d.validation?.invalidEmail || "Invalid email" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, lang }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error || "Failed to send reset link" });
            } else {
                setMessage({ type: 'success', text: d.resetLinkSent || "If an account exists, a reset link has been sent." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error." });
        }
        setLoading(false);
    };

    const handle2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!totpCode || totpCode.length !== 6) {
            setErrors({ totp: "Enter a valid 6-digit code" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, totpCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error || "Invalid 2FA code" });
                setLoading(false);
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error." });
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
                setMessage({ type: 'success', text: d.emailResent || "Verification email sent again." });
                setShowResend(false);
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error." });
        }
        setLoading(false);
    };

    const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
        if (error) setMessage({ type: 'error', text: error.message });
    };

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/15 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md glass p-10 rounded-[48px] border border-white/10 shadow-3xl relative z-10"
            >
                <Link
                    href="/"
                    className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </Link>

                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-accent rounded-[20px] flex items-center justify-center shadow-[0_0_40px_var(--accent-glow)] mb-8">
                        <Zap className="text-white w-10 h-10" fill="currentColor" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-3 uppercase tracking-tighter">
                        {view === 'login' ? d.welcome : (d.forgotPasswordTitle || "Reset Password")}
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
                        {view === 'login' ? d.desc : (d.forgotPasswordDesc || "Enter your email to receive a secure recovery link.")}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'login' ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-3 mb-12">
                                <button
                                    onClick={() => handleOAuth('google')}
                                    className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-4 hover:bg-white/10 transition-all active:scale-[0.98] group"
                                >
                                    <GoogleIcon /> {d.google}
                                </button>

                                <button
                                    onClick={() => handleOAuth('github')}
                                    className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-4 hover:bg-white/10 transition-all active:scale-[0.98] group"
                                >
                                    <GithubIcon /> {d.github}
                                </button>
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                                    <span className="bg-[#05070a] px-5 text-slate-500">{d.loginTitle || "Sign In With Password"}</span>
                                </div>
                            </div>

                            <form onSubmit={handleLogin} noValidate className="space-y-4">
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
                                    {loading ? (d.loading || "Processing...") : (d.signIn || "Sign In")} <ArrowRight className="w-5 h-5" />
                                </button>
                                <div className="text-center mt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setView('forgot'); setMessage(null); }}
                                        className="text-xs text-slate-500 hover:text-white transition-colors"
                                    >
                                        {d.forgotPassword || "Forgot password?"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : view === 'forgot' ? (
                        <motion.div
                            key="forgot"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <form onSubmit={handleForgotPassword} noValidate className="space-y-4">
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
                                <button
                                    disabled={loading}
                                    className="w-full py-5 mt-2 rounded-full bg-accent text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_var(--accent-glow)] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (d.loading || "Processing...") : (d.sendResetLink || "Send Reset Link")} <ArrowRight className="w-5 h-5" />
                                </button>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setView('login'); setMessage(null); }}
                                        className="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <ChevronLeft className="w-3 h-3" /> {d.backToLogin}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="2fa"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col items-center mb-8 text-center text-slate-400 text-xs px-4">
                                <p>Your account is protected by two-factor authentication. Please enter the 6-digit code from your authenticator app.</p>
                            </div>
                            <form onSubmit={handle2FA} noValidate className="space-y-4">
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-5 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={totpCode}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            setTotpCode(val);
                                            if (errors.totp) setErrors({ ...errors, totp: '' });
                                        }}
                                        placeholder="000000"
                                        className={`w-full bg-white/5 border ${errors.totp ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-2xl font-black text-white tracking-[0.5em] text-center placeholder:text-slate-800 placeholder:tracking-normal placeholder:text-sm placeholder:font-medium`}
                                    />
                                    {errors.totp && <p className="text-[10px] text-rose-500 font-bold ml-6 mt-1 uppercase tracking-wider">{errors.totp}</p>}
                                </div>
                                <button
                                    disabled={loading}
                                    className="w-full py-5 mt-2 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (d.loading || "Verifying...") : "Verify & Continue"} <ArrowRight className="w-5 h-5" />
                                </button>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setView('login'); setMessage(null); }}
                                        className="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <ChevronLeft className="w-3 h-3" /> Back to Login
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 flex flex-col items-center gap-3"
                        >
                            <p className={`text-center text-xs font-bold tracking-tight px-4 ${message.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {message.text}
                            </p>
                            {showResend && message.type === 'error' && (
                                <button
                                    onClick={handleResendEmail}
                                    disabled={loading}
                                    className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors underline underline-offset-4 disabled:opacity-50"
                                >
                                    {loading ? (d.loading || "Processing...") : (d.resendEmail || "Resend verification email")}
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 text-center text-sm">
                    <p className="text-slate-500">
                        {d.noAccount} <Link href="/register" className="text-white font-bold hover:underline">{d.register}</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white italic">Loading terminal...</div>}>
            <AuthContent />
        </Suspense>
    );
}
