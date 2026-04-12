"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    Bot,
    Camera,
    Check,
    ChevronDown,
    Clock,
    Code,
    Copy,
    CreditCard,
    Cpu,
    Database,
    Eye,
    EyeOff,
    FileText,
    FlaskConical,
    Globe,
    Hash,
    Key,
    Key as KeyIcon,
    LayoutDashboard,
    Link2,
    Lock,
    LogOut,
    Mail,
    MessageSquare,
    Minus,
    Network,
    Pencil,
    Play,
    Plus,
    Save,
    Settings,
    Shield,
    ShieldAlert,
    ShoppingBag,
    Sparkles,
    Store,
    Target,
    Terminal,
    Trash2,
    TrendingUp,
    Upload,
    User,
    UserPlus,
    Webhook,
    X,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, Language } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

interface ApiKey {
    id: string;
    label: string;
    key_hash: string;
    created_at: string;
    is_active: boolean;
    call_count: number;
}

const languages = [
    { code: 'en', name: 'English', flag: 'us' },
    { code: 'es', name: 'Español', flag: 'es' },
    { code: 'pt', name: 'Português', flag: 'br' },
    { code: 'ru', name: 'Русский', flag: 'ru' },
    { code: 'fr', name: 'Français', flag: 'fr' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'zh', name: '中文', flag: 'cn' },
    { code: 'ja', name: '日本語', flag: 'jp' },
    { code: 'it', name: 'Italiano', flag: 'it' },
] as const;

export default function DashboardPage() {
    const router = useRouter();
    const [lang, setLang] = useState<Language>('en');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview"); // Default tab
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

    // Modal & Key Generation State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keyLabel, setKeyLabel] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [isCreatingKey, setIsCreatingKey] = useState(false);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [copied, setCopied] = useState(false);

    const [stats, setStats] = useState({
        success: 0,
        failureRate: "0%",
        latency: "0ms",
        uptime: "100%",
        usage: 0,
        limit: 100,
        trends: {
            success: "+0%",
            failureRate: "-0%",
            latency: "0ms"
        },
        plan: 'FREE'
    });
    const [logs, setLogs] = useState<any[]>([]);
    const [isLogsLoading, setIsLogsLoading] = useState(false);
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [isWebhooksLoading, setIsWebhooksLoading] = useState(false);
    const [domains, setDomains] = useState<any[]>([]);
    const [isDomainsLoading, setIsDomainsLoading] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [templateContent, setTemplateContent] = useState("");
    const [testConfig, setTestConfig] = useState({
        platform: "telegram",
        platforms: ["telegram"],
        target: "",
        message: "",
        variables: "{}",
        category: "general",
        botName: "",
        botAvatar: ""
    });

    const [aiStats, setAiStats] = useState<any>(null);
    const [isAILoading, setIsAILoading] = useState(false);
    const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
    const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
    const [editingScenarioName, setEditingScenarioName] = useState("");
    const [testResult, setTestResult] = useState<any>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [isRawJsonVisible, setIsRawJsonVisible] = useState(false);
    const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
    const [showAdvancedCondition, setShowAdvancedCondition] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
    const [webhookModalMode, setWebhookModalMode] = useState<'create' | 'connector'>('create');
    const [webhookUrl, setWebhookUrl] = useState("");
    const [webhookLabel, setWebhookLabel] = useState("");
    const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
    const [domainHostname, setDomainHostname] = useState("");
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const cropCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [tempUser, setTempUser] = useState<any>(null);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preferences, setPreferences] = useState({
        autoRefresh: true,
        notifications: true,
        highPerformance: true
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [logFilters, setLogFilters] = useState({ platform: 'all', status: '', search: '' });
    const botAvatarInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingBotAvatar, setIsUploadingBotAvatar] = useState(false);
    const [whiteLabel, setWhiteLabel] = useState({
        corporateName: "",
        corporateLogo: "",
        customDomain: ""
    });

    // Canvas Panning State
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [canvasStartX, setCanvasStartX] = useState(0);
    const [canvasScrollLeft, setCanvasScrollLeft] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [sdkTab, setSdkTab] = useState<'nodejs' | 'javascript' | 'python' | 'php' | 'go' | 'curl'>('nodejs');
    const [selectedApiKeyHash, setSelectedApiKeyHash] = useState<string | null>(null);
    const [showIntegrationKey, setShowIntegrationKey] = useState(false);

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        setIsDraggingCanvas(true);
        setCanvasStartX(e.pageX - canvasRef.current.offsetLeft);
        setCanvasScrollLeft(canvasRef.current.scrollLeft);
    };

    const handleCanvasMouseLeave = () => setIsDraggingCanvas(false);
    const handleCanvasMouseUp = () => setIsDraggingCanvas(false);
    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingCanvas || !canvasRef.current) return;
        e.preventDefault();
        const x = e.pageX - canvasRef.current.offsetLeft;
        const walk = (x - canvasStartX) * 1.5;
        canvasRef.current.scrollLeft = canvasScrollLeft - walk;
    };

    // Scenarios (Phase 4)
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [isScenariosLoading, setIsScenariosLoading] = useState(false);
    const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
    const [isSavingScenario, setIsSavingScenario] = useState(false);
    const [isTestingScenario, setIsTestingScenario] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Node Config Modal State
    const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<any>(null);
    const [isInsertingNode, setIsInsertingNode] = useState(false);
    const [insertIndex, setInsertIndex] = useState<number | null>(null);

    const [adminAccounts, setAdminAccounts] = useState<any[]>([]);
    const [isAdminLoading, setIsAdminLoading] = useState(false);

    const fetchAdminAccounts = async () => {
        setIsAdminLoading(true);
        try {
            const res = await fetch('/api/admin/accounts');
            const data = await res.json();
            if (data.accounts) setAdminAccounts(data.accounts);
        } catch (err) {
            console.error('Fetch admin accounts error:', err);
        } finally {
            setIsAdminLoading(false);
        }
    };

    const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
        try {
            const res = await fetch('/api/admin/accounts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, plan: newPlan })
            });
            if (res.ok) {
                fetchAdminAccounts();
                if (userId === user.id) fetchUserData();
            }
        } catch (err) {
            console.error('Update user plan error:', err);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to completely DELETE this user? Their data cannot be recovered.")) return;
        setIsAdminLoading(true);
        try {
            const res = await fetch(`/api/admin/accounts?userId=${userId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchAdminAccounts();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
                setIsAdminLoading(false);
            }
        } catch (err) {
            console.error('Delete user error:', err);
            setIsAdminLoading(false);
        }
    };

    const getInitials = (name: string, fullName?: string) => {
        const target = fullName || name;
        if (!target) return "??";
        return target
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const getPlanStyles = (plan: string) => {
        const p = (plan || 'FREE').toUpperCase();
        if (p === 'STARTER') return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
        if (p === 'PRO') return "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
        if (p === 'ENTERPRISE') return "bg-gradient-to-r from-accent/20 to-purple-500/20 text-white border-accent/40 shadow-[0_0_20px_rgba(59,130,246,0.2)] font-black";
        return "bg-white/10 text-slate-400 border-white/5";
    };

    const fetchUserData = async (retryCount = 0) => {
        try {
            const res = await fetch(`/api/auth/me?t=${new Date().getTime()}`, {
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });

            if (res.status === 401 && retryCount === 0) {
                // Check if we have a Supabase session to sync
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    const syncRes = await fetch('/api/auth/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ access_token: session.access_token })
                    });
                    if (syncRes.ok) {
                        return fetchUserData(1); // Retry once after syncing
                    }
                }
            }

            const data = await res.json();

            if (!res.ok || !data.user) {
                router.push('/auth');
            } else {
                setUser(data.user);
                const savedLang = localStorage.getItem('relay-lang') as Language;
                if (savedLang && dictionaries[savedLang]) setLang(savedLang);

                await Promise.all([fetchApiKeys(), fetchStats()]);
            }
        } catch (err) {
            router.push('/auth');
        }
    };

    // Initial Auth & Data Load
    useEffect(() => {
        fetchUserData().finally(() => setLoading(false));
    }, [router]);

    // Initialize White Label from User
    useEffect(() => {
        if (user) {
            setWhiteLabel({
                corporateName: user.bot_name || "",
                corporateLogo: user.bot_thumbnail || "",
                customDomain: ""
            });
        }
    }, [user]);

    // Tab-based fetching
    const fetchTemplates = async () => {
        setIsTemplatesLoading(true);
        try {
            const res = await fetch(`/api/templates?cb=${new Date().getTime()}`);
            const data = await res.json();
            if (data.templates) setTemplates(data.templates);
        } catch (err) {
            console.error('Fetch templates error:', err);
        } finally {
            setIsTemplatesLoading(false);
        }
    };

    const handleCreateTemplate = async () => {
        try {
            const res = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: templateName, content: templateContent })
            });
            if (res.ok) {
                fetchTemplates();
                setIsTemplateModalOpen(false);
                setTemplateName("");
                setTemplateContent("");
            } else {
                const data = await res.json();
                alert(`Error: ${data.details || data.error || 'Server threw 500. Table might be missing in DB.'}`);
            }
        } catch (err) {
            console.error('Create template error:', err);
            alert('Network error connecting to API');
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        try {
            const res = await fetch(`/api/templates?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchTemplates();
            } else {
                const data = await res.json();
                alert(`Error deleting: ${data.details || data.error}`);
            }
        } catch (err) {
            console.error('Delete template error:', err);
            alert('Network error connecting to API');
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeTab === "overview") {
            fetchApiKeys();
            fetchStats();
            if (preferences.autoRefresh) {
                interval = setInterval(() => {
                    fetchStats();
                }, 5000);
            }
        }
        if (activeTab === "webhooks") fetchWebhooks();
        if (activeTab === "domains") fetchDomains();
        if (activeTab === "templates") fetchTemplates();
        if (activeTab === "relay_ai") fetchAIAnalytics();
        if (activeTab === "scenarios") fetchScenarios();
        if (activeTab === "admin") fetchAdminAccounts();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeTab, preferences.autoRefresh]);

    useEffect(() => {
        if (activeTab === "logs") {
            const delayDebounceFn = setTimeout(() => {
                fetchLogs();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [activeTab, logFilters]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            if (res.ok) {
                setStats({
                    success: data.success,
                    failureRate: data.failureRate,
                    latency: data.latency,
                    uptime: data.uptime,
                    usage: data.usage || 0,
                    limit: data.limit || 100,
                    plan: data.plan || 'FREE',
                    trends: data.trends || { success: "+0%", failureRate: "-0%", latency: "0ms" }
                });
            }
        } catch (err) {
            console.error('Failed to fetch stats');
        }
    };

    const fetchApiKeys = async () => {
        try {
            const res = await fetch('/api/keys');
            const data = await res.json();
            if (res.ok && data.keys) {
                setApiKeys(data.keys);
            }
        } catch (err) {
            console.error('Failed to fetch keys');
        }
    };

    const fetchLogs = async () => {
        setIsLogsLoading(true);
        try {
            const params = new URLSearchParams();
            if (logFilters.platform !== 'all') params.append('platform', logFilters.platform);
            if (logFilters.status) params.append('status', logFilters.status);
            if (logFilters.search) params.append('search', logFilters.search);

            const res = await fetch(`/api/logs?${params.toString()}`);
            const data = await res.json();
            setLogs(data.logs || []);
        } catch (err) {
            console.error('Fetch Logs Error:', err);
        } finally {
            setIsLogsLoading(false);
        }
    };

    const handleDeleteLog = async (id: string) => {
        try {
            const res = await fetch(`/api/logs?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchLogs();
        } catch (err) {
            console.error('Delete Log Error:', err);
        }
    };

    const handleClearAllLogs = async () => {
        if (!confirm("Are you sure you want to wipe THE ENTIRE protocol history? This cannot be undone.")) return;
        try {
            const res = await fetch(`/api/logs?clearAll=true`, { method: 'DELETE' });
            if (res.ok) fetchLogs();
        } catch (err) {
            console.error('Clear All Logs Error:', err);
        }
    };

    const fetchWebhooks = async () => {
        setIsWebhooksLoading(true);
        try {
            const res = await fetch(`/api/webhooks?cb=${new Date().getTime()}`);
            const data = await res.json();
            if (data.webhooks) setWebhooks(data.webhooks);
        } catch (err) {
            console.error('Failed to fetch webhooks:', err);
        } finally {
            setIsWebhooksLoading(false);
        }
    };

    const fetchDomains = async () => {
        setIsDomainsLoading(true);
        try {
            const res = await fetch(`/api/domains?cb=${new Date().getTime()}`);
            const data = await res.json();
            if (data.domains) setDomains(data.domains);
        } catch (err) {
            console.error('Failed to fetch domains:', err);
        } finally {
            setIsDomainsLoading(false);
        }
    };

    const fetchScenarios = async () => {
        setIsScenariosLoading(true);
        try {
            const res = await fetch('/api/scenarios');
            const data = await res.json();
            if (data.scenarios) setScenarios(data.scenarios);
        } catch (err) {
            console.error('Failed to fetch scenarios:', err);
        } finally {
            setIsScenariosLoading(false);
        }
    };

    const handleCreateScenario = async () => {
        try {
            const res = await fetch('/api/scenarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'New Routing Protocol', description: 'Automated webhook delivery pipeline' })
            });
            const data = await res.json();
            if (data.scenario) {
                setScenarios([data.scenario, ...scenarios]);
                setActiveScenarioId(data.scenario.id);
            }
        } catch (err) {
            console.error('Create scenario error:', err);
        }
    };

    const handleUpdateScenarioName = async (id: string, newName: string) => {
        if (!newName.trim()) return;
        try {
            const res = await fetch('/api/scenarios', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name: newName })
            });
            if (res.ok) {
                setScenarios(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
            }
        } catch (err) {
            console.error('Update name error:', err);
        } finally {
            setEditingScenarioId(null);
        }
    };

    const handleSaveScenario = async () => {
        const scenario = scenarios.find(s => s.id === activeScenarioId);
        if (!scenario) return;

        setIsSavingScenario(true);
        setSaveSuccess(false);
        try {
            const res = await fetch('/api/scenarios', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: scenario.id,
                    name: scenario.name,
                    description: scenario.description,
                    nodes: scenario.nodes,
                    edges: scenario.edges,
                    is_active: scenario.is_active
                })
            });
            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Save scenario error:', err);
        } finally {
            setIsSavingScenario(false);
        }
    };

    const handleDeleteScenario = async (ids: string | string[]) => {
        const idArray = Array.isArray(ids) ? ids : [ids];
        if (idArray.length === 0) return;

        if (!window.confirm(`Are you sure you want to permanently delete ${idArray.length} scenario(s)?\nThis action cannot be undone.`)) return;

        try {
            const idStr = idArray.join(',');
            console.log(`📡 Sending delete request for IDs: ${idStr}`);
            const res = await fetch(`/api/scenarios?ids=${idStr}`, { method: 'DELETE' });
            if (res.ok) {
                setScenarios(prev => prev.filter(s => !idArray.includes(s.id)));
                if (activeScenarioId && idArray.includes(activeScenarioId)) {
                    setActiveScenarioId(null);
                }
                setSelectedScenarioIds([]);
                alert(`✅ Successfully deleted ${idArray.length} scenario(s).`);
            } else {
                const err = await res.json();
                console.error('Delete failed:', err);
                alert(`❌ Deletion blocked. Error: ${err.error}`);
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert(`❌ Network or System Error. Cannot reach Relay Engine.`);
        }
    };

    const handleCreateWebhook = async (url: string, label: string) => {
        try {
            const res = await fetch('/api/webhooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, label })
            });
            if (res.ok) {
                fetchWebhooks();
            } else {
                const data = await res.json();
                alert(`Error: ${data.details || data.error || 'Server threw 500. Table might be missing in DB.'}`);
            }
        } catch (err) {
            console.error('Failed to create webhook', err);
            alert('Network error connecting to Webhooks API');
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        try {
            const res = await fetch(`/api/webhooks?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchWebhooks();
            } else {
                const data = await res.json();
                alert(`Error deleting: ${data.details || data.error}`);
            }
        } catch (err) {
            console.error('Failed to delete webhook', err);
            alert('Network error explicitly deleting');
        }
    };

    const handleCreateDomain = async (hostname: string) => {
        try {
            const res = await fetch('/api/domains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hostname })
            });
            if (res.ok) fetchDomains();
        } catch (err) {
            console.error('Failed to create domain');
        }
    };

    const handleDeleteDomain = async (id: string) => {
        try {
            const res = await fetch(`/api/domains?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchDomains();
            } else {
                const data = await res.json();
                alert(`Error deleting: ${data.details || data.error}`);
            }
        } catch (err) {
            console.error('Failed to delete domain', err);
            alert('Network error directly deleting domain');
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
        } catch (err) {
            router.push('/');
        }
    };

    const handleCreateKey = async () => {
        if (!keyLabel.trim()) return;
        setIsCreatingKey(true);
        setErrorMessage(null);
        try {
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: keyLabel,
                    key_hash: "RELAY_PK_" + Math.random().toString(36).substring(2, 15).toUpperCase()
                })
            });
            const data = await res.json();
            if (data.key) {
                setGeneratedKey(data.key.key_hash);
                fetchApiKeys();
                fetchStats();
            } else {
                setErrorMessage(data.error || 'Uplink synchronization failed');
            }
        } catch (error) {
            setErrorMessage('Network error disconnected the uplink');
        } finally {
            setIsCreatingKey(false);
        }
    };

    const handleRevokeKey = async (id: string) => {
        try {
            const res = await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchApiKeys();
                fetchStats();
            }
        } catch (err) {
            console.error('Failed to revoke key');
        }
    };

    const toggleKeyVisibility = (id: string) => {
        const newVisible = new Set(visibleKeys);
        if (newVisible.has(id)) newVisible.delete(id);
        else newVisible.add(id);
        setVisibleKeys(newVisible);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setOriginalImage(event.target?.result as string);
            setErrorMessage(null); // Clear errors
            setIsCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleBotAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingBotAvatar(true);
        setErrorMessage(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Reusing profile update but for temporary/test storage? 
            // Better: just convert to base64 for the test lab if it's small, 
            // or upload to a temp bucket.
            // For now, let's convert to base64 to keep it simple for testing.
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                setTestConfig({ ...testConfig, botAvatar: base64 });
                setIsUploadingBotAvatar(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setErrorMessage("Failed to process bot avatar");
            setIsUploadingBotAvatar(false);
        }
    };


    const handleSaveProfile = async (confirmedPassword?: string) => {
        // Security check for email change
        if (typeof confirmedPassword !== 'string' && tempUser?.email && user?.email && tempUser.email !== user.email) {
            setShowPasswordModal(true);
            return;
        }

        setIsUploading(true);
        setErrorMessage(null);
        try {
            const payload: any = {
                ...tempUser,
                bot_name: whiteLabel.corporateName,
                bot_thumbnail: whiteLabel.corporateLogo
            };
            if (typeof confirmedPassword === 'string') {
                payload.current_password = confirmedPassword;
            }

            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                if (data.message) {
                    setErrorMessage(data.message);
                }

                // Update local user state with new branding and profile info
                const updatedUser = {
                    ...(data.user || user),
                    ...tempUser,
                    bot_name: whiteLabel.corporateName,
                    bot_thumbnail: whiteLabel.corporateLogo
                };

                // Crucial: If verification is pending, don't update the primary email in UI yet
                if (data.message) {
                    updatedUser.email = user.email;
                }

                setUser(updatedUser);
            } else {
                setErrorMessage(data.error || "Update failed");
            }
        } catch (err) {
            setErrorMessage("Connection error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            setErrorMessage("Passwords do not match");
            return;
        }
        try {
            const res = await fetch('/api/profile/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });
            if (res.ok) {
                setIsChangingPassword(false);
                setPasswords({ current: "", new: "", confirm: "" });
            } else {
                const data = await res.json();
                setErrorMessage(data.error || "Password update failed");
            }
        } catch (err) {
            setErrorMessage("Connection error");
        }
    };

    const fetchAIAnalytics = async () => {
        setIsAILoading(true);
        try {
            const res = await fetch(`/api/ai/analytics?cb=${new Date().getTime()}`);
            const data = await res.json();
            if (res.ok) setAiStats(data);
        } catch (err) {
            console.error('Fetch AI Analytics error:', err);
        } finally {
            setIsAILoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setGeneratedKey(null);
        setKeyLabel("");
        setErrorMessage(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="p-1 border-2 border-accent/20 rounded-full animate-spin">
                    <Zap className="w-8 h-8 text-accent" fill="currentColor" />
                </div>
            </div>
        );
    }

    const dict = dictionaries[lang] || dictionaries.en;
    const d = dict.dashboard || dictionaries.en.dashboard;
    const isEnterprise = stats.plan.toUpperCase() === 'ENTERPRISE';

    // Extra safety for the settings object which was recently added
    if (!d.settings) d.settings = dictionaries.en.dashboard.settings;

    const renderRelayAI = () => {
        if (isAILoading) {
            return (
                <div className="flex justify-center p-20">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-accent border-r-2 border-accent/20" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent w-6 h-6 animate-pulse" />
                    </div>
                </div>
            );
        }

        if (!aiStats || aiStats.heatmap.length === 0) {
            return (
                <div className="glass border-dashed border-2 border-white/5 rounded-[40px] p-20 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 italic uppercase tracking-tighter">AI Core Offline</h3>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm">Please initiate more delivery requests to feed the Relay AI engine.</p>
                </div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-20"
            >
                {/* AI Recommendation Header */}
                <div className="p-1 rounded-[40px] bg-gradient-to-r from-accent/50 via-blue-500/50 to-purple-600/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent via-blue-400 to-purple-500 rounded-[42px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                    <div className="bg-slate-950 rounded-[38px] p-10 relative overflow-hidden">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[80px] rounded-full -ml-20 -mb-20" />

                        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                            <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center shadow-inner border border-accent/20">
                                <Sparkles className="w-12 h-12 text-accent" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase italic">Relay AI Intelligence</h1>
                                <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                                    {aiStats.recommendation}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[30px] text-center min-w-[200px]">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Best Window</p>
                                <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{aiStats.bestTime}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Delivery Heatmap (Visual Placeholder for Chart) */}
                    <div className="glass border-white/5 rounded-[40px] p-10 overflow-hidden relative group flex flex-col h-full">
                        <div className="flex items-center justify-between mb-0">
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Hourly Performance</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Activity Density (UTC)</p>
                            </div>
                            <Activity className="w-5 h-5 text-accent opacity-50 transition-transform group-hover:rotate-12" />
                        </div>

                        <div className="flex-1 min-h-[300px] flex items-center justify-between gap-1 mt-10">
                            {aiStats.heatmap.map((d: any, i: number) => {
                                const maxVal = Math.max(...aiStats.heatmap.map((h: any) => h.total));
                                const height = maxVal > 0 ? (d.total / maxVal) * 100 : 0;
                                const isPeak = i === aiStats.bestHour;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group/bar h-full justify-end">
                                        <div className="relative w-full h-full flex items-end justify-center group/tooltip">
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-2 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity z-20 font-bold">
                                                {d.total} msgs
                                            </div>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                className={`w-full rounded-t-lg transition-all duration-500 relative ${isPeak ? 'bg-accent' : 'bg-white/10'}`}
                                                style={{
                                                    background: isPeak
                                                        ? 'var(--accent)'
                                                        : height > 0
                                                            ? `linear-gradient(to top, rgba(59,130,246,0.1), rgba(59,130,246,${0.2 + (height / 200)}))`
                                                            : 'rgba(255,255,255,0.05)',
                                                    boxShadow: height > 0 ? `0 0 15px rgba(59,130,246,${height / 300})` : 'none'
                                                }}
                                            />
                                        </div>
                                        <span className={`text-[8px] mt-2 font-black ${isPeak ? 'text-accent' : 'text-slate-600'}`}>{i}H</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Platform Efficiency */}
                    <div className="space-y-6">
                        {['telegram', 'discord', 'whatsapp', 'slack', 'email'].map((p) => {
                            const efficiency = aiStats.platformEfficiency[p] || { total: 0, successRate: "0%", usageShare: "0%" };
                            const displayPercentage = efficiency.usageShare || efficiency.successRate || "0%";
                            return (
                                <div key={p} className="glass border-white/5 rounded-[30px] p-8 flex items-center justify-between group hover:border-accent/10 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                                            {p === 'telegram' && <Bot className="w-6 h-6" />}
                                            {p === 'discord' && <Zap className="w-6 h-6" />}
                                            {p === 'whatsapp' && <MessageSquare className="w-6 h-6" />}
                                            {p === 'slack' && <Hash className="w-6 h-6" />}
                                            {p === 'email' && <Mail className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white uppercase italic tracking-tighter">{p} Strategy</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{efficiency.total} Deliveries Analyzed</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-white italic tracking-tighter">{displayPercentage}</p>
                                        <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: displayPercentage }}
                                                className="h-full bg-accent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderTemplates = () => {
        const pObj = d.presets || d.dashboard?.presets;
        const systemPresets = [
            { id: 'alrm', name: pObj?.alarm?.name || "Daily Auto-Alarm", content: (pObj?.alarm?.title || "**⏰ SYSTEM ALARM**") + "\n\n" + (pObj?.alarm?.body || "Hello {{user}},\nIt's time for your scheduled reminder.\n\n_Message: {{msg}}_") },
            { id: 'strp', name: pObj?.stripe?.name || "Stripe Sale", content: (pObj?.stripe?.title || "**💰 STRIPE: PAYMENT SUCCESSFUL**") + "\n\n" + (pObj?.stripe?.body || "Customer: **{{customer_name}}**\nAmount: **{{amount}} {{currency}}**\nPlan: {{plan_name}}\n\n*Invoice: {{invoice_id}}*") },
            { id: 'shpf', name: pObj?.shopify?.name || "Shopify Order", content: (pObj?.shopify?.title || "**🛍️ SHOPIFY: NEW ORDER #{{order_number}}**") + "\n\n" + (pObj?.shopify?.body || "Items: {{item_count}}\nTotal: **{{total_price}}**\nShipping: {{shipping_city}}, {{shipping_country}}\n\n*Check the admin panel for fulfillment.*") },
            { id: 'clrk', name: pObj?.clerk?.name || "Clerk Signup", content: (pObj?.clerk?.title || "**👤 CLERK: NEW USER SIGNUP**") + "\n\n" + (pObj?.clerk?.body || "Email: **{{user_email}}**\nProvider: {{oauth_provider}}\nStatus: **Active**\n\n*User ID: {{user_id}}*") },
            { id: 'hub', name: pObj?.hubspot?.name || "HubSpot Deal", content: (pObj?.hubspot?.title || "**🤝 HUBSPOT: NEW DEAL WON!**") + "\n\n" + (pObj?.hubspot?.body || "Deal: **{{deal_name}}**\nAmount: **{{amount}}**\nOwner: {{owner_name}}\n\n🎉 *Congratulations to the team!*") },
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header Features */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2">{d.templates?.title || "Message Templates"}</h1>
                        <p className="text-sm text-slate-400 font-medium">{d.templates?.subtitle || "Create reusable message blueprints with dynamic variables."}</p>
                    </div>
                    <button
                        onClick={() => {
                            setTemplateName("");
                            setTemplateContent("");
                            setIsTemplateModalOpen(true);
                        }}
                        className="w-full md:w-auto bg-accent text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        {d.templates?.createBtn || "CREATE TEMPLATE"}
                    </button>
                </div>

                {/* System Presets Library */}
                <div className="glass border-white/5 rounded-[32px] p-8 -mb-2 space-y-4">
                    <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-accent" /> {d.presets?.libraryTitle || d.dashboard?.presets?.libraryTitle || "System Presets (Library)"}
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {systemPresets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    setTemplateName(preset.name);
                                    setTemplateContent(preset.content);
                                    setIsTemplateModalOpen(true);
                                }}
                                className="flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 hover:border-accent/30 transition-all cursor-pointer min-w-[200px] group"
                            >
                                <div className="font-bold text-white mb-1 group-hover:text-accent transition-colors">{preset.name}</div>
                                <div className="text-[9px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                                    {preset.content}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {isTemplatesLoading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent" />
                    </div>
                ) : templates.length === 0 ? (
                    <div className="glass border-dashed border-2 border-white/5 rounded-[40px] p-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{d.templates?.emptyTitle || "No templates found"}</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">{d.templates?.emptyDesc || "Build your first template to send personalized notifications at scale."}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {templates.map((t) => (
                            <motion.div
                                key={t.id}
                                layout
                                className="glass border-white/10 rounded-[30px] p-8 group hover:border-accent/30 transition-all relative overflow-hidden"
                            >
                                <div className="absolute pointer-events-none top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-accent/10 transition-colors" />
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTemplate(t.id)}
                                        className="p-2 text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{t.name}</h3>
                                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 mb-4 group-hover:border-white/10 transition-colors">
                                    <code className="text-xs text-slate-400 break-words leading-relaxed">
                                        {t.content}
                                    </code>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Active Blueprint</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            onClick={() => {
                                                const matches = [...t.content.matchAll(/\{\{([^}]+)\}\}/g)].map(m => m[1]);
                                                const vars: Record<string, string> = {};
                                                matches.forEach(m => vars[m] = "INSERT_VALUE_HERE");

                                                const jsonSnippet = JSON.stringify({
                                                    template_id: t.id,
                                                    platform: "telegram",
                                                    target: "@tu_usuario",
                                                    variables: vars
                                                }, null, 2);

                                                navigator.clipboard.writeText(jsonSnippet);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                                alert("JSON Automático copiado al portapapeles ✅");
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                                            title="Copiar JSON para API"
                                        >
                                            <Code className="w-3 h-3 text-slate-600" />
                                            <span className="text-[8px] font-black text-slate-500 uppercase">JSON Snippet</span>
                                        </div>
                                        <div
                                            onClick={() => {
                                                navigator.clipboard.writeText(t.id);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full cursor-pointer hover:bg-accent/20 hover:border-accent/50 transition-colors"
                                            title="Copiar ID"
                                        >
                                            <span className="text-[8px] font-mono text-slate-500 uppercase">ID: {t.id.slice(0, 8)}...</span>
                                            <Copy className="w-3 h-3 text-slate-600" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        );
    };

    const renderIntegration = () => {
        const activeKeys = apiKeys.filter(k => k.is_active);
        const currentKey = activeKeys.find(k => k.key_hash === selectedApiKeyHash) || activeKeys[0];
        const apiKey = currentKey?.key_hash || 'YOUR_API_KEY';
        const displayKey = showIntegrationKey ? apiKey : `${apiKey.slice(0, 12)}${'•'.repeat(16)}`;

        const snippets = {
            nodejs: `const fetch = require('node-fetch');\n\nfetch('https://relay.aetherdigital.com/api/relay', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': '${displayKey}'\n  },\n  body: JSON.stringify({\n    platform: 'telegram',\n    target: 'your_chat_id',\n    message: 'Relay Active: Situation Detected',\n    category: 'Alarm / Security',\n    botName: 'Aether Sentinel',\n    variables: { location: 'Warehouse A', severity: 'High' }\n  })\n});`,
            javascript: `// Modern Fetch API (ES6+)\nfetch('https://relay.aetherdigital.com/api/relay', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': '${displayKey}'\n  },\n  body: JSON.stringify({\n    platform: 'whatsapp',\n    target: 'phone_number',\n    message: 'System Alert: {{location}} status is {{severity}}',\n    category: 'Infrastructure',\n    botName: 'Relay AI',\n    variables: { location: 'Server Room', severity: 'Critical' }\n  })\n}).then(r => r.json()).then(console.log);`,
            python: `import requests\nimport json\n\nurl = "https://relay.aetherdigital.com/api/relay"\npayload = {\n    "platform": "telegram",\n    "target": "your_chat_id",\n    "message": "Situation: {{situation}}",\n    "category": "Automation",\n    "botName": "Relay Bot",\n    "variables": {"situation": "Fire Alarm Triggered"}\n}\nheaders = {\n    "Content-Type": "application/json",\n    "x-api-key": "${displayKey}"\n}\n\nresponse = requests.post(url, json=payload, headers=headers)`,
            php: `<?php\n\n$url = "https://relay.aetherdigital.com/api/relay";\n$payload = json_encode([\n    "platform" => "discord",\n    "target" => "webhook_url",\n    "message" => "Invoice #{{id}} Created",\n    "category" => "Billing",\n    "variables" => ["id" => "9921"]\n]);\n\n$ch = curl_init($url);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    "Content-Type: application/json",\n    "x-api-key: ${displayKey}"\n]);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $payload);\n\n$response = curl_exec($ch);\ncurl_close($ch);`,
            go: `package main\n\nimport (\n\t"bytes"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "https://relay.aetherdigital.com/api/relay"\n\tjsonStr := []byte(\`{"platform":"telegram","target":"chat_id","message":"Health Check OK"}\`)\n\treq, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))\n\treq.Header.Set("Content-Type", "application/json")\n\treq.Header.Set("x-api-key", "${displayKey}")\n\n\tclient := \u0026http.Client{}\n\tclient.Do(req)\n}`,
            curl: `curl -X POST https://relay.aetherdigital.com/api/relay \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: ${displayKey}" \\\n  -d '{\n    "platform": "telegram",\n    "target": "your_chat_id",\n    "message": "Universal Uplink Active",\n    "category": "Security / Alarm",\n    "botName": "Aether Sentinel",\n    "variables": {"location": "Main Entrance"}\n  }'`
        };

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2">Integration SDK</h1>
                        <p className="text-sm text-slate-400 font-medium">Connect Relay to your application in seconds using our modern API.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="glass border-white/10 rounded-[40px] p-10 space-y-6">
                        <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <Code className="w-3 h-3" /> Quick Start
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Integrate Relay into your existing workflow by sending a simple POST request to our relay engine.
                            Use the snippets below to get started immediately.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-500">Relay Origin</p>
                                    <p className="text-xs font-bold text-white">https://relay.aetherdigital.com/api/relay</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">Select Key to Use</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {activeKeys.map((k) => (
                                        <button
                                            key={k.id}
                                            onClick={() => setSelectedApiKeyHash(k.key_hash)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${(selectedApiKeyHash === k.key_hash) || (!selectedApiKeyHash && k.id === activeKeys[0]?.id) ? 'bg-accent/10 border-accent/30 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                                        >
                                            <Key className="w-4 h-4" />
                                            <div className="flex-1 text-left">
                                                <p className="text-xs font-bold tracking-tight">{k.label}</p>
                                                <p className="text-[10px] font-mono opacity-50 truncate max-w-[200px]">
                                                    {showIntegrationKey ? k.key_hash : `${k.key_hash.slice(0, 12)}${'•'.repeat(16)}`}
                                                </p>
                                            </div>
                                            {((selectedApiKeyHash === k.key_hash) || (!selectedApiKeyHash && k.id === activeKeys[0]?.id)) && <Check className="w-4 h-4 text-accent" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 border-dashed">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase text-slate-500">Selected Key</p>
                                    <p className="text-xs font-mono text-white truncate max-w-[200px]">{displayKey}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setShowIntegrationKey(!showIntegrationKey)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-500 hover:text-white"
                                    >
                                        {showIntegrationKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(apiKey);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass border-white/10 rounded-[32px] overflow-hidden">
                            <div className="flex items-center gap-1 p-2 bg-white/[0.03] border-b border-white/5 overflow-x-auto scrollbar-hide whitespace-nowrap">
                                {[
                                    { id: 'nodejs', label: 'Node.js' },
                                    { id: 'javascript', label: 'JS Fetch' },
                                    { id: 'python', label: 'Python' },
                                    { id: 'php', label: 'PHP' },
                                    { id: 'go', label: 'Go' },
                                    { id: 'curl', label: 'cURL' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSdkTab(tab.id as any)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer shrink-0 ${sdkTab === tab.id ? 'bg-accent text-white' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 bg-black/40 relative group">
                                <pre className="text-[11px] font-mono text-purple-400 overflow-x-auto">
                                    {snippets[sdkTab]}
                                </pre>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(snippets[sdkTab]);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-accent rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer text-white shadow-xl"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderTestLab = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-white mb-2">{d.testlab?.title || "Test Lab"}</h1>
                        <p className="text-slate-400 font-medium">{d.testlab?.subtitle || "Verify your integration payload and delivery protocols in real-time."}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Test Form */}
                    <div className="glass border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-10 space-y-6 md:space-y-8">
                        {/* Enterprise Presets */}
                        <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-2xl rounded-full -mr-10 -mt-10" />
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> {d.presets?.title || d.dashboard?.presets?.title || "ENTERPRISE PRESETS & SIMULATORS"}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { id: 'shopify', label: d.dashboard?.presets?.shopify?.name || 'Shopify Order', icon: <ShoppingBag className="w-3 h-3" />, color: 'hover:bg-[#95BF47] hover:border-[#95BF47]' },
                                        { id: 'hubspot', label: d.dashboard?.presets?.hubspot?.name || 'HubSpot Deal', icon: <Target className="w-3 h-3" />, color: 'hover:bg-[#FF7A59] hover:border-[#FF7A59]' },
                                        { id: 'clerk', label: d.dashboard?.presets?.clerk?.name || 'Clerk Signup', icon: <UserPlus className="w-3 h-3" />, color: 'hover:bg-[#6C47FF] hover:border-[#6C47FF]' },
                                        { id: 'github', label: d.dashboard?.presets?.github?.name || 'GitHub Alert', icon: <ShieldAlert className="w-3 h-3" />, color: 'hover:bg-[#2dba4e] hover:border-[#2dba4e]' },
                                        { id: 'stripe', label: d.dashboard?.presets?.stripe?.name || 'Stripe Sale', icon: <CreditCard className="w-3 h-3" />, color: 'hover:bg-[#635BFF] hover:border-[#635BFF]' },
                                        { id: 'email', label: d.dashboard?.presets?.email?.name || 'Welcome Email', icon: <Mail className="w-3 h-3" />, color: 'hover:bg-indigo-500 hover:border-indigo-500' },
                                        { id: 'security', label: d.dashboard?.presets?.security?.name || 'Security', icon: <Shield className="w-3 h-3" />, color: 'hover:bg-amber-500 hover:border-amber-500' },
                                    ].map(preset => (
                                        <button
                                            key={preset.id}
                                            onClick={() => {
                                                const pObj = d.presets || d.dashboard?.presets;
                                                if (preset.id === 'shopify') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "discord",
                                                        platforms: ["discord"],
                                                        category: "ecommerce",
                                                        botName: "Shopify Bot",
                                                        botAvatar: "https://i.imgur.com/8N4J99f.png",
                                                        message: (pObj?.shopify?.title || "**🛍️ SHOPIFY: NEW ORDER #{{order_number}}**") + "\n\n" + (pObj?.shopify?.body || "Items: {{item_count}}\nTotal: **{{total_price}}**\nShipping: {{shipping_city}}, {{shipping_country}}\n\n*Check the admin panel for fulfillment.*"),
                                                        variables: "{\n  \"order_number\": \"8821\",\n  \"item_count\": 3,\n  \"total_price\": \"$154.50\",\n  \"shipping_city\": \"Miami\",\n  \"shipping_country\": \"US\"\n}"
                                                    });
                                                } else if (preset.id === 'hubspot') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "slack",
                                                        platforms: ["slack"],
                                                        category: "sale",
                                                        botName: "HubSpot Relay",
                                                        message: (pObj?.hubspot?.title || "**🤝 HUBSPOT: NEW DEAL WON!**") + "\n\n" + (pObj?.hubspot?.body || "Deal: **{{deal_name}}**\nAmount: **{{amount}}**\nOwner: {{owner_name}}\n\n🎉 *Congratulations to the team!*"),
                                                        variables: "{\n  \"deal_name\": \"Enterprise License Renewal\",\n  \"amount\": \"$12,500.00\",\n  \"owner_name\": \"Exequiel G.\"\n}"
                                                    });
                                                } else if (preset.id === 'clerk') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "discord",
                                                        platforms: ["discord", "telegram"],
                                                        category: "auth",
                                                        botName: "Clerk Auth",
                                                        message: (pObj?.clerk?.title || "**👤 CLERK: NEW USER SIGNUP**") + "\n\n" + (pObj?.clerk?.body || "Email: **{{user_email}}**\nProvider: {{oauth_provider}}\nStatus: **Active**\n\n*User ID: {{user_id}}*"),
                                                        variables: "{\n  \"user_email\": \"new_user@example.com\",\n  \"oauth_provider\": \"Google\",\n  \"user_id\": \"user_2V9x8Z...\"\n}"
                                                    });
                                                } else if (preset.id === 'github') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "discord",
                                                        platforms: ["discord"],
                                                        category: "security",
                                                        botName: "GitHub Watcher",
                                                        message: (pObj?.github?.title || "**🛡️ GITHUB: SECURITY ALERT**") + "\n\n" + (pObj?.github?.body || "Repo: **{{repo_name}}**\nSeverity: **HIGH**\nIssue: {{description}}\n\n⚠️ *Please audit dependency graph immediately.*"),
                                                        variables: "{\n  \"repo_name\": \"relay-core\",\n  \"description\": \"Vulnerable dependency found in package-lock.json\"\n}"
                                                    });
                                                } else if (preset.id === 'stripe') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "telegram",
                                                        platforms: ["telegram"],
                                                        category: "sale",
                                                        botName: "Stripe Relay",
                                                        message: (pObj?.stripe?.title || "**💰 STRIPE: PAYMENT SUCCESSFUL**") + "\n\n" + (pObj?.stripe?.body || "Customer: **{{customer_name}}**\nAmount: **{{amount}} {{currency}}**\nPlan: {{plan_name}}\n\n*Invoice: {{invoice_id}}*"),
                                                        variables: "{\n  \"customer_name\": \"John Doe\",\n  \"amount\": \"249.00\",\n  \"currency\": \"USD\",\n  \"plan_name\": \"Pro Enterprise License\",\n  \"invoice_id\": \"INV-2026-X892\"\n}"
                                                    });
                                                } else if (preset.id === 'security') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "telegram",
                                                        platforms: ["telegram", "discord"],
                                                        category: "security",
                                                        botName: "Relay Shield",
                                                        message: (pObj?.security?.title || "**⚠️ SECURITY ALERT**") + "\n\n" + (pObj?.security?.body || "A suspicious login attempt was detected from {{location}}.\n\n📱 **Device:** {{device}}\n🕒 **Time:** {{time}}\n\nIf this was not you, please revoke access immediately."),
                                                        variables: "{\n  \"location\": \"Tokyo, JP\",\n  \"device\": \"iPhone 15 Pro\",\n  \"time\": \"14:20:05\"\n}"
                                                    });
                                                } else if (preset.id === 'email') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "email",
                                                        platforms: ["email"],
                                                        category: "general",
                                                        target: "welcome@relay.digital",
                                                        message: (pObj?.email?.title || "**✨ WELCOME TO RELAY ENTERPRISE**") + "\n\n" + (pObj?.email?.body || "Hi **{{user_name}}**,\n\nYour organization is now connected to the global relay network. Start building your automation pipelines today.\n\nBest,\nThe Relay Team"),
                                                        variables: "{\n  \"user_name\": \"Exequiel\"\n}"
                                                    });
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white ${preset.color} transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer`}
                                        >
                                            {preset.icon} {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 cursor-default">Routing Sequence (Fallback Chain)</label>
                                <div className="flex flex-wrap gap-3 p-4 bg-black/20 border border-white/5 rounded-3xl min-h-[80px] items-center">
                                    {testConfig.platforms.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center py-2 opacity-40">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">No routing sequence defined.</p>
                                            <p className="text-[8px] font-medium text-slate-600">Click the + to add your first delivery channel.</p>
                                        </div>
                                    ) : testConfig.platforms.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="px-4 py-2 bg-accent/20 border border-accent/40 text-accent font-black text-[9px] rounded-xl flex items-center gap-2 uppercase tracking-tighter shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                                {p === 'telegram' && <Bot className="w-3 h-3" />}
                                                {p === 'discord' && <MessageSquare className="w-3 h-3" />}
                                                {p === 'slack' && <Hash className="w-3 h-3" />}
                                                {p === 'email' && <Mail className="w-3 h-3" />}
                                                {p === 'whatsapp' && <Globe className="w-3 h-3" />}
                                                {p.toUpperCase()}
                                                <X
                                                    className="w-3 h-3 cursor-pointer hover:text-rose-500 transition-colors ml-1"
                                                    onClick={() => {
                                                        const newPlatforms = [...testConfig.platforms];
                                                        newPlatforms.splice(idx, 1);
                                                        setTestConfig({
                                                            ...testConfig,
                                                            platforms: newPlatforms,
                                                            platform: newPlatforms[0] || 'telegram'
                                                        });
                                                    }}
                                                />
                                            </div>
                                            {idx < testConfig.platforms.length - 1 && <ArrowRight className="w-4 h-4 text-slate-700" />}
                                        </div>
                                    ))}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                                            className={`w-10 h-10 rounded-full border border-dashed flex items-center justify-center transition-all cursor-pointer ${isPlatformMenuOpen ? 'border-accent text-accent' : 'border-slate-700 text-slate-500 hover:border-accent hover:text-accent'}`}
                                        >
                                            <Plus className={`w-4 h-4 transition-transform duration-300 ${isPlatformMenuOpen ? 'rotate-45' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isPlatformMenuOpen && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-40"
                                                        onClick={() => setIsPlatformMenuOpen(false)}
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute top-full left-0 mt-3 bg-[#0a0f1d] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl min-w-[150px]"
                                                    >
                                                        {['telegram', 'discord', 'slack', 'email', 'whatsapp'].map(p => (
                                                            <button
                                                                key={p}
                                                                onClick={() => {
                                                                    setTestConfig({
                                                                        ...testConfig,
                                                                        platforms: [...testConfig.platforms, p],
                                                                        platform: p
                                                                    });
                                                                    setIsPlatformMenuOpen(false);
                                                                }}
                                                                className="w-full text-left px-4 py-2 hover:bg-accent/10 rounded-xl text-[10px] font-black text-slate-400 hover:text-accent uppercase transition-all flex items-center gap-2"
                                                            >
                                                                {p === 'telegram' && <Bot className="w-3 h-3" />}
                                                                {p === 'discord' && <MessageSquare className="w-3 h-3" />}
                                                                {p === 'slack' && <Hash className="w-3 h-3" />}
                                                                {p === 'email' && <Mail className="w-3 h-3" />}
                                                                {p === 'whatsapp' && <Globe className="w-3 h-3" />}
                                                                Add {p}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 cursor-default">Business Category</label>
                                    <select
                                        value={testConfig.category}
                                        onChange={(e) => setTestConfig({ ...testConfig, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="general" className="bg-[#020617]">General Protocol</option>
                                        <option value="sale" className="bg-[#020617]">Sale / E-commerce</option>
                                        <option value="security" className="bg-[#020617]">Security Alert</option>
                                        <option value="billing" className="bg-[#020617]">Subscription / Billing</option>
                                    </select>
                                </div>
                                <div className="animate-in fade-in slide-in-from-right-2 duration-500">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 cursor-default">
                                        {testConfig.platforms.includes('email') ? "Recipient Email" : (d.testlab?.targetUrl || "Target ID / URL")}
                                    </label>
                                    <input
                                        type="text"
                                        value={testConfig.target}
                                        onChange={(e) => setTestConfig({ ...testConfig, target: e.target.value })}
                                        placeholder={testConfig.platforms.includes('email') ? "user@example.com" : "Chat ID or Webhook"}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {testConfig.platforms.includes('discord') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                            Bot Name Override
                                            {!isEnterprise && <Lock className="w-2.5 h-2.5 text-amber-500/50" />}
                                        </label>
                                        <div className="relative group/lock">
                                            <input
                                                type="text"
                                                value={isEnterprise ? testConfig.botName : ""}
                                                onChange={(e) => setTestConfig({ ...testConfig, botName: e.target.value })}
                                                disabled={!isEnterprise}
                                                className={`w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium text-xs ${!isEnterprise ? "cursor-not-allowed opacity-50 select-none" : ""}`}
                                                placeholder={isEnterprise ? "Example: Relay Support" : "Enterprise Only"}
                                            />
                                            <Bot className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                            {!isEnterprise && (
                                                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/lock:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] rounded-2xl pointer-events-none">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">Upgrade to Enterprise</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                            Avatar URL Override
                                            {!isEnterprise && <Lock className="w-2.5 h-2.5 text-amber-500/50" />}
                                        </label>
                                        <div className="relative flex gap-2 group/lock">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={isEnterprise ? testConfig.botAvatar : ""}
                                                    onChange={(e) => setTestConfig({ ...testConfig, botAvatar: e.target.value })}
                                                    disabled={!isEnterprise}
                                                    className={`w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium text-xs ${!isEnterprise ? "cursor-not-allowed opacity-50 select-none" : ""}`}
                                                    placeholder={isEnterprise ? "https://..." : "Enterprise Only"}
                                                />
                                                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                            </div>
                                            <button
                                                onClick={() => botAvatarInputRef.current?.click()}
                                                disabled={isUploadingBotAvatar || !isEnterprise}
                                                className={`px-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center group/upload ${!isEnterprise ? "cursor-not-allowed opacity-30" : ""}`}
                                                title={isEnterprise ? "Upload Image" : "Enterprise Feature Locked"}
                                            >
                                                {isUploadingBotAvatar ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4 group-hover/upload:scale-110 transition-transform" />
                                                )}
                                            </button>
                                            {!isEnterprise && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/lock:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] rounded-2xl pointer-events-none">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">Enterprise Only</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={botAvatarInputRef}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file && isEnterprise) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setTestConfig({ ...testConfig, botAvatar: reader.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 cursor-default">{d.testlab?.msgBody || "Message Body"}</label>
                            <textarea
                                value={testConfig.message}
                                onChange={(e) => setTestConfig({ ...testConfig, message: e.target.value })}
                                placeholder={d.testlab?.msgPlaceholder || "Enter your test message..."}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-accent shadow-inner transition-all font-medium resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 cursor-default">{d.testlab?.variables || "Variables (JSON)"}</label>
                            <input
                                type="text"
                                value={testConfig.variables}
                                onChange={(e) => setTestConfig({ ...testConfig, variables: e.target.value })}
                                placeholder='{"order_id": "123"}'
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-accent font-mono text-xs focus:outline-none focus:border-accent/50 transition-all"
                            />
                        </div>

                        <button
                            onClick={handleTestRelay}
                            disabled={isTesting || !testConfig.target || testConfig.platforms.length === 0}
                            className="w-full bg-accent text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                        >
                            {isTesting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
                            ) : (
                                <>
                                    <Terminal className="w-5 h-5" />
                                    {d.testlab?.execute || "EXECUTE PROTOCOL"}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Console Output */}
                    <div className="glass bg-black/60 border-white/10 rounded-[32px] md:rounded-[40px] p-2 overflow-hidden flex flex-col h-[500px] md:h-[600px] shadow-2xl relative">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                <span className="ml-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">{d.testlab?.consoleTitle || "Relay Diagnostic Console"}</span>
                            </div>
                            {testResult && (
                                <button
                                    onClick={() => {
                                        setTestResult(null);
                                        setIsRawJsonVisible(false);
                                    }}
                                    className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="flex-1 p-8 font-mono text-sm overflow-y-auto space-y-4">
                            {!testResult && !isTesting && (
                                <div className="text-slate-700 italic animate-pulse">{d.testlab?.waiting || "Waiting for execution..."}</div>
                            )}
                            {isTesting && (
                                <div className="text-accent flex items-center gap-2">
                                    <span className="animate-bounce">_</span>
                                    <span>Establishing uplink to {testConfig.platform.toUpperCase()} cluster...</span>
                                </div>
                            )}
                            {testResult && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <span className="text-accent font-bold">PROXIED</span>
                                        <span>{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    {testResult.logic_override && (
                                        <div className="flex items-center gap-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 my-4 animate-pulse">
                                            <Zap className="w-4 h-4" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest">Logic Intervention Detected</span>
                                                <span className="text-[8px] font-medium opacity-80">Routing dynamically altered by pipeline: <b>{testResult.pipeline_name}</b></span>
                                            </div>
                                        </div>
                                    )}
                                    {testResult.success ? (
                                        <div className="space-y-6">
                                            <div className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500">
                                                    <Check className="w-8 h-8 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Protocolo Verificado</h3>
                                                    <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-widest mt-1">Enlace de Retransmisión Establecido</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Estado</p>
                                                    <p className="text-emerald-400 font-bold text-sm">200 OK</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Protocolo</p>
                                                    <p className="text-white font-bold text-sm">RELAY_UPLINK_STABLE</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setIsRawJsonVisible(!isRawJsonVisible)}
                                                className={`w-full py-3 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${isRawJsonVisible ? 'border-accent text-accent bg-accent/5' : 'border-white/5 text-slate-500 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                {isRawJsonVisible ? 'Hide Raw Telemetry (JSON)' : 'View Raw Telemetry (JSON)'}
                                            </button>

                                            <AnimatePresence>
                                                {isRawJsonVisible && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <pre className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 overflow-x-auto text-[10px] mt-4">
                                                            {JSON.stringify(testResult, null, 2)}
                                                        </pre>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <pre className={`p-6 rounded-2xl border ${testResult.error ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-green-500/20 bg-green-500/5 text-green-400'} overflow-x-auto`}>
                                                {JSON.stringify(testResult, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div >
        );
    };


    const renderConnectors = () => {
        const connectors = [
            { id: 'stripe', name: 'Stripe', icon: <CreditCard className="w-6 h-6" />, desc: 'Billing & Subscriptions', color: 'text-indigo-400', glow: 'rgba(129,140,248,0.2)' },
            { id: 'shopify', name: 'Shopify', icon: <ShoppingBag className="w-6 h-6" />, desc: 'E-commerce Orders', color: 'text-emerald-400', glow: 'rgba(52,211,153,0.2)' },
            { id: 'woocommerce', name: 'WooCommerce', icon: <Store className="w-6 h-6" />, desc: 'WordPress Sales', color: 'text-purple-400', glow: 'rgba(168,85,247,0.2)' },
            { id: 'clerk', name: 'Clerk', icon: <UserPlus className="w-6 h-6" />, desc: 'User Authentication', color: 'text-blue-500', glow: 'rgba(59,130,246,0.2)' },
            { id: 'hubspot', name: 'HubSpot', icon: <Zap className="w-6 h-6" />, desc: 'CRM & Sales', color: 'text-orange-500', glow: 'rgba(249,115,22,0.2)' }
        ];

        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-2">Low-Code <span className="text-accent underline underline-offset-8 decoration-accent/20">Connectors</span></h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Plug Relay directly into your business with zero backend code</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {connectors.map((c, i) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-6 md:p-10 rounded-[32px] md:rounded-[44px] border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden flex flex-col items-center text-center shadow-2xl"
                        >
                            <div className="absolute pointer-events-none top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                            <div
                                className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}
                                style={{ color: c.color }}
                            >
                                {c.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">{c.name}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">{c.desc}</p>

                            <button
                                onClick={() => {
                                    const activeKey = apiKeys.find(k => k.is_active)?.key_hash || 'RELAY_PK_ENTERPRISE';
                                    const baseUrl = window.location.origin;
                                    const platforms = testConfig.platforms.join(',');
                                    const target = testConfig.target || '@admin';
                                    const template = 'sale_alert';
                                    const url = `${baseUrl}/api/webhooks/${c.id}?api_key=${activeKey}&platforms=${platforms}&target=${target}&template_id=${template}`;

                                    setWebhookUrl(url);
                                    setWebhookLabel(c.name);
                                    setIsWebhookModalOpen(true);
                                    setWebhookModalMode('connector');
                                }}
                                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent hover:text-white transition-all cursor-pointer text-slate-400"
                            >
                                Generate Webhook
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="glass p-6 md:p-12 rounded-[32px] md:rounded-[48px] border-white/5 bg-accent/[0.02] relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-accent flex items-center justify-center shadow-[0_0_40px_var(--accent-glow)] shrink-0">
                            <Zap className="w-10 h-10 text-white" fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase italic">How it works</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-2xl">
                                1. Generate a specialized Relay Webhook URL below.<br />
                                2. Paste it into your provider's settings (Stripe Webhooks, Shopify Notifications, etc).<br />
                                3. Relay automatically parses the event and sends a professional alert to your chosen channels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStatus = () => {
        const uptimeBars = [98, 100, 100, 99.5, 100, 99.8, 100];
        const ds = d.status || (dictionaries[lang] as any).dashboard.status;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">{ds.title}</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{ds.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 px-8 py-4 rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                        <div className="relative w-16 h-8 flex items-center justify-center gap-1.5">
                            {[0.2, 0.4, 0.6, 0.8, 1.0].map((delay, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: [6, 24, 6],
                                        opacity: [0.3, 1, 0.3],
                                        backgroundColor: ["#10b981", "#34d399", "#10b981"]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        delay: delay,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1.5 rounded-full"
                                />
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">{ds.stable}</span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-black uppercase mt-0.5">LIFELINE ACTIVE</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: ds.latency, value: stats.latency, sub: "GLOBAL AVG", color: "text-accent" },
                        { label: ds.uptime, value: stats.uptime, sub: "ROLLING PERFORMANCE", color: "text-emerald-400" },
                        { label: "NODES", value: "12 / 12", sub: "CLUSTERS ONLINE", color: "text-white" }
                    ].map((stat, i) => (
                        <div key={i} className="glass p-8 rounded-[32px] border-white/5 group hover:border-white/10 transition-all bg-white/[0.02]">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 group-hover:text-slate-400 transition-colors">{stat.label}</p>
                            <h3 className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
                            <p className="text-[8px] text-slate-600 mt-2 font-black uppercase tracking-widest leading-none">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Futuristic Status Ribbon */}
                <div className="glass border-white/10 rounded-[44px] p-12 relative overflow-hidden bg-black/40 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="space-y-1">
                            <h4 className="text-[11px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-2">
                                <Activity className="w-4 h-4 text-accent" />
                                {ds.uptimeChart || "SYSTEM UPTIME (LAST 7 DAYS)"}
                            </h4>
                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Global Telemetry Ribbon Feed</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Operational</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Degraded</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Offline</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between gap-1 h-24 relative z-10">
                        {Array.from({ length: 48 }).map((_, i) => {
                            // Realistic professional telemetry simulation:
                            const now = Date.now();
                            const userJoined = user?.created_at ? new Date(user.created_at).getTime() : now - (1000 * 60 * 60 * 24);
                            const blockTime = now - (47 - i) * (7 * 24 * 60 * 60 * 1000 / 48);
                            const isHistoryKnown = blockTime >= userJoined || i >= 40;

                            // Determine status: Operational, Degraded, or Offline
                            let status: 'operational' | 'degraded' | 'offline' = 'operational';
                            if (!isHistoryKnown) {
                                status = 'offline'; // Before user joined, mark as offline/standby
                            } else {
                                // Deterministic shifting status based on absolute block time
                                const blockDuration = 7 * 24 * 60 * 60 * 1000 / 48; // 3.5h in ms
                                const blockId = Math.floor(blockTime / blockDuration);
                                const hash = Math.abs(Math.sin(blockId) * 10000) % 100;

                                if (hash < 3) status = 'offline'; // Simulated outages over time
                                else if (hash < 12) status = 'degraded'; // Simulated congestion
                            }

                            const colorMap = {
                                operational: 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
                                degraded: 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
                                offline: 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                            };

                            const labelMap = {
                                operational: 'OPERATIONAL 100%',
                                degraded: 'DEGRADED PERFORMANCE / CONGESTED',
                                offline: isHistoryKnown ? 'SERVICE OUTAGE / MAINTENANCE' : 'SYSTEM STANDBY (NO DATA)'
                            };

                            const blockAgeInDays = (47 - i) * (7 / 48);

                            return (
                                <div key={i} className="flex-1 h-full group relative">
                                    <motion.div
                                        initial={{ scaleY: 0, opacity: 0 }}
                                        animate={{
                                            scaleY: status === 'operational' ? [0.7, 1, 0.85] : (status === 'degraded' ? [0.5, 0.8, 0.6] : 0.35),
                                            opacity: isHistoryKnown ? 1 : 0.15
                                        }}
                                        transition={{
                                            delay: i * 0.01,
                                            duration: 2,
                                            repeat: status !== 'offline' ? Infinity : 0,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }}
                                        className={`w-full h-full rounded-sm ${colorMap[status]} ${!isHistoryKnown && 'bg-slate-800 shadow-none'} transition-all duration-700 group-hover:scale-x-150 group-hover:bg-white z-10 relative`}
                                    >
                                        {status === 'operational' && (
                                            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-sm" />
                                        )}
                                    </motion.div>
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                                        <div className="glass px-4 py-2 rounded-xl border-white/10 shadow-2xl text-[8px] font-black uppercase tracking-widest whitespace-nowrap text-white">
                                            {labelMap[status]}
                                            <div className="text-slate-500 mt-1">T-{Math.floor(blockAgeInDays * 24)}H AGEO</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between mt-6 px-1">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">7 Days Ago</span>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Monitoring Terminal Active</span>
                        <span className="text-[9px] font-black text-accent uppercase tracking-widest">Live Feed</span>
                    </div>

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 opacity-20 bg-[length:100%_4px,3px_100%]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-10 rounded-[44px] border-white/5 relative overflow-hidden bg-white/[0.01]">
                        <div className="absolute top-0 right-0 p-8">
                            <Activity className="w-12 h-12 text-white/5 shrink-0" />
                        </div>
                        <h4 className="text-[11px] font-black text-white mb-8 tracking-[0.3em] uppercase">PROVIDER HEALTH</h4>
                        <div className="space-y-4">
                            {[
                                { name: "Discord API", status: "Operational", color: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" },
                                { name: "Telegram Bot API", status: "Operational", color: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" },
                                { name: "WhatsApp Cloud API", status: "Operational", color: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" },
                                { name: "Supabase DB Cluster", status: "Operational", color: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" }
                            ].map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${p.color}`} />
                                        <span className="text-xs font-black text-white/80 uppercase tracking-tight">{p.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{p.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-10 rounded-[44px] border-white/5 relative overflow-hidden flex flex-col justify-center items-center text-center bg-accent/[0.02]">
                        <div className="w-24 h-24 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center mb-8 relative">
                            <Zap className="w-12 h-12 text-accent animate-pulse" />
                            <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping opacity-20" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase italic">ENGINE NOMINAL</h4>
                        <p className="text-[10px] text-slate-500 font-bold max-w-[300px] leading-relaxed uppercase tracking-[0.2em] px-4">
                            Global uplink confirmed across 12 distributed edge nodes. 0 anomalies detected.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderScenarios = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 animate-in fade-in duration-500"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-2">
                            Logical <span className="text-accent underline underline-offset-8 decoration-accent/20">Scenarios</span>
                        </h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                            Visual conditional routing pipeline
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedScenarioIds.length > 0 && (
                            <button
                                onClick={() => handleDeleteScenario(selectedScenarioIds)}
                                className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                                title="Delete Selected"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={fetchScenarios}
                            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-3 text-white/70 hover:text-white"
                        >
                            <Activity className={`w-4 h-4 ${isScenariosLoading ? 'animate-pulse text-accent' : ''}`} />
                            Refresh Engine
                        </button>
                        <button
                            onClick={handleCreateScenario}
                            className="px-6 py-3 rounded-2xl bg-accent text-white border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent/80 transition-all cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> New Flow
                        </button>
                    </div>
                </div>

                {isScenariosLoading ? (
                    <div className="flex justify-center p-32">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-accent border-r-2 border-accent/20" />
                    </div>
                ) : scenarios.length === 0 ? (
                    <div className="glass border-dashed border-2 border-white/5 rounded-[32px] md:rounded-[48px] p-10 md:p-24 text-center mt-8">
                        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Network className="w-12 h-12 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-3">No Active Scenarios</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                            Create your first visual routing flow to filter, map, and conditionally route webhook payloads based on their dynamic JSON properties.
                        </p>
                    </div>
                ) : (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Bulk Actions Toolbar */}
                        <AnimatePresence>
                            {selectedScenarioIds.length > 0 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    className="fixed bottom-6 md:bottom-12 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-50 glass border-accent/30 p-2 md:pl-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-[0_20px_50px_rgba(59,130,246,0.3)] bg-blue-500/10 backdrop-blur-2xl px-4 md:px-8"
                                >
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedScenarioIds([]); }}
                                            className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all mr-1"
                                            title="Unselect All"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                            {(d as any).scenarios?.countSelected?.replace('{count}', selectedScenarioIds.length.toString()) || `${selectedScenarioIds.length} Selected`}
                                        </span>
                                    </div>
                                    <div className="w-px h-6 bg-white/10" />
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setSelectedScenarioIds(scenarios.map(s => s.id))}
                                            className="px-3 py-2 rounded-xl hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setSelectedScenarioIds([])}
                                            className="px-3 py-2 rounded-xl hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                                        >
                                            None
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteScenario(selectedScenarioIds)}
                                        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        {(d as any).scenarios?.deleteSelected || "Delete"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {scenarios.map(sc => (
                            <div
                                key={sc.id}
                                onClick={() => setActiveScenarioId(sc.id)}
                                className={`glass p-6 md:p-8 rounded-[24px] md:rounded-[32px] transition-all cursor-pointer group relative overflow-hidden bg-white/[0.02] border-2 ${selectedScenarioIds.includes(sc.id) ? 'border-accent shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'border-white/5 hover:border-accent/30'}`}
                            >
                                <div className="absolute pointer-events-none top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedScenarioIds(prev =>
                                                    prev.includes(sc.id) ? prev.filter(id => id !== sc.id) : [...prev, sc.id]
                                                );
                                            }}
                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedScenarioIds.includes(sc.id) ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                        >
                                            {selectedScenarioIds.includes(sc.id) && <Check className="w-3.5 h-3.5 font-black" />}
                                        </button>
                                        <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                                            <Network className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border ${sc.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                                            {sc.is_active ? 'Active' : 'Draft'}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteScenario(sc.id);
                                            }}
                                            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 hover:border-rose-400/20 transition-all z-10"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                {editingScenarioId === sc.id ? (
                                    <input
                                        autoFocus
                                        className="w-full bg-white/5 border border-accent/30 rounded-lg px-2 py-1 text-xl font-bold text-white focus:outline-none mb-2 hover:bg-white/10 transition-all font-sans"
                                        value={editingScenarioName}
                                        onChange={(e) => setEditingScenarioName(e.target.value)}
                                        onBlur={() => handleUpdateScenarioName(sc.id, editingScenarioName)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleUpdateScenarioName(sc.id, editingScenarioName);
                                            if (e.key === 'Escape') setEditingScenarioId(null);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <div className="flex items-center justify-between group/title mb-2">
                                        <h3 className="text-xl font-bold text-white truncate">{sc.name}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingScenarioId(sc.id);
                                                setEditingScenarioName(sc.name);
                                            }}
                                            className="opacity-40 hover:opacity-100 p-1.5 rounded-md hover:bg-white/5 text-slate-500 hover:text-accent transition-all"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-6">
                                    {sc.description || "No description provided. This is a generic routing schema."}
                                </p>
                                <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest pt-6 border-t border-white/5">
                                    <span className="flex items-center gap-1.5"><LayoutDashboard className="w-3 h-3" /> {sc.nodes?.length || 0} Nodes</span>
                                    <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" /> {sc.edges?.length || 0} Connections</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        );
    };

    const renderScenarioEditor = () => {
        const scenario = scenarios.find(s => s.id === activeScenarioId);
        if (!scenario) return null;

        const sc_t = (d as any).scenarios || {
            back: "BACK TO LIST",
            savePipeline: "SAVE PIPELINE",
            deletePipeline: "DELETE PIPELINE",
            routingStatus: "ROUTING STATUS",
            pipelineEditor: "PIPELINE EDITOR",
            saved: "PIPELINE SAVED"
        };

        const handleNodeClick = (node: any) => {
            setEditingNode({ ...node });
            setIsInsertingNode(false);
            setIsNodeModalOpen(true);
        };

        const handleInsertClick = (idx: number) => {
            setInsertIndex(idx);
            setIsInsertingNode(true);
            setIsNodeModalOpen(true);
        };

        const updateNodeData = (nodeId: string, newData: any) => {
            setScenarios(prev => prev.map(s => {
                if (s.id !== activeScenarioId) return s;
                return {
                    ...s,
                    nodes: s.nodes.map((n: any) => n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n)
                };
            }));
            setIsNodeModalOpen(false);
        };

        const insertNode = (type: string) => {
            if (insertIndex === null) return;

            const newNode = {
                id: `node_${Math.random().toString(36).substring(2, 9)}`,
                type: type,
                data: type === 'actionNode' ? { label: 'New Action', platform: 'telegram' } :
                    type === 'conditionNode' ? { label: 'New Filter', condition: 'true' } :
                        type === 'waitNode' ? { label: 'Wait / Delay', duration: 30, unit: 'seconds' } :
                            { label: 'New Step' }
            };

            setScenarios(prev => prev.map(s => {
                if (s.id !== activeScenarioId) return s;
                const newNodes = [...s.nodes];
                newNodes.splice(insertIndex + 1, 0, newNode);
                // Also update edges
                const newEdges = [...(s.edges || [])];
                // Note: In this simple horizontal layout, edges are implicit but we store them for compatibility
                return { ...s, nodes: newNodes, edges: newEdges };
            }));

            setIsNodeModalOpen(false);
            setInsertIndex(null);
        };

        const handleDeleteNode = (nodeId: string) => {
            setScenarios(prev => prev.map(s => {
                if (s.id !== activeScenarioId) return s;
                return {
                    ...s,
                    nodes: s.nodes.filter((n: any) => n.id !== nodeId)
                };
            }));
        };

        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 flex flex-col h-full relative"
            >
                {/* Editor Header */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between bg-black/40 border border-white/5 p-4 md:p-6 rounded-[24px] md:rounded-[32px] backdrop-blur-xl shadow-2xl relative overflow-hidden gap-6 lg:gap-0">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent/20" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                        <button
                            onClick={() => setActiveScenarioId(null)}
                            className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all w-full sm:w-auto justify-center"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180 text-slate-500 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                                {sc_t.back || "BACK TO LIST"}
                            </span>
                        </button>

                        <div className="hidden sm:block h-10 w-px bg-white/5" />

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <input
                                    type="text"
                                    value={scenario.name}
                                    onChange={(e) => {
                                        const newScenarios = [...scenarios];
                                        const idx = newScenarios.findIndex(s => s.id === scenario.id);
                                        newScenarios[idx].name = e.target.value;
                                        setScenarios(newScenarios);
                                    }}
                                    className="bg-transparent text-lg md:text-2xl font-black text-white focus:outline-none focus:text-accent transition-colors tracking-tighter uppercase italic w-full min-w-[200px]"
                                />
                                <Pencil className="w-3 h-3 text-slate-700 shrink-0" />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{sc_t.pipelineEditor || "PIPELINE EDITOR"}</span>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${scenario.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                                    {scenario.is_active ? 'Active' : 'Draft'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-between sm:justify-end">
                        <div className="flex items-center gap-2 sm:mr-6">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 truncate">{sc_t.routingStatus || "ROUTING STATUS"}</span>
                            <button
                                className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full p-1 transition-colors ${scenario.is_active ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800 border border-white/5'}`}
                                onClick={() => {
                                    const newScenarios = [...scenarios];
                                    const idx = newScenarios.findIndex(s => s.id === scenario.id);
                                    newScenarios[idx].is_active = !scenario.is_active;
                                    setScenarios(newScenarios);
                                }}
                            >
                                <motion.div
                                    layout
                                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${scenario.is_active ? 'bg-emerald-400' : 'bg-slate-500'}`}
                                    animate={{ x: scenario.is_active ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 20 : 22) : 0 }}
                                />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => handleDeleteScenario(scenario.id)}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group shrink-0"
                                title={sc_t.deletePipeline || "Delete Pipeline"}
                            >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                            </button>

                            <button
                                onClick={handleSaveScenario}
                                disabled={isSavingScenario}
                                className={`flex-1 sm:flex-none px-4 md:px-8 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 shadow-2xl ${saveSuccess
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : 'bg-accent text-white hover:shadow-accent/40 active:scale-95'
                                    }`}
                            >
                                {isSavingScenario ? (
                                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : saveSuccess ? (
                                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                                ) : (
                                    <Database className="w-3 h-3 md:w-4 md:h-4" />
                                )}
                                <span className="truncate">
                                    {saveSuccess ? (sc_t.saved || "PIPELINE SAVED") : isSavingScenario ? "UPLOADING..." : (sc_t.savePipeline || "SAVE PIPELINE")}
                                </span>
                            </button>

                            <button
                                onClick={async () => {
                                    if (isTestingScenario) return;
                                    const triggerNode = scenario.nodes.find((n: any) => n.type === 'triggerNode');
                                    const actionNode = scenario.nodes.find((n: any) => n.type === 'actionNode');
                                    const activeKey = apiKeys.find(k => k.is_active)?.key_hash || 'RELAY_PK_ENTERPRISE';

                                    let testPayload = { amount: 500, status: "paid", test: true, timestamp: new Date().toISOString() };
                                    if (actionNode?.data?.test_variables) {
                                        try {
                                            testPayload = JSON.parse(actionNode.data.test_variables);
                                        } catch (e) {
                                            console.warn("Invalid test variables JSON, using default");
                                        }
                                    }

                                    try {
                                        setIsTestingScenario(true);
                                        const res = await fetch('/api/relay', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'x-api-key': activeKey
                                            },
                                            body: JSON.stringify({
                                                category: triggerNode?.data?.event || 'GENERAL',
                                                payload: testPayload
                                            })
                                        });

                                        if (res.ok) {
                                            setSaveSuccess(true);
                                            setTimeout(() => setSaveSuccess(false), 3000);
                                        }
                                    } catch (err) {
                                        console.error('Simulation failed:', err);
                                    } finally {
                                        setIsTestingScenario(false);
                                    }
                                }}
                                className={`px-4 sm:px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 border shrink-0 ${isTestingScenario
                                    ? 'bg-transparent border-white/10 text-slate-500'
                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 active:scale-95'
                                    }`}
                                title="Run Full Flow Simulation"
                            >
                                {isTestingScenario ? (
                                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
                                ) : (
                                    <Play className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                                )}
                                <span className="hidden xs:inline">
                                    {isTestingScenario ? "SIMULATING..." : "SIMULATE"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visual Canvas Layout */}
                <div
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseLeave={handleCanvasMouseLeave}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseMove={handleCanvasMouseMove}
                    className={`bg-[#020617] rounded-[24px] md:rounded-[44px] border border-white/5 relative overflow-hidden shadow-[inset_0_4px_40px_rgba(0,0,0,0.5)] flex items-center min-h-[250px] md:min-h-[350px] overflow-x-auto px-6 md:px-16 py-24 group ${isDraggingCanvas ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

                    {/* Nodes Flex Layout (Horizontal Graph) */}
                    <div className="flex items-center relative z-10 w-fit pointer-events-auto transition-transform duration-200 origin-left" style={{ transform: `scale(${zoomLevel})` }}>
                        {scenario.nodes?.map((node: any, idx: number) => (
                            <div key={node.id} className="flex items-center shrink-0">

                                {/* Draggable/Hoverable Node Card */}
                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    onClick={() => handleNodeClick(node)}
                                    className="w-64 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-2xl relative cursor-pointer hover:border-accent/40 transition-colors group"
                                >
                                    {/* Quick Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNode(node.id);
                                        }}
                                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-30 shadow-lg border-2 border-[#020617] cursor-pointer"
                                        title="Delete Node"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    {/* Action Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-inner ${node.type === 'triggerNode' ? 'bg-accent/10 border border-accent/20 text-accent' :
                                                node.type === 'actionNode' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                                                    'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                                                }`}>
                                                {node.type === 'triggerNode' ? <Webhook className="w-4 h-4" /> :
                                                    node.type === 'actionNode' ? <Activity className="w-4 h-4" /> :
                                                        node.type === 'waitNode' ? <Clock className="w-4 h-4" /> :
                                                            <Network className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">
                                                    {node.type === 'triggerNode' ? 'Webhooks / Input' : node.type === 'actionNode' ? 'Execution / Output' : node.type === 'waitNode' ? 'Sequence / Delay' : 'Condition / Map'}
                                                </p>
                                                <h4 className="text-sm font-bold text-white leading-tight">{node.data.label}</h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Config Payload Block */}
                                    <div className="bg-black/60 rounded-xl p-3 border border-white/5">
                                        {node.type === 'triggerNode' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-500"><Terminal className="w-3 h-3 inline mr-1" /> ON EVENT</span>
                                                <span className="text-[10px] font-black text-accent uppercase tracking-widest">{node.data.event || 'ANY'}</span>
                                            </div>
                                        )}
                                        {node.type === 'actionNode' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-500"><Zap className="w-3 h-3 inline mr-1" /> ROUTE TO</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                                        {node.data.platform?.toUpperCase() || 'TELEGRAM'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {node.type === 'conditionNode' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-500"><FileText className="w-3 h-3 inline mr-1" /> JUMP IF</span>
                                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest truncate max-w-[140px]">{node.data.condition || 'true'}</span>
                                            </div>
                                        )}
                                        {node.type === 'waitNode' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-500"><Clock className="w-3 h-3 inline mr-1" /> DELAY</span>
                                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{node.data.duration} {node.data.unit}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Edge Line Connecting to Next Node */}
                                {idx < scenario.nodes.length - 1 && (
                                    <div className="flex justify-center items-center w-16 h-full relative group/edge mx-2">
                                        <div className="w-full h-px border-t border-dashed border-white/20 transition-colors group-hover/edge:border-accent/50" />
                                        <div className="w-2 h-2 bg-slate-900 border border-white/20 rounded-full absolute left-0" />
                                        <div className="w-2 h-2 bg-slate-900 border border-white/20 rounded-full absolute right-0" />

                                        {/* Insert Node Button */}
                                        <button
                                            onClick={() => handleInsertClick(idx)}
                                            className="absolute w-8 h-8 rounded-full bg-slate-900 border-2 border-white/10 text-white flex items-center justify-center opacity-0 group-hover/edge:opacity-100 hover:bg-accent hover:border-accent hover:scale-110 transition-all z-20 shadow-[0_0_20px_rgba(59,130,246,0.2)] cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* End of Flow Terminator / Append Node Button */}
                        <div className="ml-8 flex items-center">
                            <div className="w-16 h-px border-t border-dashed border-white/20 mx-2 relative group/append">
                                <div className="w-2 h-2 bg-slate-900 border border-white/20 rounded-full absolute left-0 -top-[4px]" />
                                <button
                                    onClick={() => handleInsertClick(scenario.nodes.length - 1)}
                                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-white/10 text-white flex items-center justify-center hover:bg-accent hover:border-accent hover:scale-110 transition-all z-20 shadow-[0_0_20px_rgba(59,130,246,0.2)] cursor-pointer"
                                    title="Add Step at End"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-dashed border-white/10 flex items-center justify-center opacity-40">
                                <div className="w-2 h-2 rounded-full bg-white/20" />
                            </div>
                        </div>
                    </div>

                    {/* Canvas Zoom & Pan UI */}
                    <div className="absolute bottom-6 right-6 z-40 flex items-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-2xl">
                        <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.4))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-16 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2.0))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Node Config Modal */}
                <AnimatePresence>
                    {isNodeModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsNodeModalOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-[92%] md:w-full h-auto max-h-[85vh] md:max-w-xl glass border-white/10 rounded-[32px] md:rounded-[40px] p-4 md:p-10 overflow-y-auto scrollbar-hide shadow-[0_0_100px_rgba(59,130,246,0.1)] z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Cpu className="w-32 h-32 text-accent" />
                                </div>

                                {isInsertingNode ? (
                                    <div className="space-y-8 relative z-10">
                                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Insert Pipeline Step</h2>
                                        <p className="text-slate-500 text-sm">Choose a logical transformation or execution node to insert.</p>

                                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                                            <button
                                                onClick={() => insertNode('conditionNode')}
                                                className="p-4 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                                    <Network className="w-6 h-6" />
                                                </div>
                                                <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">Logical Branch</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Split routing based on JSON body properties.</p>
                                            </button>
                                            <button
                                                onClick={() => insertNode('actionNode')}
                                                className="p-4 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                                                    <Zap className="w-6 h-6" />
                                                </div>
                                                <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">Parallel Action</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Dispatch telemetry to an additional platform.</p>
                                            </button>
                                            <button
                                                onClick={() => insertNode('waitNode')}
                                                className="p-4 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">Delay Step</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Pause the pipeline execution for a period.</p>
                                            </button>
                                            <button
                                                onClick={() => insertNode('webhookNode')}
                                                className="p-4 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                                    <Globe className="w-6 h-6" />
                                                </div>
                                                <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">Outgoing Webhook</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Notify external apps via HTTP POST.</p>
                                            </button>
                                        </div>
                                    </div>
                                ) : editingNode && (
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-sm md:text-xl font-black text-white italic tracking-tighter uppercase leading-tight">{editingNode.type === 'triggerNode' ? 'Source Config' : 'Target Config'}</h2>
                                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Node ID: {editingNode.id}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-2xl ${editingNode.type === 'triggerNode' ? 'bg-accent/10 text-accent' : editingNode.type === 'waitNode' ? 'bg-amber-500/10 text-amber-400' : editingNode.type === 'webhookNode' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                    {editingNode.type === 'triggerNode' ? <Webhook className="w-5 h-5" /> : editingNode.type === 'waitNode' ? <Clock className="w-5 h-5" /> : editingNode.type === 'webhookNode' ? <Globe className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                                </div>
                                                <button onClick={() => setIsNodeModalOpen(false)} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Display Label</label>
                                                <input
                                                    type="text"
                                                    value={editingNode.data.label}
                                                    onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, label: e.target.value } })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent transition-all font-bold text-sm"
                                                />
                                            </div>

                                            {editingNode.type === 'triggerNode' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Filter by Category</label>
                                                            <button
                                                                onClick={() => {
                                                                    const url = `https://relay.aetherdigital.com/api/relay?category=${editingNode.data.event || 'GENERAL'}`;
                                                                    navigator.clipboard.writeText(url);
                                                                    setSaveSuccess(true);
                                                                    setTimeout(() => setSaveSuccess(false), 2000);
                                                                }}
                                                                className="text-[8px] font-black text-accent hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest"
                                                            >
                                                                <Link2 className="w-3 h-3" /> Copy Bridge URL
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {['ANY', 'SALE', 'SECURITY', 'LOG'].map(cat => (
                                                                <button
                                                                    key={cat}
                                                                    onClick={() => setEditingNode({ ...editingNode, data: { ...editingNode.data, event: cat } })}
                                                                    className={`px-4 py-3 rounded-xl border text-[10px] font-black transition-all ${editingNode.data.event === cat ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                                                                >
                                                                    {cat}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                                        <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                            <Activity className="w-3 h-3" /> Automation Bridge
                                                        </h4>
                                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                                            Point your app's webhooks to Relay. Events with category <span className="text-emerald-400 font-bold">"{editingNode.data.event || 'ANY'}"</span> will trigger this flow.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {editingNode.type === 'actionNode' && (
                                                <div className="space-y-4">
                                                    {/* Enterprise Presets */}
                                                    <div className="p-3 md:p-4 rounded-2xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 blur-2xl rounded-full -mr-8 -mt-8" />
                                                        <div className="relative z-10">
                                                            <h4 className="text-[8px] font-black text-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                                <Sparkles className="w-2 h-2" /> {d.presets?.title || "ENTERPRISE PRESETS"}
                                                            </h4>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {[
                                                                    { id: 'stripe', label: d.presets?.stripe?.name || 'Stripe Sale', platform: 'telegram', botName: "Stripe Relay", icon: <CreditCard className="w-2.5 h-2.5" />, color: "hover:bg-[#635BFF] hover:border-[#635BFF]" },
                                                                    { id: 'shopify', label: d.presets?.shopify?.name || 'Shopify Order', platform: 'discord', botName: "Shopify Bot", icon: <ShoppingBag className="w-2.5 h-2.5" />, color: "hover:bg-[#95BF47] hover:border-[#95BF47]" },
                                                                    { id: 'clerk', label: d.presets?.clerk?.name || 'Clerk Signup', platform: 'discord', botName: "Clerk Auth", icon: <UserPlus className="w-2.5 h-2.5" />, color: "hover:bg-[#6C47FF] hover:border-[#6C47FF]" },
                                                                    { id: 'hubspot', label: d.presets?.hubspot?.name || 'HubSpot Deal', platform: 'slack', botName: "HubSpot Relay", icon: <Zap className="w-2.5 h-2.5" />, color: "hover:bg-[#FF7A59] hover:border-[#FF7A59]" },
                                                                    { id: 'github', label: d.presets?.github?.name || 'GitHub Alert', platform: 'discord', botName: "GitHub Watcher", icon: <ShieldAlert className="w-2.5 h-2.5" />, color: "hover:bg-[#2dba4e] hover:border-[#2dba4e]" },
                                                                    { id: 'email', label: d.presets?.email?.name || 'Welcome Email', platform: 'email', target_address: "welcome@relay.digital", botName: "Relay Team", icon: <Mail className="w-2.5 h-2.5" />, color: "hover:bg-indigo-500 hover:border-indigo-500" },
                                                                    { id: 'security', label: d.presets?.security?.name || 'Security', platform: 'telegram', botName: "Relay Shield", icon: <Shield className="w-2.5 h-2.5" />, color: "hover:bg-amber-500 hover:border-amber-500" },
                                                                ].map(preset => (
                                                                    <button
                                                                        key={preset.id}
                                                                        onClick={() => {
                                                                            const pObj = d.presets || d.dashboard?.presets;
                                                                            const msgTitle = pObj?.[preset.id]?.title || "";
                                                                            const msgBody = pObj?.[preset.id]?.body || "";
                                                                            // Avoid adding extra newlines if title or body is missing
                                                                            let fullMessage = "";
                                                                            if (msgTitle && msgBody) fullMessage = `${msgTitle}\n\n${msgBody}`;
                                                                            else if (msgTitle) fullMessage = msgTitle;
                                                                            else if (msgBody) fullMessage = msgBody;

                                                                            // Default variables (fallback if needed)
                                                                            let testVar = "{}";
                                                                            if (preset.id === 'stripe') testVar = "{\n  \"customer_name\": \"John Doe\",\n  \"amount\": \"249.00\",\n  \"currency\": \"USD\",\n  \"plan_name\": \"Pro Enterprise License\",\n  \"invoice_id\": \"INV-2026-X892\"\n}";
                                                                            else if (preset.id === 'shopify') testVar = "{\n  \"order_number\": \"8821\",\n  \"item_count\": 3,\n  \"total_price\": \"$154.50\",\n  \"shipping_city\": \"Miami\",\n  \"shipping_country\": \"US\"\n}";
                                                                            else if (preset.id === 'clerk') testVar = "{\n  \"user_email\": \"new_user@example.com\",\n  \"oauth_provider\": \"Google\",\n  \"user_id\": \"user_2V9x8Z...\"\n}";
                                                                            else if (preset.id === 'hubspot') testVar = "{\n  \"deal_name\": \"Enterprise License Renewal\",\n  \"amount\": \"$12,500.00\",\n  \"owner_name\": \"Exequiel G.\"\n}";
                                                                            else if (preset.id === 'github') testVar = "{\n  \"repo_name\": \"relay-core\",\n  \"description\": \"Vulnerable dependency found in package-lock.json\"\n}";
                                                                            else if (preset.id === 'email') testVar = "{\n  \"user_name\": \"Exequiel\"\n}";
                                                                            else if (preset.id === 'security') testVar = "{\n  \"location\": \"Tokyo, JP\",\n  \"device\": \"iPhone 15 Pro\",\n  \"time\": \"14:20:05\"\n}";

                                                                            setEditingNode({
                                                                                ...editingNode,
                                                                                data: {
                                                                                    ...editingNode.data,
                                                                                    platform: preset.platform,
                                                                                    bot_name: preset.botName,
                                                                                    target_address: preset.target_address || editingNode.data.target_address,
                                                                                    message_template: fullMessage || "**TEMPLATE**",
                                                                                    test_variables: testVar
                                                                                }
                                                                            });
                                                                        }}
                                                                        className={`px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[7px] font-black text-white ${preset.color} transition-all flex items-center gap-1.5 uppercase tracking-widest cursor-pointer`}
                                                                    >
                                                                        {preset.icon} {preset.label.split(' ')[0]} {/* Grab first word to keep button small */}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Platform</label>
                                                            <div className="grid grid-cols-5 gap-1.5">
                                                                {[
                                                                    { id: 'telegram', icon: <Bot className="w-3 h-3" /> },
                                                                    { id: 'discord', icon: <Zap className="w-3 h-3" /> },
                                                                    { id: 'whatsapp', icon: <MessageSquare className="w-3 h-3" /> },
                                                                    { id: 'slack', icon: <Hash className="w-3 h-3" /> },
                                                                    { id: 'email', icon: <Mail className="w-3 h-3" /> }
                                                                ].map(p => (
                                                                    <button
                                                                        key={p.id}
                                                                        onClick={() => setEditingNode({ ...editingNode, data: { ...editingNode.data, platform: p.id } })}
                                                                        className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl border text-[7px] font-black uppercase transition-all ${editingNode.data.platform === p.id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                                                                    >
                                                                        {p.icon}
                                                                        {p.id}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                                                                Address ({editingNode.data.platform || '...'})
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder={editingNode.data.platform === 'email' ? 'recipient@company.com' : 'ID / URL'}
                                                                value={editingNode.data.target_address || ''}
                                                                onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, target_address: e.target.value } })}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent transition-all font-bold text-xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    {editingNode.data.platform === 'email' && (
                                                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4 animate-in fade-in slide-in-from-top-2">
                                                            <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-3 flex items-center gap-2">
                                                                <Globe className="w-2.5 h-2.5" /> Identity / From Domain
                                                            </label>
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => setEditingNode({ ...editingNode, data: { ...editingNode.data, from_domain: 'relay.digital' } })}
                                                                    className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all ${!editingNode.data.from_domain || editingNode.data.from_domain === 'relay.digital' ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                                                                >
                                                                    relay.digital (DEFAULT)
                                                                </button>
                                                                {domains.filter(d => d.status === 'verified').map(dom => (
                                                                    <button
                                                                        key={dom.id}
                                                                        onClick={() => setEditingNode({ ...editingNode, data: { ...editingNode.data, from_domain: dom.hostname } })}
                                                                        className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all ${editingNode.data.from_domain === dom.hostname ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                                                                    >
                                                                        {dom.hostname}
                                                                    </button>
                                                                ))}
                                                                {domains.filter(d => d.status === 'verified').length === 0 && (
                                                                    <span className="text-[8px] font-medium text-slate-600 italic">Verify a domain in the Identity Vault to enable whitelabeling.</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {editingNode.data.platform === 'discord' && (
                                                        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                                                            <div>
                                                                <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-1.5">Bot Name {!isEnterprise && <Lock className="w-2 h-2 text-amber-500/50" />}</label>
                                                                <div className="relative group/lock">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={isEnterprise ? "Override Name" : "Enterprise Only"}
                                                                        value={isEnterprise ? (editingNode.data.bot_name || '') : ''}
                                                                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, bot_name: e.target.value } })}
                                                                        disabled={!isEnterprise}
                                                                        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent transition-all font-bold text-xs ${!isEnterprise ? 'opacity-30 cursor-not-allowed select-none' : ''}`}
                                                                    />
                                                                    {!isEnterprise && (
                                                                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/lock:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px] rounded-xl pointer-events-none">
                                                                            <span className="text-[7px] font-black uppercase tracking-widest text-amber-400">Enterprise Only</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-1.5">Bot Avatar {!isEnterprise && <Lock className="w-2 h-2 text-amber-500/50" />}</label>
                                                                <div className="relative group/lock">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={isEnterprise ? "https://..." : "Enterprise Only"}
                                                                        value={isEnterprise ? (editingNode.data.bot_avatar || '') : ''}
                                                                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, bot_avatar: e.target.value } })}
                                                                        disabled={!isEnterprise}
                                                                        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent transition-all font-bold text-xs ${!isEnterprise ? 'opacity-30 cursor-not-allowed select-none' : ''}`}
                                                                    />
                                                                    {!isEnterprise && (
                                                                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/lock:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px] rounded-xl pointer-events-none">
                                                                            <span className="text-[7px] font-black uppercase tracking-widest text-amber-400">Enterprise Only</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {editingNode.data.platform && (
                                                        <div className="space-y-4">
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Message Template (Prompt)</label>
                                                                </div>
                                                                <textarea
                                                                    placeholder="Use {{order_id}} etc."
                                                                    value={editingNode.data.message_template || ''}
                                                                    onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, message_template: e.target.value } })}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent transition-all font-bold text-[10px] md:text-xs min-h-[60px] md:min-h-[80px] resize-none"
                                                                />
                                                                <p className="text-[8px] text-slate-600 font-bold mt-1.5 uppercase tracking-tight">Example: {"{{name}}"} for {"${{price}}"}</p>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Variables (JSON)</label>
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (isTestingScenario) return;
                                                                            setIsTestingScenario(true);
                                                                            const activeKey = apiKeys.find(k => k.is_active)?.key_hash || 'RELAY_PK_ENTERPRISE';
                                                                            try {
                                                                                await fetch('/api/relay', {
                                                                                    method: 'POST',
                                                                                    headers: { 'Content-Type': 'application/json', 'x-api-key': activeKey },
                                                                                    body: JSON.stringify({
                                                                                        category: 'DEBUG_STEP',
                                                                                        payload: JSON.parse(editingNode.data.test_variables || '{}'),
                                                                                        override_node: editingNode.id // Hidden feature to test just one node
                                                                                    })
                                                                                });
                                                                                setSaveSuccess(true);
                                                                                setTimeout(() => setSaveSuccess(false), 2000);
                                                                            } catch (e) {
                                                                                console.error("Simulation failed", e);
                                                                            } finally {
                                                                                setIsTestingScenario(false);
                                                                            }
                                                                        }}
                                                                        className="text-[8px] font-black text-accent hover:text-white transition-colors bg-accent/10 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <Play className="w-2 h-2" /> Simulate Step
                                                                    </button>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={editingNode.data.test_variables || ''}
                                                                    onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, test_variables: e.target.value } })}
                                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-accent font-mono text-[9px] focus:outline-none focus:border-accent/50 transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {editingNode.type === 'webhookNode' && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Target Payload URL</label>
                                                        <input
                                                            type="text"
                                                            placeholder="https://your-api.com/webhooks/relay"
                                                            value={editingNode.data.target_url || ''}
                                                            onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, target_url: e.target.value } })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-all font-bold text-sm"
                                                        />
                                                    </div>
                                                    <div className="p-3 md:p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                                                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Integration Logic</div>
                                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                            This node will dispatch a POST request with the full JSON payload to the specified URL whenever the preceding logic condition passes.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {editingNode.type === 'conditionNode' && (() => {
                                                const rawCond = editingNode.data?.condition || 'payload.field == value';

                                                // Robust parsing that doesn't reset on every keystroke
                                                const parts = rawCond.trim().split(/\s+/);
                                                let source = 'payload';
                                                let key = '';
                                                let op = '==';
                                                let val = '';

                                                if (parts.length >= 1 && parts[0] !== 'true') {
                                                    const left = parts[0];
                                                    if (left.startsWith('variables.')) {
                                                        source = 'variables';
                                                        key = left.replace('variables.', '');
                                                    } else if (left.startsWith('payload.')) {
                                                        source = 'payload';
                                                        key = left.replace('payload.', '');
                                                    } else {
                                                        source = 'raw';
                                                        key = left;
                                                    }

                                                    if (parts.length >= 2) op = parts[1];
                                                    if (parts.length >= 3) val = parts.slice(2).join(' ').replace(/^['"](.*)['"]$/, '$1');
                                                }

                                                const handleUpdate = (newSource: string, newKey: string, newOp: string, newVal: string) => {
                                                    const prefix = newSource === 'raw' ? '' : `${newSource}.`;
                                                    const assembled = `${prefix}${newKey || 'field'} ${newOp} ${newVal || "''"}`;
                                                    setEditingNode({
                                                        ...editingNode,
                                                        data: { ...editingNode.data, condition: assembled }
                                                    });
                                                };

                                                return (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Logic Condition</label>
                                                            <button
                                                                onClick={() => setShowAdvancedCondition(!showAdvancedCondition)}
                                                                className="text-[9px] font-bold text-accent hover:text-white transition-colors"
                                                            >
                                                                {showAdvancedCondition ? 'SWITCH TO VISUAL BUILDER' : 'ADVANCED MODE (JS)'}
                                                            </button>
                                                        </div>

                                                        {showAdvancedCondition ? (
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    value={editingNode.data.condition}
                                                                    onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, condition: e.target.value } })}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-purple-400 font-mono text-sm focus:outline-none focus:border-purple-500 transition-all"
                                                                    placeholder="payload.amount > 100"
                                                                />
                                                                <Code className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600" />
                                                            </div>
                                                        ) : (
                                                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4 shadow-inner">
                                                                <div className="flex items-center gap-3">
                                                                    <select
                                                                        value={source}
                                                                        onChange={e => handleUpdate(e.target.value, key, op, val)}
                                                                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer"
                                                                    >
                                                                        <option value="payload" className="bg-slate-900">🟢 Payload</option>
                                                                        <option value="variables" className="bg-slate-900">🟣 Variables</option>
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        value={key}
                                                                        onChange={e => handleUpdate(source, e.target.value, op, val)}
                                                                        placeholder="field_name"
                                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none font-mono text-sm"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <select
                                                                        value={op}
                                                                        onChange={e => handleUpdate(source, key, e.target.value, val)}
                                                                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-amber-400 focus:border-amber-500 outline-none text-[11px] font-black uppercase tracking-wider text-center appearance-none cursor-pointer"
                                                                    >
                                                                        <option value="==" className="bg-slate-900">Is Equal To (==)</option>
                                                                        <option value="!=" className="bg-slate-900">Not Equal (!=)</option>
                                                                        <option value=">" className="bg-slate-900">Greater Than (&gt;)</option>
                                                                        <option value="<" className="bg-slate-900">Less Than (&lt;)</option>
                                                                        <option value="contains" className="bg-slate-900">Contains Text</option>
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        value={val}
                                                                        onChange={e => handleUpdate(source, key, op, e.target.value)}
                                                                        placeholder="Value..."
                                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-emerald-400 focus:border-emerald-500 outline-none font-mono text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                            {editingNode.type === 'waitNode' && (
                                                <div className="flex items-center gap-6">
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Duration</label>
                                                        <input
                                                            type="number"
                                                            value={editingNode.data.duration}
                                                            onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, duration: parseInt(e.target.value) } })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Unit</label>
                                                        <select
                                                            value={editingNode.data.unit}
                                                            onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, unit: e.target.value } })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none focus:outline-none focus:border-amber-500 font-bold uppercase text-[10px]"
                                                        >
                                                            <option value="seconds" className="bg-slate-900 text-white font-bold">Seconds</option>
                                                            <option value="minutes" className="bg-slate-900 text-white font-bold">Minutes</option>
                                                            <option value="hours" className="bg-slate-900 text-white font-bold">Hours</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 pt-4 md:pt-6">
                                            {editingNode.type !== 'triggerNode' && (
                                                <button
                                                    onClick={() => {
                                                        setScenarios(prev => prev.map(s => {
                                                            if (s.id !== activeScenarioId) return s;
                                                            return {
                                                                ...s,
                                                                nodes: s.nodes.filter((n: any) => n.id !== editingNode.id)
                                                            };
                                                        }));
                                                        setIsNodeModalOpen(false);
                                                    }}
                                                    className="w-full md:w-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all group order-3 md:order-1"
                                                    title="Delete Node"
                                                >
                                                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform mx-auto" />
                                                </button>
                                            )}
                                            {editingNode.type === 'actionNode' && (
                                                <button
                                                    onClick={() => {
                                                        const newNode = {
                                                            ...editingNode,
                                                            id: `node_${Math.random().toString(36).substring(2, 9)}`,
                                                            data: { ...editingNode.data, label: editingNode.data.label + ' (Copy)' }
                                                        };
                                                        setScenarios(prev => prev.map(s => {
                                                            if (s.id !== activeScenarioId) return s;
                                                            const newNodes = [...s.nodes];
                                                            const idx = newNodes.findIndex(n => n.id === editingNode.id);
                                                            newNodes.splice(idx + 1, 0, newNode);
                                                            return { ...s, nodes: newNodes };
                                                        }));
                                                        setIsNodeModalOpen(false);
                                                    }}
                                                    className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 order-2"
                                                >
                                                    <Copy className="w-4 h-4" /> Duplicate as Parallel
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setIsNodeModalOpen(false)}
                                                className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-bold hover:bg-white/10 hover:text-white transition-all uppercase text-[10px] tracking-widest cursor-pointer order-4 md:order-3"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                onClick={() => updateNodeData(editingNode.id, editingNode.data)}
                                                className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-accent text-white font-black hover:shadow-[0_0_30px_var(--accent-glow)] transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 px-6 md:px-12 cursor-pointer order-1 md:order-4"
                                            >
                                                <Save className="w-4 h-4" /> Apply Changes
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div >
        );
    };

    const renderAdminPanel = () => {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="flex justify-between items-center mb-8">
                    <div className="relative">
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-full blur-sm" />
                        <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">Superuser Terminal</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Shield className="w-3 h-3 text-accent" /> Node Management & Global Overrides
                        </p>
                    </div>
                </header>

                <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl bg-white/[0.01]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Context</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Plan</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isAdminLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">Syncing with Relay Core...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : adminAccounts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No nodes detected in local cluster</p>
                                    </td>
                                </tr>
                            ) : (
                                adminAccounts.map((acc: any) => (
                                    <tr key={acc.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-white italic group-hover:border-accent/30 transition-all overflow-hidden relative">
                                                    {acc.avatar_url ? (
                                                        <img src={acc.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : getInitials(acc.full_name)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-none mb-1 group-hover:text-accent transition-colors">
                                                        {acc.full_name || 'Generic Operator'}
                                                        {acc.email === 'quiel.g538@gmail.com' && <span className="ml-2 text-[7px] bg-accent/20 text-accent px-1.5 py-0.5 rounded border border-accent/20">ROOT</span>}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-mono italic opacity-60">{acc.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-xs font-semibold text-slate-400 italic">
                                            {acc.company || 'Independent Lab'}
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${getPlanStyles(acc.plan)}`}>
                                                {acc.plan}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {['free', 'starter', 'pro', 'enterprise'].map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => handleUpdateUserPlan(acc.id, p)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all border ${acc.plan === p.toLowerCase()
                                                            ? getPlanStyles(p) + ' ring-1 ring-white/10'
                                                            : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border-white/5'}`}
                                                    >
                                                        {p === 'enterprise' ? 'ENT' : p.slice(0, 3)}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handleDeleteUser(acc.id)}
                                                    className="ml-2 px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500"
                                                >
                                                    DEL
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const handleTestRelay = async () => {
        setIsTesting(true);
        setTestResult(null);

        // Use the first active key for the user, or fallback
        const activeKey = apiKeys.find(k => k.is_active)?.key_hash || 'INTERNAL_DEBUG_KEY';

        try {
            const res = await fetch('/api/relay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': activeKey
                },
                body: JSON.stringify({
                    platforms: testConfig.platforms,
                    target: testConfig.target,
                    message: testConfig.message,
                    variables: JSON.parse(testConfig.variables || "{ }"),
                    botName: testConfig.botName,
                    botAvatar: testConfig.botAvatar,
                    category: testConfig.category
                })
            });
            const data = await res.json();
            setTestResult(data);

            // Re-fetch stats after a short delay since it's processed in background
            setTimeout(() => {
                fetchStats();
            }, 2500);
        } catch (err: any) {
            setTestResult({ error: err.message });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex relative overflow-hidden text-slate-300 selection:bg-accent/30 selection:text-white">
            {/* Background Accents */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass z-40 border-b border-white/5 px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                        <Zap className="text-white w-5 h-5" fill="currentColor" />
                    </div>
                    <span className="font-bold text-lg tracking-tighter uppercase text-white">RELAY</span>
                </Link>
                <button
                    onClick={() => setIsSidebarMobileOpen(true)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                    <LayoutDashboard className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {isSidebarMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 w-72 glass border-r-0 border-y-0 rounded-r-[32px] md:rounded-r-[40px] p-5 lg:p-8 flex flex-col z-[50] m-0 lg:m-4 shadow-2xl transition-transform duration-500 ease-in-out overflow-y-auto scrollbar-hide
                ${isSidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="lg:hidden absolute top-6 right-6">
                    <button
                        onClick={() => setIsSidebarMobileOpen(false)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <Link href="/" className="flex items-center gap-3 mb-12 group cursor-pointer">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)] group-hover:scale-105 transition-transform">
                        <Zap className="text-white w-6 h-6" fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter uppercase whitespace-nowrap text-white flex items-center gap-1 group-hover:text-accent transition-colors">
                        RELAY
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border align-top leading-tight ${getPlanStyles(user?.plan)}`}>
                            {user?.plan || 'FREE'}
                        </span>
                    </span>
                </Link>

                {/* User Initials Avatar in Sidebar (Read Only) */}
                <div className="mb-8 px-2">
                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-lg border border-white/10 shrink-0 overflow-hidden relative">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : getInitials(user?.name, user?.full_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user?.name || 'Developer'}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest truncate">{user?.company || 'Aether Digital'}</p>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md border uppercase whitespace-nowrap ${getPlanStyles(user?.plan)}`}>
                                    {user?.plan || 'FREE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: "overview", icon: <Key className="w-5 h-5" />, label: "API KEYS" },
                        { id: "integration", icon: <Terminal className="w-5 h-5" />, label: "INTEGRATION" },
                        { id: "logs", icon: <BarChart3 className="w-5 h-5" />, label: d.sidebar?.analytics || "ANALYTICS" },
                        { id: "relay_ai", icon: <Sparkles className="w-5 h-5" />, label: d.sidebar?.relayAi || "RELAY AI" },
                        { id: "status", icon: <Activity className="w-5 h-5" />, label: d.sidebar?.status || "STATUS" },
                        { id: "test", icon: <FlaskConical className="w-5 h-5" />, label: d.sidebar?.testLab || "TEST LAB" },
                        { id: "scenarios", icon: <Network className="w-5 h-5" />, label: d.sidebar?.scenarios || "SCENARIOS" },
                        { id: "connectors", icon: <Zap className="w-5 h-5" />, label: d.sidebar?.connectors || "CONNECTORS" },
                        { id: "templates", icon: <FileText className="w-5 h-5" />, label: d.sidebar?.templates || "TEMPLATES" },
                        { id: "webhooks", icon: <Zap className="w-5 h-5" />, label: d.sidebar?.webhooks || "WEBHOOKS" },
                        { id: "domains", icon: <Globe className="w-5 h-5" />, label: d.sidebar?.domains || "DOMAINS" },
                        { id: "settings", icon: <Settings className="w-5 h-5" />, label: d.sidebar?.settings || "SETTINGS" },
                        ...((user?.is_admin || user?.email?.trim().toLowerCase() === 'quiel.g538@gmail.com') ? [{ id: "admin", icon: <Shield className="w-5 h-5" />, label: "ADMIN" }] : [])
                    ].map((item: any) => (
                        <button
                            key={item.id}
                            disabled={item.disabled}
                            onClick={() => {
                                if (!item.disabled) {
                                    if (activeTab === 'scenarios' && activeScenarioId) {
                                        handleSaveScenario();
                                    }
                                    setActiveTab(item.id);
                                    setIsSidebarMobileOpen(false);
                                }
                            }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                                ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                : item.disabled
                                    ? "text-slate-700 cursor-not-allowed opacity-40"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`${activeTab === item.id ? "text-white" : item.disabled ? "text-slate-800" : "text-slate-500 group-hover:text-accent"} transition-colors`}>
                                {item.icon}
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                {item.label}
                            </span>
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="activeGlow"
                                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Language Switcher in Sidebar */}
                <div className="mt-8 mb-4 relative z-50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Language</p>
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-sm font-medium text-slate-300 hover:text-white cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={`https://flagcdn.com/w40/${languages.find(l => l.code === lang)?.flag || 'us'}.png`}
                                alt={lang}
                                className="w-5 h-auto rounded-sm"
                            />
                            <span className="truncate">{languages.find(l => l.code === lang)?.name || 'English'}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-white transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isLangOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-[100]"
                                    onClick={() => setIsLangOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl z-[110] max-h-64 overflow-y-auto scrollbar-hide"
                                >
                                    {languages.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => {
                                                setLang(l.code as Language);
                                                localStorage.setItem('relay-lang', l.code);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${lang === l.code ? 'bg-accent/10 text-accent font-bold border border-accent/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'} cursor-pointer`}
                                        >
                                            <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt={l.name} className="w-5 h-auto rounded-sm" />
                                            <span className="truncate">{l.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-400 transition-colors text-sm font-medium mt-auto group cursor-pointer"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {d.nav.signOut}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 lg:p-12 pt-24 lg:pt-12 overflow-y-auto scrollbar-hide">
                <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-3 md:gap-6 mb-6 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="scale-95 origin-center md:origin-left"
                    >
                        <div className="flex flex-col items-center md:items-start max-w-fit md:max-w-none mx-auto md:mx-0 text-center md:text-left">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 mb-0.5 md:mb-1">
                                <h1 className="text-[17px] md:text-2xl lg:text-3xl font-black tracking-tighter text-white uppercase italic leading-tight">
                                    {d.welcome} {user?.name || 'Developer'}
                                </h1>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full h-fit shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-500/80 uppercase tracking-widest">{d.status?.stable || "Stable"}</span>
                                </div>
                            </div>
                            <p className="text-[7.5px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] opacity-70 w-full leading-snug">
                                {d.subtitle.replace('{count}', stats.success.toString())}
                            </p>
                        </div>
                    </motion.div>
                    {(activeTab === 'overview' || activeTab === 'keys') && (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto mt-2 md:mt-0">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-accent text-white font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all active:scale-[0.98] group cursor-pointer"
                            >
                                <Plus className="w-5 h-5 group-rotate-90 transition-transform duration-500" /> {d.newKey}
                            </button>
                        </div>
                    )}
                </header>

                {/* Content based on Active Tab */}
                {activeTab === "admin" && renderAdminPanel()}
                {activeTab === "scenarios" && (activeScenarioId ? renderScenarioEditor() : renderScenarios())}
                {activeTab === "relay_ai" && renderRelayAI()}
                {(activeTab === "overview" || activeTab === "keys") ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                            {/* Message Usage Radial Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 md:p-8 rounded-[32px] md:rounded-[38px] glass border-white/5 bg-white/[0.01] relative overflow-hidden group flex flex-col items-center justify-center text-center"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-20">
                                    <Database className="w-5 h-5 text-accent" />
                                </div>

                                <div className="relative w-28 h-28 mb-4">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="56" cy="56" r="48"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-white/5"
                                        />
                                        <motion.circle
                                            cx="56" cy="56" r="48"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            strokeDasharray="301.59"
                                            initial={{ strokeDashoffset: 301.59 }}
                                            animate={{
                                                strokeDashoffset: (stats as any).limit > 1000000 ? 0 : 301.59 - (301.59 * Math.min((stats as any).usage || 0, (stats as any).limit || 100)) / ((stats as any).limit || 100)
                                            }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            strokeLinecap="round"
                                            className={`${((stats as any).limit <= 1000000 && ((stats as any).usage / (stats as any).limit) > 0.8) ? 'text-rose-500' : 'text-accent'} drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className={`mb-1 px-2 py-0.5 rounded-full text-[6px] font-black uppercase tracking-[0.2em] border shadow-sm ${getPlanStyles((stats as any).plan)}`}>
                                            {(stats as any).plan || 'FREE'}
                                        </div>
                                        <span className="text-xl font-black text-white italic tracking-tighter">
                                            {(stats as any).limit > 1000000 ? "∞" : `${Math.round(((stats as any).usage / (stats as any).limit) * 100) || 0}%`}
                                        </span>
                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-0.5">UPLINK CAP</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">MESSAGE VOLUME</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">
                                        {(stats as any).usage || 0} <span className="opacity-40">/</span> {(stats as any).limit > 1000000 ? "∞" : ((stats as any).limit || 100)}
                                    </p>
                                </div>

                                {(stats as any).limit <= 1000000 && (stats as any).usage / (stats as any).limit > 0.8 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[8px] font-black text-rose-400 uppercase tracking-widest animate-pulse"
                                    >
                                        Quota Warning
                                    </motion.div>
                                )}
                            </motion.div>

                            {[
                                { label: d.stats.success, value: stats.success.toString(), color: "text-emerald-400", icon: <Zap className="w-5 h-5 text-emerald-500/50" /> },
                                { label: d.stats.failure, value: stats.failureRate, color: "text-rose-400", icon: <ShieldAlert className="w-5 h-5 text-rose-500/50" /> },
                                { label: d.stats.latency, value: stats.latency, color: "text-accent", icon: <Activity className="w-5 h-5 text-accent/50" /> }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 md:p-8 rounded-[32px] md:rounded-[38px] glass hover:border-white/10 transition-all cursor-pointer group relative overflow-hidden bg-white/[0.01] flex flex-col items-center justify-center text-center"
                                >
                                    <div className="absolute top-4 right-5 md:right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                                        {stat.icon}
                                    </div>
                                    <p className="text-slate-500 text-[10px] font-black mb-4 tracking-widest uppercase">{stat.label}</p>
                                    <div className="flex items-baseline justify-center gap-3">
                                        <span className="text-5xl font-bold tracking-tighter text-white">{stat.value}</span>
                                    </div>
                                    {/* Subtle curve line decoration */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                </motion.div>
                            ))}
                        </div>

                        {/* API Keys Table */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="lg:col-span-2 rounded-[32px] md:rounded-[44px] glass p-5 md:p-10 shadow-2xl">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-bold tracking-tight text-white">{d.table.title}</h3>
                                </div>

                                <div className="space-y-4">
                                    {apiKeys.length === 0 ? (
                                        <div className="py-20 text-center text-slate-500 border-2 border-dashed border-white/5 rounded-[32px]">
                                            <Key className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                            <p className="font-medium italic">No protocol keys discovered. Generate one to initiate uplink.</p>
                                        </div>
                                    ) : (
                                        apiKeys.map((key, i) => (
                                            <motion.div
                                                key={key.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex flex-row items-center justify-between p-3 md:p-6 rounded-[20px] md:rounded-[32px] bg-white/[0.03] border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.05] transition-all group relative overflow-hidden gap-2 md:gap-4 w-full"
                                            >
                                                <div className="flex flex-row items-center gap-2 md:gap-5 z-10 flex-1 min-w-0">
                                                    <div className="w-8 h-8 md:w-14 h-14 rounded-lg md:rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-xl hidden sm:flex">
                                                        <Globe className="w-4 h-4 md:w-7 md:h-7 text-accent" />
                                                    </div>
                                                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                                                        <h4 className="font-bold text-[11px] md:text-base tracking-tight text-white/90 truncate hidden md:block shrink-0">{key.label}</h4>
                                                        <div className="flex items-center justify-between gap-1 md:gap-2 bg-slate-900/50 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg md:rounded-xl border border-white/5 flex-1 min-w-0">
                                                            <div className="flex items-center gap-1 md:gap-2 overflow-hidden mr-1">
                                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1 shrink-0 hidden sm:block">Secret</span>
                                                                <code className="font-mono text-[9px] md:text-[11px] text-slate-400 tracking-wider truncate">
                                                                    {visibleKeys.has(key.id) ? key.key_hash : `${key.key_hash.substring(0, 6)}••••`}
                                                                </code>
                                                            </div>
                                                            <div className="flex items-center gap-0.5 md:gap-1 border-l border-white/10 pl-1 shrink-0">
                                                                <button
                                                                    onClick={() => toggleKeyVisibility(key.id)}
                                                                    className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                                                                    title={visibleKeys.has(key.id) ? "Hide Key" : "Show Key"}
                                                                >
                                                                    {visibleKeys.has(key.id) ? <EyeOff className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => copyToClipboard(key.key_hash)}
                                                                    className="p-1 text-slate-500 hover:text-accent transition-colors cursor-pointer"
                                                                    title="Copy Key"
                                                                >
                                                                    <Copy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] text-slate-600 italic whitespace-nowrap hidden xl:block">Created {new Date(key.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 md:gap-8 z-10 shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-baseline gap-1 bg-accent/5 px-2 py-1 md:px-3 md:py-1 rounded-full border border-accent/10">
                                                            <span className="text-[10px] md:text-sm font-black text-accent">{key.call_count}</span>
                                                            <span className="text-[7px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tight hidden sm:block">Requests</span>
                                                            <span className="text-[7px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tight sm:hidden">Req</span>
                                                        </div>
                                                        <span className="text-[7px] md:text-[9px] uppercase text-emerald-400 font-black tracking-widest sm:flex items-center gap-1.5 px-1 hidden">
                                                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRevokeKey(key.id)}
                                                        className="p-1.5 md:p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg md:rounded-xl transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                                                        title="Revoke Key"
                                                    >
                                                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                                    </button>
                                                </div>

                                                {/* Hover Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Documentation Side Panel */}
                            <div className="rounded-[32px] md:rounded-[44px] glass p-6 md:p-10 border-accent/20 bg-accent/[0.02] relative overflow-hidden h-fit">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full" />
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                    <Zap className="w-5 h-5 text-accent" fill="currentColor" /> {d.quickstart?.title || "Quick Start"}
                                </h3>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px] leading-relaxed text-slate-300 shadow-inner">
                                        <p className="text-accent mb-3">{d.quickstart?.firstMsg || "# Relay your first message"}</p>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="mb-1.5 uppercase text-[8px] text-slate-500 font-black tracking-[0.2em]">{d.quickstart?.baseEndpoint || "Base Endpoint"}</p>
                                                <div className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5 inline-block text-[10px] md:text-xs overflow-x-auto max-w-full">POST /api/relay</div>
                                            </div>

                                            <div className="overflow-hidden max-w-full">
                                                <p className="mb-1.5 uppercase text-[8px] text-slate-500 font-black tracking-[0.2em]">{d.quickstart?.curlExample || "CURL Example"}</p>
                                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-slate-400 space-y-1 overflow-x-auto scrollbar-hide text-[10px] md:text-xs">
                                                    <div className="flex gap-2 min-w-max">
                                                        <span className="text-emerald-400 shrink-0">curl</span>
                                                        <span>-X POST https://relay.aether.digital/api/relay \</span>
                                                    </div>
                                                    <div className="pl-6 md:pl-12 flex gap-2 min-w-max">
                                                        <span className="text-slate-600">-H</span>
                                                        <span className="text-amber-400">"x-api-key: RELAY_PK_..." \</span>
                                                    </div>
                                                    <div className="pl-6 md:pl-12 flex gap-2 min-w-max">
                                                        <span className="text-slate-600">-d</span>
                                                        <span className="text-amber-400">'{"{"} "platform": "telegram", "target": "@chat_id", "message": "Relay Uplink Stable" {"}"}'</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        {d.quickstart?.desc || "Use any generated key from the list to authorize your terminal uplink."}
                                    </p>
                                    <Link href="/docs" className="block w-full py-4 text-center rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer text-white/70 hover:text-white">
                                        {d.quickstart?.viewDocs || "VIEW FULL PROTOCOL DOCS"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'logs' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">{(d.logs?.title || "PROTOCOL LOGS").split(" ")[0]} <span className="text-accent underline underline-offset-8 decoration-accent/20">{(d.logs?.title || "PROTOCOL LOGS").split(" ")[1] || "LOGS"}</span></h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{d.logs?.subtitle || "Real-time delivery telemetry and diagnostic reporting"}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                {/* Search */}
                                <div className="relative flex-1 md:flex-none min-w-[160px]">
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        value={logFilters.search}
                                        onChange={(e) => setLogFilters(prev => ({ ...prev, search: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:border-accent"
                                    />
                                    <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                </div>
                                {/* Platform Filter */}
                                <div className="flex-1 md:flex-none">
                                    <select
                                        value={logFilters.platform}
                                        onChange={(e) => setLogFilters(prev => ({ ...prev, platform: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white appearance-none cursor-pointer hover:bg-white/10 focus:outline-none"
                                    >
                                        <option className="bg-slate-900 text-white" value="all">Any Platform</option>
                                        <option className="bg-slate-900 text-white" value="telegram">Telegram</option>
                                        <option className="bg-slate-900 text-white" value="discord">Discord</option>
                                        <option className="bg-slate-900 text-white" value="whatsapp">WhatsApp</option>
                                    </select>
                                </div>
                                {/* Status Filter */}
                                <div className="flex-1 md:flex-none">
                                    <select
                                        value={logFilters.status}
                                        onChange={(e) => setLogFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white appearance-none cursor-pointer hover:bg-white/10 focus:outline-none"
                                    >
                                        <option className="bg-slate-900 text-white" value="">Any Status</option>
                                        <option className="bg-slate-900 text-white" value="success">Success</option>
                                        <option className="bg-slate-900 text-white" value="fault">Fault</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button
                                        onClick={fetchLogs}
                                        className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-3 text-white/70 hover:text-white"
                                    >
                                        <Activity className={`w-4 h-4 ${isLogsLoading ? 'animate-pulse text-accent' : ''}`} />
                                        {d.logs?.refresh || "Refresh"}
                                    </button>
                                    <button
                                        onClick={handleClearAllLogs}
                                        className="px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-3 text-rose-400"
                                        title="Wipe ALL logs"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {d.logs?.clearAll || "Clear"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[48px] glass overflow-hidden border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-black/20">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.03] border-b border-white/5">
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.logs?.colMethod || "Method / Platform"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.logs?.colKey || "Authenticatory Key"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.logs?.colStatus || "Status"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.logs?.colTiming || "Timing"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">{d.logs?.colSync || "Synchronization"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">{d.logs?.colActions || "Actions"}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {isLogsLoading ? (
                                            <tr><td colSpan={5} className="px-10 py-32 text-center text-slate-500 italic tracking-widest text-xs uppercase animate-pulse">RECEIVING PACKETS...</td></tr>
                                        ) : logs.length === 0 ? (
                                            <tr><td colSpan={5} className="px-10 py-32">
                                                <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-500 italic">
                                                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                                                        <ShieldAlert className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <span className="tracking-widest uppercase text-[10px] font-black">{d.logs?.empty || "Null activity detected on the relay uplink."}</span>
                                                </div>
                                            </td></tr>
                                        ) : logs.map((log) => (
                                            <motion.tr
                                                key={log.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-white/[0.03] transition-colors group"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-xl">
                                                            {log.platform?.toLowerCase() === 'telegram' ? <Bot className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">POST</span>
                                                                <span className="font-bold text-white/90 capitalize text-sm">{log.platform}</span>
                                                                {log.category && (
                                                                    <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase tracking-tighter">
                                                                        {log.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[9px] text-slate-600 font-mono">RELAY_EN_V1.0</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                        <Key className="w-3 h-3 text-slate-600" />
                                                        <span className="text-xs text-white/70 font-bold italic">{log.api_keys?.label || 'UNIDENTIFIED'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-1.5 flex flex-col items-start">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${log.status_code >= 200 && log.status_code < 300
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                                                                }`}>
                                                                {log.status_code >= 200 && log.status_code < 300 ? 'SUCCESS' : `FAULT ${log.status_code}`}
                                                            </span>
                                                            {log.status_code >= 400 && (
                                                                <div className="relative group/insight z-50">
                                                                    <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse cursor-help" />
                                                                    <div className="absolute bottom-full left-0 mb-4 opacity-0 group-hover/insight:opacity-100 transition-all pointer-events-none w-64 translate-y-2 group-hover/insight:translate-y-0 duration-300">
                                                                        <div className="glass p-4 rounded-2xl border-accent/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0a0c10]/95 backdrop-blur-2xl">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <Zap className="w-3 h-3 text-accent" />
                                                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">AI FAULT DIAGNOSIS</span>
                                                                            </div>
                                                                            <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                                                                                {log.status_code === 403 ? "Invalid API signature detected. Ensure your x-api-key header matches a valid key from the API Keys tab." :
                                                                                    log.status_code === 401 ? "Unauthorized. User session expired or invalid credentials provided to the provider." :
                                                                                        log.status_code === 429 ? "Rate limit exceeded. Your current plan allows 1 req/sec. Consider upgrading for high-throughput." :
                                                                                            log.status_code === 500 ? "Internal upstream error. The provider (Discord/Telegram) rejected the packet header." :
                                                                                                "Network anomaly detected. Relay attempted 3 retries before timing out."}
                                                                            </p>
                                                                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                                                                <span className="text-[8px] font-black text-slate-500 uppercase">Confidence: 98%</span>
                                                                                <span className="text-[8px] font-black text-accent uppercase tracking-widest">Actionable Insight</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {(log.status_code >= 400 || log.error_message) && (
                                                            <p className="text-[9px] text-rose-500/40 font-mono max-w-[180px] truncate px-1" title={log.error_message || 'Access Forbidden'}>
                                                                {log.error_message || (log.status_code === 403 ? 'Invalid API Signature' : 'Internal Engine Fault')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${log.response_time < 200 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                        <span className="text-sm font-mono text-accent font-bold tracking-tighter">
                                                            {log.response_time}ms
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-center">
                                                    <div className="text-xs text-white/70 font-bold tracking-tight mb-0.5">
                                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                                    </div>
                                                    <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest font-mono">
                                                        {new Date(log.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <button
                                                        onClick={() => handleDeleteLog(log.id)}
                                                        className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                                        title="Delete Single Log"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-white/[0.03]">
                                {isLogsLoading ? (
                                    <div className="py-20 text-center text-slate-500 italic tracking-widest text-xs uppercase animate-pulse">Receiving Packets...</div>
                                ) : logs.length === 0 ? (
                                    <div className="py-20 text-center text-slate-500 italic tracking-widest uppercase text-[10px] font-black">Null activity detected.</div>
                                ) : logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 flex flex-col gap-4 bg-white/[0.02]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-accent">
                                                    {log.platform?.toLowerCase() === 'telegram' ? <Bot className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-white capitalize text-sm">{log.platform}</span>
                                                        {log.category && (
                                                            <span className="px-1.5 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-[7px] font-black uppercase">
                                                                {log.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-fit block">{log.api_keys?.label || 'UNIDENTIFIED'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] ${log.status_code >= 200 && log.status_code < 300
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                    }`}>
                                                    {log.status_code >= 200 && log.status_code < 300 ? 'SUCCESS' : `FAULT ${log.status_code}`}
                                                </span>
                                                <span className="text-[8px] text-slate-600 font-black mt-1 uppercase">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${log.response_time < 200 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    <span className="text-xs font-mono text-accent font-bold">{log.response_time}ms</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLog(log.id)}
                                                className="p-2 text-slate-600 hover:text-rose-500 active:bg-rose-500/10 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {log.status_code >= 400 && (
                                            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[9px] text-rose-400 font-medium leading-relaxed italic">
                                                {log.error_message || (log.status_code === 403 ? 'Invalid API Signature' : 'Internal Engine Fault')}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Diagnostic Protocol Tip */}
                        <div className="p-10 rounded-[44px] glass border border-accent/20 bg-accent/[0.02] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-3xl bg-accent text-white flex items-center justify-center shadow-[0_0_30px_var(--accent-glow)]">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-lg tracking-tight uppercase">{d.logs?.diagTitle || "Automated Diagnostic Protocol"}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{d.logs?.diagDesc || "Relay captures provider telemetry to decrease your MTTR by identifying delivery faults instantly."}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 relative z-10 shrink-0">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d.logs?.telemetryActive || "Telemetry Active"}</span>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'status' ? (
                    renderStatus()
                ) : activeTab === 'templates' ? (
                    renderTemplates()
                ) : activeTab === 'integration' ? (
                    renderIntegration()
                ) : activeTab === 'test' ? (
                    renderTestLab()
                ) : activeTab === 'connectors' ? (
                    renderConnectors()
                ) : activeTab === 'webhooks' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">{(d.webhooks?.title || "PROTOCOL ENDPOINTS").split(" ")[0]} <span className="text-accent underline underline-offset-8 decoration-accent/20">{(d.webhooks?.title || "PROTOCOL ENDPOINTS").split(" ").slice(1).join(" ") || "ENDPOINTS"}</span></h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{d.webhooks?.subtitle || "Configure HTTP callbacks for real-time delivery events"}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setWebhookModalMode('create');
                                    setIsWebhookModalOpen(true);
                                }}
                                className="px-8 py-4 rounded-2xl bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_var(--accent-glow)] transition-all cursor-pointer flex items-center gap-3"
                            >
                                <Zap className="w-4 h-4" />
                                {d.webhooks?.createBtn || "Create Webhook"}
                            </button>
                        </div>

                        <div className="rounded-[32px] md:rounded-[48px] glass overflow-hidden border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-black/20">
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.03] border-b border-white/5">
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.webhooks?.colLabel || "Label / Status"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.webhooks?.colDestUrl || "Destination URL"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.webhooks?.colSecret || "Secret Token"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">{d.webhooks?.colActions || "Actions"}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {isWebhooksLoading ? (
                                            <tr><td colSpan={4} className="px-10 py-32 text-center text-slate-500 italic tracking-widest text-xs uppercase animate-pulse">{d.webhooks?.scanning || "SCANNING ENDPOINTS..."}</td></tr>
                                        ) : webhooks.length === 0 ? (
                                            <tr><td colSpan={4} className="px-10 py-32">
                                                <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-500 italic">
                                                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                                                        <Zap className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <span className="tracking-widest uppercase text-[10px] font-black">{d.webhooks?.empty || "No active webhooks configured for this account."}</span>
                                                </div>
                                            </td></tr>
                                        ) : webhooks.map((webhook) => (
                                            <motion.tr
                                                key={webhook.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-white/[0.03] transition-colors group"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-3 h-3 rounded-full ${webhook.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                                                        <div>
                                                            <div className="font-bold text-white/90 text-sm uppercase tracking-tight">{webhook.label || d.webhooks?.unnamed || 'Unnamed Webhook'}</div>
                                                            <span className="text-[9px] text-slate-600 font-mono">ID: {webhook.id.substring(0, 8)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-xs text-white/70 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 inline-block max-w-[300px] truncate">
                                                        {webhook.url}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono text-slate-500 italic">{webhook.secret.substring(0, 10)}...</span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(webhook.secret);
                                                                setCopied(true);
                                                                setTimeout(() => setCopied(false), 2000);
                                                            }}
                                                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-white"
                                                        >
                                                            <Key className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <button
                                                        onClick={() => handleDeleteWebhook(webhook.id)}
                                                        className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all ml-auto flex items-center justify-center group/delete"
                                                        title="Delete Webhook"
                                                    >
                                                        <Trash2 className="w-4 h-4 transition-transform group-hover/delete:scale-110" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden p-4 space-y-4">
                                {isWebhooksLoading ? (
                                    <div className="py-20 text-center text-slate-500 italic tracking-widest text-xs uppercase animate-pulse">Scanning...</div>
                                ) : webhooks.length === 0 ? (
                                    <div className="py-20 text-center text-slate-500 italic tracking-widest uppercase text-[10px] font-black">No active webhooks.</div>
                                ) : webhooks.map((webhook) => (
                                    <motion.div
                                        key={webhook.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 rounded-[24px] bg-white/[0.03] border border-white/5 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${webhook.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                                                <span className="font-bold text-white text-sm uppercase tracking-tight">{webhook.label || 'Unnamed Webhook'}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteWebhook(webhook.id)}
                                                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Destination URL</p>
                                            <div className="text-[10px] text-white/70 font-mono bg-black/40 px-3 py-2 rounded-xl border border-white/5 break-all">
                                                {webhook.url}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Secret Token</p>
                                                <p className="text-[10px] font-mono text-slate-500">{webhook.secret.substring(0, 12)}...</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(webhook.secret);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"
                                            >
                                                <Key className="w-3 h-3" /> COPY
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'domains' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">{(d.domains?.title || "IDENTITY VAULT").split(" ")[0]} <span className="text-accent underline underline-offset-8 decoration-accent/20">{(d.domains?.title || "IDENTITY VAULT").split(" ").slice(1).join(" ") || "VAULT"}</span></h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{d.domains?.subtitle || "Verify domains for origin whitelisting and custom branding"}</p>
                            </div>
                            <button
                                onClick={() => setIsDomainModalOpen(true)}
                                className="px-8 py-4 rounded-2xl bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_var(--accent-glow)] transition-all cursor-pointer flex items-center gap-3"
                            >
                                <Globe className="w-4 h-4" />
                                {d.domains?.addBtn || "Add Domain"}
                            </button>
                        </div>

                        <div className="rounded-[32px] md:rounded-[48px] glass overflow-hidden border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-black/20">
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.03] border-b border-white/5">
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.domains?.colHostname || "Hostname"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.domains?.colStatus || "Verification Status"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.domains?.colCreated || "Created"}</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">{d.domains?.colActions || "Actions"}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {isDomainsLoading ? (
                                            <tr><td colSpan={4} className="px-10 py-32 text-center text-slate-500 italic tracking-widest text-xs uppercase animate-pulse">RESOLVING DOMAINS...</td></tr>
                                        ) : domains.length === 0 ? (
                                            <tr><td colSpan={4} className="px-10 py-32">
                                                <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-500 italic">
                                                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                                                        <Globe className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <span className="tracking-widest uppercase text-[10px] font-black">{d.domains?.empty || "No authorized domains found in your registry."}</span>
                                                </div>
                                            </td></tr>
                                        ) : domains.map((domain) => (
                                            <motion.tr
                                                key={domain.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-white/[0.03] transition-colors group"
                                            >
                                                <td className="px-10 py-8 text-sm font-bold text-white tracking-tight">
                                                    {domain.hostname}
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${domain.status === 'verified'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                                        }`}>
                                                        {domain.status}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-xs text-slate-500 font-medium">
                                                    {new Date(domain.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <button
                                                        onClick={() => handleDeleteDomain(domain.id)}
                                                        className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-black text-[10px]"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden p-4 space-y-4">
                                {isDomainsLoading ? (
                                    <div className="py-20 text-center text-slate-500 italic tracking-widest text-xs uppercase animate-pulse">Resolving...</div>
                                ) : domains.length === 0 ? (
                                    <div className="py-20 text-center text-slate-500 italic tracking-widest uppercase text-[10px] font-black">No domains Registry.</div>
                                ) : domains.map((domain) => (
                                    <motion.div
                                        key={domain.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 rounded-[24px] bg-white/[0.03] border border-white/5 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-sm tracking-tight">{domain.hostname}</span>
                                                <span className="text-[8px] text-slate-500 uppercase tracking-widest">Added {new Date(domain.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDomain(domain.id)}
                                                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] ${domain.status === 'verified'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {domain.status}
                                            </span>
                                            {domain.status !== 'verified' && (
                                                <button className="text-[9px] font-bold text-accent hover:underline uppercase">Verify Domain</button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'settings' ? (
                    <div className="max-w-3xl mx-auto space-y-10 py-10">
                        <div className="p-10 rounded-[44px] glass border border-white/5 relative overflow-hidden">
                            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-accent/20 blur-3xl rounded-full" />
                            <div className="flex items-center gap-6 mb-10">
                                <div
                                    onClick={handleAvatarClick}
                                    className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-2xl border border-white/10 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all overflow-hidden relative group/fullavatar"
                                >
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : getInitials(user?.name, user?.full_name)}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/fullavatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 pointer-events-none">
                                        <Upload className="w-6 h-6 text-white" />
                                        <span className="text-[8px] font-black uppercase text-white">SUBIR</span>
                                    </div>

                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{d.settings?.profileTitle || "Profile Configuration"}</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{d.settings?.profileSubtitle || "Identity & Organization"}</p>
                                </div>
                                <div className="ml-auto w-full md:w-auto flex flex-col md:flex-row gap-3 items-end md:items-center justify-end">
                                    {/* Removed Edit Profile Toggle */}
                                    {errorMessage && (
                                        <div className={`px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2 tracking-wide border ${errorMessage!.toLowerCase().includes('failed') || errorMessage!.toLowerCase().includes('error') ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                            {errorMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{d.settings?.fullName || "Full Name"}</p>
                                    <input
                                        type="text"
                                        value={tempUser?.full_name ?? user?.full_name ?? user?.name ?? ""}
                                        onChange={(e) => setTempUser({ ...(tempUser || user), full_name: e.target.value, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors focus:bg-white/10"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{d.settings?.corporateEmail || "Corporate Email"}</p>
                                    <input
                                        type="email"
                                        value={tempUser?.email ?? user?.email ?? ""}
                                        onChange={(e) => setTempUser({ ...(tempUser || user), email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors focus:bg-white/10"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{d.settings?.organization || "Organization"}</p>
                                    <input
                                        type="text"
                                        value={tempUser?.company ?? user?.company ?? ""}
                                        onChange={(e) => setTempUser({ ...(tempUser || user), company: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors focus:bg-white/10"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{d.settings?.accountId || "Account ID"}</p>
                                    <p className="text-xs font-mono text-slate-500 truncate mt-3">{user?.id}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{d.settings?.activePlan || "Active Plan"}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest">
                                            {user?.plan || 'FREE'}
                                        </span>
                                        <Link href="/pricing" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-tight flex items-center gap-1">
                                            {d.settings?.upgrade || "Upgrade"} <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => handleSaveProfile()}
                                    disabled={!tempUser || isUploading}
                                    className="px-8 py-3 rounded-xl bg-accent text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                                    {d.settings?.saveBtn || "SAVE SETTINGS"}
                                </button>
                            </div>
                        </div>

                        {/* White Label / Custom Branding Section */}
                        <div className="p-10 rounded-[44px] glass border border-white/5 relative overflow-hidden group">
                            {user?.plan !== 'ENTERPRISE' && (
                                <div className="absolute inset-0 z-20 backdrop-blur-[6px] bg-black/60 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                                    <Lock className="w-12 h-12 text-accent mb-6 animate-bounce" />
                                    <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{d.settings?.whiteLabelTitle}</h4>
                                    <p className="text-sm text-slate-400 mb-8 max-w-xs font-medium">
                                        {d.settings?.upgradeEnterprise}
                                    </p>
                                    <Link href="/pricing" className="px-8 py-4 rounded-2xl bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_var(--accent-glow)] hover:scale-105 transition-all">
                                        {d.settings?.upgrade}
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{d.settings?.whiteLabelTitle}</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{d.settings?.whiteLabelSubtitle}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{d.settings?.corpName}</p>
                                    <input
                                        type="text"
                                        value={whiteLabel.corporateName}
                                        onChange={(e) => setWhiteLabel({ ...whiteLabel, corporateName: e.target.value })}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{d.settings?.corpLogo}</p>
                                    <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500">
                                            {whiteLabel.corporateLogo ? <img src={whiteLabel.corporateLogo} className="w-full h-full object-cover rounded-lg" /> : <Upload className="w-5 h-5" />}
                                        </div>
                                        <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Upload Logo</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Options Section */}
                        <div className="p-10 rounded-[44px] glass border border-white/5">
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                                <Sparkles className="w-6 h-6 text-amber-400" /> {d.settings?.specialOptions || "Special Options"}
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { id: 'autoRefresh', label: d.settings?.autoRefresh || 'Auto-refresh Analytics', desc: d.settings?.autoRefreshDesc || 'Sync telemetry data every 30 seconds automatically.', icon: <BarChart3 className="w-5 h-5" /> },
                                    { id: 'notifications', label: d.settings?.protocolAlerts || 'Protocol Alerts', desc: d.settings?.protocolAlertsDesc || 'Receive real-time notifications for failed relay attempts.', icon: <Zap className="w-5 h-5" /> },
                                    { id: 'highPerformance', label: d.settings?.performanceMax || 'Performance Max', desc: d.settings?.performanceMaxDesc || 'Enable advanced GPU-accelerated UI transitions.', icon: <Zap className="w-5 h-5" /> }
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                                {opt.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white mb-1 text-sm tracking-tight">{opt.label}</p>
                                                <p className="text-xs text-slate-500">{opt.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setPreferences(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof prev] }))}
                                            className={`relative w-12 h-6 rounded-full transition-all duration-500 cursor-pointer ${preferences[opt.id as keyof typeof preferences] ? 'bg-accent shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-md ${preferences[opt.id as keyof typeof preferences] ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 rounded-[44px] glass border border-rose-500/10">
                            <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-3 underline decoration-rose-500/20 underline-offset-8">
                                <Shield className="w-5 h-5" /> {d.settings?.securityTitle || "Protocol Security"}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:bg-white/5 transition-all text-left group cursor-pointer"
                                >
                                    <KeyIcon className="w-10 h-10 text-slate-700 group-hover:text-accent transition-colors mb-4" />
                                    <h4 className="font-bold text-white mb-2">{d.settings?.updateCredentials || "Update Credentials"}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{d.settings?.updateCredentialsDesc || "Rotar claves de acceso y actualizar métodos de seguridad."}</p>
                                </button>
                                <button
                                    onClick={async () => {
                                        if (confirm("Rotate all API sessions? All current keys will remain active, but you'll be logged out everywhere else.")) {
                                            await fetch('/api/auth/logout', { method: 'POST' });
                                            window.location.reload();
                                        }
                                    }}
                                    className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:bg-rose-500/5 transition-all text-left group cursor-pointer"
                                >
                                    <Trash2 className="w-10 h-10 text-slate-700 group-hover:text-rose-400 transition-colors mb-4" />
                                    <h4 className="font-bold text-white mb-2 text-rose-400/80">{d.settings?.hardReset || "Hard Reset"}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{d.settings?.hardResetDesc || "Revocar todas las sesiones activas de esta cuenta."}</p>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Quick Profile Tip */}
                <div className="mt-12 flex items-center justify-center">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 tracking-wider uppercase font-medium hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                        <User className="w-4 h-4 text-accent" />
                        <span>{d.settings?.protocolOwner || "PROTOCOL OWNER:"} <span className="text-white font-black">{user?.name || user?.email}</span></span>
                    </motion.div>
                </div>
            </main>

            {/* Change Password Modal */}
            <AnimatePresence>
                {isChangingPassword && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsChangingPassword(false)}
                            className="absolute inset-0 bg-[#05070a]/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-[40px] p-10 relative z-10 shadow-3xl"
                        >
                            <h2 className="text-3xl font-black mb-2 text-white">Update Security</h2>
                            <p className="text-slate-500 text-sm mb-10">Ensure your account remains safe with a strong password.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="h-px bg-white/5" />
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-12">
                                <button
                                    onClick={() => setIsChangingPassword(false)}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-accent text-white font-black hover:shadow-[0_0_20px_var(--accent-glow)] transition-all cursor-pointer"
                                >
                                    UPDATE
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal - New API Key */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass border-white/10 rounded-[40px] p-10 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold tracking-tighter text-white">{d.modal.title}</h2>
                                <button onClick={closeModal} className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {!generatedKey ? (
                                <div className="space-y-6">
                                    {errorMessage && (
                                        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-in fade-in slide-in-from-top-2 tracking-wide">
                                            ERROR: {errorMessage}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">{d.modal.label}</label>
                                        <input
                                            type="text"
                                            value={keyLabel}
                                            onChange={(e) => setKeyLabel(e.target.value)}
                                            placeholder={d.modal.placeholder}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-accent shadow-inner transition-all font-medium"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleCreateKey}
                                        disabled={isCreatingKey || !keyLabel.trim()}
                                        className="w-full bg-accent text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                                    >
                                        {isCreatingKey ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Zap className="w-5 h-5" fill="currentColor" />
                                                {d.modal.create}
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-3 font-bold">
                                        <Check className="w-5 h-5 flex-shrink-0" />
                                        {d.modal.success}
                                    </div>

                                    <div className="relative group">
                                        <div className="p-5 bg-black/40 border border-white/5 rounded-2xl font-mono text-sm break-all pr-14 leading-relaxed tracking-wider shadow-inner text-white/80">
                                            {generatedKey}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(generatedKey!)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-accent transition-all bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer"
                                        >
                                            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-white/5 border border-white/10 text-white font-bold py-5 rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        {d.modal.close}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal - New Template */}
            <AnimatePresence>
                {isTemplateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTemplateModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass border-white/10 rounded-[40px] p-10 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold tracking-tighter text-white mb-2">New Template</h2>
                            <p className="text-slate-500 text-sm mb-8 font-medium">Use <code className="text-accent bg-accent/10 px-1 rounded">{"{{variable}}"}</code> to define dynamic fields.</p>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Template Internal Name</label>
                                    <input
                                        type="text"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        placeholder="e.g. purchase_success"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-accent shadow-inner transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Message Content</label>
                                    <textarea
                                        value={templateContent}
                                        onChange={(e) => setTemplateContent(e.target.value)}
                                        placeholder="Hi {{name}}, your order {{id}} is on the way!"
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-accent shadow-inner transition-all font-medium resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleCreateTemplate}
                                    disabled={!templateName.trim() || !templateContent.trim()}
                                    className="w-full bg-accent text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                                >
                                    <Plus className="w-5 h-5" />
                                    SAVE BLUEPRINT
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal - New Webhook */}
            <AnimatePresence>
                {isWebhookModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsWebhookModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass border-white/10 rounded-[40px] p-10 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold tracking-tighter text-white mb-2">
                                {webhookModalMode === 'connector' ? 'Integration Endpoint' : 'New Webhook'}
                            </h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">
                                {webhookModalMode === 'connector'
                                    ? 'Generated incoming route for your provider'
                                    : 'Configure outgoing HTTP callback notifications'}
                            </p>

                            <div className="space-y-6">
                                {webhookModalMode === 'create' && (
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Label</label>
                                        <input
                                            type="text"
                                            value={webhookLabel}
                                            onChange={(e) => setWebhookLabel(e.target.value)}
                                            placeholder="e.g. Production Alert System"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-accent shadow-inner transition-all font-medium"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                                        {webhookModalMode === 'connector' ? 'Your Unique Relay URL' : 'Destination URL'}
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="url"
                                            value={webhookUrl}
                                            onChange={(e) => setWebhookUrl(e.target.value)}
                                            readOnly={webhookModalMode === 'connector'}
                                            placeholder="https://your-server.com/api/webhook"
                                            className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-accent shadow-inner transition-all font-medium ${webhookModalMode === 'connector' ? 'font-mono text-xs pr-14 select-all' : ''}`}
                                        />
                                        {webhookModalMode === 'connector' && (
                                            <button
                                                onClick={() => copyToClipboard(webhookUrl)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-accent transition-all bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer"
                                            >
                                                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {webhookModalMode === 'connector' ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => {
                                                copyToClipboard(webhookUrl);
                                                setIsWebhookModalOpen(false);
                                            }}
                                            className="w-full bg-accent text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_var(--accent-glow)] transition-all active:scale-[0.98] cursor-pointer uppercase tracking-widest"
                                        >
                                            <Copy className="w-5 h-5" />
                                            COPY URL & FINISH
                                        </button>
                                        <p className="text-[9px] text-slate-600 font-bold uppercase text-center tracking-tighter">
                                            Paste this URL into your provider's Webhook settings to start receiving alerts.
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleCreateWebhook(webhookUrl, webhookLabel);
                                            setIsWebhookModalOpen(false);
                                            setWebhookUrl("");
                                            setWebhookLabel("");
                                        }}
                                        disabled={!webhookUrl.trim()}
                                        className="w-full bg-accent text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                                    >
                                        <Zap className="w-5 h-5" fill="currentColor" />
                                        CREATE ENDPOINT
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal - New Domain */}
            <AnimatePresence>
                {isDomainModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDomainModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass border-white/10 rounded-[40px] p-10 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold tracking-tighter text-white mb-8">Add Domain</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Hostname</label>
                                    <input
                                        type="text"
                                        value={domainHostname}
                                        onChange={(e) => setDomainHostname(e.target.value)}
                                        placeholder="notifications.your-app.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-accent shadow-inner transition-all font-medium"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        handleCreateDomain(domainHostname);
                                        setIsDomainModalOpen(false);
                                        setDomainHostname("");
                                    }}
                                    disabled={!domainHostname.trim()}
                                    className="w-full bg-accent text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                                >
                                    <Globe className="w-5 h-5" />
                                    AUTHORIZE DOMAIN
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Image Cropper Modal */}
            <AnimatePresence>
                {isCropModalOpen && originalImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCropModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-[#0B0C10] border border-white/10 rounded-[2rem] p-8 md:p-12 w-full max-w-md shadow-2xl z-10 flex flex-col items-center"
                        >
                            <h2 className="text-2xl font-black tracking-tight text-white mb-2">Adjust Avatar</h2>
                            <p className="text-slate-400 font-medium mb-8 text-center text-sm">Drag to position your profile image.</p>

                            {errorMessage && (
                                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-in fade-in tracking-wide w-full text-center">
                                    ERROR: {errorMessage}
                                </div>
                            )}

                            <div
                                className="relative w-64 h-64 rounded-full overflow-hidden bg-black border-4 border-white/5 cursor-move select-none touch-none"
                                style={{ maskImage: 'radial-gradient(white, black)' }}
                                onPointerDown={(e) => {
                                    setIsDragging(true);
                                    setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y });
                                    (e.target as HTMLElement).setPointerCapture(e.pointerId);
                                }}
                                onPointerMove={(e) => {
                                    if (!isDragging) return;
                                    setCropPosition({
                                        x: e.clientX - dragStart.x,
                                        y: e.clientY - dragStart.y
                                    });
                                }}
                                onPointerUp={(e) => {
                                    setIsDragging(false);
                                    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                                }}
                                onPointerCancel={(e) => {
                                    setIsDragging(false);
                                    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={originalImage!}
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-75"
                                    style={{ transform: `translate(${cropPosition.x}px, ${cropPosition.y}px)` }}
                                    alt="Preview"
                                    id="crop-preview-image"
                                />
                            </div>

                            <div className="flex gap-4 w-full mt-10">
                                <button
                                    onClick={() => {
                                        setIsCropModalOpen(false);
                                        setCropPosition({ x: 0, y: 0 }); // reset
                                        setErrorMessage(null); // clear errors
                                    }}
                                    className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const img = new Image();
                                        img.onload = async () => {
                                            const canvas = document.createElement('canvas');
                                            const SIZE = 400;
                                            canvas.width = SIZE;
                                            canvas.height = SIZE;
                                            const ctx = canvas.getContext('2d');

                                            // Calculate center crop
                                            const size = Math.min(img.width, img.height);
                                            const scale = size / 256; // 256 is the container size

                                            // Default center
                                            let sx = (img.width - size) / 2;
                                            let sy = (img.height - size) / 2;

                                            // Apply drag offset (opposite direction for source crop)
                                            sx -= cropPosition.x * scale;
                                            sy -= cropPosition.y * scale;

                                            // Clamp to bounds
                                            sx = Math.max(0, Math.min(sx, img.width - size));
                                            sy = Math.max(0, Math.min(sy, img.height - size));

                                            ctx?.drawImage(img, sx, sy, size, size, 0, 0, SIZE, SIZE);
                                            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                                            setIsUploading(true);
                                            try {
                                                const res = await fetch('/api/profile/update', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ avatar_url: compressedBase64 })
                                                });
                                                if (res.ok) {
                                                    await fetchUserData();
                                                    setIsCropModalOpen(false);
                                                    setCropPosition({ x: 0, y: 0 });
                                                    setErrorMessage("Avatar synchronized successfully.");
                                                } else {
                                                    const data = await res.json();
                                                    setErrorMessage(data.error || "Uplink synchronization failed");
                                                }
                                            } catch (err) {
                                                setErrorMessage("Network error during uplink");
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        };
                                        img.src = originalImage!;
                                    }}
                                    disabled={isUploading}
                                    className="flex-1 bg-accent text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
                                >
                                    {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                                        <Check className="w-5 h-5" /> Save
                                    </>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Password Verification Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowPasswordModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                                <Lock className="w-6 h-6 text-rose-500" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Verify Identity</h3>
                            <p className="text-sm text-slate-400 mb-6">
                                You are requesting to change your corporate email address. For your security, please confirm this action using your current password.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-rose-500 focus:bg-white/10 transition-colors"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && currentPassword) {
                                                setShowPasswordModal(false);
                                                handleSaveProfile(currentPassword);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setCurrentPassword('');
                                        }}
                                        className="px-5 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            handleSaveProfile(currentPassword);
                                        }}
                                        disabled={!currentPassword}
                                        className="px-5 py-2 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        VERIFY
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
