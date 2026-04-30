"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Users, ExternalLink, X, Mail, Phone, Calendar, Hash, UserCircle, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Locales list
const FULL_LOCALES = [
    { code: "en-US", label: "English (US)" }, { code: "en-GB", label: "English (UK)" }, { code: "es-ES", label: "Spanish (Spain)" }, { code: "es-MX", label: "Spanish (Mexico)" }, { code: "es-AR", label: "Spanish (Argentina)" }, { code: "fr-FR", label: "French" }, { code: "de-DE", label: "German" }, { code: "it-IT", label: "Italian" }, { code: "pt-BR", label: "Portuguese (Brazil)" }, { code: "pt-PT", label: "Portuguese (Portugal)" }, { code: "ru-RU", label: "Russian" }, { code: "ja-JP", label: "Japanese" }, { code: "ko-KR", label: "Korean" }, { code: "zh-CN", label: "Chinese (Simplified)" }, { code: "ar-SA", label: "Arabic" }, { code: "hi-IN", label: "Hindi" }, { code: "bn-BD", label: "Bengali" }, { code: "ur-PK", label: "Urdu" }, { code: "id-ID", label: "Indonesian" }, { code: "tr-TR", label: "Turkish" }, { code: "nl-NL", label: "Dutch" }, { code: "pl-PL", label: "Polish" }, { code: "sv-SE", label: "Swedish" }, { code: "vi-VN", label: "Vietnamese" }, { code: "th-TH", label: "Thai" }, { code: "cs-CZ", label: "Czech" }, { code: "el-GR", label: "Greek" }, { code: "fi-FI", label: "Finnish" }, { code: "hu-HU", label: "Hungarian" }, { code: "da-DK", label: "Danish" }, { code: "no-NO", label: "Norwegian" }
];
const REDUCED_TIMEZONES = [
    "UTC",
    "UTC-11:00",
    "UTC-10:00 (Hawaii)",
    "UTC-09:00 (Alaska)",
    "UTC-08:00 (Pacific Time - US/Canada)",
    "UTC-07:00 (Mountain Time - US/Canada)",
    "UTC-06:00 (Central Time - US/Canada)",
    "UTC-05:00 (Eastern Time - US/Canada)",
    "UTC-04:00 (Atlantic Time - Canada, Caracas)",
    "UTC-03:00 (Buenos Aires, Sao Paulo)",
    "UTC-02:00 (Mid-Atlantic)",
    "UTC-01:00 (Azores)",
    "UTC+00:00 (London, Lisbon)",
    "UTC+01:00 (Central European Time)",
    "UTC+02:00 (Eastern European Time)",
    "UTC+03:00 (Moscow, Istanbul)",
    "UTC+04:00 (Dubai)",
    "UTC+05:00 (Karachi, Maldives)",
    "UTC+05:30 (India)",
    "UTC+06:00 (Dhaka)",
    "UTC+07:00 (Bangkok, Jakarta)",
    "UTC+08:00 (Beijing, Singapore)",
    "UTC+09:00 (Tokyo, Seoul)",
    "UTC+09:30 (Adelaide)",
    "UTC+10:00 (Sydney, Melbourne)",
    "UTC+11:00 (Solomon Is.)",
    "UTC+12:00 (Auckland, Fiji)"
];

export default function SubscribersView({ activeWorkspaceId, setActiveTab }: { activeWorkspaceId: string; setActiveTab: any }) {

    const getInitials = (fullName: string | null | undefined, externalId: string) => {
        if (fullName && fullName.trim()) {
            const parts = fullName.trim().split(' ');
            if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            if (parts[0].length >= 2) return `${parts[0][0]}${parts[0][1]}`.toUpperCase();
            return parts[0][0].toUpperCase();
        }
        return externalId.substring(0, 2).toUpperCase();
    };

    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        external_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        locale: "en-US",
        timezone: "UTC",
        custom_data: "{}"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState<any | null>(null);
    const [editingSubscriberId, setEditingSubscriberId] = useState<string | null>(null);
    const [subscriberLogs, setSubscriberLogs] = useState<any[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    const handleOpenProfile = async (sub: any) => {
        setSelectedSubscriber(sub);
        setIsLoadingLogs(true);
        setSubscriberLogs([]);
        try {
            const res = await fetch(`/api/subscribers/${sub.id}/logs`);
            const data = await res.json();
            if (data.logs) {
                setSubscriberLogs(data.logs);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/subscribers${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`);
            const data = await res.json();
            if (data.subscribers) {
                setSubscribers(data.subscribers);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleBlacklist = async (id: string, currentStatus: boolean) => {
        const confirmMsg = currentStatus
            ? "Are you sure you want to resubscribe this recipient? They will start receiving messages again."
            : "Are you sure you want to blacklist this recipient? They will be skipped from any future delivery.";

        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch(`/api/subscribers/${id}/blacklist${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_unsubscribed: !currentStatus })
            });

            if (res.ok) {
                const data = await res.json();
                // Update local state lists instantly
                setSubscribers(prev => prev.map(s => s.id === id ? { ...s, is_unsubscribed: data.is_unsubscribed } : s));
                if (selectedSubscriber?.id === id) {
                    setSelectedSubscriber({ ...selectedSubscriber, is_unsubscribed: data.is_unsubscribed });
                }
            } else {
                alert("Error modifying blacklist status");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [activeWorkspaceId]);

    const handleDeleteSubscriber = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this recipient?")) return;
        try {
            const res = await fetch(`/api/subscribers?id=${id}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`, { method: 'DELETE' });
            if (res.ok) fetchSubscribers();
            else alert("Error deleting recipient");
        } catch (err) { console.error(err); }
    };

    const handleOpenEdit = (sub: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSubscriberId(sub.id);

        let nameParts = sub.full_name ? sub.full_name.split(' ') : [''];
        let customStr = '{}';

        // Prepare display fields for custom attributes
        const displayCustom = { ...sub.custom_attributes };
        delete displayCustom.locale;
        delete displayCustom.timezone;

        try { customStr = Object.keys(displayCustom).length ? JSON.stringify(displayCustom, null, 2) : '{\n  \n}'; } catch (e) { }

        setFormData({
            external_id: sub.external_id || '',
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: sub.email || '',
            phone: sub.phone_number || '',
            locale: sub.locale || sub.custom_attributes?.locale || 'en-US',
            timezone: sub.timezone || sub.custom_attributes?.timezone || 'UTC',
            custom_data: customStr
        });
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setEditingSubscriberId(null);
        setFormData({ external_id: "", first_name: "", last_name: "", email: "", phone: "", locale: "en-US", timezone: "UTC", custom_data: "{}" });
    };

    const handleCreateSubscriber = async () => {
        setIsSubmitting(true);
        try {
            let parsedMetadata = {};
            try {
                parsedMetadata = JSON.parse(formData.custom_data);
            } catch (e) {
                alert("Custom Data must be valid JSON");
                setIsSubmitting(false);
                return;
            }

            const fullName = `${formData.first_name} ${formData.last_name}`.trim();

            const method = editingSubscriberId ? "PUT" : "POST";
            const payload = {
                id: editingSubscriberId,
                external_id: formData.external_id,
                email: formData.email,
                phone_number: formData.phone,
                full_name: fullName,
                custom_data: {
                    ...parsedMetadata,
                    locale: formData.locale,
                    timezone: formData.timezone
                }
            };

            const res = await fetch(`/api/subscribers${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                closeSidebar();
                fetchSubscribers();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create subscriber");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative overflow-x-hidden">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between mb-8 pr-4">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="text-white">Recipients</span>
                    <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-full text-slate-400">
                        {subscribers.length} total
                    </span>
                </h2>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden sm:block">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search recipients..."
                            className="w-64 bg-[#050505] border border-white/5 pl-10 pr-4 py-2 rounded-xl text-sm text-white focus:bg-white/[0.02] focus:border-accent/50 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                    {subscribers.length > 0 && (
                        <button
                            onClick={() => {
                                setEditingSubscriberId(null);
                                setFormData({ external_id: "", first_name: "", last_name: "", email: "", phone: "", locale: "en-US", timezone: "UTC", custom_data: "{}" });
                                setIsSidebarOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Recipient
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                {/* Empty State */}
                {!isLoading && subscribers.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center -mt-10">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-accent/5 border border-accent/20 flex flex-col items-center justify-center relative z-10 mx-auto">
                                <UsersIcon className="w-8 h-8 text-accent" />
                            </div>
                            <div className="w-[1px] h-10 bg-gradient-to-b from-accent/30 to-transparent mx-auto border-dashed border-l border-accent/30" />
                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center border-dashed mx-auto mt-2">
                                <Plus className="w-6 h-6 text-slate-600" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No recipients registered</h3>
                        <p className="text-slate-500 max-w-sm text-center text-sm mb-6 leading-relaxed">
                            A recipient represents a user who can receive notifications. Profiles are created either dynamically upon sending a message or via API synchronization.
                        </p>
                        <div className="flex gap-4">
                            <a href="/docs" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Sync via API
                            </a>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Recipient
                            </button>
                        </div>
                    </div>
                )}

                {/* Table View */}
                {!isLoading && subscribers.length > 0 && (
                    <div className="border border-white/10 rounded-2xl bg-[#050505] overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest w-[250px]">Recipient</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Contact Information</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">External ID</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.filter(sub => {
                                    if (!searchTerm) return true;
                                    const s = searchTerm.toLowerCase();
                                    return (
                                        (sub.full_name && sub.full_name.toLowerCase().includes(s)) ||
                                        (sub.email && sub.email.toLowerCase().includes(s)) ||
                                        (sub.external_id && sub.external_id.toLowerCase().includes(s)) ||
                                        (sub.phone_number && sub.phone_number.toLowerCase().includes(s))
                                    );
                                }).map((sub, i) => (
                                    <tr key={sub.id} onClick={() => handleOpenProfile(sub)} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center font-black text-white/70 overflow-hidden text-sm uppercase relative">
                                                    {sub.custom_attributes?.avatar ? (
                                                        <img src={sub.custom_attributes.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : sub.relay_developer_avatar ? (
                                                        <img src={sub.relay_developer_avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : sub.email ? (
                                                        <>
                                                            <img
                                                                src={`https://unavatar.io/${sub.email}?fallback=false`}
                                                                alt="Avatar"
                                                                className="w-full h-full object-cover z-10 relative"
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                            <span className="absolute inset-0 flex items-center justify-center z-0">{getInitials(sub.full_name, sub.external_id)}</span>
                                                        </>
                                                    ) : (
                                                        getInitials(sub.full_name, sub.external_id)
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold text-sm ${sub.is_unsubscribed ? 'text-slate-500 line-through' : 'text-white'}`}>{sub.full_name || sub.external_id || 'Unknown'}</span>
                                                        {sub.is_unsubscribed && <span className="text-[8px] px-1.5 py-0.5 rounded font-black border border-rose-500/20 text-rose-500 bg-rose-500/10 uppercase tracking-widest">Unsubscribed</span>}
                                                    </div>
                                                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{sub.custom_attributes?.locale || sub.locale || 'EN-US'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex flex-col gap-1.5">
                                                {sub.email ? (
                                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                        <Mail className="w-3.5 h-3.5 text-slate-500" /> {sub.email}
                                                    </div>
                                                ) : <span className="text-slate-700 text-sm italic">No email</span>}
                                                {sub.phone_number ? (
                                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                        <Phone className="w-3.5 h-3.5 text-slate-500" /> {sub.phone_number}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-3.5 h-3.5 text-accent" />
                                                <span className="text-slate-400 font-mono text-xs">{sub.external_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-slate-500">
                                                <span className="text-xs font-medium">
                                                    {new Date(sub.created_at).toLocaleDateString()}
                                                </span>
                                                <button onClick={(e) => handleOpenEdit(sub, e)} className="p-1 hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={(e) => handleDeleteSubscriber(sub.id, e)} className="p-1 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="w-full flex justify-center py-20">
                        <div className="relative">
                            <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            {/* Slideover for Creation */}
            <AnimatePresence>
                {selectedSubscriber && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSubscriber(null)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#0A0A0A] border-l border-white/10 z-[110] flex flex-col shadow-2xl"
                        >
                            <div className="px-6 py-8 border-b border-white/10 bg-[#050505] flex flex-col items-center justify-center relative">
                                <button
                                    onClick={() => setSelectedSubscriber(null)}
                                    className="absolute top-5 right-5 p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/70 overflow-hidden text-2xl uppercase mb-4 shadow-xl relative">
                                    {selectedSubscriber.custom_attributes?.avatar ? (
                                        <img src={selectedSubscriber.custom_attributes.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : selectedSubscriber.relay_developer_avatar ? (
                                        <img src={selectedSubscriber.relay_developer_avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : selectedSubscriber.email ? (
                                        <>
                                            <img
                                                src={`https://unavatar.io/${selectedSubscriber.email}?fallback=false`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover z-10 relative"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center z-0">{getInitials(selectedSubscriber.full_name, selectedSubscriber.external_id)}</span>
                                        </>
                                    ) : (
                                        getInitials(selectedSubscriber.full_name, selectedSubscriber.external_id)
                                    )}
                                </div>
                                <h3 className={`text-xl font-black mt-2 ${selectedSubscriber.is_unsubscribed ? 'text-slate-500 line-through' : 'text-white'}`}>{selectedSubscriber.full_name || selectedSubscriber.external_id}</h3>
                                <p className="text-slate-500 font-mono text-xs mt-1">#{selectedSubscriber.external_id}</p>

                                {selectedSubscriber.is_unsubscribed && (
                                    <div className="mt-3 px-3 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <X className="w-3 h-3" /> Blacklisted manually
                                    </div>
                                )}

                                <div className="flex flex-wrap justify-center items-center gap-3 mt-5">
                                    {selectedSubscriber.email && (
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                            <Mail className="w-3.5 h-3.5 text-accent" /> {selectedSubscriber.email}
                                        </div>
                                    )}
                                    {selectedSubscriber.phone_number && (
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                            <Phone className="w-3.5 h-3.5 text-emerald-500" /> {selectedSubscriber.phone_number}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleToggleBlacklist(selectedSubscriber.id, !!selectedSubscriber.is_unsubscribed)}
                                    className={`mt-6 w-full max-w-[200px] py-2 rounded-xl text-xs font-bold transition-all border ${selectedSubscriber.is_unsubscribed ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white' : 'bg-rose-500/5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40'} uppercase tracking-widest`}
                                >
                                    {selectedSubscriber.is_unsubscribed ? 'Re-Subscribe User' : 'Blacklist Recipient'}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                    Notification History
                                </h4>

                                {isLoadingLogs ? (
                                    <div className="w-full flex justify-center py-10">
                                        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                    </div>
                                ) : subscriberLogs.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Calendar className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <p className="text-sm text-slate-400">No notifications sent yet.</p>
                                    </div>
                                ) : (
                                    <div className="relative border-l border-white/10 ml-2 space-y-8 pb-10">
                                        {subscriberLogs.map((log: any) => (
                                            <div key={log.id} className="relative pl-6">
                                                <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-[#0A0A0A] ${log.status === 'delivered' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />

                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-white text-sm capitalize">{log.platform}</span>
                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 leading-relaxed mt-1">
                                                        {log.message_excerpt}
                                                    </p>
                                                    {log.status !== 'delivered' && log.metadata?.error_message && (
                                                        <div className="mt-2 text-[10px] bg-rose-500/10 text-rose-400 p-2 rounded border border-rose-500/20 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                                                            {log.metadata.error_message}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Slideover for Creation */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeSidebar}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#0A0A0A] border-l border-white/10 z-[110] flex flex-col shadow-2xl"
                        >
                            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#050505]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <UserCircle className="w-5 h-5 text-accent" /> {editingSubscriberId ? 'Edit Recipient' : 'New Recipient'}
                                </h3>
                                <button
                                    onClick={closeSidebar}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                {/* Profile Mockup */}
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <UsersIcon className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <div className="flex gap-4 flex-1">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">First Name</label>
                                            <input
                                                value={formData.first_name}
                                                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                                placeholder="John"
                                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Last Name</label>
                                            <input
                                                value={formData.last_name}
                                                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                                placeholder="Doe"
                                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">User ID / External ID <span className="text-rose-500">*</span></label>
                                            <span onClick={() => setIsHelpOpen(true)} className="text-xs text-accent cursor-pointer hover:underline">How it works?</span>
                                        </div>
                                        <input
                                            value={formData.external_id}
                                            onChange={e => setFormData({ ...formData, external_id: e.target.value })}
                                            placeholder="usr_9e1342a6d437"
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:border-accent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">A unique identifier mapping to your database user ID.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="hello@example.com"
                                                    className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Locale</label>
                                            <select
                                                value={formData.locale}
                                                onChange={e => setFormData({ ...formData, locale: e.target.value })}
                                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:border-accent outline-none"
                                            >
                                                {FULL_LOCALES.map(loc => (
                                                    <option key={loc.code} value={loc.code}>{loc.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Timezone</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <select
                                                    value={formData.timezone}
                                                    onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                                                    className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:border-accent outline-none appearance-none"
                                                >
                                                    {REDUCED_TIMEZONES.map(tz => (
                                                        <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <div className="flex items-center gap-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Custom Attributes (JSON)</label>
                                        </div>
                                        <textarea
                                            value={formData.custom_data}
                                            onChange={e => setFormData({ ...formData, custom_data: e.target.value })}
                                            className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-4 font-mono text-xs text-white focus:border-accent outline-none resize-none"
                                            placeholder="{\n  \n}"
                                        />
                                    </div>

                                    <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg mt-6">
                                        <p className="text-sm text-slate-300">
                                            <strong className="text-accent">Note:</strong> Preemptively adding recipients is optional. Valid payloads sent via our SDK will automatically register unmapped recipients.
                                        </p>
                                        <a href="/docs" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white uppercase tracking-widest border-b border-white hover:text-accent hover:border-accent transition-colors mt-2 inline-block">View API Docs</a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#050505] flex items-center justify-between">
                                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white underline">Data Privacy Policy</a>
                                <button
                                    onClick={handleCreateSubscriber}
                                    disabled={!formData.external_id || isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : null}
                                    Save Recipient
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Help Modal */}
            <AnimatePresence>
                {isHelpOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsHelpOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#0A0A0A] border border-accent/30 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#050505]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <Hash className="w-5 h-5 text-accent" /> What is an External ID?
                                </h3>
                                <button
                                    onClick={() => setIsHelpOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed">
                                <p>
                                    Relay allows you to map your own application's users seamlessly. Instead of forcing you to use our internal UUIDs, you bring your own identifiers.
                                </p>
                                <p>
                                    If your user in your database has the ID <code className="bg-white/10 px-1 py-0.5 rounded text-accent font-mono">usr_123</code>, you can simply use <code className="bg-white/10 px-1 py-0.5 rounded text-accent font-mono">usr_123</code> here as their <strong>External ID</strong>.
                                </p>
                                <p>
                                    When you send a notification payload aimed at <code className="bg-white/10 px-1 py-0.5 rounded text-slate-400 font-mono">usr_123</code>, Relay will automatically match it and dispatch it via the channels linked to this Recipient Profile.
                                </p>
                                <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                                    <button
                                        onClick={() => setIsHelpOpen(false)}
                                        className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                    >
                                        Got it
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

function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
