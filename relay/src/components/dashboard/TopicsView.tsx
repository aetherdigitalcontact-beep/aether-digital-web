"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Layers, ExternalLink, X, KeySquare, Calendar, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopicsView({ activeWorkspaceId, setActiveTab }: { activeWorkspaceId: string; setActiveTab: any }) {

    const getInitials = (fullName: string | null | undefined, externalId: string) => {
        if (fullName && fullName.trim()) {
            const parts = fullName.trim().split(' ');
            if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            if (parts[0].length >= 2) return `${parts[0][0]}${parts[0][1]}`.toUpperCase();
            return parts[0][0].toUpperCase();
        }
        return externalId.substring(0, 2).toUpperCase();
    };

    const [topics, setTopics] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const [recipientIds, setRecipientIds] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [segmentMembers, setSegmentMembers] = useState<any[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [memberSearchTerm, setMemberSearchTerm] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        key: "",
        rules: [] as { id: string, field: string, operator: string, value: string }[]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTopics = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/topics${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`);
            const data = await res.json();
            if (data.topics) {
                setTopics(data.topics);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, [activeWorkspaceId]);

    const handleDeleteTopic = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this segment?")) return;
        try {
            const res = await fetch(`/api/topics?id=${id}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`, { method: 'DELETE' });
            if (res.ok) fetchTopics();
            else alert("Error deleting segment");
        } catch (err) { console.error(err); }
    };

    const handleCreateTopic = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/topics${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ name: "", key: "", rules: [] });
                fetchTopics();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create topic");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddRecipients = async () => {
        if (!selectedTopic || !recipientIds.trim()) return;
        setIsSubmitting(true);
        try {
            const externalIds = recipientIds.split(',').map(id => id.trim()).filter(Boolean);
            const res = await fetch(`/api/topics/${selectedTopic.key}/subscribers${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscribers: externalIds })
            });

            if (res.ok) {
                setIsManageOpen(false);
                setRecipientIds("");
                setErrorMsg(null);
                fetchTopics();
            } else {
                const data = await res.json();
                setErrorMsg(data.error || "Failed to link recipients");
            }
        } catch (err) {
            setErrorMsg("An unexpected network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchSegmentMembers = async (topic: any) => {
        setIsLoadingMembers(true);
        try {
            const res = await fetch(`/api/topics/${topic.key}/subscribers${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`);
            const data = await res.json();
            if (data.subscribers) {
                setSegmentMembers(data.subscribers);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMembers(false);
        }
    };

    const handleRemoveMember = async (subscriberId: string) => {
        try {
            const res = await fetch(`/api/topics/${selectedTopic.key}/subscribers?subscriberId=${subscriberId}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchSegmentMembers(selectedTopic);
                fetchTopics(); // update member count globally
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between mb-8 pr-4">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="text-white">Segments</span>
                    <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-full text-slate-400">
                        {topics.length} total
                    </span>
                </h2>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden sm:block">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search segments..."
                            className="w-64 bg-[#050505] border border-white/5 pl-10 pr-4 py-2 rounded-xl text-sm text-white focus:bg-white/[0.02] focus:border-accent/50 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                    {topics.length > 0 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Create Segment
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                {/* Empty State */}
                {!isLoading && topics.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center -mt-10">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex flex-col items-center justify-center relative z-10 mx-auto">
                                <Layers className="w-8 h-8 text-rose-500" />
                            </div>
                            <div className="w-[1px] h-10 bg-gradient-to-b from-rose-500/30 to-transparent mx-auto border-dashed border-l border-rose-500/30" />
                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center border-dashed mx-auto mt-2">
                                <Plus className="w-6 h-6 text-slate-600" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No Segments Created</h3>
                        <p className="text-slate-500 max-w-sm text-center text-sm mb-6 leading-relaxed">
                            Segments group multiple recipients together, enabling efficient broadcast of a single notification to targeted user bases simultaneously.
                        </p>
                        <div className="flex gap-4">
                            <a href="/docs" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Sync via API
                            </a>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Create Segment
                            </button>
                        </div>
                    </div>
                )}

                {/* Table View */}
                {!isLoading && topics.length > 0 && (
                    <div className="border border-white/10 rounded-2xl bg-[#050505] overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest w-[250px]">Segment</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Segment Key</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center hidden lg:table-cell">Member Count</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topics.map((topic, i) => (
                                    <tr key={topic.id} onClick={() => { setSelectedTopic(topic); setIsManageOpen(true); setErrorMsg(null); fetchSegmentMembers(topic); }} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/10 flex flex-col items-center justify-center text-accent">
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm">{topic.name}</span>
                                                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{topic.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <KeySquare className="w-3.5 h-3.5 text-slate-500" />
                                                <span className="text-slate-400 font-mono text-sm">{topic.key}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center hidden lg:table-cell">
                                            <span className="text-white font-bold px-3 py-1 pb-1.5 bg-white/5 rounded-full text-xs">
                                                {topic.subscriber_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-slate-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium">
                                                    {new Date(topic.created_at).toLocaleDateString()}
                                                </span>
                                                <button onClick={(e) => handleDeleteTopic(topic.id, e)} className="p-1 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
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
                            <div className="w-10 h-10 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            {/* Creation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        >
                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                            >
                                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#050505]">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                        <Layers className="w-5 h-5 text-accent" /> Create a Segment
                                    </h3>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Segment Name <span className="text-rose-500">*</span></label>
                                        <input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Investors Updates"
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Segment Key <span className="text-rose-500">*</span></label>
                                        <input
                                            value={formData.key}
                                            onChange={e => setFormData({ ...formData, key: e.target.value })}
                                            placeholder="e.g. investors-updates"
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:border-accent outline-none transition-colors"
                                        />
                                        <p className="text-xs text-slate-500">A unique identifier used to target this segment via the API. Alphanumeric characters, dashes, and underscores only.</p>
                                    </div>

                                    <div className="space-y-4 mt-6 border-t border-white/5 pt-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Dynamic Rules (Optional)</h4>
                                            <button
                                                onClick={() => setFormData({ ...formData, rules: [...formData.rules, { id: Math.random().toString(), field: '', operator: 'equals', value: '' }] })}
                                                className="text-xs font-bold text-accent hover:text-blue-400 transition-colors flex items-center gap-1"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add Rule
                                            </button>
                                        </div>
                                        {formData.rules.map((rule, idx) => (
                                            <div key={rule.id} className="flex flex-col sm:flex-row items-center gap-2 bg-white/[0.02] p-2 rounded-xl border border-white/5">
                                                <input
                                                    value={rule.field}
                                                    onChange={e => { const newRules = [...formData.rules]; newRules[idx].field = e.target.value; setFormData({ ...formData, rules: newRules }); }}
                                                    placeholder="Field (e.g. locale, metadata.tier)"
                                                    className="w-full sm:flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-accent outline-none"
                                                />
                                                <select
                                                    value={rule.operator}
                                                    onChange={e => { const newRules = [...formData.rules]; newRules[idx].operator = e.target.value; setFormData({ ...formData, rules: newRules }); }}
                                                    className="w-full sm:w-28 bg-[#050505] border border-white/10 rounded-lg px-2 py-2 text-[11px] font-medium text-white focus:border-accent outline-none appearance-none"
                                                >
                                                    <option value="equals">Equals</option>
                                                    <option value="not_equals">Not Equals</option>
                                                    <option value="contains">Contains</option>
                                                    <option value="exists">Exists</option>
                                                </select>
                                                {rule.operator !== 'exists' && (
                                                    <input
                                                        value={rule.value}
                                                        onChange={e => { const newRules = [...formData.rules]; newRules[idx].value = e.target.value; setFormData({ ...formData, rules: newRules }); }}
                                                        placeholder="Value"
                                                        className="w-full sm:flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-accent outline-none"
                                                    />
                                                )}
                                                <button
                                                    onClick={() => { const newRules = formData.rules.filter((_, i) => i !== idx); setFormData({ ...formData, rules: newRules }); }}
                                                    className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-colors w-full sm:w-auto flex justify-center shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg mt-6">
                                        <p className="text-sm text-slate-300">
                                            Recipients can be dynamically evaluated based on the rules applied above, or linked statically to this segment.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/10 bg-[#050505] flex items-center justify-end">
                                    <button
                                        onClick={handleCreateTopic}
                                        disabled={!formData.name || !formData.key || isSubmitting}
                                        className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : null}
                                        Create Segment
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Manage Segment Modal */}
            <AnimatePresence>
                {isManageOpen && selectedTopic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsManageOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#050505]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <Layers className="w-5 h-5 text-accent" /> Manage {selectedTopic.name}
                                </h3>
                                <button
                                    onClick={() => { setIsManageOpen(false); setErrorMsg(null); }}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {errorMsg && (
                                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm font-medium">
                                        {errorMsg}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Add Recipients (External IDs or Email) <span className="text-rose-500">*</span></label>
                                    <textarea
                                        value={recipientIds}
                                        onChange={e => setRecipientIds(e.target.value)}
                                        placeholder="usr_123, beta@test.com..."
                                        className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-4 font-mono text-sm text-white focus:border-accent outline-none resize-none transition-colors"
                                    />
                                    <p className="text-xs text-slate-500">Paste the valid External Identifiers separated by commas.</p>
                                </div>



                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            Active Members
                                            {isLoadingMembers && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                                        </h4>
                                        <div className="relative">
                                            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Search members..."
                                                value={memberSearchTerm}
                                                onChange={e => setMemberSearchTerm(e.target.value)}
                                                className="bg-[#050505] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-accent outline-none transition-colors w-40 sm:w-48"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                                        {segmentMembers.length === 0 && !isLoadingMembers ? (
                                            <div className="p-6 text-center text-slate-500 text-sm">
                                                No members in this segment yet.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-white/5">
                                                {segmentMembers.filter(m => !memberSearchTerm || (m.full_name?.toLowerCase().includes(memberSearchTerm.toLowerCase()) || m.external_id?.toLowerCase().includes(memberSearchTerm.toLowerCase()) || m.email?.toLowerCase().includes(memberSearchTerm.toLowerCase()))).map((member, idx) => {
                                                    const avatarUrl = member.custom_attributes?.avatar;
                                                    const initials = getInitials(member.full_name, member.external_id);
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden text-[10px] font-black text-white/70 relative">
                                                                    {avatarUrl ? (
                                                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                                    ) : member.relay_developer_avatar ? (
                                                                        <img src={member.relay_developer_avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                                    ) : member.email ? (
                                                                        <>
                                                                            <img
                                                                                src={`https://unavatar.io/${member.email}?fallback=false`}
                                                                                alt="Avatar"
                                                                                className="w-full h-full object-cover z-10 relative"
                                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                            />
                                                                            <span className="absolute inset-0 flex items-center justify-center z-0">{initials}</span>
                                                                        </>
                                                                    ) : (
                                                                        initials
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-sm font-bold ${member.is_unsubscribed ? 'text-slate-500 line-through' : 'text-white'}`}>{member.full_name || member.external_id}</span>
                                                                        {member.is_unsubscribed && <span className="px-1.5 py-0.5 rounded flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-[8px] font-black tracking-widest text-rose-500 uppercase">Unsubscribed</span>}
                                                                    </div>
                                                                    {member.email && <span className="text-[10px] text-slate-500 tracking-wider truncate">{member.email}</span>}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id); }}
                                                                className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#050505] flex items-center justify-end">
                                <button
                                    onClick={handleAddRecipients}
                                    disabled={!recipientIds.trim() || isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : null}
                                    Link Recipients
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
