"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Lock, ArrowRight, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { dictionaries, Language } from "@/lib/i18n";

function ResetContent() {
    const [lang, setLang] = useState<Language>('en');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    useEffect(() => {
        const savedLang = localStorage.getItem('relay-lang') as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        }
    }, []);

    const d = dictionaries[lang].auth;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!password) {
            newErrors.password = d.validation?.required || "Required field";
        } else if (password.length < 8) {
            newErrors.password = d.validation?.passwordTooShort || "Min 8 characters";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = d.confirmPasswordError || "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !token) return;

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error || "Failed to reset password" });
                setLoading(false);
            } else {
                setMessage({ type: 'success', text: d.passwordUpdated || "Password updated!" });
                setTimeout(() => {
                    router.push('/auth');
                }, 3000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error. Please try again." });
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6 text-white">
                <div className="glass p-10 rounded-[32px] text-center border border-white/10 max-w-sm">
                    <X className="w-12 h-12 text-rose-500 mx-auto mb-6" />
                    <h1 className="text-xl font-bold mb-4">{d.invalidToken || "Invalid Token"}</h1>
                    <Link href="/auth" className="text-accent underline font-semibold">{d.backToLogin}</Link>
                </div>
            </main>
        );
    }

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
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-accent rounded-[20px] flex items-center justify-center shadow-[0_0_40px_var(--accent-glow)] mb-8">
                        <Lock className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-3 uppercase tracking-tighter">
                        {d.resetTitle || "New Password"}
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
                        {d.resetDesc || "Secure your protocol with a new authentication credential."}
                    </p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div className="relative group">
                        <Lock className="absolute left-6 top-5 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                            placeholder={d.password || "New Password"}
                            className={`w-full bg-white/5 border ${errors.password ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-sm font-medium text-white`}
                        />
                        {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-6 mt-1 uppercase tracking-wider">{errors.password}</p>}
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-6 top-5 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }); }}
                            placeholder={d.confirmPassword || "Confirm New Password"}
                            className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-sm font-medium text-white`}
                        />
                        {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-6 mt-1 uppercase tracking-wider">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        disabled={loading || !token}
                        className="w-full py-5 mt-2 rounded-full bg-accent text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_var(--accent-glow)] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? (d.loading || "Updating...") : (d.updateProtocol || "Update Protocol")} <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/auth" className="text-xs text-slate-500 hover:text-white transition-colors">
                            {d.backToLogin}
                        </Link>
                    </div>
                </form>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 flex flex-col items-center gap-3"
                        >
                            {message.type === 'success' && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
                            <p className={`text-center text-xs font-bold tracking-tight px-4 ${message.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {message.text}
                            </p>
                            {message.type === 'success' && (
                                <p className="text-[10px] text-slate-500 italic">
                                    {d.redirecting || "Redirecting to login..."}
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}

export default function ResetPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white italic">Loading uplink...</div>}>
            <ResetContent />
        </Suspense>
    );
}
