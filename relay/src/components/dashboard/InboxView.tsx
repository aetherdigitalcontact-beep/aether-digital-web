"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Search,
    Clock,
    ChevronRight,
    ChevronDown,
    Database,
    Globe,
    AlertCircle,
    Info,
    Mail,
    Phone,
    Send,
    Zap,
    ExternalLink,
    Copy as CopyIcon,
    Trash2,
    CheckSquare
} from "lucide-react";
import { useState } from "react";
import {
    DiscordIcon,
    TelegramIcon,
    WhatsAppIcon,
    SlackIcon,
    EmailIcon,
    TeamsIcon,
    SMSIcon
} from "@/components/ui/PlatformIcons";

// Platform Icon Helper
const getPlatformIcon = (platform: string) => {
    if (!platform) return <div className="w-8 h-8 rounded-[10px] bg-white/5 flex items-center justify-center border border-white/10"><Globe className="w-4 h-4 text-slate-500" /></div>;
    const pStr = platform.toLowerCase();

    // Multiple routes fallback handler
    if (pStr.includes(',') || pStr === 'multiple') return <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30"><Zap className="w-4 h-4 text-indigo-400" /></div>;

    switch (pStr) {
        case 'discord': return <div className="w-8 h-8 rounded-[10px] bg-[#5865F2]/10 flex items-center justify-center border border-[#5865F2]/20"><DiscordIcon className="w-4 h-4" /></div>;
        case 'telegram': return <div className="w-8 h-8 rounded-[10px] bg-[#26A5E4]/10 flex items-center justify-center border border-[#26A5E4]/20"><TelegramIcon className="w-4 h-4" /></div>;
        case 'whatsapp': return <div className="w-8 h-8 rounded-[10px] bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20"><WhatsAppIcon className="w-4 h-4" /></div>;
        case 'slack': return <div className="w-8 h-8 rounded-[10px] bg-[#E01E5A]/10 flex items-center justify-center border border-[#E01E5A]/20"><SlackIcon className="w-4 h-4" /></div>;
        case 'email': return <div className="w-8 h-8 rounded-[10px] bg-[#6366f1]/10 flex items-center justify-center border border-[#6366f1]/20"><EmailIcon className="w-4 h-4" /></div>;
        case 'teams': return <div className="w-8 h-8 rounded-[10px] bg-[#6264A7]/10 flex items-center justify-center border border-[#6264A7]/20"><TeamsIcon className="w-4 h-4" /></div>;
        case 'sms': return <div className="w-8 h-8 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><SMSIcon className="w-4 h-4" /></div>;
        default: return <div className="w-8 h-8 rounded-[10px] bg-white/5 flex items-center justify-center border border-white/10"><Globe className="w-4 h-4 text-slate-500" /></div>;
    }
};

interface InboxViewProps {
    notifications: any[];
    isLoading: boolean;
    filters: any;
    setFilters: (filters: any) => void;
    variant?: 'default' | 'onboarding';
}

export default function InboxView({ notifications, isLoading, filters, setFilters, variant = 'default' }: InboxViewProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
    const [locallyDeletedIds, setLocallyDeletedIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
    const isOnboarding = variant === 'onboarding';

    // Hide deleted items dynamically
    const visibleNotifications = notifications.filter(n => !locallyDeletedIds.has(n.id));

    const selectedNotification = visibleNotifications.find(n => n.id === selectedId);

    const handleBulkDelete = async () => {
        if (selectedLogIds.length === 0) return;
        setIsDeleting(true);
        const workspaceId = visibleNotifications.find(n => selectedLogIds.includes(n.id))?.project_id;

        try {
            await fetch('/api/inbox', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logIds: selectedLogIds, workspaceId })
            });
            // Hides them in memory without reloading the page data
            setLocallyDeletedIds(new Set([...locallyDeletedIds, ...selectedLogIds]));
            setSelectedLogIds([]);
            if (selectedLogIds.includes(selectedId || '')) setSelectedId(null);
        } catch (e) {
            console.error(e);
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePurgeAll = async () => {
        setIsDeleting(true);
        setShowPurgeConfirm(false);
        // We can safely grab workspaceId from the first notification, or pass it via props if needed, but this works via internal logic
        const workspaceId = notifications[0]?.project_id;

        if (!workspaceId) {
            setIsDeleting(false);
            return;
        }

        try {
            await fetch('/api/inbox', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logIds: ['ALL'], workspaceId })
            });
            const allIds = notifications.map(n => n.id);
            setLocallyDeletedIds(new Set([...locallyDeletedIds, ...allIds]));
            setSelectedLogIds([]);
            setSelectedId(null);
        } catch (e) {
            console.error(e);
        } finally {
            setIsDeleting(false);
        }
    };

    // Categories Logic dynamically from visible notifications
    const uniqueCategories = Array.from(new Set(visibleNotifications.map(n => (n.category || 'GENERAL').toUpperCase())));
    uniqueCategories.sort(); // Predictable rendering order

    const getCountsForCategory = (cat: string) => {
        if (cat === 'ALL') return visibleNotifications.length;
        return visibleNotifications.filter(n => (n.category || 'GENERAL').toUpperCase() === cat).length;
    };

    // Current filter
    const currentCatFilter = (filters.category || 'ALL').toUpperCase();

    const getCategoriesToRender = () => {
        return ['ALL', ...uniqueCategories];
    };

    return (
        <div className={`flex flex-col h-full gap-8 overflow-hidden rounded-[2rem] ${isOnboarding ? 'p-0 bg-transparent' : 'p-6 lg:p-10 min-h-[600px] bg-[#020510] border border-blue-500/10 shadow-[inset_0_0_80px_rgba(59,130,246,0.03)] relative'}`}>

            {/* Background Glow */}
            {!isOnboarding && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-[100px] pointer-events-none" />}

            {/* HEADER - Holographic Style */}
            {!isOnboarding && (
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10 w-full mb-2">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-400/30">
                            <Zap className="w-7 h-7 text-white fill-white relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                                Universal Inbox
                            </h1>
                            <p className="text-sm font-medium text-slate-400 mt-1 tracking-wide">
                                One inbox. Every channel. Every signal.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 md:mr-[140px] lg:mr-[180px]">

                        <div className="relative group">
                            <select
                                value={filters.platform || 'all'}
                                onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                                className="appearance-none bg-[#0a0f25]/50 border border-blue-500/20 rounded-2xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-all font-medium whitespace-nowrap cursor-pointer shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] hover:bg-[#0a0f25]"
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                            >
                                <option value="all">ALL ROUTES</option>
                                <option value="discord">Discord</option>
                                <option value="telegram">Telegram</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="slack">Slack</option>
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                        </div>

                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Intercept signal..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full bg-[#0a0f25]/50 border border-blue-500/20 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:bg-[#0a0f25] transition-all placeholder:text-slate-600 font-medium shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]"
                            />
                        </div>

                        <button
                            onClick={() => setShowPurgeConfirm(true)}
                            disabled={isDeleting || visibleNotifications.length === 0}
                            className="px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold text-sm shadow-[0_0_15px_rgba(244,63,94,0.1)] flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border border-rose-500/20 z-10 relative"
                            title="Delete All Local Logs"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden lg:inline">Purge Logs</span>
                        </button>
                    </div>
                </div>
            )}

            {/* FILTER TABS (Chips) */}
            {!isOnboarding && (
                <div className="flex items-center gap-3 relative z-10 w-full pb-4 border-b border-blue-500/10 overflow-x-auto scrollbar-hide">
                    {getCategoriesToRender().map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilters({ ...filters, category: cat })}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold transition-all border whitespace-nowrap ${currentCatFilter === cat ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'}`}
                        >
                            {cat} <span className={`px-2 py-0.5 rounded-full text-[9px] ${currentCatFilter === cat ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>{getCountsForCategory(cat)}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-1 gap-6 overflow-hidden relative z-10 w-full">
                {/* Notification List */}
                <div className="flex-1 overflow-y-auto pr-4 space-y-4 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-80">
                            <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                                <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 border-r-blue-500/50 border-b-transparent border-l-transparent animate-spin" />
                                <div className="absolute inset-1 rounded-full border-2 border-b-blue-400 border-l-blue-400/50 border-t-transparent border-r-transparent animate-[spin_1.5s_reverse_infinite]" />
                                <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
                            </div>
                            <p className="text-sm font-black text-blue-400 tracking-[0.3em] uppercase animate-pulse">Decrypting Signal</p>
                        </div>
                    ) : visibleNotifications.length === 0 ? (
                        <div className="text-center py-20 bg-[#0a0f25]/50 border border-blue-500/10 rounded-3xl">
                            <div className="w-20 h-20 mx-auto bg-blue-500/5 rounded-full flex items-center justify-center border border-blue-500/20 mb-6">
                                <Database className="w-8 h-8 text-blue-500/50" />
                            </div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Null Sector</p>
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2">No signals intercepted yet</p>
                        </div>
                    ) : (
                        visibleNotifications.filter(n => {
                            if (currentCatFilter !== 'ALL' && (n.category || 'GENERAL').toUpperCase() !== currentCatFilter) return false;
                            return true;
                        }).map((n, i) => {
                            const isChecked = selectedLogIds.includes(n.id);

                            return (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 30 }}
                                    onClick={() => setSelectedId(n.id)}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden group 
                                    ${selectedId === n.id
                                            ? 'bg-[#0a1128] border-blue-500/40 shadow-[0_5px_30px_rgba(59,130,246,0.15)] shadow-blue-500/20'
                                            : 'bg-[#060a1a] border-white/5 hover:border-blue-500/20 hover:bg-[#080d20] hover:shadow-[0_0_20px_rgba(59,130,246,0.05)]'} 
                                    border`}
                                >
                                    {/* Glowing top border for unread effect (Mocking unread with opacity for now) */}
                                    <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity ${selectedId === n.id ? 'opacity-100' : 'group-hover:opacity-50'}`} />

                                    <div className="flex items-center gap-4">

                                        {/* Select Checkbox */}
                                        <div
                                            className="relative shrink-0 flex items-center justify-center p-2 -ml-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isChecked) setSelectedLogIds(prev => prev.filter(id => id !== n.id));
                                                else setSelectedLogIds(prev => [...prev, n.id]);
                                            }}
                                        >
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isChecked ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-slate-600 hover:border-slate-400 bg-[#020510]'}`}>
                                                {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                        </div>

                                        {/* Icon Container with glowing badge */}
                                        <div className="relative shrink-0">
                                            <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center outline outline-1 outline-offset-2 ${n.category?.toLowerCase() === 'alert' || n.category?.toLowerCase() === 'system alert' ? 'bg-rose-500/10 outline-rose-500/30' : 'bg-blue-500/10 outline-blue-500/30'}`}>
                                                {n.category?.toLowerCase() === 'alert' || n.category?.toLowerCase() === 'system alert' ? <AlertCircle className="w-5 h-5 text-rose-500" /> : getPlatformIcon(n.platform)}
                                            </div>
                                            {/* Status Dot */}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0a1128] rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center justify-between gap-4 mb-2">
                                                <h4 className={`text-[15px] font-bold ${selectedId === n.id ? 'text-white' : 'text-slate-200'} truncate tracking-tight group-hover:text-white transition-colors`}>{n.title}</h4>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60" />
                                                    <span className="text-[10px] font-medium text-slate-500">{new Date(n.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${selectedId === n.id ? 'translate-x-1 text-blue-400' : 'text-slate-600'}`} />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                                                    {n.category || 'GENERAL'}
                                                </span>
                                                <span className="text-slate-600 text-[10px] font-black mb-0.5 opacity-50">•</span>
                                                <p className="text-xs text-slate-400 line-clamp-1 flex-1 font-medium italic">
                                                    {n.message || n.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Cyberpunk Data Explorer Panel */}
                {!isOnboarding && (
                    <AnimatePresence mode="wait">
                        {selectedNotification && (
                            <motion.div
                                key={selectedNotification.id}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                className="w-full max-w-md bg-transparent rounded-3xl border border-blue-500/20 p-8 flex flex-col hidden xl:flex overflow-y-auto scrollbar-hide relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#080d22] before:to-transparent before:rounded-3xl before:-z-10 shadow-[inner_0_0_50px_rgba(59,130,246,0.05)]"
                            >
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {selectedNotification.data?.url && (
                                        <button onClick={() => window.open(selectedNotification.data.url, '_blank')} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all cursor-pointer z-50 relative">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                        <Database className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Signal Inspector</h3>
                                        <p className="text-[9px] font-black text-blue-400/80 uppercase tracking-[0.2em] mt-1 shadow-blue-500">Live Telemetry</p>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-blue-500/10">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Delivery Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                                                <span className="text-xs font-bold text-white tracking-wide">Success</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-blue-500/10">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform</p>
                                            <span className="text-xs font-bold text-white tracking-wide capitalize">
                                                {selectedNotification.platform?.includes(',') ? 'MULTIPLE ROUTES' : selectedNotification.platform}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] pl-2 flex items-center gap-2">
                                            <Info className="w-3 h-3 text-blue-400" /> Decrypted Payload
                                        </p>
                                        <div className="bg-[#030610] border border-blue-500/20 rounded-2xl p-5 font-mono text-[11px] text-emerald-400/90 overflow-x-auto shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                            <pre>{JSON.stringify(selectedNotification.data, null, 2)}</pre>
                                        </div>
                                    </div>

                                    {selectedNotification.data?.url && (
                                        <a href={selectedNotification.data.url} target="_blank" className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col items-start gap-1 group hover:bg-blue-500/10 transition-all cursor-pointer">
                                            <p className="text-[9px] font-black text-blue-400/80 uppercase tracking-widest">Attached Link</p>
                                            <span className="text-xs text-blue-300 font-medium truncate w-full group-hover:text-white transition-colors">{selectedNotification.data.url}</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Floating Action Bar for Bulk Deletion */}
            <AnimatePresence>
                {selectedLogIds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[70] bg-[#0a0f25]/90 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-4 shadow-[0_20px_60px_rgba(244,63,94,0.15)] flex items-center gap-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/40">
                                <span className="text-rose-400 font-bold text-sm">{selectedLogIds.length}</span>
                            </div>
                            <span className="text-white font-medium text-sm tracking-wide">Signals Intercepted</span>
                        </div>

                        <div className="w-px h-6 bg-slate-800" />

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedLogIds([])}
                                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Purge Selected
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Purge Confirmation Modal */}
            <AnimatePresence>
                {showPurgeConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#060a1a] border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.15)] rounded-3xl p-8 max-w-md w-full"
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2">
                                    <AlertCircle className="w-8 h-8 text-rose-500" />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">Purge All Signals?</h3>
                                <p className="text-sm text-slate-400 font-medium">
                                    Are you absolutely sure you want to permanently delete <span className="text-white font-bold">ALL</span> intercepted signals? This action cannot be undone and will erase your workspace history.
                                </p>

                                <div className="flex w-full gap-3 mt-4">
                                    <button
                                        onClick={() => setShowPurgeConfirm(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePurgeAll}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Purge All
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
