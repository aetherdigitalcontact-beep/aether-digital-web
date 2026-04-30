"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, CheckCheck, X, Inbox, Zap, MoreVertical, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Note: In a real SDK, these would be props or a Provider
interface RelayInboxProps {
    apiKey: string;
    subscriberId: string;
    theme?: 'dark' | 'light';
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RelayInbox({ apiKey, subscriberId, theme = 'dark' }: RelayInboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const unreadCount = messages.filter(m => !m.is_read).length;
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/inbox?subscriberId=${subscriberId}`, {
                headers: { 'x-api-key': apiKey }
            });
            const data = await res.json();
            if (data.messages) setMessages(data.messages);
        } catch (e) {
            console.error('RelayInbox Error:', e);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (messageId: string) => {
        // Optimistic update
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_read: true } : m));
        await fetch('/api/inbox', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
            body: JSON.stringify({ messageId })
        });
    };

    const markAllAsRead = async () => {
        setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
        await fetch('/api/inbox', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
            body: JSON.stringify({ readAll: true, subscriberId })
        });
    };

    useEffect(() => {
        fetchMessages();

        // REAL-TIME SYNC
        const channel = supabase
            .channel(`inbox-${subscriberId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'inbox_messages' },
                (payload) => {
                    // Prepend new messages if they belong to this subscriber
                    // Note: Ideally the channel filter would handle this
                    setMessages(prev => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [subscriberId]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block font-sans" ref={containerRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-3 rounded-2xl transition-all duration-300 group
                    ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border border-white/5' : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'}`}
            >
                {unreadCount > 0 ? (
                    <BellRing className={`w-5 h-5 ${theme === 'dark' ? 'text-accent' : 'text-blue-600'} animate-pulse`} />
                ) : (
                    <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} />
                )}

                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-black text-white shadow-lg"
                        >
                            {unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Inbox Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute right-0 mt-4 w-[380px] rounded-[32px] overflow-hidden shadow-2xl z-50 border
                            ${theme === 'dark' ? 'bg-[#0a0a0b] border-white/10' : 'bg-white border-slate-200 text-slate-900'}`}
                    >
                        {/* Header */}
                        <div className={`p-6 border-b flex items-center justify-between
                            ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <span className="font-black text-sm uppercase tracking-widest">Inbox</span>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent text-[10px] font-black uppercase tracking-tighter">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-accent transition-colors flex items-center gap-1.5"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        </div>

                        {/* List container */}
                        <div className="max-h-[480px] overflow-y-auto custom-scrollbar p-3">
                            {loading ? (
                                <div className="p-10 text-center space-y-4">
                                    <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Syncing with Relay Edge...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center opacity-40">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-500/10 flex items-center justify-center mb-4">
                                        <Inbox className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-widest mb-1 text-slate-400">All caught up</h4>
                                    <p className="text-[10px] font-medium italic text-slate-500">Your signal stream is empty.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <AnimatePresence mode="popLayout">
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                layout
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                onClick={() => !msg.is_read && markAsRead(msg.id)}
                                                className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden
                                                    ${msg.is_read
                                                        ? 'bg-transparent border-transparent opacity-50 grayscale hover:grayscale-0 transition-all'
                                                        : theme === 'dark' ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5
                                                        ${msg.is_read
                                                            ? 'bg-slate-500/10 text-slate-500'
                                                            : theme === 'dark' ? 'bg-accent/10 text-accent' : 'bg-blue-100 text-blue-600'}`}>
                                                        <Zap className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h5 className="text-xs font-black truncate">{msg.title}</h5>
                                                            <span className="text-[8px] font-black uppercase text-slate-500 shrink-0 ml-2">
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className={`text-[11px] leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {msg.content}
                                                        </p>
                                                    </div>
                                                    {!msg.is_read && (
                                                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#10B981]" />
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className={`p-4 border-t text-center
                             ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center justify-center gap-2">
                                <Zap className="w-2.5 h-2.5" />
                                Secured by Relay Protocol
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(128, 128, 128, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(128, 128, 128, 0.2);
                }
            `}</style>
        </div>
    );
}
