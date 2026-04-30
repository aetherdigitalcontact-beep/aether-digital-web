"use client";

import React, { useState, useEffect, useRef } from "react";

// Simple portable SVG Icons to avoid requiring external libraries for the end user if possible.
const BellIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

interface RelayInboxProps {
    appId: string; // The Workspace UUID public key
    subscriberId: string; // The External ID of the currently logged-in user
    theme?: "dark" | "light"; // Theme toggle
    apiUrl?: string; // Automatically overridable for local testing
}

export default function RelayInbox({ appId, subscriberId, theme = "dark", apiUrl = "http://localhost:3000" }: RelayInboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const isDark = theme === "dark";

    // Outside click listener to close popover
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch Messages
    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/inbox/widget?appId=${appId}&subscriberId=${subscriberId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                setUnreadCount(data.metadata?.unread || 0);
            }
        } catch (error) {
            console.error("[RelayInbox] Connection Failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (appId && subscriberId) {
            fetchMessages();
            // Polling simple cada 30 segundos
            const interval = setInterval(fetchMessages, 30000);
            return () => clearInterval(interval);
        }
    }, [appId, subscriberId, apiUrl]);

    // Mark specific message as read
    const markAsRead = async (messageId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        // Optimistic UI Update
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_read: true } : m));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await fetch(`${apiUrl}/api/inbox/widget`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appId, subscriberId, messageId })
            });
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
        setUnreadCount(0);

        try {
            await fetch(`${apiUrl}/api/inbox/widget`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appId, subscriberId, readAll: true })
            });
        } catch (err) {
            console.error("Failed to mark all read", err);
        }
    };

    const toggleInbox = () => {
        setIsOpen(!isOpen);
        if (!isOpen) { fetchMessages(); }
    };

    return (
        <div className="relative inline-block font-sans" ref={popupRef}>
            {/* The Bell Trigger */}
            <button
                onClick={toggleInbox}
                className={`relative p-2 rounded-full transition-all duration-300 ${isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-black/5 hover:bg-black/10 text-gray-800'
                    }`}
                style={{ backdropFilter: 'blur(10px)' }}
            >
                <div className={`transition-transform duration-300 ${isOpen ? 'scale-110' : 'scale-100'}`}>
                    <BellIcon className="w-5 h-5" />
                </div>
                {unreadCount > 0 && (
                    <span
                        className="absolute 0 top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* The Dropdown Popover */}
            {isOpen && (
                <div
                    className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border transition-all origin-top-right transform z-50 animate-in fade-in zoom-in-95 duration-200 ${isDark
                        ? 'bg-[#0f121d] border-white/10 text-white shadow-black/50'
                        : 'bg-white border-gray-200 text-gray-900 shadow-gray-200/50'
                        }`}
                >
                    {/* Header */}
                    <div className={`p-4 flex items-center justify-between border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                        <div className="flex flex-col">
                            <span className="font-bold text-base flex items-center gap-2">
                                Inbox
                                {unreadCount > 0 && <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-0.5 rounded-full font-black">{unreadCount} New</span>}
                            </span>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${isDark ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-black/5 hover:text-black'
                                    }`}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                        {isLoading && messages.length === 0 ? (
                            <div className="p-8 flex justify-center">
                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className={`p-8 text-center flex flex-col items-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                <BellIcon className="w-8 h-8 mb-3 opacity-20" />
                                <span className="text-sm font-medium">You're all caught up!</span>
                                <span className="text-xs mt-1 opacity-70">No new notifications.</span>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => !msg.is_read && markAsRead(msg.id)}
                                        className={`relative p-4 flex gap-3 transition-colors cursor-pointer border-b last:border-b-0 ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/80'
                                            }`}
                                    >
                                        {/* Unread indicator */}
                                        {!msg.is_read && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
                                        )}

                                        <div className={`flex-1 pl-2`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-bold truncate pr-2 ${!msg.is_read ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>
                                                    {msg.title}
                                                </h4>
                                                <span className={`text-[10px] whitespace-nowrap mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className={`text-xs line-clamp-2 ${isDark ? (!msg.is_read ? 'text-gray-300' : 'text-gray-500') : (!msg.is_read ? 'text-gray-700' : 'text-gray-500')}`}>
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Branding */}
                    <div className={`p-2 text-center border-t flex items-center justify-center gap-1 ${isDark ? 'border-white/5 text-gray-600' : 'border-gray-100 text-gray-400'}`}>
                        <span className="text-[9px] font-medium tracking-wide">Powered by</span>
                        <div className="flex items-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500 mr-0.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                            <span className="text-[10px] font-bold">Relay</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// How to use this component:
//
// import RelayInbox from './components/universal/RelayInbox';
//
// export default function Navbar() {
//   return (
//      <nav>
//          <RelayInbox
//              appId="your-workspace-uuid"
//              subscriberId="current-user-email-or-id"
//              theme="dark" // or light
//          />
//      </nav>
//   );
// }
// ----------------------------------------------------
