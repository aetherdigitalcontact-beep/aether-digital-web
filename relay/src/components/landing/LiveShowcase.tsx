"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Inbox as InboxIcon, Terminal, MessageSquare, ShieldCheck, Mail, Zap, BellRing, CheckCheck, Filter, Send } from 'lucide-react';

const BRAND_ICONS: Record<string, any> = {
    'Relay': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
        </svg>
    ),
    'Slack': (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-0.5">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.958 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.52 2.521h-2.522v-2.521zM17.687 8.834a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312zM15.165 18.958a2.528 2.528 0 0 1 2.522 2.521 2.528 2.528 0 0 1-2.522 2.521 2.528 2.528 0 0 1-2.521-2.521v-2.521h2.521zM15.165 17.687a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.313A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.313z" />
        </svg>
    ),
    'WhatsApp': (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-0.5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    'Telegram': (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-0.5">
            <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12.122 12.122 0 00-.056 0zM17.07 8.417l-1.855 8.74c-.14.633-.514.788-1.044.49l-2.828-2.084-1.363 1.312c-.15.15-.276.276-.566.276l.202-2.871 5.228-4.723c.227-.202-.05-.314-.352-.112l-6.463 4.07-2.78-.869c-.604-.19-.617-.604.126-.894l10.866-4.184c.503-.183.943.117.76.894z" />
        </svg>
    ),
    'Discord': (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-0.5">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    )
};

const BRAND_COLORS: Record<string, string> = {
    'Relay': 'text-accent bg-accent/20 border-accent/20',
    'Slack': 'text-rose-400 bg-rose-400/20 border-rose-400/20',
    'WhatsApp': 'text-emerald-400 bg-emerald-400/20 border-emerald-400/20',
    'Telegram': 'text-sky-400 bg-sky-400/20 border-sky-400/20',
    'Discord': 'text-indigo-400 bg-indigo-400/20 border-indigo-400/20'
};

const INITIAL_MESSAGES = [
    { id: 1, category: 'leads', title: 'Mark Johnson', desc: 'Hey, can we sync on the Relay API updates later?', time: 'Just now', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10', isRead: false },
    { id: 2, category: 'system', title: 'PR #104 Merged', desc: 'docs: update Relay SDK documentation', time: '25m ago', icon: Terminal, color: 'text-purple-400', bg: 'bg-purple-400/10', isRead: true },
    { id: 3, category: 'alerts', title: 'Security Update', desc: 'Token rotation completed successfully', time: '1h ago', icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-400/10', isRead: false },
    { id: 4, category: 'system', title: 'Campaign Sent', desc: 'Q3 Onboarding flow dispatched to 12k users', time: '2h ago', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-400/10', isRead: true },
    { id: 5, category: 'leads', title: 'Sarah P.', desc: 'Can we sync on the API?', time: '3h ago', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10', isRead: true },
    { id: 6, category: 'alerts', title: 'Database Backup', desc: 'Weekly snapshot stored in S3 Madrid', time: '5h ago', icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-400/10', isRead: true },
];

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'leads', label: 'Leads' },
    { id: 'system', label: 'System' },
    { id: 'alerts', label: 'Alerts' },
];

export default function LiveShowcase() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [mobilePush, setMobilePush] = useState<any[]>([
        { id: 'm1', app: 'Slack', text: 'Engineering channel: build passing', time: '1h', isRead: true },
        { id: 'm2', app: 'WhatsApp', text: 'Product Lead: Ship the API updates today? 🚀', time: '2h', isRead: false },
        { id: 'm3', app: 'Telegram', text: 'Relay Dev Group: New node deployed in Tokyo region.', time: '4h', isRead: false },
        { id: 'm4', app: 'Discord', text: 'Security Bot: Token rotation verified successfully.', time: '6h', isRead: false }
    ]);
    const [isRinging, setIsRinging] = useState(false);

    const filteredMessages = useMemo(() => {
        if (selectedCategory === 'all') return messages;
        return messages.filter(m => m.category === selectedCategory);
    }, [messages, selectedCategory]);

    const unreadCount = useMemo(() => messages.filter(m => !m.isRead).length, [messages]);

    const markAsRead = (id: number) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    };

    const markAllAsRead = () => {
        setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
    };

    const markMobileAsRead = (id: string) => {
        setMobilePush(prev => prev.map(p => p.id === id ? { ...p, isRead: true } : p));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsRinging(true);
            const newMsgId = Date.now();
            const newMsg = {
                id: newMsgId,
                category: 'leads',
                title: 'Live Transmission',
                desc: 'Inbound packet detected from relay-v1 node.',
                time: 'Just now',
                icon: Zap,
                color: 'text-accent',
                bg: 'bg-accent/10',
                isRead: false
            };
            setMessages(prev => [newMsg, ...prev]);
            setMobilePush(prev => [{ id: `m-${newMsgId}`, app: 'Relay', text: 'Sarah P: Inbound transmission received', time: 'now', isRead: false }, ...prev]);

            setTimeout(() => setIsRinging(false), 1500);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-full max-w-6xl mx-auto h-[700px] flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20 perspective-1000 py-10">
            {/* INBOX PANEL (Left) */}
            <motion.div
                initial={{ opacity: 0, rotateY: 20, x: -100 }}
                animate={{ opacity: 1, rotateY: 5, x: 0 }}
                whileHover={{ rotateY: 0, scale: 1.01, transition: { duration: 0.4 } }}
                className="relative z-10 w-full max-w-[500px] glass border border-white/10 rounded-[40px] overflow-hidden shadow-[0_40px_100px_-15px_rgba(16,185,129,0.15)] hidden md:block"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Header with Tools */}
                <div className="bg-white/[0.03] p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                                <InboxIcon className="w-4 h-4 text-accent" />
                            </div>
                            <span className="font-black text-white tracking-widest uppercase text-sm">Action Center</span>
                        </div>
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group/btn"
                        >
                            <CheckCheck className="w-3.5 h-3.5 group-hover/btn:text-accent transition-colors" />
                            Mark all as read
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        <Filter className="w-3 h-3 text-slate-600 mr-1" />
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                    ${selectedCategory === cat.id ? 'bg-accent text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                            >
                                {cat.label}
                                {cat.id === 'all' && unreadCount > 0 && (
                                    <div className="flex items-center gap-2 ml-2">
                                        <span className="px-1.5 py-0.5 bg-black/20 rounded-md">{unreadCount}</span>
                                        <div className="relative">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-75 absolute top-0 left-0" />
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Message List */}
                <div className="p-6 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent custom-scrollbar">
                    <AnimatePresence initial={false} mode="popLayout">
                        {filteredMessages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                onClick={() => markAsRead(msg.id)}
                                className={`group p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center relative overflow-hidden mb-3
                                    ${msg.isRead ? 'bg-transparent border-white/[0.03] opacity-60' : 'bg-white/[0.04] border-white/10 shadow-lg'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.bg} border border-white/5 transition-transform group-hover:scale-105`}>
                                    <msg.icon className={`w-5 h-5 ${msg.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`text-sm font-black transition-colors ${msg.isRead ? 'text-slate-400' : 'text-white group-hover:text-accent'}`}>{msg.title}</h4>
                                        <div className="flex items-center gap-2 ml-2">
                                            {!msg.isRead && (
                                                <div className="relative">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75 absolute top-0 left-0" />
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full relative z-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                                </div>
                                            )}
                                            <span className="text-[9px] text-slate-600 font-black font-mono shrink-0 uppercase">{msg.time}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 line-clamp-1 font-medium italic">"{msg.desc}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredMessages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20 filter grayscale">
                            <InboxIcon className="w-12 h-12 text-slate-500 mb-4" />
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">No active pulses in this category</p>
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600">Simulating real-time delivery layer</p>
                </div>
            </motion.div>

            {/* MOBILE PHONE (Right) */}
            <motion.div
                initial={{ opacity: 0, rotateY: -20, x: 100 }}
                animate={{
                    opacity: 1,
                    rotateY: -10,
                    x: 0,
                    scale: isRinging ? [1, 1.03, 1] : 1,
                }}
                transition={{
                    duration: 1.2,
                    type: "spring",
                    bounce: 0.2,
                    delay: 0.2,
                    scale: { duration: 0.2, repeat: isRinging ? 3 : 0, type: "tween" },
                }}
                whileHover={{ rotateY: 0, scale: 1.05, transition: { duration: 0.4 } }}
                className="relative z-20 w-[320px] h-[640px] rounded-[60px] border-[12px] border-[#1e293b] bg-[#020617] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 group/phone"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Dynamic Island */}
                <motion.div
                    animate={{ width: isRinging ? 160 : 100 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 h-8 bg-black rounded-full z-30 flex items-center justify-between px-3 overflow-hidden shadow-2xl"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    {isRinging && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] text-white font-black uppercase tracking-tighter">New Relay</motion.span>}
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
                </motion.div>

                {/* Clock */}
                <div className="pt-24 text-center relative z-10 transition-transform group-hover/phone:-translate-y-2">
                    <h2 className="text-7xl font-light text-white tracking-tighter">10:58</h2>
                    <p className="text-[10px] text-accent font-black uppercase tracking-[0.4em] mt-2">Friday, Oct 24</p>
                </div>

                {/* Notifications Stack */}
                <div className="absolute top-52 left-5 right-5 bottom-8 overflow-y-auto scrollbar-hide space-y-3 z-20 custom-scrollbar pr-1">
                    <AnimatePresence mode="popLayout">
                        {mobilePush.map((push) => (
                            <motion.div
                                key={push.id}
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                onClick={() => markMobileAsRead(push.id)}
                                className={`glass p-5 rounded-[28px] border backdrop-blur-2xl transition-all duration-700 active:scale-95 cursor-pointer relative overflow-hidden group/notif
                                    ${push.isRead ? 'bg-white/[0.03] border-white/5' : 'bg-white/10 border-white/20 shadow-2xl'}`}
                            >
                                <div className="flex justify-between items-center mb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500 border ${push.isRead && BRAND_COLORS[push.app] ? BRAND_COLORS[push.app] : (push.app === 'Relay' ? 'bg-accent/20 text-accent border-accent/20' : 'bg-white/10 text-white/50 border-white/5')}`}>
                                            {BRAND_ICONS[push.app] || <Zap className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${push.isRead ? 'text-white/60' : 'text-white/50'}`}>{push.app}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase transition-colors duration-500 ${push.isRead ? 'text-white/30' : 'text-white/30'}`}>{push.time}</span>
                                </div>
                                <div className="flex justify-between items-start gap-4">
                                    <p className={`text-xs font-bold leading-relaxed flex-1 ${push.isRead ? 'text-white/50' : 'text-white'}`}>{push.text}</p>
                                    {!push.isRead && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="relative shrink-0 mt-1"
                                        >
                                            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping opacity-75 absolute top-0 left-0" />
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full relative z-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Custom Ringing Visual Backdrop */}
                <AnimatePresence>
                    {isRinging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-accent/[0.05] pointer-events-none z-10"
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
