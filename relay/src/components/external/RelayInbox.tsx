"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Clock, CheckCircle2, Zap } from 'lucide-react';

interface RelayInboxProps {
    appId: string;
    subscriberId: string;
    theme?: 'dark' | 'light';
    position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
    className?: string;
    soundEnabled?: boolean;
}

export const RelayInbox: React.FC<RelayInboxProps> = ({
    appId,
    subscriberId,
    theme = 'dark',
    position = 'bottom-right',
    className = '',
    soundEnabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const prevUnreadCountRef = useRef(0);
    const inboxRef = useRef<HTMLDivElement>(null);

    const playNotificationSound = () => {
        if (!soundEnabled) return;
        try {
            // Un sonido suave y moderno "bip-bip" estilo iPhone
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Tono inicial
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1); // Subida rápida

            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05); // Attack
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3); // Fade out

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        } catch (e) {
            console.error("Audio play failed:", e);
        }
    };

    // Initial Fetch Implementation
    useEffect(() => {
        const fetchMessages = async () => {
            if (!appId || !subscriberId) return;
            setIsLoading(true);
            try {
                // Here we fetch from public api
                const res = await fetch(`/api/inbox/public?appId=${appId}&subscriberId=${subscriberId}`);
                if (res.ok) {
                    const data = await res.json();
                    const newUnreadCount = data.notifications?.filter((n: any) => !n.is_read).length || 0;
                    if (newUnreadCount > prevUnreadCountRef.current) {
                        playNotificationSound();
                    }
                    prevUnreadCountRef.current = newUnreadCount;
                    setNotifications(data.notifications || []);
                    setUnreadCount(newUnreadCount);
                }
            } catch (err) {
                console.error("RelayInbox Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [appId, subscriberId, isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inboxRef.current && !inboxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const markAsRead = async (id: string) => {
        // local update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        try {
            await fetch('/api/inbox/public', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'read', logIds: [id], appId, subscriberId })
            });
        } catch (e) {
            console.error(e);
        }
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        try {
            await fetch('/api/inbox/public', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'read', logIds: unreadIds, appId, subscriberId })
            });
        } catch (e) {
            console.error(e);
        }
    };

    // UI Configuration based on position
    const getPopoverStyles = () => {
        const isDark = theme === 'dark';
        const baseDark = "bg-[#060913] border-[#1e293b] shadow-[0_30px_80px_rgba(0,0,0,0.8),_inset_0_0_0_1px_rgba(59,130,246,0.15)]";
        const baseLight = "bg-white border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.1),_0_0_0_1px_rgba(15,23,42,0.05)]";
        const base = `absolute w-[380px] h-[550px] z-[9999] border rounded-3xl overflow-hidden flex flex-col ${isDark ? baseDark : baseLight}`;

        switch (position) {
            case 'bottom-right': return `${base} bottom-full mb-4 right-0`;
            case 'top-right': return `${base} top-full mt-4 right-0`;
            case 'bottom-left': return `${base} bottom-full mb-4 left-0`;
            case 'top-left': return `${base} top-full mt-4 left-0`;
            default: return base;
        }
    };

    const isDark = theme === 'dark';

    return (
        <div ref={inboxRef} className={`relative inline-block ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Bell Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${isOpen
                    ? `bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.5)] border-transparent text-white`
                    : isDark
                        ? 'bg-[#0f172a] border border-white/10 hover:border-blue-500/50 hover:bg-[#1e293b] text-slate-300'
                        : 'bg-white border border-slate-200 hover:border-blue-500/50 hover:bg-slate-50 text-slate-600 shadow-sm'
                    }`}
            >
                <Bell className={`w-5 h-5 ${isOpen ? 'text-white' : ''}`} />

                {/* Unread Badge Glow */}
                <AnimatePresence>
                    {unreadCount > 0 && !isOpen && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center border-2 border-[#111827] shadow-[0_0_15px_rgba(225,29,72,0.6)]"
                        >
                            <span className="text-white text-[10px] font-black">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: position.startsWith('bottom') ? 10 : -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: position.startsWith('bottom') ? 10 : -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={getPopoverStyles()}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between p-5 border-b relative overflow-hidden ${isDark ? 'border-white/5 bg-gradient-to-b from-[#0f172a] to-[#0a0f1c]' : 'border-slate-100 bg-gradient-to-b from-slate-50 to-white'}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-100'}`}>
                                    <Zap className="w-4 h-4 text-blue-500" fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className={`font-extrabold text-base tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                                    <p className={`text-[11px] font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time alerts</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 relative z-10">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-500/15"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`p-1.5 rounded-xl transition-colors ${isDark ? 'text-slate-500 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className={`flex-1 overflow-y-auto w-full scrollbar-hide ${isDark ? 'bg-[#060913]' : 'bg-white'}`}>
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                                    <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin dark:border-slate-800" />
                                    <span className="text-[13px] font-medium tracking-wide">Syncing uplink...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                        <CheckCircle2 className={`w-7 h-7 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                                    </div>
                                    <h4 className={`font-bold text-base mb-1.5 tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>You're all caught up</h4>
                                    <p className="text-[13px] text-slate-500 font-medium">No new signals transmitted yet.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col w-full">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                                            className={`p-5 min-h-[90px] border-b transition-colors cursor-pointer group flex items-start gap-4 
                                                ${isDark
                                                    ? `border-white/[0.03] hover:bg-white/[0.02] ${!notif.is_read ? 'bg-blue-500/[0.03]' : ''}`
                                                    : `border-slate-100 hover:bg-slate-50 ${!notif.is_read ? 'bg-blue-50' : ''}`
                                                }`}
                                        >
                                            {/* Status Indicator */}
                                            <div className="pt-1.5 flex-shrink-0">
                                                {!notif.is_read ? (
                                                    <div className="relative">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping absolute opacity-70" />
                                                    </div>
                                                ) : (
                                                    <div className={`w-2 h-2 rounded-full border-2 bg-transparent ${isDark ? 'border-slate-700' : 'border-slate-300'}`} />
                                                )}
                                            </div>

                                            {/* Body */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${!notif.is_read ? 'text-blue-500' : 'text-slate-400'}`}>
                                                        {notif.category || 'General'}
                                                    </span>
                                                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(notif.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className={`text-[13px] leading-relaxed whitespace-pre-wrap break-words line-clamp-3 
                                                    ${!notif.is_read
                                                        ? isDark ? 'text-slate-200 font-medium' : 'text-slate-800 font-medium'
                                                        : isDark ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'
                                                    }`}>
                                                    {notif.body}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Branding */}
                        <div className={`p-3 border-t flex items-center justify-center backdrop-blur-md ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200'}`}>
                            <span className={`text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${isDark ? 'text-slate-600 hover:text-slate-500' : 'text-slate-400 hover:text-slate-500'}`}>
                                <Zap className="w-3 h-3" />
                                Powered by Relay
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
