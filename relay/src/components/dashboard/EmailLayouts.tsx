"use client";

import React, { useState, useEffect } from 'react';
import {
    Layout, Plus, PlusCircle, Trash2, ArrowRight, Settings,
    Layers, Code, FileText, Square, Camera, Share2,
    Minus, User, Sparkles, Save, Check, GripVertical, Copy,
    Link, ExternalLink, Maximize2, MoveHorizontal, ChevronRight
} from 'lucide-react';

interface Block {
    id: string;
    type: 'text' | 'button' | 'image' | 'social' | 'divider' | 'footer' | 'variable' | 'card-feature' | 'card-horizontal' | 'card-info';
    content?: string;
    title?: string;
    image?: string;
    cta?: string;
    icon?: string;
    externalLink?: string;
    size?: number;
    twitterUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    style?: any;
    data?: any;
}

interface EmailLayout {
    id: string;
    name: string;
    block_data: Block[];
    is_default: boolean;
    updated_at: string;
}

interface EmailLayoutsProps {
    user: any;
    whiteLabel: any;
}

export default function EmailLayouts({ user, whiteLabel }: EmailLayoutsProps) {
    const [layouts, setLayouts] = useState<EmailLayout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [editingLayout, setEditingLayout] = useState<Partial<EmailLayout> | null>(null);
    const [layoutName, setLayoutName] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [sandboxData, setSandboxData] = useState<Record<string, any>>({
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        companyName: "Relay Protocol",
        content: "Your protocol update is ready for review."
    });
    const [isSaving, setIsSaving] = useState(false);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'editor' | 'preview'>('editor');
    const [toolbarPos, setToolbarPos] = useState<{ top: number, left: number } | null>(null);
    const [insertingAfterIdx, setInsertingAfterIdx] = useState<number | null>(null);
    const [optionsMenuIdx, setOptionsMenuIdx] = useState<number | null>(null);
    const [editingImage, setEditingImage] = useState<{ id: string, field: string, url: string, link?: string, size?: number } | null>(null);

    const SocialIcon = ({ type }: { type: string }) => {
        if (type === 'twitter') return <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
        if (type === 'linkedin') return <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.98 0 1.778-.773 1.778-1.729V1.729C24 .774 23.205 0 22.225 0z" /></svg>;
        if (type === 'youtube') return <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
        if (type === 'instagram') return <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.984 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16.02a4.02 4.02 0 1 1 0-8.04 4.02 4.02 0 0 1 0 8.04zm7.846-10.405a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" /></svg>;
        return null;
    }

    const RelayBoltLogo = ({ className }: { className?: string }) => (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <div className="w-5 h-5 bg-[#3B82F6] rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                </svg>
            </div>
            <span className="font-extrabold tracking-tighter text-[11px] text-slate-900">RELAY</span>
        </div>
    );

    useEffect(() => {
        fetchLayouts();
    }, []);

    const fetchLayouts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/email-layouts');
            const data = await res.json();
            if (data.layouts) setLayouts(data.layouts);
        } catch (err) {
            console.error('Failed to fetch layouts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                id: editingLayout?.id,
                name: layoutName,
                block_data: blocks,
                is_default: editingLayout?.is_default || false,
                html_content: generateHtml() // We'll store pre-rendered HTML for the engine
            };

            const method = payload.id ? 'PUT' : 'POST';
            const res = await fetch('/api/email-layouts', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchLayouts();
                setEditingLayout(null);
                setView('list');
            }
        } catch (err) {
            console.error('Failed to save layout:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this layout?")) return;
        try {
            const res = await fetch(`/api/email-layouts?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLayouts(prev => prev.filter(l => l.id !== id));
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const addBlock = (type: Block['type'], index?: number) => {
        let blockData: any = {};
        let initialContent = "";

        if (type === 'text') initialContent = "New text block";
        else if (type === 'card-feature') {
            blockData = {
                title: "Accelerate your workflow",
                content: "Experience the next generation of notification infrastructure with Relay's neutral engine.",
                image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
                cta: "Explore Infrastructure",
                externalLink: "https://relay.aetherdigital.com",
                size: 600
            };
        } else if (type === 'card-horizontal') {
            blockData = {
                title: "Global Delivery Latency",
                content: "Sub-millisecond delivery across all major regions with our distributed edge network.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
                cta: "View Metrics",
                externalLink: "https://relay.aetherdigital.com/metrics",
                size: 200
            };
        } else if (type === 'card-info') {
            blockData = {
                title: "Security & Encryption",
                content: "End-to-end encryption for all sensitive communication payloads and metadata.",
                icon: "shield",
                externalLink: "https://relay.aetherdigital.com/security",
                size: 64
            };
        }

        const newBlock: Block = {
            id: Math.random().toString(36).substring(7),
            type,
            content: initialContent,
            style: { textAlign: 'left', fontWeight: 'normal' },
            ...blockData
        };

        if (typeof index === 'number') {
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setBlocks(newBlocks);
        } else {
            setBlocks([...blocks, newBlock]);
        }

        setActiveBlockId(newBlock.id);
        setInsertingAfterIdx(null);
    };

    const duplicateBlock = (idx: number) => {
        const blockToDuplicate = blocks[idx];
        const newBlock = { ...blockToDuplicate, id: Math.random().toString(36).substring(7) };
        const newBlocks = [...blocks];
        newBlocks.splice(idx + 1, 0, newBlock);
        setBlocks(newBlocks);
        setOptionsMenuIdx(null);
    };

    const updateBlock = (id: string, updates: Partial<Block>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const generateHtml = () => {
        // Simple mock of HTML generation from blocks
        return blocks.map(b => {
            if (b.type === 'text') return `<p style="text-align: ${b.style?.textAlign}">${b.content}</p>`;
            return '';
        }).join('');
    };

    const replaceVars = (text: string) => {
        if (!text) return "";
        return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
            return sandboxData[key] || match;
        });
    };

    const renderEditor = () => {
        const canvasBorderClass = previewMode === 'preview' ? 'ring-8 ring-white/5' : '';
        return (
            <div className="flex flex-col h-full bg-[#050505] overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => { setEditingLayout(null); setView('list'); }} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-all">
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div>
                            <input
                                type="text"
                                value={layoutName}
                                onChange={(e) => setLayoutName(e.target.value)}
                                placeholder="Layout Name"
                                className="bg-transparent border-none outline-none text-white text-lg font-black tracking-tight placeholder:text-slate-700"
                            />
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                <span>Relay Custom Engine</span>
                                {editingLayout?.is_default && <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[8px]">DEFAULT</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-[#0a0a0a] border border-white/5 rounded-xl p-1 mr-4">
                            <button
                                onClick={() => setPreviewMode('editor')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${previewMode === 'editor' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Layout Editor
                            </button>
                            <button
                                onClick={() => setPreviewMode('preview')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${previewMode === 'preview' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Preview
                            </button>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-[0_0_30px_var(--accent-glow)] hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {isSaving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save Layout'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden h-full">
                    {/* Left Panel: Preview Sandbox */}
                    <div className="w-[280px] border-r border-white/5 bg-[#080808]/50 flex flex-col shrink-0">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Preview Sandbox</span>
                            <Sparkles className="w-3 h-3 text-accent" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Mock Subscriber</label>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                        {Object.entries(sandboxData).map(([key, val]) => (
                                            <div key={key} className="space-y-1">
                                                <span className="text-[8px] font-black text-slate-500 uppercase">{key}</span>
                                                <input
                                                    value={val}
                                                    onChange={(e) => setSandboxData({ ...sandboxData, [key]: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-accent/40"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Panel: Block Editor Canvas */}
                    <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
                        <div className="flex-1 overflow-y-auto pt-12 px-12 scrollbar-thin scrollbar-thumb-white/10">
                            <div className={`mx-auto w-full max-w-[750px] bg-white rounded-[40px] shadow-2xl transition-all ${canvasBorderClass}`}>
                                <div className="p-12 min-h-[1000px] relative text-slate-800 flex flex-col">
                                    {/* Email Header */}
                                    <div className="flex items-center justify-between mb-12 pb-10 border-b border-slate-50">
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{whiteLabel.corporateName || "Relay"}</p>
                                        </div>
                                    </div>

                                    {/* Blocks Area */}
                                    {blocks.map((block, idx) => {
                                        const blockActiveClasses = activeBlockId === block.id ? 'border-accent/30 bg-accent/[0.01]' : 'border-transparent hover:border-slate-50';
                                        const blockContainerClasses = previewMode === 'editor' ? `p-6 border-2 ${blockActiveClasses}` : '';
                                        return (
                                            <div key={block.id} className="group/row flex items-start gap-4 transition-all pr-12">
                                                {/* Left Side Controls (Novu Style) */}
                                                <div className={`flex items-center gap-1 mt-6 opacity-0 group-hover/row:opacity-100 transition-opacity ${previewMode === 'preview' ? 'hidden' : ''}`}>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                setInsertingAfterIdx(insertingAfterIdx === idx ? null : idx);
                                                                setOptionsMenuIdx(null);
                                                            }}
                                                            className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 border transition-all ${insertingAfterIdx === idx ? 'border-accent text-accent' : 'border-slate-50 text-slate-300'}`}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                        {insertingAfterIdx === idx && (
                                                            <div className="absolute top-0 left-full ml-4 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 grid grid-cols-1 gap-1 min-w-[200px]">
                                                                {[
                                                                    { label: 'Feature Card', id: 'card-feature', icon: <Sparkles className="w-3.5 h-3.5" /> },
                                                                    { label: 'Horizontal Card', id: 'card-horizontal', icon: <Layout className="w-3.5 h-3.5" /> },
                                                                    { label: 'Info Card', id: 'card-info', icon: <Settings className="w-3.5 h-3.5" /> },
                                                                    { label: 'Standard Text', id: 'text', icon: <FileText className="w-3.5 h-3.5" /> }
                                                                ].map(item => (
                                                                    <button
                                                                        key={`${item.id}-${item.label}`}
                                                                        onClick={() => addBlock(item.id as any, idx)}
                                                                        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50 group/btn transition-all text-left w-full"
                                                                    >
                                                                        <div className="text-slate-400 group-hover/btn:text-accent transition-all">{item.icon}</div>
                                                                        <span className="text-xs font-bold text-slate-600 group-hover/btn:text-slate-900">{item.label}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                setOptionsMenuIdx(optionsMenuIdx === idx ? null : idx);
                                                                setInsertingAfterIdx(null);
                                                            }}
                                                            className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 border transition-all ${optionsMenuIdx === idx ? 'border-accent text-accent' : 'border-slate-50 text-slate-300'}`}
                                                        >
                                                            <GripVertical className="w-4 h-4 text-slate-300" />
                                                        </button>
                                                        {optionsMenuIdx === idx && (
                                                            <div className="absolute top-0 left-full ml-4 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl py-1 min-w-[160px] overflow-hidden">
                                                                <button
                                                                    onClick={() => duplicateBlock(idx)}
                                                                    className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 transition-all text-slate-700 hover:text-slate-900 border-b border-slate-50"
                                                                >
                                                                    <Copy className="w-4 h-4 text-slate-400" />
                                                                    <span className="text-xs font-bold">Duplicate</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => { setBlocks(blocks.filter(b => b.id !== block.id)); setOptionsMenuIdx(null); }}
                                                                    className="flex items-center gap-3 px-4 py-3 w-full hover:bg-rose-50 transition-all text-rose-500 font-bold"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                                                    <span className="text-xs">Delete</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => {
                                                        if (previewMode === 'preview') return;
                                                        setActiveBlockId(block.id);
                                                    }}
                                                    className={`flex-1 transition-all rounded-3xl ${blockContainerClasses}`}
                                                >
                                                    {block.type === 'text' && (
                                                        <div
                                                            className="text-lg font-medium text-slate-700 leading-relaxed outline-none"
                                                            contentEditable={previewMode === 'editor'}
                                                            suppressContentEditableWarning={true}
                                                            onBlur={(e) => updateBlock(block.id, { content: e.target.innerText })}
                                                            style={{ textAlign: block.style?.textAlign, fontWeight: block.style?.fontWeight }}
                                                            dangerouslySetInnerHTML={{ __html: replaceVars(block.content || "") }}
                                                        />
                                                    )}

                                                    {block.type === 'button' && (
                                                        <div className="py-6 flex" style={{ justifyContent: block.style?.textAlign === 'left' ? 'flex-start' : block.style?.textAlign === 'right' ? 'flex-end' : 'center' }}>
                                                            <button className="px-10 py-4 bg-accent rounded-full text-white font-black text-sm shadow-xl shadow-accent/20 hover:scale-105 transition-all active:scale-95">
                                                                {replaceVars(block.content || "Button")}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {block.type === 'social' && (
                                                        <div className="flex items-center gap-8 py-8" style={{ justifyContent: block.style?.textAlign === 'left' ? 'flex-start' : block.style?.textAlign === 'right' ? 'flex-end' : 'center' }}>
                                                            <div className="text-slate-400 hover:text-[#1DA1F2] cursor-pointer transition-all active:scale-95" onClick={() => setEditingImage({ id: block.id, field: 'twitterUrl', url: '', link: block.twitterUrl })}><SocialIcon type="twitter" /></div>
                                                            <div className="text-slate-400 hover:text-[#0A66C2] cursor-pointer transition-all active:scale-95" onClick={() => setEditingImage({ id: block.id, field: 'linkedinUrl', url: '', link: block.linkedinUrl })}><SocialIcon type="linkedin" /></div>
                                                            <div className="text-slate-400 hover:text-[#E4405F] cursor-pointer transition-all active:scale-95" onClick={() => setEditingImage({ id: block.id, field: 'instagramUrl', url: '', link: block.instagramUrl })}><SocialIcon type="instagram" /></div>
                                                            <div className="text-slate-400 hover:text-[#FF0000] cursor-pointer transition-all active:scale-95" onClick={() => setEditingImage({ id: block.id, field: 'youtubeUrl', url: '', link: block.youtubeUrl })}><SocialIcon type="youtube" /></div>
                                                        </div>
                                                    )}

                                                    {block.type === 'card-feature' && (
                                                        <div className="my-8 overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm">
                                                            <img
                                                                src={block.image}
                                                                className="h-96 w-full object-cover cursor-pointer hover:opacity-90 transition-all"
                                                                onClick={() => setEditingImage({ id: block.id, field: 'image', url: block.image || '', link: block.externalLink, size: block.size || 600 })}
                                                            />
                                                            <div className="p-10 space-y-4">
                                                                <h3
                                                                    className="text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter outline-none"
                                                                    contentEditable={previewMode === 'editor'}
                                                                    suppressContentEditableWarning={true}
                                                                    onBlur={(e) => updateBlock(block.id, { title: e.target.innerText })}
                                                                >
                                                                    {block.title}
                                                                </h3>
                                                                <p
                                                                    className="text-slate-500 text-sm leading-relaxed outline-none"
                                                                    contentEditable={previewMode === 'editor'}
                                                                    suppressContentEditableWarning={true}
                                                                    onBlur={(e) => updateBlock(block.id, { content: e.target.innerText })}
                                                                >
                                                                    {block.content}
                                                                </p>
                                                                <button
                                                                    className="mt-4 px-8 py-3 bg-accent rounded-full text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 outline-none"
                                                                    contentEditable={previewMode === 'editor'}
                                                                    suppressContentEditableWarning={true}
                                                                    onBlur={(e) => updateBlock(block.id, { cta: e.target.innerText })}
                                                                >
                                                                    {block.cta}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {block.type === 'card-horizontal' && (
                                                        <div className="my-8 flex gap-4 items-center p-3 rounded-[32px] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100/50 min-h-[500px] overflow-hidden">
                                                            <div className="w-[65%] border-r border-slate-50 h-[500px] shrink-0">
                                                                <img
                                                                    src={block.image}
                                                                    className="w-full h-full object-cover cursor-pointer hover:scale-[1.05] transition-all"
                                                                    onClick={() => setEditingImage({ id: block.id, field: 'image', url: block.image || '', link: block.externalLink, size: block.size || 500 })}
                                                                />
                                                            </div>
                                                            <div className="flex-1 px-6 space-y-4">
                                                                <div className="space-y-3">
                                                                    <h3
                                                                        className="text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-none outline-none"
                                                                        contentEditable={previewMode === 'editor'}
                                                                        suppressContentEditableWarning={true}
                                                                        onBlur={(e) => updateBlock(block.id, { title: e.target.innerText })}
                                                                    >
                                                                        {block.title}
                                                                    </h3>
                                                                    <p
                                                                        className="text-slate-500 text-sm font-medium leading-relaxed outline-none"
                                                                        contentEditable={previewMode === 'editor'}
                                                                        suppressContentEditableWarning={true}
                                                                        onBlur={(e) => updateBlock(block.id, { content: e.target.innerText })}
                                                                    >
                                                                        {block.content}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    className="flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest hover:gap-4 transition-all outline-none"
                                                                    contentEditable={previewMode === 'editor'}
                                                                    suppressContentEditableWarning={true}
                                                                    onBlur={(e) => updateBlock(block.id, { cta: e.target.innerText })}
                                                                >
                                                                    {block.cta || "View Metrics"} <ChevronRight className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {block.type === 'card-info' && (
                                                        <div className="my-8 bg-white rounded-[32px] p-12 text-center space-y-6 relative overflow-hidden group border border-slate-100 shadow-sm">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] rounded-full" />
                                                            <div
                                                                className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm cursor-pointer hover:bg-slate-100 transition-all"
                                                                onClick={() => setEditingImage({ id: block.id, field: 'icon', url: '', link: block.externalLink, size: block.size || 64 })}
                                                            >
                                                                <Sparkles className="w-8 h-8 text-accent" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h3
                                                                    className="text-xl font-black text-slate-900 italic tracking-tighter uppercase outline-none"
                                                                    contentEditable={previewMode === 'editor'}
                                                                    suppressContentEditableWarning={true}
                                                                    onBlur={(e) => updateBlock(block.id, { title: e.target.innerText })}
                                                                >
                                                                    {block.title}
                                                                </h3>
                                                                <p
                                                                    className="text-slate-500 text-sm font-medium outline-none"
                                                                    contentEditable={previewMode === 'editor'}
                                                                    suppressContentEditableWarning={true}
                                                                    onBlur={(e) => updateBlock(block.id, { content: e.target.innerText })}
                                                                >
                                                                    {block.content}
                                                                </p>
                                                            </div>
                                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-8 text-slate-300">
                                                                <Code className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-all" />
                                                                <Layers className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-all" />
                                                                <Check className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-all" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Footer Branding */}
                                    <div className="mt-auto pt-16 pb-12 border-t border-slate-50 flex flex-col items-center gap-6 text-center bg-white px-12 rounded-b-[40px]">
                                        <div className="flex items-center gap-6 opacity-30">
                                            <Share2 className="w-5 h-5 text-slate-400" />
                                            <User className="w-5 h-5 text-slate-400" />
                                            <Layers className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">{whiteLabel.corporateName || "Relay Bot"}</p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight italic">Transmission Infrastructure Secured by Relay</p>
                                        </div>
                                        <div className="mt-12 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all gap-4 bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mt-0.5">Neutral Engine</span>
                                            <RelayBoltLogo />
                                        </div>
                                    </div>

                                    {/* Buffer final Compacto */}
                                    <div className="h-[150px] shrink-0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Side Controls */}
                    <div className={`w-[320px] border-l border-white/5 bg-[#080808]/50 flex flex-col shrink-0 transition-all ${previewMode === 'preview' ? 'w-0 border-none overflow-hidden' : ''}`}>
                        <div className="flex items-center px-4 border-b border-white/5">
                            <button className="flex-1 py-4 text-[10px] font-black text-white uppercase tracking-widest border-b-2 border-accent">Add Blocks</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            <div className="space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Pre-made Cards</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { label: 'Feature Highlight', id: 'card-feature', icon: <Sparkles /> },
                                            { label: 'Horizontal Eco', id: 'card-horizontal', icon: <Layout /> },
                                            { label: 'Security Info', id: 'card-info', icon: <Check /> }
                                        ].map(b => (
                                            <button
                                                key={b.id}
                                                onClick={() => addBlock(b.id as any)}
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/40 hover:bg-accent/5 group transition-all text-left"
                                            >
                                                <div className="text-slate-400 group-hover:text-accent transition-all shrink-0">{React.cloneElement(b.icon as any, { className: "w-5 h-5" })}</div>
                                                <div>
                                                    <span className="block text-[10px] font-black text-white uppercase tracking-widest">{b.label}</span>
                                                    <span className="block text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter italic">Ready to use card</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Structure Blocks</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Text', id: 'text', icon: <FileText /> },
                                            { label: 'Button', id: 'button', icon: <Square /> },
                                            { label: 'Image', id: 'image', icon: <Camera /> },
                                            { label: 'Social', id: 'social', icon: <Share2 /> },
                                            { label: 'Divider', id: 'divider', icon: <Minus /> },
                                            { label: 'Variable', id: 'variable', icon: <Code /> }
                                        ].map(b => (
                                            <button
                                                key={b.id}
                                                onClick={() => addBlock(b.id as any)}
                                                className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/40 hover:bg-accent/5 group transition-all"
                                            >
                                                <div className="text-slate-400 group-hover:text-accent transition-all">{React.cloneElement(b.icon as any, { className: "w-5 h-5" })}</div>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">{b.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlays */}
                {editingImage && (
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-slate-200 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-8 w-80 space-y-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Edit Element</h4>
                            <button onClick={() => setEditingImage(null)} className="p-2 hover:bg-slate-50 rounded-full transition-all">
                                <Plus className="w-4 h-4 text-slate-400 rotate-45" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {editingImage.field !== 'icon' && !editingImage.field.includes('Url') && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <Link className="w-3 h-3" />
                                        Source URL
                                    </label>
                                    <input
                                        type="text"
                                        value={editingImage.url}
                                        onChange={(e) => {
                                            if (editingImage) {
                                                setEditingImage({ ...editingImage, url: e.target.value });
                                                updateBlock(editingImage.id, { [editingImage.field]: e.target.value });
                                            }
                                        }}
                                        placeholder="https://..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <ExternalLink className="w-3 h-3" />
                                    Action Link
                                </label>
                                <input
                                    type="text"
                                    value={editingImage.link || ''}
                                    onChange={(e) => {
                                        if (editingImage) {
                                            const linkField = editingImage.field.includes('Url') ? editingImage.field : 'externalLink';
                                            setEditingImage({ ...editingImage, link: e.target.value });
                                            updateBlock(editingImage.id, { [linkField]: e.target.value });
                                        }
                                    }}
                                    placeholder="https://google.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <MoveHorizontal className="w-3 h-3" />
                                    Size (PX)
                                </label>
                                <input
                                    type="range"
                                    min="20" max="800"
                                    value={editingImage.size || 200}
                                    onChange={(e) => {
                                        if (editingImage) {
                                            setEditingImage({ ...editingImage, size: parseInt(e.target.value) });
                                            updateBlock(editingImage.id, { size: parseInt(e.target.value) });
                                        }
                                    }}
                                    className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-accent"
                                />
                                <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
                                    <span>Min</span>
                                    <span>{editingImage.size || 200}px</span>
                                    <span>Max</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setEditingImage(null)}
                            className="w-full py-3 bg-slate-900 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                            Done Editing
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (view === 'editor') return renderEditor();

    return (
        <div className="p-8 h-full bg-[#050505] overflow-y-auto scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Email Layouts</h2>
                        <p className="text-slate-500 text-sm font-medium">Design professional, branded transactional templates.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingLayout({});
                            setLayoutName("New Branded Layout");
                            setBlocks([]);
                            setView('editor');
                        }}
                        className="group relative px-8 py-4 bg-accent rounded-2xl overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_var(--accent-glow)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 relative z-10">
                            <PlusCircle className="w-5 h-5 text-white" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">Create Layout</span>
                        </div>
                    </button>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : layouts.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-[#080808]/50 border border-white/5 rounded-[40px] border-dashed">
                        <Layout className="w-16 h-16 text-slate-800" />
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">No Layouts Yet</h3>
                            <p className="text-slate-500 text-sm max-w-sm">Every transmission needs a skin. Create your first global brand layout.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {layouts.map(layout => (
                            <div
                                key={layout.id}
                                onClick={() => {
                                    setEditingLayout(layout);
                                    setBlocks(layout.block_data || []);
                                    setLayoutName(layout.name);
                                    setView('editor');
                                }}
                                className="group relative bg-[#080808] border border-white/5 rounded-3xl p-6 hover:border-accent/40 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="h-40 rounded-2xl bg-white/[0.02] mb-6 flex items-center justify-center relative overflow-hidden">
                                    <Layout className="w-12 h-12 text-slate-900 group-hover:text-accent/20 transition-all" />
                                    {layout.is_default && (
                                        <div className="absolute top-4 left-4 px-2 py-1 rounded bg-accent text-[8px] font-black text-white uppercase">Default</div>
                                    )}
                                </div>
                                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1 group-hover:text-accent transition-all">{layout.name}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Updated {new Date(layout.updated_at).toLocaleDateString()}</p>
                                <button
                                    onClick={(e) => handleDelete(layout.id, e)}
                                    className="absolute top-6 right-6 p-2 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
