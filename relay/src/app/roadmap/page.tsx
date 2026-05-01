"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Zap, Plus, X, Search, CheckCircle2, Clock, Circle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

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
    const [items, setItems] = useState<RoadmapItem[]>(STATIC_ROADMAP);
    const [requests, setRequests] = useState<FeatureRequest[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [activePhase, setActivePhase] = useState<string>('All');
    const [showModal, setShowModal] = useState(false);
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
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/30 transition-all">
                            <Zap className="text-white w-4 h-4" fill="currentColor" />
                        </div>
                        <span className="font-black text-lg tracking-tighter">RELAY</span>
                        <span className="text-xs text-slate-500 font-medium hidden sm:block">/ Roadmap</span>
                    </Link>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        New Request
                    </button>
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
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border mt-0.5 ${PRIORITY_COLORS[req.priority]}`}>
                                                {req.priority}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-semibold text-sm">{req.title}</div>
                                                {req.description && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{req.description}</p>}
                                            </div>
                                            <div className="text-[10px] text-slate-600 whitespace-nowrap">
                                                {new Date(req.created_at).toLocaleDateString()}
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
                {showModal && <NewRequestModal onClose={() => setShowModal(false)} onSubmit={handleSubmitRequest} />}
            </AnimatePresence>
        </div>
    );
}
