"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Zap, Plus, X, Search, CheckCircle2, Clock, Circle, ArrowRight, Sparkles, Mail, Lock, LogIn, UserPlus, Sun, Moon, Camera, Trash2, Check } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ─── Admin emails (hardcoded for security) ───────────────────
const ADMIN_EMAILS = ['quiel.g538@gmail.com', 'aetherdigital.contact@gmail.com'];

// ─── Google / GitHub SVG Icons ────────────────────────────
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const GithubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
    </svg>
);

// ─── Auth Hook ────────────────────────────────────────────
function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
            setUser(session?.user ?? null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    return { user, loading };
}

// ─── Auth Modal ────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    const handleOAuth = async (provider: 'google' | 'github') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${window.location.origin}/roadmap` },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        setMsg(null);

        const { error } = tab === 'login'
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/roadmap` } });

        if (error) {
            setMsg({ type: 'error', text: error.message });
        } else if (tab === 'register') {
            setMsg({ type: 'success', text: 'Check your email to confirm your account, then come back here.' });
        } else {
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 22 }}
                className="bg-[#0c1018] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-white font-black text-xl">Sign in to continue</h2>
                        <p className="text-slate-400 text-sm mt-0.5">You need an account to vote and submit requests.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* OAuth */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-all">
                        <GoogleIcon /> Google
                    </button>
                    <button onClick={() => handleOAuth('github')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-all">
                        <GithubIcon /> GitHub
                    </button>
                </div>

                <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-[#0c1018] px-3 text-slate-600">or continue with email</span></div>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-1 mb-5 bg-white/[0.03] border border-white/5 rounded-xl p-1">
                    {(['login', 'register'] as const).map(t => (
                        <button key={t} onClick={() => { setTab(t); setMsg(null); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                            {t === 'login' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                            {t === 'login' ? 'Sign In' : 'Register'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                    {msg && (
                        <p className={`text-xs font-semibold px-1 ${msg.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>{msg.text}</p>
                    )}
                    <button type="submit" disabled={loading || !email || !password}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : tab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}

// ─── Profile Menu ──────────────────────────────────────────

function ProfileMenu({ user }: { user: any }) {
    const [open, setOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
    const [uploading, setUploading] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const ref = React.useRef<HTMLDivElement>(null);

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.slice(0, 2).toUpperCase();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target?.result as string;
            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64, userId: user.id }),
                });
                const data = await res.json();
                if (data.url) {
                    await supabase.auth.updateUser({ data: { avatar_url: data.url } });
                    setAvatarUrl(data.url);
                }
            } catch { }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteAvatar = async () => {
        await supabase.auth.updateUser({ data: { avatar_url: null } });
        setAvatarUrl(null);
    };

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        // Apply to <html> so CSS can respond to it
        if (next === 'light') {
            document.documentElement.style.setProperty('--page-bg', '#f1f5f9');
            document.documentElement.style.setProperty('--page-text', '#0f172a');
            document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
        } else {
            document.documentElement.style.removeProperty('--page-bg');
            document.documentElement.style.removeProperty('--page-text');
            document.documentElement.style.filter = '';
        }
        localStorage.setItem('roadmap-theme', next);
    };

    // Restore theme on mount
    useEffect(() => {
        const saved = localStorage.getItem('roadmap-theme') as 'dark' | 'light' | null;
        if (saved === 'light') {
            setTheme('light');
            document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
        }
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Avatar Button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/10 hover:border-blue-500/60 transition-all focus:outline-none focus:border-blue-500 shadow-lg"
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-black">
                        {initials}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -8 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute right-0 top-12 w-72 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[500]"
                    >
                        {/* Profile Section */}
                        <div className="p-5 border-b border-white/5">
                            {/* Avatar with upload controls */}
                            <div className="flex items-center gap-4 mb-3">
                                <div className="relative group flex-shrink-0">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-lg font-black">
                                                {initials}
                                            </div>
                                        )}
                                    </div>
                                    {/* Upload overlay (camera icon) */}
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-all">
                                        {uploading
                                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <Camera className="w-4 h-4 text-white" />
                                        }
                                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                    </label>
                                    {/* X delete button top-right */}
                                    {avatarUrl && (
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDeleteAvatar(); }}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 hover:bg-rose-400 border-2 border-[#0d1117] rounded-full flex items-center justify-center transition-colors z-10 opacity-0 group-hover:opacity-100"
                                            title="Remove photo"
                                        >
                                            <X className="w-2.5 h-2.5 text-white" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{displayName}</p>
                                    <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2">
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-slate-300 hover:text-white group"
                            >
                                <div className="flex items-center gap-2.5">
                                    {theme === 'dark'
                                        ? <Moon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                        : <Sun className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                    }
                                    <span className="font-medium">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
                                </div>
                                <div className={`w-9 h-5 rounded-full transition-colors relative ${theme === 'light' ? 'bg-blue-600' : 'bg-white/10'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${theme === 'light' ? 'left-4' : 'left-0.5'}`} />
                                </div>
                            </button>

                            {/* Sign out */}
                            <button
                                onClick={() => { supabase.auth.signOut(); setOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 transition-colors text-sm text-slate-400 hover:text-rose-400 group mt-0.5"
                            >
                                <LogIn className="w-4 h-4 rotate-180 group-hover:text-rose-400 transition-colors" />
                                <span className="font-medium">Sign out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Types ────────────────────────────────────────────────
interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    phase: string;
    status: 'Completed' | 'In Progress' | 'Planned' | 'Backlog';
    priority: 'High' | 'Medium' | 'Low';
    votes: number;
    category: string;
    hasVoted?: boolean;
}

interface FeatureRequest {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    author_email: string;
    status: string;
    votes: number;
    created_at: string;
}

// ─── Static Roadmap Data (shown even without DB) ──────────
const STATIC_ROADMAP: RoadmapItem[] = [
    // Foundation
    { id: 's1', title: 'Authentication System', description: 'Full auth with 2FA, email verification, and session management.', phase: 'Foundation', status: 'Completed', priority: 'High', votes: 0, category: 'Core' },
    { id: 's2', title: 'Multi-Platform Relay Engine', description: 'Send notifications via Email, WhatsApp, SMS, Telegram and more through a single API.', phase: 'Foundation', status: 'Completed', priority: 'High', votes: 0, category: 'Core' },
    { id: 's3', title: 'Subscriber Management', description: 'Create, update, blacklist and segment your subscriber base from the dashboard.', phase: 'Foundation', status: 'Completed', priority: 'High', votes: 0, category: 'Core' },
    { id: 's4', title: 'API Key System', description: 'Generate and revoke project-scoped API keys with full audit trail.', phase: 'Foundation', status: 'Completed', priority: 'High', votes: 0, category: 'Core' },
    { id: 's5', title: 'Topics & Broadcast', description: 'Broadcast messages to subscriber groups using topic-based pub/sub architecture.', phase: 'Foundation', status: 'Completed', priority: 'Medium', votes: 0, category: 'Core' },
    { id: 's6', title: 'Webhook Integrations', description: 'Native webhooks for PayPal, MercadoPago, Lemon Squeezy, Shopify, WooCommerce and more.', phase: 'Foundation', status: 'Completed', priority: 'Medium', votes: 0, category: 'Integrations' },
    { id: 's7', title: 'Email Layout Builder', description: 'Visual block-based email editor to design and manage transactional email templates.', phase: 'Foundation', status: 'Completed', priority: 'Medium', votes: 0, category: 'Core' },
    { id: 's8', title: 'Real-Time Inbox', description: 'In-app notification inbox with read/unread state and delivery telemetry.', phase: 'Foundation', status: 'Completed', priority: 'High', votes: 0, category: 'Core' },

    // Alpha
    { id: 's9', title: 'Retry Engine & Cron Worker', description: 'Automated retry system for failed notifications with configurable backoff policies.', phase: 'Alpha', status: 'In Progress', priority: 'High', votes: 0, category: 'Infra' },
    { id: 's10', title: 'Visual Scenario Builder', description: 'Build notification automation flows with drag-and-drop nodes (Digest, Delay, Condition).', phase: 'Alpha', status: 'In Progress', priority: 'High', votes: 0, category: 'Core' },
    { id: 's11', title: 'Activity Log & Telemetry', description: 'Complete delivery log with status codes, latency and error inspection per notification.', phase: 'Alpha', status: 'In Progress', priority: 'Medium', votes: 0, category: 'Analytics' },
    { id: 's12', title: 'Community Roadmap', description: 'This very page — public roadmap with upvoting and feature requests.', phase: 'Alpha', status: 'In Progress', priority: 'Low', votes: 0, category: 'Platform' },
    { id: 's31', title: 'Notification Providers Dashboard', description: 'Connect and configure your own notification providers (Resend, SendGrid, Twilio, Meta WhatsApp, Slack) directly from the dashboard — no code required.', phase: 'Alpha', status: 'In Progress', priority: 'High', votes: 0, category: 'Core' },
    { id: 's32', title: 'Provider Health & Fallback', description: 'Monitor channel provider uptime and automatically failover to a secondary provider when the primary fails.', phase: 'Alpha', status: 'Planned', priority: 'High', votes: 0, category: 'Infra' },
    { id: 's33', title: 'Per-Workspace Provider Config', description: 'Isolate provider credentials per workspace so each project runs on its own sending infrastructure.', phase: 'Alpha', status: 'Planned', priority: 'Medium', votes: 0, category: 'Core' },
    { id: 's13', title: 'Billing & Subscription Plans', description: 'Paid tiers with Lemon Squeezy, usage metering and automatic quota enforcement.', phase: 'Alpha', status: 'Planned', priority: 'High', votes: 0, category: 'Platform' },

    // Beta
    { id: 's14', title: 'React / React Native SDK', description: 'Official Relay SDKs for React web and React Native with pre-built Inbox component.', phase: 'Beta', status: 'Planned', priority: 'High', votes: 0, category: 'SDK' },
    { id: 's15', title: 'Custom Domain Email Sending', description: 'Verify and send emails from your own domain with DKIM/SPF auto-configuration.', phase: 'Beta', status: 'Planned', priority: 'High', votes: 0, category: 'Infra' },
    { id: 's16', title: 'Notification Preferences UI', description: 'Let subscribers manage their own notification preferences per channel and category.', phase: 'Beta', status: 'Planned', priority: 'Medium', votes: 0, category: 'Core' },
    { id: 's17', title: 'AI-Powered Send Time Optimization', description: 'Predict and auto-schedule notifications at the moment each subscriber is most likely to engage.', phase: 'Beta', status: 'Planned', priority: 'Medium', votes: 0, category: 'AI' },
    { id: 's18', title: 'Analytics Dashboard v2', description: 'Advanced delivery analytics: open rates, click rates, channel performance and cohort analysis.', phase: 'Beta', status: 'Planned', priority: 'High', votes: 0, category: 'Analytics' },
    { id: 's19', title: 'Digest & Delay Nodes (Advanced)', description: 'Full digest configuration: timed windows, smart grouping and custom digest templates.', phase: 'Beta', status: 'Planned', priority: 'Medium', votes: 0, category: 'Core' },

    // Launch
    { id: 's20', title: 'Public API Documentation', description: 'Comprehensive API reference, guides and interactive playground for developers.', phase: 'Launch', status: 'Planned', priority: 'High', votes: 0, category: 'Platform' },
    { id: 's21', title: 'Slack & MS Teams Integration', description: 'Send notifications directly to Slack channels or Microsoft Teams workspaces.', phase: 'Launch', status: 'Planned', priority: 'Medium', votes: 0, category: 'Integrations' },
    { id: 's22', title: 'Multi-Language Email Templates', description: 'i18n support inside email templates with per-subscriber locale detection.', phase: 'Launch', status: 'Planned', priority: 'Medium', votes: 0, category: 'Core' },
    { id: 's23', title: 'White-Label Portal', description: 'Brand the dashboard and notification email footers with your own logo and colors.', phase: 'Launch', status: 'Planned', priority: 'Low', votes: 0, category: 'Platform' },
    { id: 's24', title: 'Flutter & Vue SDK', description: 'Official SDKs for Flutter mobile apps and Vue.js web applications.', phase: 'Launch', status: 'Planned', priority: 'Medium', votes: 0, category: 'SDK' },

    // Growth
    { id: 's25', title: 'Enterprise SSO / SAML', description: 'Single sign-on with SAML 2.0 and SCIM provisioning for enterprise teams.', phase: 'Growth', status: 'Backlog', priority: 'Medium', votes: 0, category: 'Infra' },
    { id: 's26', title: 'Workflow Branching', description: 'Conditional branching logic inside Scenario Builder based on subscriber properties.', phase: 'Growth', status: 'Backlog', priority: 'High', votes: 0, category: 'Core' },
    { id: 's27', title: 'Global SLA Guarantee', description: '99.99% uptime SLA with enterprise-grade support and dedicated infrastructure.', phase: 'Growth', status: 'Backlog', priority: 'High', votes: 0, category: 'Infra' },
    { id: 's28', title: 'MCP Server (AI Agents)', description: 'Native integration for AI agents to trigger Relay notifications via tool calling.', phase: 'Growth', status: 'Backlog', priority: 'Medium', votes: 0, category: 'AI' },
    { id: 's29', title: 'Push Notifications (iOS/Android)', description: 'Native mobile push via APNs and FCM with rich media and action buttons.', phase: 'Growth', status: 'Backlog', priority: 'High', votes: 0, category: 'SDK' },
    { id: 's30', title: 'Self-Hosted / Docker Release', description: 'Official Docker image for self-hosted Relay deployments with full feature parity.', phase: 'Growth', status: 'Backlog', priority: 'Medium', votes: 0, category: 'Infra' },
];

const PHASES = ['Foundation', 'Alpha', 'Beta', 'Launch', 'Growth'];

const PHASE_META: Record<string, { color: string; glow: string; label: string; desc: string }> = {
    Foundation: { color: 'text-emerald-400', glow: 'shadow-emerald-500/20 border-emerald-500/20', label: 'Phase 01', desc: 'Core infrastructure' },
    Alpha: { color: 'text-blue-400', glow: 'shadow-blue-500/20 border-blue-500/20', label: 'Phase 02', desc: 'Active development' },
    Beta: { color: 'text-violet-400', glow: 'shadow-violet-500/20 border-violet-500/20', label: 'Phase 03', desc: 'Extended testing' },
    Launch: { color: 'text-amber-400', glow: 'shadow-amber-500/20 border-amber-500/20', label: 'Phase 04', desc: 'Public release' },
    Growth: { color: 'text-rose-400', glow: 'shadow-rose-500/20 border-rose-500/20', label: 'Phase 05', desc: 'Scale & enterprise' },
};

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    'Completed': { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    'In Progress': { icon: <Clock className="w-3.5 h-3.5" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    'Planned': { icon: <Circle className="w-3.5 h-3.5" />, color: 'text-slate-400', bg: 'bg-white/5 border-white/10' },
    'Backlog': { icon: <Circle className="w-3.5 h-3.5" />, color: 'text-slate-600', bg: 'bg-white/[0.02] border-white/5' },
};

const PRIORITY_COLORS: Record<string, string> = {
    High: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Low: 'text-slate-400 bg-white/5 border-white/10',
};

// ─── New Request Modal ─────────────────────────────────────
function NewRequestModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => Promise<void> }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit({ title, description: desc, priority, author_email: email });
        setLoading(false);
        setDone(true);
        setTimeout(onClose, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-[#0c1018] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {done ? (
                    <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                        <p className="text-white font-bold text-lg">Request submitted!</p>
                        <p className="text-slate-400 text-sm mt-1">Thank you. We review all suggestions.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-white font-black text-xl">New Feature Request</h2>
                                <p className="text-slate-400 text-sm mt-0.5">Tell us what you'd like to see in Relay.</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Feature title *</label>
                                <input
                                    required
                                    placeholder="e.g. Batch notification delivery"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Description</label>
                                <textarea
                                    placeholder="I'd like to see..."
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    rows={3}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Priority</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['Low', 'Medium', 'High'] as const).map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${priority === p ? PRIORITY_COLORS[p] : 'text-slate-500 border-white/5 bg-white/[0.02]'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Your email (optional)</label>
                                <input
                                    type="email"
                                    placeholder="so we can notify you when it ships"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !title}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit Request <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

// ─── Roadmap Item Card ─────────────────────────────────────
function ItemCard({ item, onVote }: { item: RoadmapItem; onVote: (id: string) => void }) {
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG['Planned'];
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all"
        >
            <button
                onClick={() => onVote(item.id)}
                className={`flex flex-col items-center gap-0.5 min-w-[44px] py-2 px-2 rounded-xl border transition-all ${item.hasVoted ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/[0.03] border-white/5 text-slate-500 hover:text-white hover:border-white/20'}`}
            >
                <ChevronUp className="w-4 h-4" />
                <span className="text-[11px] font-black">{item.votes}</span>
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-semibold text-sm">{item.title}</span>
                    {item.priority === 'High' && (
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[item.priority]}`}>High</span>
                    )}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                        {status.icon}
                        {item.status}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">{item.category}</span>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Page ─────────────────────────────────────────────
export default function RoadmapPage() {
    const { user, loading: authLoading } = useAuth();
    const [items, setItems] = useState<RoadmapItem[]>(STATIC_ROADMAP);
    const [requests, setRequests] = useState<FeatureRequest[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [activePhase, setActivePhase] = useState<string>('All');
    const [showModal, setShowModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [tab, setTab] = useState<'roadmap' | 'requests'>('roadmap');


    useEffect(() => {
        // Try to load live data from Supabase, fallback to static
        fetch('/api/roadmap')
            .then(r => r.json())
            .then(d => { if (d.items?.length) setItems(d.items); })
            .catch(() => { });

        fetch('/api/feature-requests')
            .then(r => r.json())
            .then(d => { if (d.requests?.length) setRequests(d.requests); })
            .catch(() => { });
    }, []);

    const handleVote = async (id: string) => {
        if (!user) { setShowAuthModal(true); return; }
        setItems(prev => prev.map(item =>
            item.id === id
                ? { ...item, votes: item.hasVoted ? item.votes - 1 : item.votes + 1, hasVoted: !item.hasVoted }
                : item
        ));
        await fetch(`/api/roadmap/${id}/vote`, { method: 'POST' }).catch(() => { });
    };

    const handleSubmitRequest = async (data: any) => {
        await fetch('/api/feature-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    };

    const isAdmin = !!user && ADMIN_EMAILS.includes(user.email ?? '');

    const handleDeleteRequest = async (id: string) => {
        setRequests(prev => prev.filter(r => r.id !== id));
        await fetch(`/api/feature-requests/${id}`, { method: 'DELETE' }).catch(() => { });
    };

    const handleCompleteRequest = async (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Completed' } : r));
        await fetch(`/api/feature-requests/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Completed' }),
        }).catch(() => { });
    };

    const filtered = items.filter(item => {
        const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchPhase = activePhase === 'All' || item.phase === activePhase;
        return matchSearch && matchStatus && matchPhase;
    });

    const byPhase = PHASES.reduce((acc, phase) => {
        const phaseItems = filtered.filter(i => i.phase === phase);
        if (phaseItems.length) acc[phase] = phaseItems;
        return acc;
    }, {} as Record<string, RoadmapItem[]>);

    return (
        <div className="min-h-screen bg-[#060810] text-white">
            {/* Background glow effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/8 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-violet-600/8 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#060810]/80 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                    {/* LEFT: Logo + New Request */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/30 transition-all">
                                <Zap className="text-white w-4 h-4" fill="currentColor" />
                            </div>
                            <span className="font-black text-lg tracking-tighter">RELAY</span>
                            <span className="text-xs text-slate-500 font-medium hidden sm:block">/ Roadmap</span>
                        </Link>

                        {user && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:block">New Request</span>
                            </button>
                        )}
                    </div>

                    {/* RIGHT: Profile or Sign In */}
                    {user ? (
                        <ProfileMenu user={user} />
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                        >
                            <LogIn className="w-4 h-4" />
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="mb-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" />
                            Public Roadmap
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                            What we're building
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                            Vote on features you need most and submit your own ideas. We build in the open.
                        </p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-8 bg-white/[0.03] border border-white/5 rounded-2xl p-1 w-fit mx-auto">
                    {(['roadmap', 'requests'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${tab === t ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                        >
                            {t === 'requests' ? 'Community Requests' : 'Engineering Roadmap'}
                        </button>
                    ))}
                </div>

                {tab === 'roadmap' && (
                    <>
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3 mb-10">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    placeholder="Search features..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-blue-500/40 transition-all text-sm"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['All', 'Completed', 'In Progress', 'Planned', 'Backlog'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filterStatus === s ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'border-white/5 text-slate-500 hover:text-white bg-white/[0.02]'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Phase pills */}
                        <div className="flex gap-2 flex-wrap mb-10">
                            <button
                                onClick={() => setActivePhase('All')}
                                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${activePhase === 'All' ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-slate-600 hover:text-white'}`}
                            >
                                All Phases
                            </button>
                            {PHASES.map(phase => {
                                const meta = PHASE_META[phase];
                                return (
                                    <button
                                        key={phase}
                                        onClick={() => setActivePhase(activePhase === phase ? 'All' : phase)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${activePhase === phase ? `${meta.color} ${meta.glow} shadow-sm` : 'border-white/5 text-slate-600 hover:text-white'}`}
                                    >
                                        {meta.label} · {phase}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Phase Sections */}
                        <div className="space-y-12">
                            {PHASES.filter(p => activePhase === 'All' || activePhase === p).map(phase => {
                                const phaseItems = byPhase[phase];
                                if (!phaseItems?.length) return null;
                                const meta = PHASE_META[phase];
                                return (
                                    <motion.section key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div>
                                                <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-0.5 ${meta.color}`}>{meta.label}</div>
                                                <h2 className="text-2xl font-black tracking-tight">{phase}</h2>
                                                <div className="text-xs text-slate-500 font-medium">{meta.desc}</div>
                                            </div>
                                            <div className={`ml-auto flex-shrink-0 px-3 py-1 rounded-full border text-xs font-black ${meta.glow} ${meta.color}`}>
                                                {phaseItems.length} {phaseItems.length === 1 ? 'item' : 'items'}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {phaseItems.sort((a, b) => b.votes - a.votes).map((item, i) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                >
                                                    <ItemCard item={item} onVote={handleVote} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>
                                );
                            })}
                        </div>
                    </>
                )}

                {tab === 'requests' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-black">Community Requests</h2>
                                <p className="text-slate-500 text-sm mt-1">Feature ideas submitted by the Relay community.</p>
                            </div>
                        </div>
                        {requests.length === 0 ? (
                            <div className="text-center py-20 text-slate-600">
                                <p className="text-lg font-bold mb-2">No requests yet.</p>
                                <p className="text-sm">Be the first to suggest a feature!</p>
                                <button onClick={() => setShowModal(true)} className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm">
                                    Submit a Request
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {requests.map((req, i) => (
                                    <motion.div
                                        key={req.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`p-4 rounded-2xl border transition-all ${req.status === 'Completed'
                                                ? 'bg-emerald-500/5 border-emerald-500/15'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border mt-0.5 flex-shrink-0 ${PRIORITY_COLORS[req.priority]}`}>
                                                {req.priority}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-semibold ${req.status === 'Completed' ? 'text-emerald-400 line-through opacity-60' : 'text-white'
                                                        }`}>{req.title}</span>
                                                    {req.status === 'Completed' && (
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                            <CheckCircle2 className="w-2.5 h-2.5" /> Done
                                                        </span>
                                                    )}
                                                </div>
                                                {req.description && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{req.description}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                                    {new Date(req.created_at).toLocaleDateString()}
                                                </span>
                                                {/* Admin controls */}
                                                {isAdmin && (
                                                    <div className="flex items-center gap-1">
                                                        {req.status !== 'Completed' && (
                                                            <button
                                                                onClick={() => handleCompleteRequest(req.id)}
                                                                title="Mark as completed"
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteRequest(req.id)}
                                                            title="Delete request"
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {showModal && user && <NewRequestModal onClose={() => setShowModal(false)} onSubmit={handleSubmitRequest} />}
                {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />}
            </AnimatePresence>
        </div>
    );
}
