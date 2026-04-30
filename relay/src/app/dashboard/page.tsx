"use client";
import * as React from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    Bot,
    Camera,
    Check,
    CheckCircle2,
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
    Search,
    UserCircle,
    Key,
    Key as KeyIcon,
    LayoutDashboard,
    Link2,
    Lock,
    LogOut,
    Mail,
    MessageCircle,
    MessageSquare,
    Minus,
    Network,
    Pencil,
    Play,
    Plus,
    Save,
    Settings,
    Share2,
    Shield,
    ShieldAlert,
    ShoppingBag,
    Sparkles,
    Store,
    Target,
    Terminal,
    Monitor,
    Laptop,
    Trash2,
    TrendingUp,
    Upload,
    User,
    UserPlus,
    Users,
    Webhook,
    X,
    Zap,
    PlusCircle,
    AlertTriangle,
    AlertCircle,
    ChevronRight,
    Layers,
    Square
} from "lucide-react";
import Link from "next/link";
import { RelayInbox } from '@/components/external/RelayInbox';
import InboxView from "@/components/dashboard/InboxView";
import TopicsView from "@/components/dashboard/TopicsView";
import SubscribersView from "@/components/dashboard/SubscribersView";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, Language } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from 'qrcode.react';

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

import {
    DiscordIcon,
    ChromeIcon,
    GithubIcon,
    TelegramIcon,
    WhatsAppIcon,
    SlackIcon,
    EmailIcon,
    TeamsIcon,
    SMSIcon
} from "@/components/ui/PlatformIcons";

const GoogleIcon = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.01c-.22-.66-.35-1.36-.35-2.01s.13-1.35.35-2.01V7.15H2.18C1.43 8.62 1 10.26 1 12s.43 3.38 1.18 4.85l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.16l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335" />
    </svg>
);

const GitHubLogo = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" className={`${className} fill-white`} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const HighlightedCode = ({ code, language }: { code: string, language: string }) => {
    const tokens = code.split(/(".*?"|'.*?'|\/\/.*|\n|\s+)/g);

    return (
        <code>
            {tokens.map((token, i) => {
                if (!token) return null;

                // Strings (Blue)
                if (token.startsWith('"') || token.startsWith("'")) {
                    return <span key={i} className="text-sky-300">{token}</span>;
                }

                // Comments (Grey)
                if (token.startsWith('//') || token.startsWith('#')) {
                    return <span key={i} className="text-slate-500 italic">{token}</span>;
                }

                // Keywords (Rose/Red)
                const keywords = [
                    'const', 'let', 'var', 'require', 'import', 'from', 'export', 'default',
                    'function', 'return', 'if', 'else', 'for', 'while', 'package', 'func',
                    'type', 'struct', 'interface', 'map', 'chan', 'go', 'select', 'case', 'switch',
                    'class', 'public', 'private', 'protected', 'static', 'extends', 'implements',
                    'namespace', 'use', 'as', 'try', 'catch', 'finally', 'throw', 'new', 'await', 'async',
                    'curl', 'method', 'headers', 'body', 'platform', 'target', 'message', 'category', 'botName', 'variables',
                    'payload', 'json', 'url', 'response', 'ch', 'res'
                ];
                if (keywords.includes(token)) {
                    return <span key={i} className="text-rose-400 font-bold">{token}</span>;
                }

                // Values/Methods (Amber)
                const specials = [
                    'true', 'false', 'null', 'nil', 'POST', 'GET', 'JSON.stringify', 'json_encode',
                    'requests.post', 'http.NewRequest', 'curl_init', 'curl_setopt', 'curl_exec', 'curl_close',
                    '<?php', '?>', 'package main'
                ];
                if (specials.some(s => token.includes(s))) {
                    return <span key={i} className="text-amber-400 font-medium">{token}</span>;
                }

                // URL/API (Accent)
                if (token.includes('https://') || token.includes('x-api-key')) {
                    return <span key={i} className="text-accent font-bold">{token}</span>;
                }

                return <span key={i} className="text-slate-300">{token}</span>;
            })}
        </code>
    );
};

const OnboardingSetupTransition = ({ onComplete }: { onComplete: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
        >
            <div className="relative">
                <div className="w-32 h-32 rounded-[40px] bg-accent/5 border border-accent/20 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="absolute -inset-8 bg-accent/20 blur-[100px] -z-10 animate-pulse" />
            </div>
            <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Setting up your workspace</h3>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] animate-pulse">
                    Deploying secure node to decentralized cluster...
                </p>
            </div>
        </motion.div>
    );
};

export default function DashboardPage() {
    const router = useRouter();
    const [lang, setLang] = useState<Language>('en');
    const [user, setUser] = useState<any>(null);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('relay_active_workspace');
        }
        return null;
    });
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [isYearly, setIsYearly] = useState(false);
    const [envMode, setEnvMode] = useState<'Development' | 'Production'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('relay_env_mode') as 'Development' | 'Production') || 'Development';
        }
        return 'Development';
    });

    const [scenarioToDelete, setScenarioToDelete] = useState<string | string[] | null>(null);


    useEffect(() => {
        localStorage.setItem('relay_env_mode', envMode);
    }, [envMode]);

    // Fetch user's multi-tenant workspaces
    useEffect(() => {
        if (user?.id) {
            fetch('/api/workspace/list')
                .then(res => res.json())
                .then(data => {
                    if (data.workspaces) {
                        setWorkspaces(data.workspaces);
                        const saved = localStorage.getItem('relay_active_workspace');
                        if (saved && data.workspaces.some((w: any) => w.id === saved)) {
                            setActiveWorkspaceId(saved);
                        } else {
                            setActiveWorkspaceId(user.id);
                        }
                    }
                })
                .catch(err => console.error("Error fetching workspaces", err));
        }
    }, [user?.id]);

    // Re-fetch all scoped data when Active Workspace changes
    useEffect(() => {
        if (activeWorkspaceId) {
            localStorage.setItem('relay_active_workspace', activeWorkspaceId);
            // We re-trigger fetches to get contextual data for this workspace
            fetchStats();
            fetchApiKeys();
            fetchInbox();
            fetchLogs();
            fetchWebhooks();
            fetchScenarios();
        }
    }, [activeWorkspaceId, envMode]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(open => !open);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview"); // Default tab
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isEnvOpen, setIsEnvOpen] = useState(false);
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('#env-switcher') && !target.closest('#workspace-switcher')) {
                setIsEnvOpen(false);
                setIsWorkspaceOpen(false);
            }
        };

        if (isEnvOpen || isWorkspaceOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEnvOpen, isWorkspaceOpen]);

    // Core Initialization Sequence state
    const [isInitializingCore, setIsInitializingCore] = useState(false);
    const [coreInitStep, setCoreInitStep] = useState(0);
    const [isOnboarded, setIsOnboarded] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('relay-onboarded') !== 'true') {
                setIsOnboarded(false);
            }
        }
    }, []);

    // Modals
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [commandSearchTerm, setCommandSearchTerm] = useState("");

    // Modal & Key Generation State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keyLabel, setKeyLabel] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [isCreatingKey, setIsCreatingKey] = useState(false);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [copied, setCopied] = useState(false);

    // 2FA Verification State
    const [show2FAOverlay, setShow2FAOverlay] = useState(false);
    const [totpCode, setTotpCode] = useState("");
    const [isVerifying2FA, setIsVerifying2FA] = useState(false);
    const [verify2FAError, setVerify2FAError] = useState<string | null>(null);
    const [pendingAccessToken, setPendingAccessToken] = useState<string | null>(null);

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
    const [sysStats, setSysStats] = useState<any>(null);
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
        targets: {} as Record<string, string>,
        message: "",
        variables: "{}",
        category: "general",
        botName: "",
        botAvatar: ""
    });

    const [aiStats, setAiStats] = useState<any>(null);
    const [isAILoading, setIsAILoading] = useState(false);

    const handleInitializeCore = async () => {
        setIsInitializingCore(true);
        setCoreInitStep(0);
        await new Promise(r => setTimeout(r, 600));
        setCoreInitStep(1);
        await new Promise(r => setTimeout(r, 600));
        setCoreInitStep(2);
        await new Promise(r => setTimeout(r, 800));
        setCoreInitStep(3);
        await new Promise(r => setTimeout(r, 500));
        setIsInitializingCore(false);
        setCoreInitStep(0);
        setIsOnboarded(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('relay-onboarded', 'true');
        }
        setActiveTab("scenarios");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
    const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
    const [editingScenarioName, setEditingScenarioName] = useState("");
    const [testResult, setTestResult] = useState<any>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [isRawJsonVisible, setIsRawJsonVisible] = useState(false);
    const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
    const [selectedLogForModal, setSelectedLogForModal] = useState<any>(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [teamInvitations, setTeamInvitations] = useState<any[]>([]);
    const [teamRequests, setTeamRequests] = useState<any[]>([]);
    const [incomingInvitations, setIncomingInvitations] = useState<any[]>([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [settingsSubTab, setSettingsSubTab] = useState<'account' | 'organization' | 'team' | 'usage'>('account');

    const handleRespondInvite = async (invitationId: string, action: 'ACCEPT' | 'DECLINE' | 'REVOKE') => {
        try {
            const res = await fetch(`/api/workspace/invitations${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'PATCH',
                body: JSON.stringify({ invitationId, action })
            });
            if (res.ok) {
                setNotification({ message: action === 'ACCEPT' ? 'Authorization successful.' : 'Signal terminated.', type: 'success' });
                fetchTeamData();
            } else {
                const data = await res.json();
                setNotification({ message: (data.error + (data.details ? `: ${data.details}` : '')) || 'Signal failure.', type: 'error' });
            }
        } catch (e) {
            setNotification({ message: 'Uplink failure.', type: 'error' });
        }
    };

    const fetchTeamData = async () => {
        if (!user?.id) return;
        setIsLoadingTeam(true);
        try {
            const [membersRes, invitesRes, requestsRes] = await Promise.all([
                fetch(`/api/workspace/members${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`),
                fetch(`/api/workspace/invitations${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`),
                fetch(`/api/workspace/requests${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`)
            ]);

            if (membersRes.ok) setTeamMembers((await membersRes.json()).members || []);
            if (invitesRes.ok) {
                const data = await invitesRes.json();
                setTeamInvitations(data.invitations || []);
                setIncomingInvitations(data.incoming || []);
            }
            if (requestsRes.ok) setTeamRequests((await requestsRes.json()).requests || []);
        } catch (e) {
            console.error('Telemetry fetch failed', e);
        } finally {
            setIsLoadingTeam(false);
        }
    };

    useEffect(() => {
        if (settingsSubTab === 'team') {
            fetchTeamData();
        }
    }, [settingsSubTab, activeWorkspaceId]);
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
    const [isAddingEmail, setIsAddingEmail] = useState(false);
    const [isConnectingAccount, setIsConnectingAccount] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(false);
    const [showPurgeDataModal, setShowPurgeDataModal] = useState(false);
    const [isPurgingData, setIsPurgingData] = useState(false);
    const [teamActionMenuOpen, setTeamActionMenuOpen] = useState<string | null>(null);
    const [workspaceDeleteConfirmName, setWorkspaceDeleteConfirmName] = useState("");
    const [domainVerifyEmail, setDomainVerifyEmail] = useState("");
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'loading' } | null>(null);
    const [showLeaveWorkspaceModal, setShowLeaveWorkspaceModal] = useState(false);
    const [showLeaveError, setShowLeaveError] = useState(false);
    const [workspaceLeaveConfirmName, setWorkspaceLeaveConfirmName] = useState("");
    const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
    const [teamTab, setTeamTab] = useState<'members' | 'invitations' | 'requests'>('members');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmails, setInviteEmails] = useState("");
    const [isSendingInvites, setIsSendingInvites] = useState(false);
    const [onboardingData, setOnboardingData] = useState({ name: "", identifier: "", logo: "" });

    // Auto-close notifications after 5 seconds
    useEffect(() => {
        if (notification && notification.type !== 'loading') {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);
    const [isSettingUpAuthenticator, setIsSettingUpAuthenticator] = useState(false);
    const [authenticatorStep, setAuthenticatorStep] = useState(1);
    const [totpSecret, setTotpSecret] = useState("");
    const [otpAuthUri, setOtpAuthUri] = useState("");
    const [totpInputs, setTotpInputs] = useState(["", "", "", "", "", ""]);
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
    const whiteLabelLogoInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingBotAvatar, setIsUploadingBotAvatar] = useState(false);
    const [isUploadingWhiteLabel, setIsUploadingWhiteLabel] = useState(false);
    const [inboxNotifications, setInboxNotifications] = useState<any[]>([]);
    const [isInboxLoading, setIsInboxLoading] = useState(false);
    const [inboxFilters, setInboxFilters] = useState({ platform: 'all', category: 'all', search: '' });
    const [whiteLabel, setWhiteLabel] = useState({
        corporateName: "",
        corporateLogo: "",
        customDomain: ""
    });

    const [userEmails, setUserEmails] = useState<Array<{ email: string, is_verified: boolean, isPrimary?: boolean }>>([]);
    const [newEmailInput, setNewEmailInput] = useState("");
    const [connectedServices, setConnectedServices] = useState<Array<{ name: string, email: string, isPrimary?: boolean }>>([]);
    const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [securityCode, setSecurityCode] = useState("");
    const [passwordStep, setPasswordStep] = useState(1);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [emailDeleteError, setEmailDeleteError] = useState<string | null>(null);
    const isFetchingRef = useRef(false);
    const sdkScrollRef = useRef<HTMLDivElement>(null);
    const [isSdkDragging, setIsSdkDragging] = useState(false);
    const [sdkStartX, setSdkStartX] = useState(0);
    const [sdkScrollLeft, setSdkScrollLeft] = useState(0);
    const [sdkHasDragged, setSdkHasDragged] = useState(false);

    useEffect(() => {
        if (!user) return;

        // 1. Map Identities (Connected Accounts)
        const identities: any[] = (user.identities || [])
            .filter((id: any) => id.provider === 'google' || id.provider === 'github')
            .map((id: any) => ({
                name: id.provider === 'google' ? 'Google' : 'GitHub',
                email: id.identity_data?.email || user.email,
                isPrimary: id.provider === (user.app_metadata?.provider || 'google')
            }));

        if (identities.length === 0) {
            identities.push({
                name: user.app_metadata?.provider === 'github' ? 'GitHub' : 'Google',
                email: user.email,
                isPrimary: true
            });
        }

        // 2. Map Emails
        const identityEmails = identities.map((id: any) => id.email);
        const secondaryEmailsFromDB = (user.secondary_emails || [])
            .filter((se: any) => !identityEmails.includes(se.email) && se.is_verified === true);

        const emails = [
            { email: user.email, is_verified: true, isPrimary: true },
            ...identities.map((id: any) => ({ email: id.email, is_verified: true })),
            ...secondaryEmailsFromDB
        ];

        const uniqueEmails = Array.from(new Set(emails.map(e => e.email)))
            .map(email => emails.find(e => e.email === email)!);

        // ONLY update state if data actually changed to prevent render loops
        const currentEmailsStr = JSON.stringify(userEmails);
        const newEmailsStr = JSON.stringify(uniqueEmails);
        if (currentEmailsStr !== newEmailsStr) {
            setUserEmails(uniqueEmails);
        }

        const currentServicesStr = JSON.stringify(connectedServices);
        const newServicesStr = JSON.stringify(identities);
        if (currentServicesStr !== newServicesStr) {
            setConnectedServices(identities);
        }
    }, [user, userEmails, connectedServices]);

    const handleAddEmail = async () => {
        if (!newEmailInput.trim() || !newEmailInput.includes('@')) {
            alert("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/auth/emails/add${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmailInput })
            });

            if (res.ok) {
                setVerifyingEmail(newEmailInput);
                setNewEmailInput("");
                setIsAddingEmail(false);
            } else {
                const data = await res.json();
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Network error adding email");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!verifyingEmail || verificationCode.length !== 6) return;

        setIsVerifyingCode(true);
        try {
            const res = await fetch(`/api/auth/emails/verify${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: verifyingEmail, code: verificationCode })
            });

            if (res.ok) {
                alert("Email verified successfully!");
                setVerifyingEmail(null);
                setVerificationCode("");
                await fetchUserData(); // Refresh local user data
            } else {
                const data = await res.json();
                alert("Verification failed: " + data.error);
            }
        } catch (err) {
            alert("Network error verifying email");
        } finally {
            setIsVerifyingCode(false);
        }
    };


    const handleResendEmail = async () => {
        if (!verifyingEmail) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/auth/emails/add${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: verifyingEmail })
            });

            if (res.ok) {
                alert(lang === 'es' || lang === 'pt' ? "¡Código reenviado!" : "Code resent!");
            } else {
                const data = await res.json();
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Network error resending email");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmail = async (emailObj: { email: string, isPrimary?: boolean }) => {
        setNotification({ message: `Deleting ${emailObj.email}...`, type: 'loading' });

        if (emailObj.isPrimary) {
            setEmailDeleteError(emailObj.email);
            setNotification({ message: "You cannot delete your primary identification.", type: 'error' });
            setTimeout(() => setEmailDeleteError(null), 5000);
            return;
        }

        try {
            const res = await fetch(`/api/auth/emails/delete${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailObj.email })
            });

            if (!res.ok) {
                const errorData = await res.json();
                setNotification({
                    message: errorData.error || "Signal transmission failed.",
                    type: 'error'
                });
                console.error('[INVITE-ACTION-FAILURE]', errorData);
                return;
            }

            setNotification({ message: "Email deleted successfully", type: 'success' });
            setTimeout(() => fetchUserData(), 800);
        } catch (err) {
            console.error("General deletion failure:", err);
            setNotification({ message: "Network error while deleting email", type: 'error' });
        }
    };

    const handleConnectService = async (service: string) => {
        setNotification({ message: `Linking ${service}...`, type: 'loading' });
        const provider = service.toLowerCase() === 'google' ? 'google' : service.toLowerCase() === 'github' ? 'github' : service.toLowerCase();

        // Use linkIdentity instead of signInWithOAuth if user is already logged in
        // to prevent account switching and handle collisions cleanly.
        const { error } = await supabase.auth.linkIdentity({
            provider: provider as any,
            options: {
                redirectTo: window.location.origin + '/dashboard?linked=true'
            }
        });

        if (error) {
            console.error("Link identity error:", error);
            setIsConnectingAccount(false); // Close modal on error to show notification clearly

            // Handle common linking errors
            if (error.message.toLowerCase().includes("manual linking is disabled")) {
                setNotification({
                    message: "Supabase Config Required: Enable 'Manual Account Linking' in (Auth > Security) of your Supabase Dashboard.",
                    type: 'error'
                });
            } else if (error.message.toLowerCase().includes("already linked") || error.message.toLowerCase().includes("identity_already_exists")) {
                setNotification({
                    message: `This ${service} account is already linked to another Relay profile. Please use a different account or disconnect it from the other profile first.`,
                    type: 'error'
                });
            } else {
                setNotification({ message: `Error linking ${service}: ${error.message}`, type: 'error' });
            }
        }
    };

    const handleDisconnectService = async (service: { name: string, email: string, isPrimary?: boolean }) => {
        setNotification({ message: `Disconnecting ${service.name}: ${service.email}...`, type: 'loading' });

        if (service.isPrimary) {
            setNotification({ message: "You cannot disconnect your primary account.", type: 'error' });
            return;
        }

        const provider = service.name.toLowerCase();
        const identities = user?.identities || [];
        const identity = identities.find((id: any) => id.provider === provider);

        if (!identity) {
            console.error("No identity found for provider:", provider, "User identities:", identities);
            setNotification({ message: `Identity ${service.name} not found in this session.`, type: 'error' });
            return;
        }

        try {
            const { error } = await supabase.auth.unlinkIdentity(identity);
            if (error) {
                setNotification({ message: `Failed to disconnect ${service.name}: ${error.message}`, type: 'error' });
            } else {
                setNotification({ message: `${service.name} account disconnected`, type: 'success' });
                setTimeout(() => fetchUserData(), 800);
            }
        } catch (err) {
            console.error("Unlink exception:", err);
            setNotification({ message: "Network error during disconnection", type: 'error' });
        }
    };

    const processImageUpload = async (base64: string, type: 'avatar' | 'logo') => {
        try {
            const isAvatar = type === 'avatar';
            if (isAvatar) setIsUploadingBotAvatar(true);
            else setIsUploadingWhiteLabel(true);

            const res = await fetch(`/api/upload${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64, userId: user?.id })
            });
            const data = await res.json();
            if (data.url) {
                if (isAvatar) setTestConfig(prev => ({ ...prev, botAvatar: data.url }));
                else setWhiteLabel(prev => ({ ...prev, corporateLogo: data.url }));
                return data.url;
            }
        } catch (err) {
            console.error(`${type} upload error:`, err);
        } finally {
            setIsUploadingBotAvatar(false);
            setIsUploadingWhiteLabel(false);
        }
        return null;
    };

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
            const res = await fetch(`/api/admin/accounts${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`);
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
            const res = await fetch(`/api/admin/accounts${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
        if (isFetchingRef.current && retryCount === 0) return;
        isFetchingRef.current = true;

        try {
            // If we have an OAuth hash in the URL or 'linked=true' param, sync the session
            const urlParams = new URLSearchParams(window.location.search);
            const isLinked = urlParams.get('linked') === 'true';

            if (typeof window !== 'undefined' && (window.location.hash.includes('access_token') || isLinked) && retryCount === 0) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    const syncRes = await fetch(`/api/auth/sync${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ access_token: session.access_token })
                    });

                    const syncData = await syncRes.json();
                    if (syncData.require2FA) {
                        setPendingAccessToken(session.access_token);
                        setShow2FAOverlay(true);
                        setLoading(false);
                        return;
                    }

                    // Clean the hash and linked param from URL
                    window.history.replaceState(null, '', window.location.pathname);

                    if (isLinked) return fetchUserData(1); // Force fetch after sync
                }
            }

            const res = await fetch(`/api/auth/me?t=${new Date().getTime()}`, {
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });

            if (res.status === 401 && retryCount === 0) {
                // Secondary check: maybe Supabase has the session but we don't have our cookie
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    const syncRes = await fetch(`/api/auth/sync${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ access_token: session.access_token })
                    });

                    const syncData = await syncRes.json();
                    if (syncData.require2FA) {
                        setPendingAccessToken(session.access_token);
                        setShow2FAOverlay(true);
                        setLoading(false);
                        return;
                    }

                    if (syncRes.ok) {
                        return fetchUserData(1); // Retry once after syncing
                    }
                }
                if (!show2FAOverlay) {
                    router.push('/auth');
                }
                return;
            }

            const data = await res.json();

            if (!res.ok || !data.user) {
                if (!show2FAOverlay) {
                    router.push('/auth');
                }
            } else {
                setUser(data.user);
                const savedLang = localStorage.getItem('relay-lang') as Language;
                if (savedLang && dictionaries[savedLang]) setLang(savedLang);

                await Promise.all([fetchApiKeys(), fetchStats()]);
            }
        } catch (err) {
            console.error('[DASHBOARD] Auth Check Error:', err);
            router.push('/auth');
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    const handle2FAVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!totpCode || totpCode.length !== 6 || !pendingAccessToken) return;

        setIsVerifying2FA(true);
        setVerify2FAError(null);

        try {
            const res = await fetch(`/api/auth/sync${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_token: pendingAccessToken,
                    totpCode
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setVerify2FAError(data.error || "Invalid 2FA code");
                setIsVerifying2FA(false);
            } else {
                // Success! Clean hash, close overlay and reload data
                window.history.replaceState(null, '', window.location.pathname);
                setShow2FAOverlay(false);
                setPendingAccessToken(null);
                setTotpCode("");
                await fetchUserData(1);
            }
        } catch (err) {
            setVerify2FAError("Connection error. Please try again.");
            setIsVerifying2FA(false);
        }
    };

    // Initial Auth & Data Load
    useEffect(() => {
        fetchUserData();
    }, [router]);

    // Initialize White Label from User
    useEffect(() => {
        if (!isOnboarded) return;
        fetchStats();

        const token = setInterval(() => {
            fetchStats();
        }, 15000);

        return () => clearInterval(token);
    }, [isOnboarded, envMode]);

    useEffect(() => {
        if (user) {
            setWhiteLabel({
                corporateName: user.company || user.bot_name || "",
                corporateLogo: user.bot_thumbnail || "",
                customDomain: ""
            });

            // Trigger onboarding if organization is not set up
            if (!user.bot_name && onboardingStep === null) {
                setOnboardingStep(0);
            }
        }
    }, [user]);

    // Tab-based fetching
    const fetchTemplates = async () => {
        setIsTemplatesLoading(true);
        try {
            const res = await fetch(`/api/templates?cb=${new Date().getTime()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
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
            const res = await fetch(`/api/templates${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
            fetchSysStats();
            if (preferences.autoRefresh) {
                interval = setInterval(() => {
                    fetchStats();
                    fetchSysStats();
                }, 5000);
            }
        }
        if (activeTab === "status") {
            fetchSysStats();
            interval = setInterval(() => {
                fetchSysStats();
            }, 10000);
        }
        if (activeTab === "webhooks") fetchWebhooks();
        if (activeTab === "domains" || activeTab === "settings") fetchDomains();
        if (activeTab === "templates") fetchTemplates();
        if (activeTab === "relay_ai") fetchAIAnalytics();
        if (activeTab === "inbox") fetchInbox();
        if (activeTab === "admin") fetchAdminAccounts();

        // Realtime subscription for inbox
        const channel = supabase
            .channel('inbox_realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'inbox_messages'
                },
                (payload) => {
                    console.log('New notification received:', payload);
                    setInboxNotifications(prev => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            if (interval) clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, [activeTab, preferences.autoRefresh, envMode]);

    useEffect(() => {
        if (activeTab === "inbox" || onboardingStep === 2) {
            const delayDebounceFn = setTimeout(() => {
                fetchInbox();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
        if (activeTab === "logs") {
            const delayDebounceFn = setTimeout(() => {
                fetchLogs();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [activeTab, inboxFilters, logFilters, onboardingStep, envMode]);

    useEffect(() => {
        if (onboardingStep === 2 && inboxNotifications.length === 0) {
            setInboxNotifications([
                {
                    id: 'discovery-1',
                    title: 'Relay Protocol: Signal Found',
                    message: 'Uplink initiated. Awaiting first telemetry packet from your organization...',
                    platform: 'relay',
                    category: 'System',
                    received_at: new Date().toISOString()
                }
            ]);
        }
    }, [onboardingStep, inboxNotifications.length]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/stats?env=${envMode.toLowerCase()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
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

    const fetchSysStats = async () => {
        try {
            const res = await fetch(`/api/system/stats`);
            const data = await res.json();
            if (res.ok) setSysStats(data);
        } catch (err) {
            console.error('Failed to fetch hardware stats');
        }
    };

    const fetchApiKeys = async () => {
        try {
            const res = await fetch(`/api/keys?env=${envMode.toLowerCase()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
            const data = await res.json();
            if (res.ok && data.keys) {
                setApiKeys(data.keys);
            }
        } catch (err) {
            console.error('Failed to fetch keys');
        }
    };

    const fetchInbox = async () => {
        setIsInboxLoading(true);
        try {
            const params = new URLSearchParams();
            if (inboxFilters.platform !== 'all') params.append('platform', inboxFilters.platform);
            if (inboxFilters.search) params.append('search', inboxFilters.search);
            params.append('env', envMode.toLowerCase());
            params.append('limit', '50');

            const res = await fetch(`/api/inbox?${params.toString()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
            const data = await res.json();
            if (data.messages) setInboxNotifications(data.messages);
            else if (data.notifications) setInboxNotifications(data.notifications);
        } catch (err) {
            console.error('Fetch Inbox Error:', err);
        } finally {
            setIsInboxLoading(false);
        }
    };

    const fetchLogs = async () => {
        setIsLogsLoading(true);
        try {
            const params = new URLSearchParams();
            if (logFilters.platform !== 'all') params.append('platform', logFilters.platform);
            if (logFilters.status) params.append('status', logFilters.status);
            if (logFilters.search) params.append('search', logFilters.search);
            params.append('env', envMode.toLowerCase());

            const res = await fetch(`/api/logs?${params.toString()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
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
            const res = await fetch(`/api/logs?clearAll=true&env=${envMode.toLowerCase()}`, { method: 'DELETE' });
            if (res.ok) fetchLogs();
        } catch (err) {
            console.error('Clear All Logs Error:', err);
        }
    };

    const fetchWebhooks = async () => {
        setIsWebhooksLoading(true);
        try {
            const res = await fetch(`/api/webhooks?cb=${new Date().getTime()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
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
            const res = await fetch(`/api/domains?cb=${new Date().getTime()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
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
            const res = await fetch(`/api/scenarios${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`);
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
            const res = await fetch(`/api/scenarios${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
            const res = await fetch(`/api/scenarios${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
            const res = await fetch(`/api/scenarios${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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

    const confirmDeleteScenario = (ids: string | string[]) => {
        const idArray = Array.isArray(ids) ? ids : [ids];
        if (idArray.length === 0) return;
        setScenarioToDelete(idArray);
    };

    const executeDeleteScenario = async () => {
        if (!scenarioToDelete) return;
        const idArray = Array.isArray(scenarioToDelete) ? scenarioToDelete : [scenarioToDelete];

        setNotification({ message: 'Commencing permanent deletion...', type: 'loading' });
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
                setScenarioToDelete(null);
                setNotification({ message: `Successfully deleted ${idArray.length} scenario(s).`, type: 'success' });
            } else {
                const err = await res.json();
                console.error('Delete failed:', err);
                setScenarioToDelete(null);
                setNotification({ message: `Deletion blocked. Error: ${err.error}`, type: 'error' });
            }
        } catch (err) {
            console.error('Delete error:', err);
            setScenarioToDelete(null);
            setNotification({ message: `Network or System Error. Cannot reach Relay Engine.`, type: 'error' });
        }
    };

    const handleCreateWebhook = async (url: string, label: string) => {
        try {
            const res = await fetch(`/api/webhooks${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
            const res = await fetch(`/api/domains${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hostname })
            });
            if (res.ok) fetchDomains();
        } catch (err) {
            console.error('Failed to create domain');
        }
    };

    const handleCheckLiveDomain = async (id: string) => {
        setNotification({ message: 'Validating DNS from network...', type: 'loading' });
        try {
            const verifyRes = await fetch(`/api/domains/verify${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, simulate: false })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
                setNotification({ message: 'Protocol Verified! Domain is now active.', type: 'success' });
                fetchDomains();
            } else {
                setNotification({ message: verifyData.message || 'Verification failed. Value not found yet.', type: 'error' });
            }
        } catch {
            setNotification({ message: 'Network error validating DNS.', type: 'error' });
        }
    };

    const handleVerifyDomainConfirm = async () => {
        if (!domainHostname) return;

        setIsUploading(true);
        setNotification({ message: 'Generating cryptographic tokens...', type: 'loading' });

        try {
            const createRes = await fetch(`/api/domains${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hostname: domainHostname.trim() })
            });
            const createData = await createRes.json();

            if (!createRes.ok) throw new Error(createData.error || 'Failed to register domain');

            setNotification({ message: 'Domain Added! Please verify DNS.', type: 'success' });
            fetchDomains();
            setIsDomainModalOpen(false);
            setDomainHostname("");
            setDomainVerifyEmail(""); // Reset unused state too
        } catch (err: any) {
            setNotification({ message: err.message || 'Connection error', type: 'error' });
        } finally {
            setIsUploading(false);
            setTimeout(() => setNotification(null), 4000);
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
            await fetch(`/api/auth/logout${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, { method: 'POST' });
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
            const isProd = envMode.toLowerCase() === 'production';
            const prefix = isProd ? 'RELAY_PK_' : 'RELAY_SK_';
            const entropy = Array.from({ length: 4 }, () =>
                Math.random().toString(36).substring(2, 14).toUpperCase()
            ).join('');
            const key_hash = prefix + entropy;

            const res = await fetch(`/api/keys${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: keyLabel,
                    key_hash: key_hash,
                    env: envMode.toLowerCase()
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
        // Validation check for EMAIL update
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (tempUser?.email && !emailRegex.test(tempUser.email)) {
            setNotification({ message: 'Invalid email address format.', type: 'error' });
            return;
        }

        // Security check for email change
        if (typeof confirmedPassword !== 'string' && tempUser?.email && user?.email && tempUser.email !== user.email) {
            setShowPasswordModal(true);
            return;
        }

        setIsUploading(true);
        setErrorMessage(null);
        setNotification({ message: 'Synchronizing protocols...', type: 'loading' });
        try {
            const payload: any = {
                ...tempUser,
                company: whiteLabel.corporateName,
                bot_name: whiteLabel.corporateName,
                bot_thumbnail: whiteLabel.corporateLogo
            };
            if (typeof confirmedPassword === 'string') {
                payload.current_password = confirmedPassword;
            }

            const res = await fetch(`/api/profile/update${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                // Update local user state with new branding and profile info
                const updatedUser = {
                    ...(data.user || user),
                    ...tempUser,
                    name: (data.user?.full_name || tempUser?.full_name || user?.full_name || user?.name),
                    full_name: (data.user?.full_name || tempUser?.full_name || user?.full_name || user?.name),
                    company: whiteLabel.corporateName || data.user?.company || user?.company,
                    bot_name: whiteLabel.corporateName || data.user?.bot_name || user?.bot_name,
                    bot_thumbnail: whiteLabel.corporateLogo || data.user?.bot_thumbnail || user?.bot_thumbnail
                };

                // Crucial: If verification is pending, don't update the primary email in UI yet
                if (data.message) {
                    updatedUser.email = user.email;
                    setErrorMessage(data.message);
                }
                setUser(updatedUser);
                setTempUser(null); // Clear temp state after success
                setNotification({ message: 'Workspace protocol updated successfully.', type: 'success' });
            } else {
                const err = data.error || "Update failed";
                setErrorMessage(err);
                setNotification({ message: err, type: 'error' });
            }
        } catch (err) {
            setErrorMessage("Connection error");
            setNotification({ message: 'Connection error', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setNotification({ message: "Terminating account protocol...", type: 'loading' });
        try {
            const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
            if (res.ok) {
                setNotification({ message: "Uplink destroyed. Redirecting...", type: 'success' });
                setTimeout(() => router.push('/'), 2000);
            } else {
                const data = await res.json();
                setNotification({ message: data.error || "Decommissioning failed.", type: 'error' });
            }
        } catch (err) {
            setNotification({ message: "Network disconnection during termination.", type: 'error' });
        }
    };

    const handleChangePassword = async () => {
        if (passwordStep === 1) {
            // Step 1: Request Code
            setErrorMessage(null);
            setIsUploading(true);
            try {
                const res = await fetch(`/api/auth/password/request${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, { method: 'POST' });
                const data = await res.json();
                if (res.ok) {
                    setPasswordStep(2);
                    setNotification({ message: "Verification code sent to your primary email.", type: 'success' });
                } else {
                    setErrorMessage(data.error || "Failed to send code");
                }
            } catch (err) {
                setErrorMessage("Connection error");
            } finally {
                setIsUploading(false);
            }
            return;
        }

        // Step 2: Finalize Password Change
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(passwords.new)) {
            setErrorMessage("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setErrorMessage("Passwords do not match");
            return;
        }
        if (!securityCode) {
            setErrorMessage("Verification code is required");
            return;
        }

        setIsUploading(true);
        try {
            const res = await fetch(`/api/profile/password${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                    code: securityCode
                })
            });
            const data = await res.json();
            if (res.ok) {
                setIsChangingPassword(false);
                setPasswordStep(1);
                setPasswords({ current: "", new: "", confirm: "" });
                setSecurityCode("");
                setNotification({ message: "Security protocol updated successfully.", type: 'success' });
            } else {
                setErrorMessage(data.error || "Password update failed");
            }
        } catch (err) {
            setErrorMessage("Connection error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSdkMouseDown = (e: React.MouseEvent) => {
        if (!sdkScrollRef.current) return;
        setIsSdkDragging(true);
        setSdkHasDragged(false);
        setSdkStartX(e.pageX - sdkScrollRef.current.offsetLeft);
        setSdkScrollLeft(sdkScrollRef.current.scrollLeft);
    };

    const handleSdkMouseMove = (e: React.MouseEvent) => {
        if (!isSdkDragging || !sdkScrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - sdkScrollRef.current.offsetLeft;
        const walk = (x - sdkStartX) * 2;
        if (Math.abs(walk) > 5) setSdkHasDragged(true);
        sdkScrollRef.current.scrollLeft = sdkScrollLeft - walk;
    };

    const handleSdkMouseUpOrLeave = () => {
        setIsSdkDragging(false);
    };

    const handleSendOnboardingTest = async () => {
        if (!user) return;
        setNotification({ message: "Connecting to Relay Uplink...", type: 'loading' });

        try {
            // 1. Ensure a test subscriber exists for this user
            const { data: subscriber, error: subError } = await supabase
                .from('subscribers')
                .select('id')
                .eq('user_id', user.id)
                .eq('external_id', 'relay-test-user')
                .single();

            let targetSubscriberId = subscriber?.id;

            if (subError || !subscriber) {
                const { data: newSub, error: createError } = await supabase
                    .from('subscribers')
                    .insert({
                        user_id: user.id,
                        external_id: 'relay-test-user',
                        full_name: user.full_name || 'Protocol Tester',
                        email: user.email
                    })
                    .select('id')
                    .single();

                if (createError) throw createError;
                targetSubscriberId = newSub.id;
            }

            // 2. Insert the test messages (Multiple for realistic effect)
            const testMessages = [
                {
                    project_id: user.id,
                    subscriber_id: targetSubscriberId,
                    title: "Relay Protocol Initialized",
                    message: "Your organization '" + onboardingData.name + "' has been successfully initialized. Real-time uplink is now active.",
                    platform: 'relay',
                    category: 'System',
                    data: { type: 'onboarding', priority: 'high' }
                },
                {
                    project_id: user.id,
                    subscriber_id: targetSubscriberId,
                    title: "Lemon Squeezy: New Sale 🎉",
                    message: "Success! You just received a new payment of $49.00 for 'Relay Pro Plan'.",
                    platform: 'whatsapp',
                    category: 'Billing',
                    data: { amount: 49, currency: 'USD', status: 'paid' }
                },
                {
                    project_id: user.id,
                    subscriber_id: targetSubscriberId,
                    title: "Discord: @Developer Mention",
                    message: "Team Alpha: 'Bro, check the new relay endpoint, it's working flawlessly!'",
                    platform: 'discord',
                    category: 'Social',
                    data: { channel: 'development' }
                }
            ];

            // Robust insertion with fallback for missing columns (Self-healing logic)
            // This ensures a working onboarding even if the user hasn't run the schema fix yet
            for (const msg of testMessages) {
                let currentPayload: any = { ...msg };
                let success = false;
                let attempts = 0;

                while (!success && attempts < 8) {
                    try {
                        const { error } = await supabase.from('inbox_messages').insert(currentPayload);
                        if (!error) { success = true; break; }

                        if (error.code === 'PGRST204') {
                            const match = error.message.match(/column "?([^"'\s]+)"?/i) ||
                                error.message.match(/'([^']+)' column/i) ||
                                error.message.match(/Could not find the '([^']+)'/i);
                            if (match && match[1]) {
                                delete currentPayload[match[1]];
                                attempts++;
                                continue;
                            }
                        }

                        if (error.code === '23502') {
                            const match = error.message.match(/column "([^"]+)"/i);
                            if (match && match[1]) {
                                currentPayload[match[1]] = match[1] === 'data' ? {} : (match[1] === 'status' ? 'delivered' : "Default");
                                attempts++;
                                continue;
                            }
                        }
                        break;
                    } catch (err) { break; }
                }
            }

            // Trigger manual fetch to populate preview
            fetchInbox();
            setNotification({ message: "Uplink clusters synchronization complete!", type: 'success' });

            // Auto-transition to Step 3 after a short delay for feedback
            setTimeout(() => {
                setOnboardingStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 2500);
        } catch (err: any) {
            console.error('Onboarding Test Error:', err);
            setNotification({ message: "Uplink failure: " + (err.message || "Unknown Error"), type: 'error' });
        }
    };

    const fetchAIAnalytics = async () => {
        setIsAILoading(true);
        try {
            const res = await fetch(`/api/ai/analytics?cb=${new Date().getTime()}${activeWorkspaceId ? '&workspaceId=' + activeWorkspaceId : ''}`);
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

    const renderTopics = () => {
        return <TopicsView activeWorkspaceId={activeWorkspaceId || ''} setActiveTab={setActiveTab} />;
    };

    const renderSubscribers = () => {
        return <SubscribersView activeWorkspaceId={activeWorkspaceId || ''} setActiveTab={setActiveTab} />;
    };

    const renderInbox = () => {
        return (
            <InboxView
                notifications={inboxNotifications}
                isLoading={isInboxLoading}
                filters={inboxFilters}
                setFilters={setInboxFilters}
            />
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
            nodejs: `const fetch = require('node-fetch');\n\nfetch('https://relay-notify.com/api/relay', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': '${displayKey}'\n  },\n  body: JSON.stringify({\n    platform: 'telegram',\n    target: 'your_chat_id',\n    message: 'Relay Active: Situation Detected',\n    category: 'Alarm / Security',\n    botName: 'Aether Sentinel',\n    variables: { location: 'Warehouse A', severity: 'High' }\n  })\n});`,
            javascript: `// Modern Fetch API (ES6+)\nfetch('https://relay-notify.com/api/relay', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': '${displayKey}'\n  },\n  body: JSON.stringify({\n    platform: 'whatsapp',\n    target: 'phone_number',\n    message: 'System Alert: {{location}} status is {{severity}}',\n    category: 'Infrastructure',\n    botName: 'Relay AI',\n    variables: { location: 'Server Room', severity: 'Critical' }\n  })\n}).then(r => r.json()).then(console.log);`,
            python: `import requests\nimport json\n\nurl = "https://relay-notify.com/api/relay"\npayload = {\n    "platform": "telegram",\n    "target": "your_chat_id",\n    "message": "Situation: {{situation}}",\n    "category": "Automation",\n    "botName": "Relay Bot",\n    "variables": {"situation": "Fire Alarm Triggered"}\n}\nheaders = {\n    "Content-Type": "application/json",\n    "x-api-key": "${displayKey}"\n}\n\nresponse = requests.post(url, json=payload, headers=headers)`,
            php: `<?php\n\n$url = "https://relay-notify.com/api/relay";\n$payload = json_encode([\n    "platform" => "discord",\n    "target" => "webhook_url",\n    "message" => "Invoice #{{id}} Created",\n    "category" => "Billing",\n    "variables" => ["id" => "9921"]\n]);\n\n$ch = curl_init($url);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    "Content-Type: application/json",\n    "x-api-key: ${displayKey}"\n]);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $payload);\n\n$response = curl_exec($ch);\ncurl_close($ch);`,
            go: `package main\n\nimport (\n\t"bytes"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "https://relay-notify.com/api/relay"\n\tjsonStr := []byte(\`{"platform":"telegram","target":"chat_id","message":"Health Check OK"}\`)\n\treq, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))\n\treq.Header.Set("Content-Type", "application/json")\n\treq.Header.Set("x-api-key", "${displayKey}")\n\n\tclient := \u0026http.Client{}\n\tclient.Do(req)\n}`,
            curl: `curl -X POST https://relay-notify.com/api/relay \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: ${displayKey}" \\\n  -d '{\n    "platform": "telegram",\n    "target": "your_chat_id",\n    "message": "Universal Uplink Active",\n    "category": "Security / Alarm",\n    "botName": "Aether Sentinel",\n    "variables": {"location": "Main Entrance"}\n  }'`,
            react: `import { RelayInbox } from 'relay-inbox-react';\n\n// Drop the Universal Inbox into your Next.js/React app\nexport default function App() {\n  return (\n    <RelayInbox \n      appId="YOUR_WORKSPACE_APP_ID"\n      subscriberId="USER_INTERNAL_ID"\n      theme="dark" \n    />\n  );\n}`
        };

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 p-10"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2 pl-2">API & SDKs</h1>
                        <p className="text-sm text-slate-400 font-medium pl-2">Connect Relay to your application in seconds using our modern API.</p>
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
                                    <p className="text-xs font-bold text-white">https://relay-notify.com/api/relay</p>
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
                        <div className="glass border-white/10 rounded-[32px] overflow-hidden group">
                            <div className="relative">
                                {/* Scroll Masks */}
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none opacity-100" />

                                <div
                                    ref={sdkScrollRef}
                                    onMouseDown={handleSdkMouseDown}
                                    onMouseMove={handleSdkMouseMove}
                                    onMouseUp={handleSdkMouseUpOrLeave}
                                    onMouseLeave={handleSdkMouseUpOrLeave}
                                    className={`flex items-center gap-1 p-2.5 bg-white/[0.02] border-b border-white/5 overflow-x-auto whitespace-nowrap scrollbar-thin scroll-smooth px-8 ${isSdkDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                >
                                    {[
                                        { id: 'nodejs', label: 'Node.js' },
                                        { id: 'javascript', label: 'JS Fetch' },
                                        { id: 'python', label: 'Python' },
                                        { id: 'php', label: 'PHP' },
                                        { id: 'go', label: 'Go' },
                                        { id: 'curl', label: 'cURL' },
                                        { id: 'react', label: 'Relay Inbox [UI]' },
                                    ].map((tab, idx, arr) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                if (!sdkHasDragged) setSdkTab(tab.id as any);
                                            }}
                                            style={{ marginRight: idx === arr.length - 1 ? '40px' : '0' }}
                                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shrink-0 ${sdkTab === tab.id ? 'bg-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 bg-[#050505] relative group">
                                <pre className="text-[11px] font-mono overflow-x-auto leading-relaxed">
                                    <HighlightedCode code={snippets[sdkTab]} language={sdkTab} />
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
                                                        variables: "{\n  \"order_number\": \"8821\",\n  \"item_count\": 3,\n  \"total_price\": \"$154.50\",\n  \"shipping_city\": \"Miami\",\n  \"shipping_country\": \"US\"\n}",
                                                        targets: { discord: testConfig.target }
                                                    });
                                                } else if (preset.id === 'hubspot') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "slack",
                                                        platforms: ["slack"],
                                                        category: "sale",
                                                        botAvatar: "",
                                                        message: (pObj?.hubspot?.title || "**🤝 HUBSPOT: NEW DEAL WON!**") + "\n\n" + (pObj?.hubspot?.body || "Deal: **{{deal_name}}**\nAmount: **{{amount}}**\nOwner: {{owner_name}}\n\n🎉 *Congratulations to the team!*"),
                                                        variables: "{\n  \"deal_name\": \"Enterprise License Renewal\",\n  \"amount\": \"$12,500.00\",\n  \"owner_name\": \"Exequiel G.\"\n}",
                                                        targets: { slack: testConfig.target }
                                                    });
                                                } else if (preset.id === 'clerk') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "discord",
                                                        platforms: ["discord", "telegram"],
                                                        category: "auth",
                                                        botAvatar: "",
                                                        message: (pObj?.clerk?.title || "**👤 CLERK: NEW USER SIGNUP**") + "\n\n" + (pObj?.clerk?.body || "Email: **{{user_email}}**\nProvider: {{oauth_provider}}\nStatus: **Active**\n\n*User ID: {{user_id}}*"),
                                                        variables: "{\n  \"user_email\": \"new_user@example.com\",\n  \"oauth_provider\": \"Google\",\n  \"user_id\": \"user_2V9x8Z...\"\n}",
                                                        targets: { discord: testConfig.target, telegram: testConfig.target }
                                                    });
                                                } else if (preset.id === 'github') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "discord",
                                                        platforms: ["discord"],
                                                        category: "security",
                                                        botAvatar: "",
                                                        message: (pObj?.github?.title || "**🛡️ GITHUB: SECURITY ALERT**") + "\n\n" + (pObj?.github?.body || "Repo: **{{repo_name}}**\nSeverity: **HIGH**\nIssue: {{description}}\n\n⚠️ *Please audit dependency graph immediately.*"),
                                                        variables: "{\n  \"repo_name\": \"relay-core\",\n  \"description\": \"Vulnerable dependency found in package-lock.json\"\n}",
                                                        targets: { discord: testConfig.target }
                                                    });
                                                } else if (preset.id === 'stripe') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "telegram",
                                                        platforms: ["telegram"],
                                                        category: "sale",
                                                        botAvatar: "",
                                                        message: (pObj?.stripe?.title || "**💰 STRIPE: PAYMENT SUCCESSFUL**") + "\n\n" + (pObj?.stripe?.body || "Customer: **{{customer_name}}**\nAmount: **{{amount}} {{currency}}**\nPlan: {{plan_name}}\n\n*Invoice: {{invoice_id}}*"),
                                                        variables: "{\n  \"customer_name\": \"John Doe\",\n  \"amount\": \"249.00\",\n  \"currency\": \"USD\",\n  \"plan_name\": \"Pro Enterprise License\",\n  \"invoice_id\": \"INV-2026-X892\"\n}",
                                                        targets: { telegram: testConfig.target }
                                                    });
                                                } else if (preset.id === 'security') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "telegram",
                                                        platforms: ["telegram", "discord"],
                                                        category: "security",
                                                        botAvatar: "",
                                                        message: (pObj?.security?.title || "**⚠️ SECURITY ALERT**") + "\n\n" + (pObj?.security?.body || "A suspicious login attempt was detected from {{location}}.\n\n📱 **Device:** {{device}}\n🕒 **Time:** {{time}}\n\nIf this was not you, please revoke access immediately."),
                                                        variables: "{\n  \"location\": \"Tokyo, JP\",\n  \"device\": \"iPhone 15 Pro\",\n  \"time\": \"14:20:05\"\n}",
                                                        targets: { telegram: testConfig.target, discord: testConfig.target }
                                                    });
                                                } else if (preset.id === 'email') {
                                                    setTestConfig({
                                                        ...testConfig,
                                                        platform: "email",
                                                        platforms: ["email"],
                                                        category: "general",
                                                        target: "welcome@relay-notify.com",
                                                        message: (pObj?.email?.title || "**✨ WELCOME TO RELAY ENTERPRISE**") + "\n\n" + (pObj?.email?.body || "Hi **{{user_name}}**,\n\nYour organization is now connected to the global relay network. Start building your automation pipelines today.\n\nBest,\nThe Relay Team"),
                                                        variables: "{\n  \"user_name\": \"Exequiel\"\n}",
                                                        targets: { email: "welcome@relay-notify.com" }
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
                                                {p === 'telegram' && <TelegramIcon className="w-3.5 h-3.5" />}
                                                {p === 'discord' && <DiscordIcon className="w-3.5 h-3.5" />}
                                                {p === 'slack' && <SlackIcon className="w-3.5 h-3.5" />}
                                                {p === 'email' && <EmailIcon className="w-3.5 h-3.5" />}
                                                {p === 'whatsapp' && <WhatsAppIcon className="w-3.5 h-3.5" />}
                                                {p === 'teams' && <TeamsIcon className="w-3.5 h-3.5" />}
                                                {p === 'sms' && <SMSIcon className="w-3.5 h-3.5" />}
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
                                                        {['telegram', 'discord', 'slack', 'email', 'whatsapp', 'sms'].map(p => (
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
                                                                {p === 'telegram' && <TelegramIcon className="w-4 h-4" />}
                                                                {p === 'discord' && <DiscordIcon className="w-4 h-4" />}
                                                                {p === 'slack' && <SlackIcon className="w-4 h-4" />}
                                                                {p === 'email' && <EmailIcon className="w-4 h-4" />}
                                                                {p === 'whatsapp' && <WhatsAppIcon className="w-4 h-4" />}
                                                                {p === 'sms' && <SMSIcon className="w-4 h-4" />}
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
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-500">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 cursor-default">
                                        {d.testlab?.targetUrl || "Routing Targets (Unique IDs / Webhooks)"}
                                    </label>

                                    <div className="grid grid-cols-1 gap-4">
                                        {testConfig.platforms.length === 0 ? (
                                            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-slate-500 italic text-[10px] uppercase font-black">
                                                Add a platform to the sequence to define targets
                                            </div>
                                        ) : testConfig.platforms.map((p, idx) => (
                                            <div key={idx} className="relative group/target">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                                                    {p === 'telegram' && <TelegramIcon className="w-4 h-4 text-[#26A5E4]" />}
                                                    {p === 'discord' && <DiscordIcon className="w-4 h-4 text-[#5865F2]" />}
                                                    {p === 'slack' && <SlackIcon className="w-4 h-4 text-[#E01E5A]" />}
                                                    {p === 'email' && <EmailIcon className="w-4 h-4 text-indigo-400" />}
                                                    {p === 'whatsapp' && <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />}
                                                    {p === 'teams' && <TeamsIcon className="w-4 h-4 text-[#6264A7]" />}
                                                    {p === 'sms' && <SMSIcon className="w-4 h-4 text-emerald-500" />}
                                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-2">{p}</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={testConfig.targets[p] || ""}
                                                    onChange={(e) => {
                                                        const newTargets = { ...testConfig.targets };
                                                        newTargets[p] = e.target.value;
                                                        setTestConfig({ ...testConfig, targets: newTargets, target: e.target.value }); // Sync singular target for compatibility with some parts if needed
                                                    }}
                                                    placeholder={p === 'email' ? "user@example.com" : p === 'slack' ? "Member ID (U12345) or Webhook" : `Enter ${p} ID or Webhook`}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-32 pr-4 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium text-xs placeholder:text-white/10"
                                                />
                                                {testConfig.targets[p] && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <Check className="w-3.5 h-3.5 text-emerald-500/50" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val.startsWith('data:image')) {
                                                            processImageUpload(val, 'avatar');
                                                        } else {
                                                            setTestConfig({ ...testConfig, botAvatar: val });
                                                        }
                                                    }}
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
                                                        reader.onloadend = async () => {
                                                            const base64 = reader.result as string;
                                                            await processImageUpload(base64, 'avatar');
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
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-2">Low-Code <span className="text-accent underline underline-offset-8 decoration-accent/20">Webhooks</span></h1>
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
        const ds = d.status || (dictionaries[lang] as any).dashboard.status;

        // If no data yet, show skeleton/loading
        if (!sysStats) {
            return (
                <div className="flex justify-center p-32">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-accent border-r-2 border-accent/20" />
                </div>
            );
        }

        const os = sysStats.os;
        const verifiableNode = sysStats.verifiable_node || "localhost";

        // Format uptime (from seconds to Days/Hours)
        const formatUptimeOS = (secs: number) => {
            const d = Math.floor(secs / (3600 * 24));
            const h = Math.floor(secs % (3600 * 24) / 3600);
            const m = Math.floor(secs % 3600 / 60);
            if (d > 0) return `${d}d ${h}h`;
            return `${h}h ${m}m`;
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 animate-in fade-in duration-500"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{ds.title || "Network Status"}</h1>
                        <p className="text-sm text-slate-400 mt-1">Real-time local infrastructure telemetry</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-lg">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                        <span className="text-sm font-medium text-emerald-400">Node Online: CONNECTED</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Database Response", value: sysStats.latency, sub: "Local DB Poll", color: "text-blue-400" },
                        { label: "System Uptime", value: formatUptimeOS(os.uptime_seconds), sub: "Uninterrupted", color: "text-emerald-400" },
                        { label: "Nodes Online", value: "1 / 1", sub: "Primary Instance", color: "text-white" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl hover:bg-white/[0.03] transition-colors">
                            <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
                            <h3 className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</h3>
                            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white/[0.02] p-6 rounded-xl border border-white/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-white/5 pb-4 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-slate-300 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white uppercase tracking-widest">
                                        HOSTING
                                    </h4>
                                    <span className="text-xs text-slate-400">Primary Infrastructure</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {Object.entries({
                                os: "Operating System Polling",
                                api: "Relay Internal Engine",
                                uplink: "WebSocket Stream"
                            }).map(([key, name]: [string, any], i) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-white block">{name}</span>
                                        <span className="text-xs text-slate-500 mt-0.5">Live History (4h chunks)</span>
                                    </div>
                                    <div className="flex gap-[2px] h-6">
                                        {/* Using real history from sysStats.history if key === 'api', else just solid green since local Node is running perfectly if we can render this */}
                                        {Array.from({ length: 41 }).map((_, barIdx) => {

                                            let statusColor = 'bg-emerald-500/40 hover:bg-emerald-400/80';
                                            let tooltipStatus = 'Operational';

                                            if (key === 'api' && sysStats.history[barIdx]) {
                                                const state = sysStats.history[barIdx];
                                                if (state === 'OFFLINE') {
                                                    statusColor = 'bg-rose-500/80 hover:bg-rose-400';
                                                    tooltipStatus = 'Downtime';
                                                } else if (state === 'DEGRADED') {
                                                    statusColor = 'bg-amber-500/80 hover:bg-amber-400';
                                                    tooltipStatus = 'Degraded';
                                                } else if (barIdx === 40) {
                                                    statusColor = 'bg-emerald-500 hover:bg-emerald-400';
                                                }
                                            } else if (barIdx === 40) {
                                                statusColor = 'bg-emerald-500 hover:bg-emerald-400'; // Make the latest bar brighter
                                            }

                                            return (
                                                <div
                                                    key={barIdx}
                                                    className={`flex-1 rounded-sm ${statusColor} transition-colors group relative`}
                                                >
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[60]">
                                                        <div className="bg-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap text-white shadow-xl border border-white/10 flex flex-col items-center gap-1">
                                                            <span>{tooltipStatus}</span>
                                                            <span className="text-slate-400 text-[9px]">{barIdx === 40 ? "Current" : `Block -${40 - barIdx}`}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                onClick={() => confirmDeleteScenario(selectedScenarioIds)}
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
                                        onClick={() => confirmDeleteScenario(selectedScenarioIds)}
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
                                                confirmDeleteScenario(sc.id);
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

            let newNode;
            switch (type) {
                case 'actionNode':
                    newNode = { id: Date.now().toString(), type: 'actionNode', data: { label: 'New Action', platform: 'telegram' } };
                    break;
                case 'conditionNode':
                    newNode = { id: Date.now().toString(), type: 'conditionNode', data: { label: 'New Filter', condition: 'true' } };
                    break;
                case 'waitNode':
                    newNode = { id: Date.now().toString(), type: 'waitNode', data: { label: 'Wait / Delay', delay_duration: 10, delay_unit: 'minutes' } };
                    break;
                case 'digestNode':
                    newNode = { id: Date.now().toString(), type: 'digestNode', data: { label: 'Notification Digest', digest_key: '{{user_id}}', interval_minutes: 60, interval_unit: 'minutes' } };
                    break;
                case 'webhookNode':
                    newNode = { id: Date.now().toString(), type: 'webhookNode', data: { label: 'Outgoing Webhook', url: '' } };
                    break;
                default:
                    newNode = { id: Date.now().toString(), type: 'stepNode', data: { label: 'New Step' } };
            }

            setScenarios(prev => prev.map(s => {
                if (s.id !== activeScenarioId) return s;
                const newNodes = [...s.nodes];
                newNodes.splice(insertIndex + 1, 0, newNode);
                const newEdges = [...(s.edges || [])];
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
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(scenario.id);
                                        setNotification({ message: 'Scenario ID copied to clipboard.', type: 'success' });
                                    }}
                                    className="flex items-center gap-1.5 px-2 py-0.5 rounded border bg-slate-800 border-white/5 text-slate-400 hover:text-white transition-colors group cursor-pointer"
                                    title="Copy Scenario ID for API routing"
                                >
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-80 group-hover:opacity-100">ID: {scenario.id.substring(0, 8)}...</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-between sm:justify-end">
                        <div className="flex items-center gap-2 sm:mr-6">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 truncate">{sc_t.routingStatus || "ENABLE PIPELINE"}</span>
                            <button
                                className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full p-1 transition-colors flex items-center shrink-0 ${scenario.is_active ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800 border border-white/5'}`}
                                onClick={() => {
                                    const newScenarios = [...scenarios];
                                    const idx = newScenarios.findIndex(s => s.id === scenario.id);
                                    newScenarios[idx].is_active = !scenario.is_active;
                                    setScenarios(newScenarios);
                                }}
                            >
                                <div
                                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-transform duration-300 ease-in-out ${scenario.is_active ? 'bg-emerald-400 translate-x-[20px] sm:translate-x-[24px]' : 'bg-slate-500 translate-x-0'}`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => confirmDeleteScenario(scenario.id)}
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
                                        const res = await fetch(`/api/relay${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
                                                            node.type === 'digestNode' ? <Layers className="w-4 h-4" /> :
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
                                                    {node.data.platform === 'telegram' && <TelegramIcon className="w-3 h-3" />}
                                                    {node.data.platform === 'discord' && <DiscordIcon className="w-3 h-3" />}
                                                    {node.data.platform === 'slack' && <SlackIcon className="w-3 h-3" />}
                                                    {node.data.platform === 'email' && <EmailIcon className="w-3 h-3" />}
                                                    {node.data.platform === 'whatsapp' && <WhatsAppIcon className="w-3 h-3" />}
                                                    {node.data.platform === 'teams' && <TeamsIcon className="w-3 h-3" />}
                                                    {node.data.platform === 'sms' && <SMSIcon className="w-3 h-3" />}
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
                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{node.data.delay_duration} {node.data.delay_unit}</span>
                                            </div>
                                        )}
                                        {node.type === 'digestNode' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-500"><Layers className="w-3 h-3 inline mr-1" /> DIGEST</span>
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{node.data.interval_minutes}{node.data.interval_unit === 'seconds' ? 's' : node.data.interval_unit === 'hours' ? 'h' : node.data.interval_unit === 'days' ? 'd' : 'm'}</span>
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
                                className={`relative w-[92%] md:w-full h-auto max-h-[85vh] ${(editingNode?.type === 'waitNode' || editingNode?.type === 'digestNode') && !isInsertingNode ? 'md:max-w-md' : 'md:max-w-xl'} glass border-white/10 rounded-[32px] md:rounded-[40px] p-4 md:p-10 overflow-y-auto scrollbar-hide shadow-[0_0_100px_rgba(59,130,246,0.1)] z-10`}
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
                                                onClick={() => insertNode('digestNode')}
                                                className="p-4 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                                                    <Layers className="w-6 h-6" />
                                                </div>
                                                <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">Notification Digest</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Batch notifications within a time window.</p>
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
                                                <div className={`p-2.5 rounded-2xl ${editingNode.type === 'triggerNode' ? 'bg-accent/10 text-accent' : editingNode.type === 'waitNode' ? 'bg-amber-500/10 text-amber-400' : editingNode.type === 'webhookNode' ? 'bg-blue-500/10 text-blue-400' : editingNode.type === 'digestNode' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                    {editingNode.type === 'triggerNode' ? <Webhook className="w-5 h-5" /> : editingNode.type === 'waitNode' ? <Clock className="w-5 h-5" /> : editingNode.type === 'webhookNode' ? <Globe className="w-5 h-5" /> : editingNode.type === 'digestNode' ? <Layers className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
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
                                                    value={editingNode.data.label || ''}
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
                                                                    const url = `https://relay-notify.com/api/relay?category=${editingNode.data.event || 'GENERAL'}`;
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

                                                    <div className="flex flex-col gap-6 mb-8">
                                                        <div className="w-full">
                                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Platform</label>
                                                            <div className="flex flex-row flex-wrap gap-2">
                                                                {[
                                                                    { id: 'telegram', icon: TelegramIcon, color: 'text-[#26A5E4]' },
                                                                    { id: 'discord', icon: DiscordIcon, color: 'text-[#5865F2]' },
                                                                    { id: 'whatsapp', icon: WhatsAppIcon, color: 'text-[#25D366]' },
                                                                    { id: 'slack', icon: SlackIcon, color: 'text-[#E01E5A]' },
                                                                    { id: 'email', icon: EmailIcon, color: 'text-indigo-400' },
                                                                    { id: 'sms', icon: SMSIcon, color: 'text-emerald-500' }
                                                                ].map((p) => (
                                                                    <button
                                                                        key={p.id}
                                                                        onClick={() => setEditingNode({ ...editingNode, data: { ...editingNode.data, platform: p.id } })}
                                                                        className={`flex flex-row items-center gap-2 px-4 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${editingNode.data.platform === p.id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-105' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}`}
                                                                    >
                                                                        <p.icon className={`w-4 h-4 ${editingNode.data.platform === p.id ? 'text-white' : p.color}`} />
                                                                        {p.id}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="w-full">
                                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
                                                                Address ({editingNode.data.platform || '...'})
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder={editingNode.data.platform === 'email' ? 'recipient@company.com' : 'ID / URL'}
                                                                value={editingNode.data.target_address || ''}
                                                                onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, target_address: e.target.value } })}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-all font-bold text-sm"
                                                            />
                                                            {envMode === 'Development' && (
                                                                <div className="mt-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 font-sans">
                                                                    <div className="flex items-start gap-3">
                                                                        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-violet-400" />
                                                                        <div className="space-y-1">
                                                                            <h4 className="text-[10px] font-black text-violet-300 uppercase tracking-wider">Development Sandbox Active</h4>
                                                                            <p className="text-[10px] leading-relaxed text-violet-300/80 font-medium italic">
                                                                                All third-party platforms are <strong className="text-violet-300">silently mocked</strong> (returning success) to prevent real external traffic.<br />
                                                                                <strong className="text-emerald-400">Emails</strong> will bypass your custom address config and route straight to your own Auth Email to test templates safely.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 relative overflow-hidden group mb-4">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full -mr-12 -mt-12" />
                                                        <div className="relative z-10 space-y-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <ShieldAlert className="w-4 h-4 text-amber-500" />
                                                                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Smart Fallback (Enterprise)</h4>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[8px] font-bold uppercase tracking-widest text-amber-500/80 mb-2">If delivery fails, use:</label>
                                                                    <div className="grid grid-cols-6 gap-1">
                                                                        {[
                                                                            { id: 'none', label: 'None', icon: <X className="w-3 h-3" /> },
                                                                            { id: 'telegram', label: 'TG', icon: <TelegramIcon className="w-3.5 h-3.5" /> },
                                                                            { id: 'discord', label: 'DC', icon: <DiscordIcon className="w-3.5 h-3.5" /> },
                                                                            { id: 'slack', label: 'SL', icon: <SlackIcon className="w-3.5 h-3.5" /> },
                                                                            { id: 'whatsapp', label: 'WA', icon: <WhatsAppIcon className="w-3.5 h-3.5" /> },
                                                                            { id: 'email', label: 'EM', icon: <EmailIcon className="w-3.5 h-3.5" /> }
                                                                        ].map(p => (
                                                                            <button
                                                                                key={p.id}
                                                                                onClick={() => setEditingNode({ ...editingNode, data: { ...editingNode.data, fallback_platform: p.id === 'none' ? null : p.id } })}
                                                                                className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[6px] font-black uppercase transition-all ${(editingNode.data.fallback_platform || 'none') === p.id ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-lg' : 'bg-white/5 border-amber-500/20 text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-400'}`}
                                                                                title={p.label}
                                                                            >
                                                                                {p.icon}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className={!editingNode.data.fallback_platform ? 'opacity-30 pointer-events-none transition-opacity' : 'transition-opacity'}>
                                                                    <label className="block text-[8px] font-bold uppercase tracking-widest text-amber-500/80 mb-2">Fallback Address</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Fallback ID/URL"
                                                                        value={editingNode.data.fallback_target_address || ''}
                                                                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, fallback_target_address: e.target.value } })}
                                                                        className="w-full bg-black/40 border border-amber-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-all font-bold text-[10px]"
                                                                    />
                                                                </div>
                                                            </div>
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
                                                                                await fetch(`/api/relay${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
                                                                    value={editingNode.data.condition || ''}
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
                                                            value={editingNode.data.delay_duration ?? ''}
                                                            onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, delay_duration: e.target.value === '' ? '' : parseInt(e.target.value) } })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Unit</label>
                                                        <select
                                                            value={editingNode.data.delay_unit || 'minutes'}
                                                            onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, delay_unit: e.target.value } })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none focus:outline-none focus:border-amber-500 font-bold uppercase text-[10px]"
                                                        >
                                                            <option value="seconds" className="bg-slate-900 text-white font-bold">Seconds</option>
                                                            <option value="minutes" className="bg-slate-900 text-white font-bold">Minutes</option>
                                                            <option value="hours" className="bg-slate-900 text-white font-bold">Hours</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {editingNode.type === 'digestNode' && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 md:gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 whitespace-nowrap truncate">Batch Window</label>
                                                            <input
                                                                type="number"
                                                                value={editingNode.data.interval_minutes ?? ''}
                                                                onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, interval_minutes: e.target.value === '' ? '' : parseInt(e.target.value) } })}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 whitespace-nowrap truncate">Unit</label>
                                                            <select
                                                                value={editingNode.data.interval_unit || 'minutes'}
                                                                onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, interval_unit: e.target.value } })}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-indigo-500 font-bold uppercase text-[10px]"
                                                            >
                                                                <option value="seconds" className="bg-slate-900 text-white font-bold">Seconds</option>
                                                                <option value="minutes" className="bg-slate-900 text-white font-bold">Minutes</option>
                                                                <option value="hours" className="bg-slate-900 text-white font-bold">Hours</option>
                                                                <option value="days" className="bg-slate-900 text-white font-bold">Days</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 whitespace-nowrap truncate">Grouping Key</label>
                                                            <input
                                                                type="text"
                                                                placeholder="{{user_id}}"
                                                                value={editingNode.data.digest_key || ''}
                                                                onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, digest_key: e.target.value } })}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Digest Summary Template</label>
                                                        <input
                                                            type="text"
                                                            placeholder="You have {{count}} new notifications"
                                                            value={editingNode.data.digest_template || ''}
                                                            onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, digest_template: e.target.value } })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold text-xs"
                                                        />
                                                        <p className="text-[8px] text-slate-600 font-bold mt-2 uppercase tracking-tight">Use {"{{count}}"} for total items and {"{{key}}"} for grouping key.</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                                                        <p className="text-[10px] text-slate-500 font-medium italic">
                                                            Notifications with the same <span className="text-indigo-400 font-bold">Grouping Key</span> will be batched together and sent as a single notification after the batch window expires.
                                                        </p>
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
                                                    className="w-full md:w-auto aspect-square flex items-center justify-center p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all group order-3 md:order-1"
                                                    title="Delete Node"
                                                >
                                                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
                                                    <Copy className="w-4 h-4" /> Duplicate
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setIsNodeModalOpen(false)}
                                                className="flex-1 py-4 rounded-2xl bg-[#0F0F0F] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase text-[9px] font-black tracking-widest cursor-pointer order-4 md:order-3"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                onClick={() => updateNodeData(editingNode.id, editingNode.data)}
                                                className="flex-1 py-4 rounded-2xl bg-accent text-white hover:shadow-[0_0_30px_var(--accent-glow)] transition-all uppercase text-[9px] font-black tracking-[0.2em] flex items-center justify-center gap-3 px-6 md:px-12 cursor-pointer order-1 md:order-4"
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

    const renderRelayAI = () => {
        return (
            <div className="max-w-5xl mx-auto pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-400/20 blur-xl animate-pulse" />
                        <Bot className="w-6 h-6 text-accent relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Autonomous Core</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Alpha
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 tracking-widest">AETHER DIGITAL INTELLIGENCE</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    {/* Copy Text */}
                    <div className="lg:col-span-2">
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-[1.1] uppercase">
                            Self-Healing <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Signal</span> Orchestration
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                            Step beyond static webhooks. Embed Aether's autonomous agents into your data pipelines to dynamically route, validate, and transform events in real-time without writing middleware.
                        </p>

                        <div className="space-y-5 mb-10">
                            {[
                                { title: "Semantic Event Normalization", desc: "Automatically parse and standardize chaotic payloads from any provider into unified schemas." },
                                { title: "Predictive Failover & Retry", desc: "Agents learn provider downtime patterns to intelligently delay or reroute critical signals." },
                                { title: "Stateful Interaction Loops", desc: "Maintain context across disconnected systems (e.g., Slack to GitHub to DB) natively." }
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                    <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 shadow-inner border border-accent/20">
                                        <Zap className="w-4 h-4 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">{feature.title}</h4>
                                        <p className="text-[11px] text-slate-400 leading-snug">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleInitializeCore}
                            disabled={isInitializingCore}
                            className={`w-full md:w-auto px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 group relative overflow-hidden ${isInitializingCore ? 'bg-black border border-accent text-accent' : 'bg-gradient-to-r from-accent to-blue-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]'}`}
                        >
                            {isInitializingCore ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                    <span className="animate-pulse">{["Handshaking with Neural Grid...", "Allocating Compute Nodes...", "Establishing Data Pipe...", "Access Granted"][coreInitStep]}</span>
                                    <div className="absolute bottom-0 left-0 h-1 bg-accent transition-all duration-300" style={{ width: `${((coreInitStep + 1) / 4) * 100}%` }} />
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Initialize Agent Access
                                </>
                            )}
                        </button>
                    </div>

                    {/* Aether Neural Map Visualization */}
                    <div className="lg:col-span-3 h-[500px] rounded-[40px] bg-[#030508] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-8 group">
                        {/* Background Grid & Glows */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-colors duration-1000" />

                        {/* Neural Graph Structure */}
                        <div className="w-full h-full flex items-center justify-center relative z-10">

                            {/* Central AGI Node */}
                            <div className="absolute w-32 h-32 rounded-full border-2 border-accent/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)] bg-black/50 backdrop-blur-md z-20">
                                <div className="absolute inset-0 border border-accent rounded-full animate-[spin_4s_linear_infinite] opacity-50" />
                                <div className="absolute inset-2 border border-purple-500 rounded-full animate-[spin_3s_linear_infinite_reverse] opacity-30" />
                                <div className="text-center">
                                    <Bot className="w-8 h-8 text-white mx-auto mb-1 animate-pulse" />
                                    <span className="text-[8px] font-black tracking-widest text-accent uppercase">Aether Agent</span>
                                </div>
                            </div>

                            {/* Connecting Lines (SVG) - Precise responsive grid 1000x500 */}
                            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                                <defs>
                                    <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                                {/* Left Connections */}
                                <path id="path_tl" d="M 120 120 Q 250 150 500 250" fill="transparent" stroke="url(#lineGlow)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                                <path id="path_bl" d="M 100 375 Q 250 350 500 250" fill="transparent" stroke="url(#lineGlow)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite_reverse]" />
                                {/* Right Connections */}
                                <path id="path_tr" d="M 880 120 Q 750 150 500 250" fill="transparent" stroke="url(#lineGlow)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                                <path id="path_br" d="M 900 375 Q 750 350 500 250" fill="transparent" stroke="url(#lineGlow)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite_reverse]" />

                                {/* Data Signals (Animated Orbs) */}
                                {["path_tl", "path_bl", "path_tr", "path_br"].map((pathId, i) => (
                                    <circle key={pathId} r="3" fill={i % 2 === 0 ? "#3b82f6" : "#a855f7"} filter="blur(1px)">
                                        <animateMotion dur={`${3 + i}s`} repeatCount="indefinite">
                                            <mpath href={`#${pathId}`} />
                                        </animateMotion>
                                    </circle>
                                ))}
                            </svg>

                            {/* Peripheral Nodes Left */}
                            <div className="absolute left-[10%] top-[20%] flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                                    <SlackIcon className="w-5 h-5 text-slate-300" />
                                </div>
                                <span className="text-[8px] font-black uppercase text-slate-500">Unstructured</span>
                            </div>

                            <div className="absolute left-[5%] bottom-[25%] flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                                    <GithubIcon className="w-5 h-5 text-slate-300" />
                                </div>
                                <span className="text-[8px] font-black uppercase text-slate-500">Chaotic Webhook</span>
                            </div>

                            {/* Peripheral Nodes Right */}
                            <div className="absolute right-[10%] top-[20%] flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-xl relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                                    <Database className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-[8px] font-black uppercase text-emerald-500">Normalized Sync</span>
                            </div>

                            <div className="absolute right-[5%] bottom-[25%] flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-xl relative shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                    <Activity className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-[8px] font-black uppercase text-purple-400">Action Trigger</span>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
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

    const renderOnboarding = () => {
        const steps = [
            { id: 0, title: "Initialize Node", description: "Establish your secure protocol identity" },
            { id: 1, title: "Protocol Setup", description: "Synchronizing environment parameters" },
            { id: 2, title: "Uplink Test", description: "Verify real-time data delivery" },
            { id: 3, title: "Integrate Bridge", description: "Connect your production stack" }
        ];

        return (
            <div className="min-h-screen bg-[#000000] text-slate-300 font-sans selection:bg-accent/30 overflow-hidden flex flex-col">
                {/* Onboarding Header */}
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/50 backdrop-blur-xl z-50">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                <Zap className="text-white w-5 h-5" fill="currentColor" />
                            </div>
                            <span className="font-black text-lg tracking-tighter uppercase text-white">RELAY</span>
                        </div>
                        <div className="h-4 w-px bg-white/10 mx-2" />
                        <div className="flex items-center gap-8">
                            {steps.map((s) => (
                                <div key={s.id} className="flex items-center gap-3 group">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${(onboardingStep !== null ? onboardingStep : 0) === s.id ? 'bg-accent text-white' : (onboardingStep !== null ? onboardingStep : 0) > s.id ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-600 border border-white/5'}`}>
                                        {(onboardingStep !== null ? onboardingStep : 0) > s.id ? <Check className="w-3 h-3" /> : s.id + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${(onboardingStep !== null ? onboardingStep : 0) === s.id ? 'text-white' : 'text-slate-600'}`}>{s.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {(onboardingStep !== null ? onboardingStep : 0) > 1 && (
                        <button
                            onClick={() => setOnboardingStep(null)}
                            className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
                        >
                            Skip, I'll explore myself
                        </button>
                    )}
                </header>

                <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {onboardingStep === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-xl"
                            >
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Initialize Node</h2>
                                <p className="text-slate-500 text-sm mb-12">Configure your primary node parameters to establish a secure uplink.</p>

                                <div className="space-y-8 bg-[#050505] p-10 rounded-[32px] border border-white/5 shadow-2xl">
                                    <div className="flex gap-8 items-start">
                                        <div className="flex flex-col items-center gap-4">
                                            <div
                                                onClick={() => whiteLabelLogoInputRef.current?.click()}
                                                className="w-24 h-24 rounded-3xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/40 hover:bg-white/[0.07] transition-all group overflow-hidden relative"
                                            >
                                                <input type="file" ref={whiteLabelLogoInputRef} className="hidden" onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => setOnboardingData({ ...onboardingData, logo: ev.target?.result as string });
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} />
                                                {onboardingData.logo ? (
                                                    <img src={onboardingData.logo} className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <Upload className="w-6 h-6 text-slate-600 group-hover:text-accent transition-colors" />
                                                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Logo</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-1">Workspace Name</label>
                                                <input
                                                    type="text"
                                                    value={onboardingData.name}
                                                    onChange={(e) => setOnboardingData({ ...onboardingData, name: e.target.value, identifier: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                    placeholder="e.g. Acme Corp"
                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-800 outline-none focus:border-accent/40 transition-all font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-1">Node Tag</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={onboardingData.identifier}
                                                        onChange={(e) => setOnboardingData({ ...onboardingData, identifier: e.target.value })}
                                                        placeholder="node-alpha"
                                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-800 outline-none focus:border-accent/40 transition-all font-mono text-xs"
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 rounded text-[8px] font-black text-slate-600 uppercase">Tag</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={!onboardingData.name || !onboardingData.identifier}
                                        onClick={() => {
                                            setWhiteLabel({ ...whiteLabel, corporateName: onboardingData.name, corporateLogo: onboardingData.logo || "" });
                                            setOnboardingStep(1);
                                        }}
                                        className="w-full py-5 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale"
                                    >
                                        Initialize Protocol
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {onboardingStep === 1 && (
                            <OnboardingSetupTransition onComplete={() => setOnboardingStep(2)} />
                        )}

                        {onboardingStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="w-full max-w-7xl h-[700px] grid grid-cols-12 gap-12 items-center"
                            >
                                <div className="col-span-5 flex flex-col justify-center space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                                                <span className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">Telemetry Preview</span>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                        </div>
                                        <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.85]">
                                            Uplink <br /> <span className="text-accent underline decoration-white/10 underline-offset-8">Synchronized.</span>
                                        </h2>
                                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium">
                                            Telemetry packets from <span className="text-white font-bold">{onboardingData.name}</span> are now being intercepted. Press the button to verify the routing path.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <button
                                            onClick={handleSendOnboardingTest}
                                            className="group relative w-fit px-12 py-6 rounded-3xl bg-accent text-white font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-4 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                            <Zap className="w-6 h-6 fill-white" />
                                            <span>Send verification packet</span>
                                        </button>

                                        <button
                                            onClick={() => setOnboardingStep(3)}
                                            className="px-6 py-3 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all w-fit flex items-center gap-3 group/btn"
                                        >
                                            <div className="w-8 h-[1px] bg-slate-800 group-hover/btn:w-12 group-hover/btn:bg-accent transition-all" />
                                            Skip Verification
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-7 h-[600px] bg-[#050505] rounded-[56px] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center group">
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[2] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

                                    {/* Mock Dashboard UI with Parallax Effect */}
                                    <div className="absolute inset-8 rounded-[40px] bg-[#020202] border border-white/10 overflow-hidden flex shadow-2xl transition-all duration-700 group-hover:scale-[1.01] group-hover:border-white/20">
                                        <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black/40">
                                            <div className="w-8 h-8 rounded-xl bg-accent shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                                            <div className="space-y-4">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={`w-6 h-6 rounded-lg border border-white/5 ${i === 4 ? 'bg-accent/10 border-accent/20' : 'bg-white/5'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex-1 p-8 space-y-8 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.02),transparent)]">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <div className="w-40 h-4 bg-white/5 rounded-full" />
                                                    <div className="w-24 h-2 bg-white/5 rounded-full opacity-30" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="h-24 bg-white/[0.02] border border-white/5 rounded-[20px] p-4 flex flex-col justify-between">
                                                        <div className="w-10 h-1.5 bg-white/10 rounded-full" />
                                                        <div className="w-full h-2 bg-white/5 rounded-full" />
                                                        <div className="w-12 h-6 bg-accent/5 border border-accent/10 rounded-lg self-end" />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex-1 h-32 bg-white/[0.01] border border-white/5 rounded-[24px] p-6 relative overflow-hidden">
                                                <div className="flex items-end gap-1.5 h-full">
                                                    {[40, 70, 45, 90, 65, 80, 35, 60, 85, 50, 75, 40].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-accent/20 rounded-t-sm" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real Inbox Component Preview - This is the HERO */}
                                    <div className="relative z-10 w-[420px] h-[480px] bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/20">
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Uplink Active</span>
                                                </div>
                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{onboardingData.identifier}.relay.so</p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                                <Sparkles className="w-5 h-5 text-accent" />
                                            </div>
                                        </div>
                                        <div className="h-full overflow-y-auto scrollbar-hide pb-20">
                                            <InboxView
                                                notifications={inboxNotifications}
                                                isLoading={isInboxLoading}
                                                filters={inboxFilters}
                                                setFilters={setInboxFilters}
                                                variant="onboarding"
                                            />
                                        </div>

                                        {/* Premium Blur Overlay at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />
                                    </div>

                                    {/* Glass Overlay to prevent interaction with mock dashboard */}
                                    <div className="absolute inset-0 z-[5] bg-transparent" />
                                </div>
                            </motion.div>
                        )}

                        {onboardingStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full max-w-6xl"
                            >
                                <div className="text-center mb-16 px-4">
                                    <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 pl-4">You're ready to launch</h2>
                                    <p className="text-slate-500 text-sm">Add the Relay Inbox to your application in minutes.</p>
                                </div>

                                <div className="bg-[#050505] rounded-[40px] border border-white/5 overflow-hidden shadow-3xl">
                                    {renderIntegration()}
                                </div>

                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={() => {
                                            setOnboardingStep(null);
                                            setActiveTab('overview');
                                        }}
                                        className="px-16 py-6 rounded-[24px] bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-[0_0_60px_rgba(255,255,255,0.1)] active:scale-95"
                                    >
                                        Go to dashboard
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                <footer className="h-16 border-t border-white/5 px-8 flex items-center justify-between text-[8px] font-black text-slate-800 uppercase tracking-widest">
                    <span>Relay Network Onboarding © 2026</span>
                    <div className="flex gap-4">
                        <span className="text-slate-600">Privacy Protocol</span>
                        <span className="text-slate-600">Security Clearance</span>
                    </div>
                </footer>
            </div >
        );
    };

    const handleTestRelay = async () => {
        setIsTesting(true);
        setTestResult(null);

        // Use the first active key for the user, or fallback
        const activeKey = apiKeys.find(k => k.is_active)?.key_hash || 'INTERNAL_DEBUG_KEY';

        try {
            const res = await fetch(`/api/relay${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': activeKey
                },
                body: JSON.stringify({
                    platforms: testConfig.platforms,
                    target: testConfig.target,
                    targets: testConfig.targets,
                    message: testConfig.message,
                    variables: JSON.parse(testConfig.variables || "{ }"),
                    botName: (testConfig.botName === 'Relay' || !testConfig.botName) ? whiteLabel.corporateName : testConfig.botName,
                    botAvatar: (!testConfig.botAvatar) ? whiteLabel.corporateLogo : testConfig.botAvatar,
                    category: testConfig.category,
                    _is_test_lab: true
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="w-20 h-20 bg-accent rounded-[32px] flex items-center justify-center shadow-[0_0_80px_var(--accent-glow)] mb-10 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <Zap className="text-white w-10 h-10 relative z-10" fill="currentColor" />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 rounded-full bg-accent"
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] pl-2">Syncing Node</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex relative overflow-hidden text-slate-400 selection:bg-accent/30 selection:text-white">
            {!isOnboarded ? (
                <div className="w-full h-full min-h-screen flex items-center justify-center relative bg-[#020408] z-[100] absolute inset-0">
                    <div className="lg:w-4/5 lg:h-[80vh] w-full h-full">
                        {renderRelayAI()}
                    </div>
                </div>
            ) : onboardingStep !== null ? renderOnboarding() : (
                <>
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
                        peer fixed lg:relative inset-y-0 left-0 bg-[#050505] border-r border-white/5 py-4 flex flex-col z-[70] transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto scrollbar-hide group hover:shadow-[10px_0_40px_rgba(0,0,0,0.5)]
                        ${isSidebarMobileOpen ? 'translate-x-0 w-64 px-5' : '-translate-x-full lg:translate-x-0 lg:w-[68px] lg:hover:w-64 lg:px-2.5 lg:hover:px-5 w-64 px-5'}
                    `}>

                        <div className="lg:hidden absolute top-6 right-6">
                            <button
                                onClick={() => setIsSidebarMobileOpen(false)}
                                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <Link href="/" className="flex items-center gap-3 mb-10 group cursor-pointer px-1">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transition-transform shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-105">
                                <Zap className="text-white w-4 h-4" fill="currentColor" />
                            </div>
                            <span className="font-bold text-lg tracking-tighter uppercase whitespace-nowrap text-white flex items-center gap-1 group-hover:text-accent transition-colors">
                                RELAY
                            </span>
                        </Link>

                        <div id="env-switcher" className="mb-6 px-1 relative z-[75]">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1">ENVIRONMENT</h4>

                            <div
                                onClick={() => setIsEnvOpen(!isEnvOpen)}
                                className={`py-2.5 px-3 flex items-center justify-between gap-3 border ${isEnvOpen ? 'border-white/20 bg-white/[0.05]' : 'border-white/5 bg-white/[0.02]'} rounded-xl cursor-pointer hover:bg-white/[0.05] transition-all duration-200`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-7 h-7 rounded-[8px] ${envMode === 'Development' ? 'bg-violet-500/10 border-violet-500/20' : 'bg-accent/10 border-accent/20'} flex items-center justify-center shrink-0 border`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${envMode === 'Development' ? 'bg-violet-400' : 'bg-accent animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-[11px] font-bold text-white truncate max-w-[80px] uppercase tracking-widest">
                                            {envMode}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isEnvOpen ? 'rotate-180 text-white' : ''} opacity-100 lg:opacity-0 lg:group-hover:opacity-100`} />
                            </div>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isEnvOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-[#020408] border border-white/10 rounded-xl shadow-2xl z-[80]"
                                    >
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 py-2 border-b border-white/5 mb-1">Switch Environment</div>
                                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                                            <button
                                                onClick={() => {
                                                    setEnvMode('Development');
                                                    setIsEnvOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${envMode === 'Development' ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-md ${envMode === 'Development' ? 'bg-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-white/5'} flex items-center justify-center shrink-0`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${envMode === 'Development' ? 'bg-violet-400' : 'bg-[#1a1c20]'}`} />
                                                </div>
                                                <div className="flex flex-col items-start min-w-0 flex-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${envMode === 'Development' ? 'text-white' : 'text-slate-400'}`}>
                                                        Development
                                                    </span>
                                                </div>
                                                {envMode === 'Development' && <Check className="w-3 h-3 text-violet-400 shrink-0" />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEnvMode('Production');
                                                    setIsEnvOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${envMode === 'Production' ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-md ${envMode === 'Production' ? 'bg-accent/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-white/5'} flex items-center justify-center shrink-0`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${envMode === 'Production' ? 'bg-accent' : 'bg-[#1a1c20]'}`} />
                                                </div>
                                                <div className="flex flex-col items-start min-w-0 flex-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${envMode === 'Production' ? 'text-white' : 'text-slate-400'}`}>
                                                        Production
                                                    </span>
                                                </div>
                                                {envMode === 'Production' && <Check className="w-3 h-3 text-accent shrink-0" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div id="workspace-switcher" className="mb-6 px-1 relative z-[65]">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1">WORKSPACES</h4>
                            <div
                                onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                                className={`py-2.5 px-3 flex items-center justify-between gap-3 border ${isWorkspaceOpen ? 'border-white/20 bg-white/[0.05]' : 'border-white/5 bg-white/[0.02]'} rounded-xl cursor-pointer hover:bg-white/[0.05] transition-all duration-200`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-[8px] bg-white/5 flex items-center justify-center text-[9px] font-black text-white border border-white/10 shrink-0 overflow-hidden relative">
                                        {(() => {
                                            const activeWs = workspaces.find((w: any) => w.id === activeWorkspaceId);
                                            const avatar = activeWs?.avatar_url || (activeWs?.isPersonal ? user?.avatar_url : null);
                                            if (avatar) return <img src={avatar} alt="Profile" className="w-full h-full object-cover" />;
                                            return getInitials(activeWs?.name?.replace("'s Workspace", '') || user?.name || 'W', activeWs?.name || user?.full_name);
                                        })()}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 w-[120px]">
                                        <p className="text-[11px] font-bold text-white truncate w-full">
                                            {workspaces.find((w: any) => w.id === activeWorkspaceId)?.name?.replace("'s Workspace", '') || user?.name || 'Developer'}
                                        </p>
                                        <div className="bg-accent/20 px-1.5 py-[1px] rounded-[4px] text-[8px] font-black text-accent uppercase tracking-widest mt-0.5">
                                            {workspaces.find((w: any) => w.id === activeWorkspaceId)?.role || 'OWNER'}
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isWorkspaceOpen ? 'rotate-180 text-white' : ''} opacity-100 lg:opacity-0 lg:group-hover:opacity-100`} />
                            </div>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isWorkspaceOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-[#020408] border border-white/10 rounded-xl shadow-2xl z-[70]"
                                    >
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 py-2 border-b border-white/5 mb-1">Switch Workspace</div>
                                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                                            {workspaces.map((workspace: any) => (
                                                <button
                                                    key={workspace.id}
                                                    onClick={() => {
                                                        setActiveWorkspaceId(workspace.id);
                                                        setIsWorkspaceOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeWorkspaceId === workspace.id ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
                                                >
                                                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[8px] font-bold text-white shrink-0 overflow-hidden">
                                                        {workspace.avatar_url ? (
                                                            <img src={workspace.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : getInitials(workspace.name?.replace("'s Workspace", ''))}
                                                    </div>
                                                    <div className="flex flex-col items-start truncate min-w-0 flex-1">
                                                        <span className={`text-[11px] font-bold truncate max-w-[100px] ${activeWorkspaceId === workspace.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                                            {workspace.name?.replace("'s Workspace", '')}
                                                        </span>
                                                    </div>
                                                    {activeWorkspaceId === workspace.id && <Check className="w-3 h-3 text-accent shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto scrollbar-hide pr-2">
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 mt-2 mb-2">Workspace</div>
                            {[
                                { id: "overview", icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: "API KEYS" },
                                { id: "status", icon: <Activity className="w-3.5 h-3.5" />, label: "NETWORK STATUS" },
                                { id: "inbox", icon: <MessageSquare className="w-3.5 h-3.5" />, label: "INBOX" },
                                { id: "integration", icon: <Terminal className="w-3.5 h-3.5" />, label: "API & SDKs" },
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
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${activeTab === item.id
                                        ? "bg-white/[0.05] text-white"
                                        : item.disabled
                                            ? "text-slate-800 cursor-not-allowed opacity-40"
                                            : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
                                        }`}
                                >
                                    <div className={`${activeTab === item.id ? "text-accent" : item.disabled ? "text-slate-900" : "text-slate-600 group-hover:text-slate-400"} transition-colors`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                        {item.label}
                                    </span>
                                    {activeTab === item.id && (
                                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-full" />
                                    )}
                                </button>
                            ))}
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 mt-6 mb-2">Directory</div>
                            {[
                                { id: "subscribers", icon: <Users className="w-3.5 h-3.5" />, label: "RECIPIENTS" },
                                { id: "topics", icon: <Layers className="w-3.5 h-3.5" />, label: "SEGMENTS" },
                            ].map((item: any) => (
                                <button
                                    key={item.id}
                                    disabled={item.disabled}
                                    onClick={() => {
                                        if (!item.disabled) {
                                            setActiveTab(item.id);
                                            setIsSidebarMobileOpen(false);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${activeTab === item.id
                                        ? "bg-rose-500/[0.05] text-rose-400"
                                        : item.disabled
                                            ? "text-slate-800 cursor-not-allowed opacity-40"
                                            : "text-slate-500 hover:text-rose-400/70 hover:bg-white/[0.02]"
                                        }`}
                                >
                                    <div className={`${activeTab === item.id ? "text-rose-500" : item.disabled ? "text-slate-900" : "text-slate-600 group-hover:text-rose-400/70"} transition-colors shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                        {item.label}
                                    </span>
                                    {activeTab === item.id && (
                                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-rose-500 rounded-full" />
                                    )}

                                </button>
                            ))}
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 mt-6 mb-2">Systems</div>
                            {[
                                { id: "scenarios", icon: <Network className="w-3.5 h-3.5" />, label: d.sidebar?.scenarios || "WORKFLOWS" },
                                { id: "connectors", icon: <Zap className="w-3.5 h-3.5" />, label: d.sidebar?.connectors || "WEBHOOKS" },
                                { id: "logs", icon: <BarChart3 className="w-3.5 h-3.5" />, label: "ANALYTICS" },
                                { id: "domains", icon: <Globe className="w-3.5 h-3.5" />, label: "DOMAINS" },
                                ...((user?.is_admin || user?.email?.trim().toLowerCase() === 'quiel.g538@gmail.com') ? [{ id: "admin", icon: <Shield className="w-3.5 h-3.5" />, label: "ADMIN" }] : [])
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
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${activeTab === item.id
                                        ? "bg-white/[0.05] text-white"
                                        : item.disabled
                                            ? "text-slate-800 cursor-not-allowed opacity-40"
                                            : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
                                        }`}
                                >
                                    <div className={`${activeTab === item.id ? "text-accent" : item.disabled ? "text-slate-900" : "text-slate-600 group-hover:text-slate-400"} transition-colors shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                        {item.label}
                                    </span>
                                    {activeTab === item.id && (
                                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-full" />
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Language Switcher in Sidebar */}
                        <div className="mt-8 mb-4 relative z-50">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Language</p>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="w-full flex items-center justify-between px-3 py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-sm font-medium text-slate-300 hover:text-white cursor-pointer group/lang"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="shrink-0">
                                        <img
                                            src={`https://flagcdn.com/w40/${languages.find(l => l.code === lang)?.flag || 'us'}.png`}
                                            alt={lang}
                                            className="w-5 h-auto rounded-sm object-contain"
                                        />
                                    </div>
                                    <span className="truncate opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">{languages.find(l => l.code === lang)?.name || 'English'}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 group-hover/lang:text-white transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''} opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shrink-0`} />
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

                    </aside>

                    {/* Fixed Top Global Header */}
                    <div className="fixed top-0 right-0 left-0 lg:left-[68px] peer-hover:lg:left-64 h-16 z-[60] flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ease-in-out">
                        <div className="flex items-center flex-1">
                            {/* Command Palette Target */}
                            <button onClick={() => setIsCommandPaletteOpen(true)} className="flex items-center gap-3 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-[#050505] hover:bg-white/[0.02] transition-colors text-slate-400 group">
                                <Search className="w-4 h-4 ml-0.5 group-hover:text-white transition-colors" />
                                <kbd className="flex items-center justify-center gap-0.5 font-sans min-w-[32px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400 font-medium tracking-wide">
                                    <span className="text-xs">⌘</span><span className="text-[10px]">K</span>
                                </kbd>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <AlertCircle className="w-4 h-4" />
                            </button>

                            {/* Inbox / Notifications */}
                            <RelayInbox
                                appId={activeWorkspaceId || ""}
                                subscriberId={user?.id || user?.email || ""}
                                position="top-right"
                                soundEnabled={true}
                                theme="dark"
                            />
                            <div className="relative group">
                                <button className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#050505] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] shadow-xl transition-all">
                                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-black text-white border border-white/10 shrink-0 overflow-hidden relative">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            getInitials(user?.name || user?.full_name || 'U')
                                        )}
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="absolute top-full right-0 mt-2 w-56 p-1.5 bg-[#020408] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100 flex flex-col gap-1">
                                    <div className="p-3 mb-1 border-b border-white/5 flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-white truncate">{user?.name || user?.full_name || 'Developer'}</span>
                                        <span className={`w-fit mt-1 text-[8px] px-1.5 py-0.5 rounded font-black border leading-tight tracking-widest uppercase ${getPlanStyles(user?.plan)}`}>
                                            {user?.plan || 'FREE'}
                                        </span>
                                    </div>

                                    <button onClick={() => { setActiveTab('settings'); setTimeout(() => { const event = new CustomEvent('relay_set_subtab', { detail: 'profile' }); window.dispatchEvent(event); }, 100); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
                                        <Settings className="w-3.5 h-3.5" /> Settings
                                    </button>

                                    <div className="h-px bg-white/5 my-1" />

                                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:text-white hover:bg-rose-500/20 transition-colors">
                                        <LogOut className="w-3.5 h-3.5" /> {d.nav.signOut}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 p-6 md:p-8 lg:p-12 pt-24 lg:pt-24 lg:ml-[68px] peer-hover:lg:ml-[256px] transition-all duration-300 ease-in-out overflow-y-auto scrollbar-hide h-screen w-full relative">
                        <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-3 md:gap-6 mb-6 md:mb-12 pr-6 lg:pr-10 relative z-40">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="scale-95 origin-center md:origin-left"
                            >
                                <div className="flex flex-col items-center md:items-start max-w-fit md:max-w-none mx-auto md:mx-0 text-center md:text-left">
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 mb-0.5 md:mb-1">
                                        <h1 className="text-[17px] md:text-2xl lg:text-3xl font-bold tracking-tighter text-white uppercase leading-tight">
                                            {d.welcome} {(user?.full_name?.trim() ? user.full_name.trim().split(' ')[0] : user?.name?.trim() ? user.name.trim().split(' ')[0] : 'OPERATOR')}
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
                        {activeTab === "inbox" && renderInbox()}
                        {activeTab === "topics" && renderTopics()}
                        {activeTab === "subscribers" && renderSubscribers()}
                        {(activeTab === "overview" || activeTab === "keys") && (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    {/* Message Usage Metric */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 rounded-xl bg-[#050505] border border-white/5 flex flex-col justify-between"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usage Uplink</span>
                                            <Database className="w-4 h-4 text-accent/40" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-white italic tracking-tighter">
                                                    {(envMode === 'Development' || user?.plan === 'ENTERPRISE' || (stats as any).limit > 1000000) ? "∞" : `${Math.round(((stats as any).usage / (stats as any).limit) * 100) || 0}%`}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                    {(stats as any).usage || 0} / {(envMode === 'Development' || user?.plan === 'ENTERPRISE' || (stats as any).limit > 1000000) ? "∞" : ((stats as any).limit || 100)}
                                                </span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(envMode === 'Development' || user?.plan === 'ENTERPRISE' || (stats as any).limit > 1000000) ? 0 : Math.min(((stats as any).usage / (stats as any).limit) * 100, 100)}%` }}
                                                    className="h-full bg-accent"
                                                />
                                            </div>
                                        </div>
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
                                            className="p-6 rounded-xl bg-[#050505] border border-white/5 hover:border-white/10 transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</span>
                                                <div className="opacity-40">{stat.icon}</div>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold tracking-tighter text-white">{stat.value}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* API Keys Table */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 rounded-2xl bg-[#050505] border border-white/5 p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-lg font-bold tracking-tight text-white uppercase tracking-widest">Active Protocol Keys</h3>
                                        </div>

                                        <div className="space-y-1">
                                            {apiKeys.length === 0 ? (
                                                <div className="py-20 text-center text-slate-600 border border-dashed border-white/5 rounded-xl">
                                                    <p className="text-xs font-bold uppercase tracking-widest italic opacity-50">No protocol keys discovered</p>
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
                                                        <div className="flex flex-row items-center gap-4 z-10 flex-1 min-w-0">
                                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-xs tracking-widest text-white/90 uppercase mb-1.5">{key.label}</h4>
                                                                    <div className="flex items-center gap-2">
                                                                        <code className="font-mono text-[10px] text-slate-500 tracking-wider truncate">
                                                                            {visibleKeys.has(key.id) ? key.key_hash : `${key.key_hash.substring(0, 12)}••••`}
                                                                        </code>
                                                                        <div className="flex items-center gap-1">
                                                                            <button onClick={() => toggleKeyVisibility(key.id)} className="p-1 text-slate-600 hover:text-white transition-colors" title={visibleKeys.has(key.id) ? "Hide" : "Show"}>{visibleKeys.has(key.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}</button>
                                                                            <button onClick={() => copyToClipboard(key.key_hash)} className="p-1 text-slate-600 hover:text-accent transition-colors" title="Copy"><Copy className="w-3 h-3" /></button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6 z-10 shrink-0">
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black text-white leading-none mb-1">{key.call_count}</p>
                                                                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Calls</p>
                                                                </div>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${key.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`} />
                                                            </div>
                                                            <button
                                                                onClick={() => handleRevokeKey(key.id)}
                                                                className="p-2 text-slate-700 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
                                                                title="Revoke Key"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Documentation Side Panel */}
                                    <div className="rounded-2xl bg-[#050505] border border-white/5 p-8 relative overflow-hidden h-fit">
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
                                                                <span>-X POST https://relay-notify.com/api/relay \</span>
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
                        )}

                        {activeTab === 'logs' && (
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
                                                <option className="bg-slate-900 text-white" value="slack">Slack</option>
                                                <option className="bg-slate-900 text-white" value="email">Email</option>
                                                <option className="bg-slate-900 text-white" value="sms">SMS</option>
                                                <option className="bg-slate-900 text-white" value="in-app">In-App</option>
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

                                <div className="rounded-2xl bg-[#050505] border border-white/5 overflow-hidden">
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
                                                        onClick={() => {
                                                            setSelectedLogForModal(log);
                                                            setIsLogModalOpen(true);
                                                        }}
                                                        className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                                                    >
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl ${log.platform?.includes(',') ? 'text-amber-400' :
                                                                    log.platform?.toLowerCase() === 'telegram' ? 'text-sky-400' :
                                                                        log.platform?.toLowerCase() === 'discord' ? 'text-indigo-400' :
                                                                            log.platform?.toLowerCase() === 'whatsapp' ? 'text-emerald-400' :
                                                                                log.platform?.toLowerCase() === 'slack' ? 'text-rose-400' :
                                                                                    'text-accent'
                                                                    }`}>
                                                                    {log.platform?.includes(',') ? <Share2 className="w-5 h-5" /> :
                                                                        log.platform?.toLowerCase() === 'telegram' ? <TelegramIcon /> :
                                                                            log.platform?.toLowerCase() === 'discord' ? <DiscordIcon /> :
                                                                                log.platform?.toLowerCase() === 'whatsapp' ? <WhatsAppIcon /> :
                                                                                    log.platform?.toLowerCase() === 'slack' ? <SlackIcon /> :
                                                                                        <MessageSquare className="w-5 h-5" />}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RELAYED</span>
                                                                        <span className="font-bold text-white/90 capitalize text-sm">{log.platform}</span>
                                                                        {(log.category || log.payload?.category) && (
                                                                            <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase tracking-tighter">
                                                                                {log.category || log.payload?.category}
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
                                                                                <div className="p-4 rounded-xl border border-accent/20 bg-[#080808]">
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
                                                        <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl ${log.platform?.includes(',') ? 'text-amber-400' :
                                                            log.platform?.toLowerCase() === 'telegram' ? 'text-sky-400' :
                                                                log.platform?.toLowerCase() === 'discord' ? 'text-indigo-400' :
                                                                    log.platform?.toLowerCase() === 'whatsapp' ? 'text-emerald-400' :
                                                                        log.platform?.toLowerCase() === 'slack' ? 'text-rose-400' :
                                                                            'text-accent'
                                                            }`}>
                                                            {log.platform?.includes(',') ? <Share2 className="w-5 h-5" /> :
                                                                log.platform?.toLowerCase() === 'telegram' ? <TelegramIcon /> :
                                                                    log.platform?.toLowerCase() === 'discord' ? <DiscordIcon /> :
                                                                        log.platform?.toLowerCase() === 'whatsapp' ? <WhatsAppIcon /> :
                                                                            log.platform?.toLowerCase() === 'slack' ? <SlackIcon /> :
                                                                                <MessageSquare className="w-5 h-5" />}
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
                                <div className="p-10 rounded-2xl bg-[#050505] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
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
                        )}

                        {activeTab === 'status' && renderStatus()}
                        {activeTab === 'templates' && renderTemplates()}
                        {activeTab === 'integration' && renderIntegration()}
                        {activeTab === 'test' && renderTestLab()}
                        {activeTab === 'connectors' && renderConnectors()}

                        {activeTab === 'webhooks' && (
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

                                <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#050505]">
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
                        )}

                        {activeTab === 'domains' && (
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

                                <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#050505]">
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
                                                            <div className="flex flex-col gap-2">
                                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] w-fit ${domain.status === 'verified'
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                                                    }`}>
                                                                    {domain.status}
                                                                </span>
                                                                {domain.status !== 'verified' && (
                                                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                                                                        <div className="px-2 py-1 rounded bg-black/40 border border-white/5 font-mono text-[8px] text-slate-400">
                                                                            TXT relay-verify={domain.verification_token}
                                                                        </div>
                                                                        <button
                                                                            onClick={async () => {
                                                                                try {
                                                                                    const res = await fetch(`/api/domains/verify${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                                                                                        method: 'POST',
                                                                                        headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({ id: domain.id })
                                                                                    });
                                                                                    const data = await res.json();
                                                                                    if (data.success) {
                                                                                        setErrorMessage("Domain verified successfully!");
                                                                                        fetchDomains();
                                                                                    } else {
                                                                                        setErrorMessage(data.message || "Verification failed");
                                                                                    }
                                                                                    setTimeout(() => setErrorMessage(null), 3000);
                                                                                } catch (e) {
                                                                                    setErrorMessage("Network error during verification");
                                                                                }
                                                                            }}
                                                                            className="text-[8px] font-black text-accent hover:underline uppercase tracking-widest cursor-pointer"
                                                                        >
                                                                            Verify Now
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
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
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-5xl mx-auto space-y-10 py-10 px-4 md:px-0">
                                {/* Settings Sub-Tabs */}
                                <div className="flex items-center gap-8 border-b border-white/5 mb-2 overflow-x-auto scrollbar-hide">
                                    {[
                                        { id: 'account', label: 'Identity' },
                                        { id: 'organization', label: 'Workspace' },
                                        { id: 'team', label: 'Co-Pilots' },
                                        { id: 'usage', label: 'Quotas & Billing' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSettingsSubTab(tab.id as any)}
                                            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap cursor-pointer ${settingsSubTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {tab.label}
                                            {settingsSubTab === tab.id && (
                                                <motion.div
                                                    layoutId="settingsActiveTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_var(--accent-glow)]"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {(settingsSubTab === 'account' ?
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                                        {/* Profile Info Header */}
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white tracking-tight">Identity & Security</h3>
                                            <p className="text-xs text-slate-500 font-medium">Manage your personal protocol credentials and security profile.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                            <div className="space-y-1 mt-1">
                                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Avatar Profile</h4>
                                            </div>
                                            <div className="md:col-span-2 flex items-center gap-6">
                                                <div
                                                    onClick={handleAvatarClick}
                                                    className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white border border-white/5 shrink-0 cursor-pointer hover:border-accent/40 transition-all overflow-hidden relative group/fullavatar"
                                                >
                                                    {user?.avatar_url ? (
                                                        <div className="relative w-full h-full group/avatarwrap">
                                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                            <div
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    const { error } = await supabase.from('accounts').update({ avatar_url: null }).eq('id', user.id);
                                                                    if (!error) setUser({ ...user, avatar_url: null });
                                                                }}
                                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/avatarwrap:opacity-100 transition-opacity hover:bg-rose-600 z-50 cursor-pointer"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </div>
                                                        </div>
                                                    ) : getInitials(user?.name, user?.full_name)}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/fullavatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 pointer-events-none">
                                                        <Upload className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white mb-1">{tempUser?.full_name || user?.full_name || user?.name || "Developer"}</h3>
                                                    <button
                                                        onClick={() => {
                                                            setTempUser({ ...user }); // Initialize with current user data
                                                            setIsEditingProfile(true);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                                                    >
                                                        EDIT PROFILE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        {/* Email Addresses */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                            <div className="space-y-1 mt-1">
                                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Email Routing</h4>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                {userEmails.map((emailObj) => (
                                                    <div key={emailObj.email} className="flex flex-col gap-2 group">
                                                        <div className="flex items-center justify-between py-2 px-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm text-white font-bold">{emailObj.email}</span>
                                                                {emailObj.isPrimary && (
                                                                    <span className="px-1.5 py-0.5 rounded bg-accent/20 text-[8px] font-black uppercase text-accent tracking-tighter border border-accent/20">Primary</span>
                                                                )}
                                                            </div>
                                                            {!emailObj.isPrimary && (
                                                                <button
                                                                    onClick={() => handleDeleteEmail(emailObj)}
                                                                    className="text-slate-600 hover:text-rose-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    onClick={() => setIsAddingEmail(true)}
                                                    className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest pl-2 cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> ADD ROUTING EMAIL
                                                </button>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        {/* Connected Accounts */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                            <div className="space-y-1 mt-1">
                                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Connected accounts</h4>
                                            </div>
                                            <div className="md:col-span-2 space-y-6">
                                                {connectedServices.map((service) => (
                                                    <div key={service.name} className="flex items-center justify-between py-2 group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-white/5">
                                                                {service.name === 'Google' ? <GoogleIcon className="w-4 h-4" /> : <GitHubLogo className="w-4 h-4" />}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-white font-bold">{service.name}</span>
                                                                    <span className="text-[10px] text-slate-500 font-medium">{service.email}</span>
                                                                </div>
                                                                <span className="text-[8px] font-black text-accent uppercase tracking-widest">CONNECTED</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDisconnectService(service);
                                                            }}
                                                            className="text-slate-600 hover:text-rose-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                                            title={`Disconnect ${service.name}`}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setIsConnectingAccount(true)}
                                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                                                >
                                                    <Plus className="w-3 h-3" /> CONNECT ACCOUNT
                                                </button>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        {/* Security Section */}
                                        <div className="space-y-2 py-4">
                                            <h3 className="text-lg font-bold text-white tracking-tight">Security Protocol</h3>
                                            <p className="text-xs text-slate-500 font-medium">Protect your identity with multi-layer authentication and session control.</p>
                                        </div>

                                        <div className="space-y-12">
                                            {/* Password */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                <div className="space-y-1 mt-1">
                                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Password</h4>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <button
                                                        onClick={() => setIsChangingPassword(true)}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                                                    >
                                                        UPDATE PASSWORD
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 2FA */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                <div className="space-y-1 mt-1">
                                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">2-Factor Security</h4>
                                                </div>
                                                <div className="md:col-span-2 space-y-6">
                                                    <div className="flex items-center justify-between group py-2">
                                                        <div className="flex items-center gap-4">
                                                            <Shield className={`w-5 h-5 ${user?.is_2fa_enabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-white font-bold">Authenticator App</span>
                                                                    {user?.is_2fa_enabled && (
                                                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[8px] font-black uppercase text-emerald-500 tracking-tighter border border-emerald-500/20">Active</span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[10px] text-slate-500">Google Authenticator, 1Password, or Authy.</span>
                                                            </div>
                                                        </div>
                                                        {user?.is_2fa_enabled ? (
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm("Disable 2FA? This will lower your protocol security.")) {
                                                                        const res = await fetch(`/api/auth/2fa/disable${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, { method: 'POST' });
                                                                        if (res.ok) { fetchUserData(); }
                                                                    }
                                                                }}
                                                                className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest cursor-pointer opacity-0 group-hover:opacity-100 transition-all font-black"
                                                            >
                                                                DISABLE
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const res = await fetch(`/api/auth/2fa/generate${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, { method: 'POST' });
                                                                        const data = await res.json();
                                                                        if (data.success) {
                                                                            setTotpSecret(data.secret);
                                                                            setOtpAuthUri(data.uri);
                                                                            setAuthenticatorStep(1);
                                                                            setIsSettingUpAuthenticator(true);
                                                                        }
                                                                    } catch (e) { }
                                                                }}
                                                                className="px-3 py-1.5 rounded-lg bg-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all"
                                                            >
                                                                CONFIGURE 2FA
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Danger Zone */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                <div className="space-y-1 mt-1">
                                                    <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Danger Zone</h4>
                                                    <p className="text-[10px] text-slate-500 max-w-[160px]">Irreversible actions for your account.</p>
                                                </div>
                                                <div className="md:col-span-2 flex flex-col items-start gap-4">
                                                    <div className="space-y-2">
                                                        <h5 className="text-xs font-bold text-white uppercase tracking-tight">Delete account</h5>
                                                        <p className="text-[10px] text-slate-500 leading-relaxed">Once you delete your account, there is no going back. Please be certain.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowDeleteAccountModal(true)}
                                                        className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
                                                    >
                                                        DESTROY ACCOUNT
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : settingsSubTab === 'organization' ? (() => {
                                        const currentWorkspace = workspaces.find((w: any) => w.id === activeWorkspaceId);
                                        const isOwner = currentWorkspace ? currentWorkspace.role === 'OWNER' : true;
                                        return (
                                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                                                {/* Workspace Info */}
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold text-white tracking-tight">Workspace Protocol</h3>
                                                    <p className="text-xs text-slate-500 font-medium">Configure global settings for this node and linked identities.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                    <div className="space-y-1 mt-1">
                                                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Logo Identification</h4>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-6">
                                                        <div className="flex items-start gap-6">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div
                                                                    onClick={() => whiteLabelLogoInputRef.current?.click()}
                                                                    className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 shrink-0 cursor-pointer hover:border-accent/40 transition-all overflow-hidden relative group/logo"
                                                                >
                                                                    {whiteLabel.corporateLogo ? (
                                                                        <div className="relative w-full h-full group/logowrap">
                                                                            <img src={whiteLabel.corporateLogo} alt="Logo" className="w-full h-full object-cover" />
                                                                            <div
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setWhiteLabel({ ...whiteLabel, corporateLogo: "" });
                                                                                }}
                                                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/logowrap:opacity-100 transition-opacity hover:bg-rose-600 z-50 cursor-pointer"
                                                                            >
                                                                                <X className="w-3 h-3" />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent">
                                                                            <Store className="w-6 h-6" />
                                                                        </div>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 pointer-events-none">
                                                                        <Upload className="w-4 h-4 text-white" />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => whiteLabelLogoInputRef.current?.click()}
                                                                    className="text-[9px] font-black text-accent uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                                                                >
                                                                    UPLOAD IMAGE
                                                                </button>
                                                            </div>
                                                            <div className="flex-1 space-y-4">
                                                                <div>
                                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 shadow-sm block px-1">Workspace Name</label>
                                                                    <input
                                                                        type="text"
                                                                        disabled={!isOwner}
                                                                        value={!isOwner ? (currentWorkspace?.name || whiteLabel.corporateName) : whiteLabel.corporateName}
                                                                        onChange={(e) => setWhiteLabel({ ...whiteLabel, corporateName: e.target.value })}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-bold focus:border-accent outline-none transition-all placeholder:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        placeholder="Relay Global"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-start pl-[88px]">
                                                            <button
                                                                onClick={() => isOwner && handleSaveProfile()}
                                                                disabled={isUploading || !isOwner}
                                                                className="px-8 py-3 bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent/80 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-20 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                                                            >
                                                                {isUploading ? 'SYNCHRONIZING...' : 'SAVE WORKSPACE'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-white/5" />

                                                {/* Domain Verification */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                    <div className="space-y-1 mt-1">
                                                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Identity Domains</h4>
                                                        <p className="text-[10px] text-slate-500 max-w-[160px]">Verify domain ownership to enable secure protocol routing.</p>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-6">
                                                        <div className="space-y-3">
                                                            {domains.length === 0 ? (
                                                                <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl">
                                                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No active domains linked to this node</p>
                                                                </div>
                                                            ) : domains.map(domain => (
                                                                <div key={domain.id} className="flex flex-col p-3.5 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-all gap-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-1.5 h-1.5 rounded-full ${domain.status === 'verified' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                                                            <span className="text-xs font-bold text-white font-mono tracking-tight">{domain.hostname}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            {domain.status === 'pending' && (
                                                                                <button onClick={() => handleCheckLiveDomain(domain.id)} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-300 rounded-md transition-colors cursor-pointer">
                                                                                    VERIFY DNS
                                                                                </button>
                                                                            )}
                                                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${domain.status === 'verified' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : 'bg-amber-500/5 text-amber-400 border-amber-500/10'}`}>
                                                                                {domain.status}
                                                                            </span>
                                                                            {isOwner && (
                                                                                <button
                                                                                    onClick={() => handleDeleteDomain(domain.id)}
                                                                                    className="text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {domain.status === 'pending' && (
                                                                        <div className="pt-3 border-t border-white/5">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">TXT Record</span>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <div className="w-16 bg-black/40 border border-white/5 rounded-lg px-3 py-2 flex items-center justify-center">
                                                                                    <span className="text-xs font-mono text-slate-400">@</span>
                                                                                </div>
                                                                                <div className="flex-1 relative">
                                                                                    <input readOnly value={`relay-verify=${domain.verification_token}`} className="w-full bg-black/40 border border-white/5 rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-slate-300 outline-none" />
                                                                                    <button onClick={() => { navigator.clipboard.writeText(`relay-verify=${domain.verification_token}`); setNotification({ message: 'Token copied!', type: 'success' }); }} className="absolute right-2 top-1.5 p-1 text-slate-500 hover:text-white transition-colors cursor-pointer">
                                                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-[9px] text-slate-500 mt-3 leading-relaxed">Publish this TXT record in your DNS provider (e.g., Cloudflare, GoDaddy). It may take up to 24 hours to propagate globally. Once published, click 'Verify DNS'.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => setIsDomainModalOpen(true)}
                                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                                                        >
                                                            <Plus className="w-3 h-3" /> VERIFY NEW DOMAIN
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-white/5" />

                                                {/* Danger Zone */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                    <div className="space-y-1 mt-1">
                                                        <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Danger Zone</h4>
                                                        <p className="text-[10px] text-slate-500 max-w-[160px]">Irreversible actions for this workspace and protocol data.</p>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-8">
                                                        <div className="flex items-center justify-between group py-2">
                                                            <div className="flex flex-col">
                                                                <h5 className="text-sm font-bold text-white">Leave Workspace</h5>
                                                                <span className="text-[10px] text-slate-500">Disconnect your identity from this node.</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setShowLeaveWorkspaceModal(true)}
                                                                className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all cursor-pointer"
                                                            >
                                                                LEAVE
                                                            </button>
                                                        </div>
                                                        <div className="h-px bg-white/5" />
                                                        <div className="flex items-center justify-between group py-2">
                                                            <div className="flex flex-col">
                                                                <h5 className="text-sm font-bold text-amber-500">Purge Data</h5>
                                                                <span className="text-[10px] text-slate-500">Erase all telemetry, webhooks, and scenarios. (Keeps workspace intact)</span>
                                                            </div>
                                                            <button
                                                                onClick={() => isOwner && setShowPurgeDataModal(true)}
                                                                disabled={!isOwner}
                                                                className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 hover:bg-amber-500 hover:text-white transition-all uppercase tracking-widest cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                                                            >
                                                                PURGE
                                                            </button>
                                                        </div>
                                                        {showPurgeDataModal && (
                                                            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                                                                <div className="w-full max-w-md bg-[#0f0f13] border border-rose-500/20 rounded-[24px] p-8 shadow-2xl relative overflow-hidden text-left">
                                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400" />
                                                                    <div className="mb-6">
                                                                        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                                                                            <Trash2 className="w-6 h-6 text-rose-500" />
                                                                        </div>
                                                                        <h3 className="text-xl font-bold text-white mb-2">Purge Workspace Data</h3>
                                                                        <p className="text-[10px] text-slate-500 leading-relaxed">This action will permanently purge all telemetry, inboxes, webhooks, logs, and scenarios. This workspace will remain, but all its stored interactions will vanish immediately.</p>
                                                                    </div>
                                                                    <div className="flex gap-4 w-full">
                                                                        <button
                                                                            disabled={isPurgingData}
                                                                            onClick={() => setShowPurgeDataModal(false)}
                                                                            className="flex-1 px-4 py-3 bg-white/5 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                                                                        >
                                                                            Abort
                                                                        </button>
                                                                        <button
                                                                            disabled={isPurgingData}
                                                                            onClick={async () => {
                                                                                setIsPurgingData(true);
                                                                                try {
                                                                                    const r = await fetch('/api/workspace/purge', { method: 'POST', body: JSON.stringify({ workspaceId: activeWorkspaceId }) });
                                                                                    const rd = await r.json();
                                                                                    if (r.ok) {
                                                                                        setNotification({ message: 'Telemetry successfully purged.', type: 'success' });
                                                                                        setShowPurgeDataModal(false);
                                                                                    } else { setNotification({ message: rd.error || 'Failed to purge.', type: 'error' }); }
                                                                                } catch (e) { setNotification({ message: 'Network error.', type: 'error' }); }
                                                                                finally { setIsPurgingData(false); }
                                                                            }}
                                                                            className="flex-1 px-4 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                                                                        >
                                                                            {isPurgingData ? 'PURGING...' : 'Confirm Purge'}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="h-px bg-white/5" />
                                                        <div className="flex items-center justify-between group py-2">
                                                            <div className="flex flex-col">
                                                                <h5 className="text-sm font-bold text-rose-500">Destroy Workspace</h5>
                                                                <span className="text-[10px] text-slate-500">Permanently purge all data, scenarios, and domains.</span>
                                                            </div>
                                                            <button
                                                                onClick={() => isOwner && setShowDeleteWorkspaceModal(true)}
                                                                disabled={!isOwner}
                                                                className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                                                            >
                                                                DESTROY
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-white/5" />
                                            </div>
                                        );
                                    })()
                                        : settingsSubTab === 'usage' ?
                                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
                                                {/* Usage Header */}
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold text-white tracking-tight">Plan & Quota</h3>
                                                    <p className="text-xs text-slate-500 font-medium tracking-wide">Resource consumption and active subscription tier.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                    <div className="space-y-1 mt-1">
                                                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Protocol Usage</h4>
                                                        <p className="text-[10px] text-slate-500 max-w-[160px]">Real-time consumption for the current billing cycle.</p>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-6">
                                                        <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-8">
                                                            {[
                                                                { label: 'Platform Notifications', current: (stats as any).usage || 0, max: user?.plan === 'ENTERPRISE' ? 'Unlimited' : user?.plan === 'PRO' ? 200000 : user?.plan === 'STARTER' ? 50000 : 10000, color: 'bg-accent' },
                                                                { label: 'Active Workflows', current: scenarios.filter((s: any) => s.is_active).length, max: user?.plan === 'ENTERPRISE' ? 'Unlimited' : 20, color: 'bg-indigo-500' },
                                                                { label: 'Co-Pilot Seats', current: adminAccounts.length || 1, max: user?.plan === 'ENTERPRISE' ? 'Unlimited' : 3, color: 'bg-emerald-500' }
                                                            ].map((stat) => (
                                                                <div key={stat.label} className="space-y-2">
                                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                                        <span className="text-slate-500">{stat.label}</span>
                                                                        <span className="text-white">{stat.current.toLocaleString()} <span className="text-slate-600">/ {stat.max === 'Unlimited' ? '∞' : stat.max.toLocaleString()}</span></span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full ${stat.color} transition-all duration-1000`}
                                                                            style={{ width: `${stat.max === 'Unlimited' ? 100 : (stat.current / (stat.max as number)) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-white/5" />

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
                                                    <div className="space-y-1 mt-1">
                                                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Subscription Tier</h4>
                                                        <p className="text-[10px] text-slate-500 max-w-[160px]">Select the capacity that perfectly fits your project.</p>

                                                        <div className="mt-6 flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/5 w-fit">
                                                                <button onClick={() => setIsYearly(false)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isYearly ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Monthly</button>
                                                                <button onClick={() => setIsYearly(true)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${isYearly ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Yearly <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded">-20%</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                            {/* FREE PLAN */}
                                                            <div className="p-6 rounded-[24px] bg-black/40 border-[2px] border-white/5 space-y-6 flex flex-col relative overflow-hidden group">
                                                                <div className="space-y-2">
                                                                    <h5 className="text-sm font-black text-white uppercase tracking-wider">Free Forever</h5>
                                                                    <div className="flex items-end gap-1">
                                                                        <span className="text-2xl font-black text-white">$0</span>
                                                                        <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase">/ {isYearly ? 'YEAR' : 'MONTH'}</span>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Standard baseline for personal nodes.</p>
                                                                </div>
                                                                <div className="flex-1 space-y-4">
                                                                    <div className="space-y-3">
                                                                        {[
                                                                            '10k Transmissions / mo',
                                                                            '2 Co-Pilot Seats max',
                                                                            '3 Days Data Retention',
                                                                            'Standard Relay Branding'
                                                                        ].map(f => (
                                                                            <div key={f} className="flex items-start gap-2">
                                                                                <Check className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
                                                                                <span className="text-[10px] text-slate-400 font-medium leading-tight">{f}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="pt-4 border-t border-white/5">
                                                                    {(!user?.plan || user?.plan === 'FREE') ? (
                                                                        <button disabled className="w-full py-3 rounded-xl bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Current Plan</button>
                                                                    ) : (
                                                                        <button disabled className="w-full py-3 rounded-xl bg-white/5 text-slate-600 opacity-50 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Included</button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* STARTER PLAN */}
                                                            <div className="p-6 rounded-[24px] bg-accent/[0.02] border-[2px] border-accent relative space-y-6 flex flex-col">
                                                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.5)]">Recommended</div>
                                                                <div className="space-y-2 flex-shrink-0">
                                                                    <h5 className="text-sm font-black text-white uppercase tracking-wider text-accent">Starter</h5>
                                                                    <div className="flex items-end gap-1">
                                                                        <span className="text-2xl font-black text-white">{isYearly ? '$192' : '$20'}</span>
                                                                        <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase">/ {isYearly ? 'YEAR' : 'MONTH'}</span>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Enhanced delivery for serious projects.</p>
                                                                </div>
                                                                <div className="flex-1 space-y-4">
                                                                    <div className="space-y-3">
                                                                        {[
                                                                            '35,000 Transmissions / mo',
                                                                            '3 Co-Pilot Seats max',
                                                                            'White-Label (No Branding)',
                                                                            'Email Priority Support'
                                                                        ].map(f => (
                                                                            <div key={f} className="flex items-start gap-2">
                                                                                <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                                                                                <span className="text-[10px] text-slate-300 font-medium leading-tight">{f}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="pt-4 border-t border-accent/20">
                                                                    {user?.plan === 'STARTER' ? (
                                                                        <button disabled className="w-full py-3 rounded-xl bg-accent text-white opacity-50 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Current Plan</button>
                                                                    ) : (user?.plan === 'PRO' || user?.plan === 'ENTERPRISE') ? (
                                                                        <button disabled className="w-full py-3 rounded-xl bg-white/5 text-slate-600 opacity-50 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Included</button>
                                                                    ) : (
                                                                        <button onClick={() => router.push('/pricing')} className="w-full py-3 rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">Upgrade Plan</button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* PRO PLAN */}
                                                            <div className="p-6 rounded-[24px] bg-slate-900 border-[2px] border-white/10 space-y-6 flex flex-col relative">
                                                                <div className="space-y-2">
                                                                    <h5 className="text-sm font-black text-white uppercase tracking-wider">Pro</h5>
                                                                    <div className="flex items-end gap-1">
                                                                        <span className="text-2xl font-black text-white">{isYearly ? '$960' : '$100'}</span>
                                                                        <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase">/ {isYearly ? 'YEAR' : 'MONTH'}</span>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Uncapped potential for scale operations.</p>
                                                                </div>
                                                                <div className="flex-1 space-y-4">
                                                                    <div className="space-y-3">
                                                                        {[
                                                                            '200,000 Transmissions / mo',
                                                                            'Unlimited Co-Pilot Seats',
                                                                            '90 Days Data Retention',
                                                                            'Role-Based Access (RBAC)',
                                                                            'Telegram & WhatsApp Support'
                                                                        ].map(f => (
                                                                            <div key={f} className="flex items-start gap-2">
                                                                                <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                                                                <span className="text-[10px] text-slate-400 font-medium leading-tight">{f}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="pt-4 border-t border-white/10">
                                                                    {user?.plan === 'PRO' ? (
                                                                        <button disabled className="w-full py-3 rounded-xl bg-white text-black opacity-50 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Current Plan</button>
                                                                    ) : user?.plan === 'ENTERPRISE' ? (
                                                                        <button disabled className="w-full py-3 rounded-xl bg-white/5 text-slate-600 opacity-50 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Included</button>
                                                                    ) : (
                                                                        <button onClick={() => router.push('/pricing')} className="w-full py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">Upgrade Plan</button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Enterprise Callout */}
                                                        <div className="mt-6 p-6 rounded-[24px] bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                                            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
                                                            <div className="space-y-1 relative z-10 md:pl-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h4 className="text-[12px] font-black text-emerald-400 uppercase tracking-widest">Enterprise Class</h4>
                                                                    {user?.plan === 'ENTERPRISE' ? (
                                                                        <span className="px-1.5 py-0.5 rounded border border-emerald-500 text-[8px] font-black bg-emerald-500 text-white uppercase shadow-[0_0_10px_rgba(16,185,129,0.5)]">Current Plan</span>
                                                                    ) : (
                                                                        <span className="px-1.5 py-0.5 rounded border border-emerald-500/30 text-[8px] font-black text-emerald-500 uppercase">Custom</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-[10px] text-slate-400 max-w-sm">Infinite scaling, SAML/SSO integrations, GDPR DPAs, and dedicated VIP Channels for Enterprise Nodes.</p>
                                                            </div>
                                                            {user?.plan === 'ENTERPRISE' ? (
                                                                <button onClick={() => window.open('https://wa.me/543425502817', '_blank')} className="shrink-0 px-6 py-3 rounded-xl bg-emerald-500 text-white border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">Contact Account Manager</button>
                                                            ) : (
                                                                <button onClick={() => window.open('https://wa.me/543425502817', '_blank')} className="shrink-0 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Contact Sales</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : settingsSubTab === 'team' ?
                                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
                                                    {(!user?.plan || user?.plan === 'FREE' || user?.plan === 'STARTER') && (
                                                        <div className="py-3 px-4 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 pl-5 relative">
                                                            <div className="absolute left-0 top-3 bottom-3 w-1 bg-slate-500 rounded-r-sm" />
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm text-slate-400">
                                                                    <span className="font-bold text-slate-300">Protocol Tip:</span> Unlock granular access protocols and expand your crew capacity with a Pro subscription.
                                                                </p>
                                                            </div>
                                                            <Link href="/pricing" className="text-sm font-medium text-rose-500 hover:text-rose-400 transition-colors">
                                                                Upgrade to Pro
                                                            </Link>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-6 border-b border-white/5">
                                                        <button
                                                            onClick={() => setTeamTab('members')}
                                                            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${teamTab === 'members' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                                        >
                                                            Crew <span className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">{teamMembers.length}</span>
                                                            {teamTab === 'members' && (
                                                                <motion.div layoutId="teamActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => setTeamTab('invitations')}
                                                            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${teamTab === 'invitations' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                                        >
                                                            Transmissions <span className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">{teamInvitations.length + incomingInvitations.length}</span>
                                                            {teamTab === 'invitations' && (
                                                                <motion.div layoutId="teamActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => setTeamTab('requests')}
                                                            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${teamTab === 'requests' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                                        >
                                                            Uplink Requests <span className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">{teamRequests.length}</span>
                                                            {teamTab === 'requests' && (
                                                                <motion.div layoutId="teamActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {teamTab === 'members' && (
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="relative flex-1 max-w-md">
                                                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                                        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1111.15 3.6a7.5 7.5 0 015.5 13.05z" /></svg>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search"
                                                                        className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-white/30 transition-all placeholder:text-slate-500"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        const count = teamMembers.length;
                                                                        const plan = user?.plan || 'FREE';
                                                                        if ((plan === 'FREE' || plan === 'STARTER') && count >= 3) {
                                                                            setNotification({ message: 'Capacity Limit Exceeded: Free/Starter plans are limited to 3 Co-Pilots. Please upgrade to Pro.', type: 'error' });
                                                                            return;
                                                                        }
                                                                        setIsInviteModalOpen(!isInviteModalOpen);
                                                                    }}
                                                                    className="px-5 py-2 bg-slate-800 text-white font-medium text-sm rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
                                                                >
                                                                    Invite
                                                                </button>
                                                            </div>

                                                            {isInviteModalOpen && (
                                                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                                                    <textarea
                                                                        value={inviteEmails}
                                                                        onChange={(e) => setInviteEmails(e.target.value)}
                                                                        placeholder="example@email.com, example2@email.com"
                                                                        className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white resize-none focus:outline-none focus:border-accent transition-all"
                                                                    />
                                                                    <div className="flex justify-between items-center w-full">
                                                                        <button onClick={() => { navigator.clipboard.writeText(`https://relay-notify.com/join/${activeWorkspaceId}`); setNotification({ message: 'Invite link copied to clipboard.', type: 'success' }); }} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer">
                                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                                                            Copy Invite Link
                                                                        </button>
                                                                        <div className="flex gap-3">
                                                                            <button onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer">
                                                                                Abort
                                                                            </button>
                                                                            <button
                                                                                disabled={isSendingInvites}
                                                                                onClick={async () => {
                                                                                    if (!inviteEmails.trim()) return;
                                                                                    setIsSendingInvites(true);
                                                                                    try {
                                                                                        const res = await fetch(`/api/workspace/invitations${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
                                                                                            method: 'POST',
                                                                                            body: JSON.stringify({ emails: inviteEmails })
                                                                                        });
                                                                                        const data = await res.json();
                                                                                        if (res.ok) {
                                                                                            setNotification({ message: 'Deployment successful. Transmission active.', type: 'success' });
                                                                                            setIsInviteModalOpen(false);
                                                                                            setInviteEmails("");
                                                                                            // Refresh invites here eventually
                                                                                        } else {
                                                                                            const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Signal lost. Transmission failed.');
                                                                                            setNotification({ message: errorMsg, type: 'error' });
                                                                                        }
                                                                                    } catch (e) {
                                                                                        setNotification({ message: 'Uplink failure. Please retry.', type: 'error' });
                                                                                    } finally {
                                                                                        setIsSendingInvites(false);
                                                                                    }
                                                                                }}
                                                                                className="px-5 py-2 bg-accent text-white font-bold text-xs rounded-lg hover:bg-accent/80 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer disabled:opacity-50"
                                                                            >
                                                                                {isSendingInvites ? 'SENDING...' : 'Broadcast Transmission'}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="rounded-2xl border border-white/5 bg-white/[0.01]">
                                                                <table className="w-full text-left text-sm text-slate-400">
                                                                    <thead className="border-b border-white/5 text-xs text-slate-500 font-medium">
                                                                        <tr>
                                                                            <th className="px-6 py-4">Pilot</th>
                                                                            <th className="px-6 py-4">Status</th>
                                                                            <th className="px-6 py-4">Joined</th>
                                                                            <th className="px-6 py-4 text-right">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-white/5">
                                                                        {isLoadingTeam ? (
                                                                            <tr>
                                                                                <td colSpan={4} className="px-6 py-12 text-center">
                                                                                    <div className="flex flex-col items-center gap-3">
                                                                                        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">Syncing Telemetry...</p>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ) : teamMembers.length === 0 ? (
                                                                            <tr>
                                                                                <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">No active signals detected</td>
                                                                            </tr>
                                                                        ) : teamMembers.map((member) => (
                                                                            <tr key={member.id} className="group hover:bg-white/[0.01] transition-colors">
                                                                                <td className="px-6 py-4">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
                                                                                            {member.avatar_url ? (
                                                                                                <img src={member.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                                                            ) : getInitials(member.full_name)}
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="font-bold text-white">{member.full_name}</span>
                                                                                                {member.is_me && (
                                                                                                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase text-slate-400">You</span>
                                                                                                )}
                                                                                            </div>
                                                                                            <p className="text-xs text-slate-500">{member.email}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-6 py-4">
                                                                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase text-slate-500">
                                                                                        {member.role || 'PILOT'}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="px-6 py-4 text-xs">
                                                                                    {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'N/A'}
                                                                                </td>
                                                                                <td className="px-6 py-4 text-right relative">
                                                                                    {!member.is_me && (
                                                                                        <>
                                                                                            <button onClick={() => setTeamActionMenuOpen(teamActionMenuOpen === member.user_id ? null : member.user_id)} className="text-slate-500 hover:text-white transition-colors cursor-pointer">...</button>
                                                                                            {teamActionMenuOpen === member.user_id && (
                                                                                                <div className="absolute right-6 top-10 mt-2 w-48 rounded-xl bg-[#0f0f13] border border-white/10 shadow-2xl py-2 z-[100] text-left">
                                                                                                    <button onClick={async () => {
                                                                                                        setTeamActionMenuOpen(null);
                                                                                                        try {
                                                                                                            const action = member.role === 'OWNER' ? 'demote' : 'promote';
                                                                                                            const res = await fetch('/api/workspace/members/action', { method: 'POST', body: JSON.stringify({ workspaceId: activeWorkspaceId, targetUserId: member.user_id, action }) });
                                                                                                            const data = await res.json();
                                                                                                            if (res.ok) { setNotification({ message: `Co-Pilot ${action}d.`, type: 'success' }); fetchTeamData(); }
                                                                                                            else { setNotification({ message: data.error, type: 'error' }); }
                                                                                                        } catch (e) { setNotification({ message: 'Network error.', type: 'error' }); }
                                                                                                    }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer block">
                                                                                                        {member.role === 'OWNER' ? 'Demote to PILOT' : 'Promote to OWNER'}
                                                                                                    </button>
                                                                                                    <div className="h-px bg-white/5 my-1" />
                                                                                                    <button onClick={async () => {
                                                                                                        setTeamActionMenuOpen(null);
                                                                                                        try {
                                                                                                            const res = await fetch('/api/workspace/members/action', { method: 'POST', body: JSON.stringify({ workspaceId: activeWorkspaceId, targetUserId: member.user_id, action: 'remove' }) });
                                                                                                            const data = await res.json();
                                                                                                            if (res.ok) { setNotification({ message: `Co-Pilot removed.`, type: 'success' }); fetchTeamData(); }
                                                                                                            else { setNotification({ message: data.error, type: 'error' }); }
                                                                                                        } catch (e) { setNotification({ message: 'Network error.', type: 'error' }); }
                                                                                                    }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer block">
                                                                                                        Remove Member
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {teamTab === 'invitations' && (
                                                        <div className="space-y-10">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                                    Incoming Signal Intercepts
                                                                </h4>
                                                                <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
                                                                    <table className="w-full text-left text-sm text-slate-400">
                                                                        <thead className="border-b border-white/5 text-xs text-slate-500 font-medium">
                                                                            <tr>
                                                                                <th className="px-6 py-4">Source Node</th>
                                                                                <th className="px-6 py-4">Timestamp</th>
                                                                                <th className="px-6 py-4">Status</th>
                                                                                <th className="px-6 py-4 text-right">Authorization</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-white/5">
                                                                            {incomingInvitations.length === 0 ? (
                                                                                <tr>
                                                                                    <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">No incoming signals detected</td>
                                                                                </tr>
                                                                            ) : incomingInvitations.map((invite) => (
                                                                                <tr key={invite.id} className="group hover:bg-white/[0.01] transition-colors">
                                                                                    <td className="px-6 py-4 font-bold text-white tracking-tight">
                                                                                        {invite.sender_email || `${invite.workspace_owner_id.slice(0, 8)}...`}
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-xs">{new Date(invite.created_at).toLocaleString()}</td>
                                                                                    <td className="px-6 py-4">
                                                                                        <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest ${invite.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                                                            invite.status === 'ACCEPTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                                                                'bg-slate-500/10 border-slate-500/20 text-slate-500'
                                                                                            }`}>
                                                                                            {invite.status}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                                                        {invite.status === 'PENDING' && (
                                                                                            <>
                                                                                                <button
                                                                                                    onClick={() => handleRespondInvite(invite.id, 'ACCEPT')}
                                                                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase hover:bg-emerald-600 transition-all cursor-pointer"
                                                                                                >
                                                                                                    Authorize
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() => handleRespondInvite(invite.id, 'DECLINE')}
                                                                                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all cursor-pointer"
                                                                                                >
                                                                                                    Reject
                                                                                                </button>
                                                                                            </>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center justify-between mb-6">
                                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                                                        Outgoing Satellite Broadcasts
                                                                    </h4>
                                                                    <button
                                                                        onClick={() => { setTeamTab('members'); setIsInviteModalOpen(true); }}
                                                                        className="px-4 py-1.5 bg-white text-black font-black text-[9px] rounded-lg hover:bg-slate-200 transition-colors cursor-pointer uppercase"
                                                                    >
                                                                        New Broadcast
                                                                    </button>
                                                                </div>
                                                                <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
                                                                    <table className="w-full text-left text-sm text-slate-400">
                                                                        <thead className="border-b border-white/5 text-xs text-slate-500 font-medium">
                                                                            <tr>
                                                                                <th className="px-6 py-4">Pilot</th>
                                                                                <th className="px-6 py-4">Broadcast Date</th>
                                                                                <th className="px-6 py-4">Status</th>
                                                                                <th className="px-6 py-4 text-right">Actions</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-white/5">
                                                                            {isLoadingTeam ? (
                                                                                <tr>
                                                                                    <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">Scanning frequencies...</td>
                                                                                </tr>
                                                                            ) : teamInvitations.length === 0 ? (
                                                                                <tr>
                                                                                    <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">No active broadcasts</td>
                                                                                </tr>
                                                                            ) : teamInvitations.map((invite) => (
                                                                                <tr key={invite.id} className="group hover:bg-white/[0.01] transition-colors">
                                                                                    <td className="px-6 py-4 font-bold text-white">{invite.invited_email}</td>
                                                                                    <td className="px-6 py-4 text-xs">{new Date(invite.created_at).toLocaleDateString()}</td>
                                                                                    <td className="px-6 py-4">
                                                                                        <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-[8px] font-black uppercase text-accent tracking-widest">
                                                                                            {invite.status}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-right">
                                                                                        <button
                                                                                            onClick={() => handleRespondInvite(invite.id, 'REVOKE')}
                                                                                            className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 hover:text-white transition-colors uppercase cursor-pointer"
                                                                                        >
                                                                                            Revoke Signal
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {teamTab === 'requests' && (
                                                        <div className="space-y-6">
                                                            <div className="text-center py-12 max-w-lg mx-auto">
                                                                <h4 className="text-sm font-bold text-white mb-2 flex items-center justify-center gap-2">
                                                                    <Plus className="w-4 h-4" /> Global Discovery
                                                                </h4>
                                                                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                                                    Pilots registering through matching telemetry domains will be notified of your node and can request entry.
                                                                </p>
                                                                <button
                                                                    onClick={() => { setTeamTab('members'); setIsInviteModalOpen(true); }}
                                                                    className="px-6 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-lg transition-colors border border-white/10 cursor-pointer"
                                                                >
                                                                    Initiate Invite
                                                                </button>
                                                            </div>
                                                            <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
                                                                <table className="w-full text-center text-sm text-slate-400">
                                                                    <thead className="border-b border-white/5 text-xs text-slate-500 font-medium text-left">
                                                                        <tr>
                                                                            <th className="px-6 py-4">Pilot</th>
                                                                            <th className="px-6 py-4">Request Timestamp</th>
                                                                            <th className="px-6 py-4 text-right">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-white/5">
                                                                        {isLoadingTeam ? (
                                                                            <tr>
                                                                                <td colSpan={3} className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">Monitoring entry frequencies...</td>
                                                                            </tr>
                                                                        ) : teamRequests.length === 0 ? (
                                                                            <tr>
                                                                                <td colSpan={3} className="px-6 py-12 text-center font-bold text-slate-500 text-xs uppercase tracking-widest">No entry requests detected</td>
                                                                            </tr>
                                                                        ) : teamRequests.map((req) => (
                                                                            <tr key={req.id} className="text-left group hover:bg-white/[0.01] transition-colors">
                                                                                <td className="px-6 py-4 flex items-center gap-3">
                                                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                                                        <span className="text-[10px] font-bold text-slate-500">{req.requester_email.slice(0, 2).toUpperCase()}</span>
                                                                                    </div>
                                                                                    <span className="text-white font-medium">{req.requester_email}</span>
                                                                                </td>
                                                                                <td className="px-6 py-4 text-xs">{new Date(req.created_at).toLocaleDateString()}</td>
                                                                                <td className="px-6 py-4 text-right space-x-2">
                                                                                    <button className="px-3 py-1 rounded bg-accent text-white text-[9px] font-bold hover:bg-accent/80 transition-colors uppercase">Authorize</button>
                                                                                    <button className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 hover:text-white transition-colors uppercase">Reject</button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                :
                                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-bold text-white tracking-tight">Protocol Quotas</h3>
                                                        <p className="text-xs text-slate-500 font-medium">Monitor signal usage and global delivery credits.</p>
                                                    </div>
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                                                        <Zap className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                                        <h4 className="text-lg font-bold text-white mb-2">Billing Matrix Offline</h4>
                                                        <p className="text-sm text-slate-500">Quota metrics will be available once the uplink is fully established.</p>
                                                    </div>
                                                </div>)}

                                {/* Quick Profile Tip */}
                                <div className="mt-12 flex items-center justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 tracking-wider uppercase font-medium hover:bg-white/[0.04] transition-all cursor-pointer"
                                    >
                                        <User className="w-4 h-4 text-accent" />
                                        <span>PROTOCOL OWNER: <span className="text-white font-black">{user?.full_name || user?.name || user?.email}</span></span>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {/* Change Password Modal */}
                        <AnimatePresence>
                            {
                                isChangingPassword && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsChangingPassword(false)}
                                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                            className="w-full max-w-md bg-[#080808] border border-white/5 rounded-2xl p-10 relative z-10"
                                        >
                                            <h2 className="text-3xl font-black mb-2 text-white">Update Security</h2>
                                            <p className="text-slate-500 text-sm mb-10">
                                                {passwordStep === 1
                                                    ? "Protect your protocol. Verify your identity to rotate your security credentials."
                                                    : "Identity confirmed. Establish your new secure access credentials."}
                                            </p>

                                            <div className="space-y-6">
                                                {passwordStep === 1 ? (
                                                    <div className="py-8 text-center space-y-4">
                                                        <Shield className="w-12 h-12 text-accent mx-auto animate-pulse" />
                                                        <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed">
                                                            A security code will be sent to:<br />
                                                            <span className="text-white">{user?.email}</span>
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">Verification Code</label>
                                                            <input
                                                                type="text"
                                                                maxLength={6}
                                                                value={securityCode}
                                                                onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, ''))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-xl tracking-[0.5em] text-center font-bold outline-none focus:border-accent transition-all"
                                                                placeholder="000000"
                                                            />
                                                        </div>
                                                        <div className="h-px bg-white/5" />
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
                                                    </>
                                                )}
                                            </div>

                                            {errorMessage && (
                                                <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{errorMessage}</p>
                                                </div>
                                            )}

                                            <div className="flex gap-4 mt-12">
                                                <button
                                                    onClick={() => {
                                                        setIsChangingPassword(false);
                                                        setPasswordStep(1);
                                                        setErrorMessage(null);
                                                    }}
                                                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
                                                >
                                                    CANCEL
                                                </button>
                                                <button
                                                    onClick={handleChangePassword}
                                                    disabled={isUploading}
                                                    className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-accent text-white font-black hover:shadow-[0_0_20px_var(--accent-glow)] transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    {isUploading ? "PROCESS..." : passwordStep === 1 ? "REQUEST CODE" : "UPDATE ACCESS"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >

                        {/* Edit Profile Modal */}
                        <AnimatePresence>
                            {
                                isEditingProfile && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsEditingProfile(false)}
                                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                            className="w-full max-w-md bg-[#080808] border border-white/5 rounded-2xl p-10 relative z-10"
                                        >
                                            <h2 className="text-3xl font-black mb-2 text-white italic tracking-tighter">Edit Identity</h2>
                                            <p className="text-slate-500 text-sm mb-10">Configure your public-facing protocol presence.</p>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={tempUser?.full_name || ""}
                                                        onChange={(e) => setTempUser({ ...tempUser, full_name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all"
                                                        placeholder="Full Name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">Primary Email</label>
                                                    <input
                                                        type="email"
                                                        value={tempUser?.email || ""}
                                                        onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all"
                                                        placeholder="Email"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mt-12">
                                                <button
                                                    onClick={() => setIsEditingProfile(false)}
                                                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
                                                >
                                                    CANCEL
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        await handleSaveProfile();
                                                        setIsEditingProfile(false);
                                                    }}
                                                    className="flex-1 py-4 rounded-2xl bg-accent text-white font-black hover:shadow-[0_0_20px_var(--accent-glow)] transition-all cursor-pointer"
                                                >
                                                    SAVE CHANGES
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >


                        {/* Modal - New API Key */}
                        <AnimatePresence>
                            {
                                isModalOpen && (
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
                                            className="relative w-full max-w-lg bg-[#080808] border border-white/5 rounded-2xl p-10 overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        >

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
                                )
                            }
                        </AnimatePresence >

                        {/* Modal - New Template */}
                        <AnimatePresence>
                            {
                                isTemplateModalOpen && (
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
                                            className="relative w-full max-w-lg bg-[#080808] border border-white/5 rounded-2xl p-10 overflow-hidden"
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
                                )
                            }
                        </AnimatePresence >

                        {/* Modal - New Webhook */}
                        <AnimatePresence>
                            {
                                isWebhookModalOpen && (
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
                                            className="relative w-full max-w-lg bg-[#080808] border border-white/5 rounded-2xl p-10 overflow-hidden"
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
                                )
                            }
                        </AnimatePresence >

                        {/* Modal - New Domain */}
                        <AnimatePresence>
                            {
                                isDomainModalOpen && (
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
                                            className="relative w-full max-w-lg bg-[#080808] border border-white/5 rounded-2xl p-10 overflow-hidden"
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
                                )
                            }
                        </AnimatePresence >

                        {/* Image Cropper Modal */}
                        <AnimatePresence>
                            {
                                isCropModalOpen && originalImage && (
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
                                            className="relative bg-[#080808] border border-white/5 rounded-2xl p-8 md:p-12 w-full max-w-md shadow-2xl z-10 flex flex-col items-center"
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
                                                                const res = await fetch(`/api/profile/update${activeWorkspaceId ? '?workspaceId=' + activeWorkspaceId : ''}`, {
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
                                )
                            }
                        </AnimatePresence >
                        {/* Password Verification Modal */}
                        <AnimatePresence>
                            {
                                showPasswordModal && (
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
                                            className="relative w-full max-w-md bg-[#080808] border border-white/5 rounded-2xl p-8 shadow-2xl overflow-hidden"
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
                                )
                            }
                            {
                                isLogModalOpen && selectedLogForModal && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsLogModalOpen(false)}
                                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                            className="relative w-full max-w-4xl max-h-[90vh] bg-[#080808] border border-white/5 rounded-2xl overflow-hidden flex flex-col"
                                        >
                                            {/* Header */}
                                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-accent shadow-2xl`}>
                                                        <Activity className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                                                            Log Diagnostics
                                                            <span className={`text-[9px] px-2 py-0.5 rounded border ${selectedLogForModal.status_code < 300 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                                {selectedLogForModal.status_code < 300 ? 'STABLE' : 'CRITICAL'}
                                                            </span>
                                                        </h3>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">UUID: {selectedLogForModal.id}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setIsLogModalOpen(false)}
                                                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                    {/* Left: Metadata */}
                                                    <div className="space-y-6">
                                                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Transmission Specs</h4>

                                                            <div className="flex justify-between items-center group/meta">
                                                                <span className="text-xs text-slate-500 font-medium">Platform</span>
                                                                <span className="text-xs text-white font-bold uppercase tracking-widest">{selectedLogForModal.platform}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center group/meta">
                                                                <span className="text-xs text-slate-500 font-medium">Response Time</span>
                                                                <span className={`text-xs font-black italic ${selectedLogForModal.response_time > 5000 ? 'text-rose-500' : 'text-accent'}`}>{selectedLogForModal.response_time}ms</span>
                                                            </div>
                                                            <div className="flex justify-between items-center group/meta">
                                                                <span className="text-xs text-slate-500 font-medium">Synced At</span>
                                                                <span className="text-xs text-white font-bold">{new Date(selectedLogForModal.created_at).toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        {selectedLogForModal.payload?.telemetry && (
                                                            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/20 space-y-4 relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                                    <Cpu className="w-8 h-8 text-accent" />
                                                                </div>
                                                                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4">Execution Trace</h4>

                                                                {Object.entries(selectedLogForModal.payload.telemetry).map(([key, val]: [string, any]) => (
                                                                    <div key={key} className="flex justify-between items-center border-b border-accent/5 pb-2 last:border-0 last:pb-0">
                                                                        <span className="text-[10px] text-slate-400 font-mono capitalize">{key.replace('_', ' ')}</span>
                                                                        <span className="text-[10px] text-white font-mono font-bold">{val}ms</span>
                                                                    </div>
                                                                ))}

                                                                <div className="pt-2 mt-2 border-t border-accent/20">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-[10px] text-accent font-black uppercase">Total Relay Time</span>
                                                                        <span className="text-xs text-white font-black italic">{selectedLogForModal.payload.telemetry.total_relay_time || selectedLogForModal.payload.telemetry.total_to_send || 0}ms</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {selectedLogForModal.error_message && (
                                                            <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                                                                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                    <ShieldAlert className="w-3.5 h-3.5" /> Fault Identification
                                                                </h4>
                                                                <p className="text-[11px] text-rose-400 font-mono leading-relaxed">{selectedLogForModal.error_message}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right: Code Inspector */}
                                                    <div className="lg:col-span-2 space-y-4">
                                                        <div className="flex items-center justify-between px-2">
                                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payload Inspector</h4>
                                                            <span className="text-[9px] font-bold text-slate-600 font-mono">CONTENT-TYPE: APPLICATION/JSON</span>
                                                        </div>
                                                        <div className="p-8 rounded-[32px] bg-black/60 border border-white/5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto shadow-inner min-h-[400px]">
                                                            <pre className="scrollbar-hide">
                                                                {JSON.stringify(selectedLogForModal.payload, null, 2)}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uplink Stable</span>
                                                </div>
                                                <button
                                                    onClick={() => setIsLogModalOpen(false)}
                                                    className="px-10 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 active:scale-95"
                                                >
                                                    CLOSE DIAGNOSTICS
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >

                        {/* Add Email Modal */}
                        <AnimatePresence>
                            {
                                isAddingEmail && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsAddingEmail(false)}
                                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                            className="w-full max-w-md bg-[#080808] border border-white/5 rounded-2xl p-10 relative z-10"
                                        >
                                            <h2 className="text-3xl font-black mb-2 text-white">Add Email</h2>
                                            <p className="text-slate-500 text-sm mb-10">Add an email address to your account to receive system alerts.</p>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block px-1">Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={newEmailInput}
                                                        onChange={(e) => setNewEmailInput(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all bg-transparent"
                                                        placeholder="developer@acme.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mt-12">
                                                <button
                                                    onClick={() => setIsAddingEmail(false)}
                                                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
                                                >
                                                    CANCEL
                                                </button>
                                                <button
                                                    onClick={handleAddEmail}
                                                    className="flex-1 py-4 rounded-2xl bg-accent text-white font-black hover:shadow-[0_0_20px_var(--accent-glow)] transition-all cursor-pointer"
                                                >
                                                    ADD
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >

                        {/* Email Verification Code Modal */}
                        <AnimatePresence>
                            {
                                verifyingEmail && (
                                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setVerifyingEmail(null)}
                                            className="absolute inset-0 bg-[#05070a]/90 backdrop-blur-2xl"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                            className="w-full max-w-md bg-[#080808] border border-white/5 rounded-2xl p-12 relative z-10 text-center"
                                        >
                                            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-8 border border-amber-500/20">
                                                <Mail className="w-10 h-10" />
                                            </div>
                                            <h2 className="text-3xl font-black mb-4 text-white">Verify Email</h2>
                                            <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                                                Enter the 6-digit verification code sent to <span className="text-white font-bold">{verifyingEmail}</span>
                                            </p>

                                            <div className="flex justify-center gap-3 mb-10">
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                    <input
                                                        key={i}
                                                        id={`email-code-${i}`}
                                                        type="text"
                                                        maxLength={1}
                                                        value={verificationCode[i] || ""}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/[^0-9]/g, "").slice(-1);
                                                            const newCode = verificationCode.split("");
                                                            newCode[i] = val;
                                                            const fullCode = newCode.join("");
                                                            setVerificationCode(fullCode);
                                                            if (val && i < 5) document.getElementById(`email-code-${i + 1}`)?.focus();
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Backspace") {
                                                                if (!verificationCode[i] && i > 0) {
                                                                    document.getElementById(`email-code-${i - 1}`)?.focus();
                                                                    const newCode = verificationCode.split("");
                                                                    newCode[i - 1] = "";
                                                                    setVerificationCode(newCode.join(""));
                                                                } else {
                                                                    const newCode = verificationCode.split("");
                                                                    newCode[i] = "";
                                                                    setVerificationCode(newCode.join(""));
                                                                }
                                                            }
                                                        }}
                                                        onPaste={(e) => {
                                                            const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
                                                            if (pasteData.length === 6) {
                                                                setVerificationCode(pasteData);
                                                                document.getElementById(`email-code-5`)?.focus();
                                                            }
                                                        }}
                                                        className="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:border-accent outline-none transition-all"
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <button
                                                    onClick={handleVerifyEmail}
                                                    disabled={verificationCode.length !== 6 || isVerifyingCode}
                                                    className="w-full py-5 rounded-2xl bg-accent text-white font-black hover:shadow-[0_0_30px_var(--accent-glow)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                                >
                                                    <span className="relative z-10">{isVerifyingCode ? "VERIFYING..." : "VERIFY CODE"}</span>
                                                </button>

                                                <div className="mt-2">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                        {lang === 'es' ? "¿No te llegó el código?" : "Didn't receive the code?"}
                                                        <button
                                                            onClick={handleResendEmail}
                                                            className="ml-2 text-accent hover:underline cursor-pointer"
                                                        >
                                                            {lang === 'es' ? "Reenviar código" : "Resend code"}
                                                        </button>
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => setVerifyingEmail(null)}
                                                    className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest mt-2"
                                                >
                                                    {lang === 'es' ? "Cancelar" : "Cancel"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >

                        {/* Connect Account Modal */}
                        <AnimatePresence>
                            {
                                isConnectingAccount && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsConnectingAccount(false)}
                                            className="absolute inset-0 bg-[#05070a]/80 backdrop-blur-xl"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                            className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-[40px] p-10 relative z-10 shadow-3xl"
                                        >
                                            <h2 className="text-3xl font-black mb-2 text-white">Connect Account</h2>
                                            <p className="text-slate-500 text-sm mb-10">Select a provider to link with your Relay profile.</p>

                                            <div className="space-y-4">
                                                {[
                                                    { name: 'Google', icon: <GoogleIcon className="w-5 h-5" /> },
                                                    { name: 'GitHub', icon: <GitHubLogo className="w-5 h-5" /> }
                                                ].filter(provider => !connectedServices.some(s => s.name === provider.name))
                                                    .map((provider) => (
                                                        <button
                                                            key={provider.name}
                                                            onClick={() => handleConnectService(provider.name)}
                                                            className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.06] transition-all group cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                                                    {provider.icon}
                                                                </div>
                                                                <span className="text-white font-bold">{provider.name}</span>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                                        </button>
                                                    ))}
                                                {connectedServices.length >= 3 && (
                                                    <p className="text-center text-xs text-slate-500 italic py-4">All available providers are already connected.</p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setIsConnectingAccount(false)}
                                                className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all cursor-pointer uppercase text-[10px] tracking-widest"
                                            >
                                                CLOSE
                                            </button>
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >
                        {/* Authenticator Setup Modal */}
                        <AnimatePresence>
                            {
                                isSettingUpAuthenticator && (
                                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsSettingUpAuthenticator(false)}
                                            className="absolute inset-0 bg-[#05070a]/90 backdrop-blur-2xl"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                            className="w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-[48px] p-12 relative z-10 shadow-3xl text-center"
                                        >
                                            <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8 border border-accent/20">
                                                <Shield className="w-10 h-10" />
                                            </div>

                                            {authenticatorStep === 1 ? (
                                                <>
                                                    <h2 className="text-3xl font-black mb-4 text-white uppercase italic tracking-tighter">Set up Authenticator</h2>
                                                    <p className="text-slate-400 text-sm mb-10 leading-relaxed">Scan this QR code with your authenticator app (Authy, 1Password, or Google Authenticator).</p>

                                                    <div className="w-56 h-56 bg-white p-6 rounded-[40px] mx-auto mb-10 shadow-2xl relative group flex items-center justify-center">
                                                        {otpAuthUri ? (
                                                            <QRCodeSVG
                                                                value={otpAuthUri}
                                                                size={180}
                                                                level="H"
                                                                includeMargin={false}
                                                            />
                                                        ) : (
                                                            <div className="animate-pulse bg-slate-100 w-full h-full rounded-2xl" />
                                                        )}
                                                    </div>

                                                    <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Secret Key (Manual Entry)</p>
                                                        <p className="text-xs font-mono text-accent select-all">{totpSecret}</p>
                                                    </div>

                                                    <div className="flex flex-col gap-4">
                                                        <button
                                                            onClick={() => setAuthenticatorStep(2)}
                                                            className="w-full py-5 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] shadow-[0_0_20px_var(--accent-glow)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                                                        >
                                                            Next: Verify Code
                                                        </button>
                                                        <button
                                                            onClick={() => setIsSettingUpAuthenticator(false)}
                                                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-bold hover:text-white transition-all cursor-pointer"
                                                        >
                                                            I'll do this later
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h2 className="text-3xl font-black mb-4 text-white uppercase italic tracking-tighter">Verify App</h2>
                                                    <p className="text-slate-400 text-sm mb-10 leading-relaxed">Enter the 6-digit code currently shown on your device to finalize the setup.</p>

                                                    <div className="flex justify-center gap-3 mb-10">
                                                        {totpInputs.map((val, i) => (
                                                            <input
                                                                key={i}
                                                                id={`totp-${i}`}
                                                                type="text"
                                                                maxLength={1}
                                                                value={val}
                                                                onChange={(e) => {
                                                                    const newVal = e.target.value.replace(/[^0-9]/g, "").slice(-1);
                                                                    const newInputs = [...totpInputs];
                                                                    newInputs[i] = newVal;
                                                                    setTotpInputs(newInputs);
                                                                    if (newVal && i < 5) {
                                                                        document.getElementById(`totp-${i + 1}`)?.focus();
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Backspace") {
                                                                        if (!totpInputs[i] && i > 0) {
                                                                            document.getElementById(`totp-${i - 1}`)?.focus();
                                                                            const newInputs = [...totpInputs];
                                                                            newInputs[i - 1] = "";
                                                                            setTotpInputs(newInputs);
                                                                        } else {
                                                                            const newInputs = [...totpInputs];
                                                                            newInputs[i] = "";
                                                                            setTotpInputs(newInputs);
                                                                        }
                                                                    }
                                                                }}
                                                                onPaste={(e) => {
                                                                    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
                                                                    if (pasteData.length === 6) {
                                                                        setTotpInputs(pasteData.split(""));
                                                                        document.getElementById(`totp-5`)?.focus();
                                                                    }
                                                                }}
                                                                className="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-accent transition-all"
                                                                autoFocus={i === 0}
                                                            />
                                                        ))}
                                                    </div>

                                                    <div className="flex flex-col gap-4">
                                                        <button
                                                            onClick={() => {
                                                                const code = totpInputs.join("");
                                                                if (code.length !== 6) {
                                                                    alert("Please enter all 6 digits.");
                                                                    return;
                                                                }

                                                                setLoading(true);
                                                                fetch('/api/auth/2fa/enable', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ secret: totpSecret, code })
                                                                }).then(res => res.json()).then(data => {
                                                                    if (data.success) {
                                                                        alert("2FA Authenticator Enabled and Saved!");
                                                                        setIsSettingUpAuthenticator(false);
                                                                        fetchUserData();
                                                                    } else {
                                                                        alert("Error: " + (data.error || "Invalid code. Please check your app and try again."));
                                                                    }
                                                                }).catch(() => {
                                                                    alert("Network error connecting to server.");
                                                                }).finally(() => {
                                                                    setLoading(false);
                                                                });
                                                            }}
                                                            className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer hover:shadow-emerald-500/50"
                                                        >
                                                            Complete Setup
                                                        </button>
                                                        <button
                                                            onClick={() => setAuthenticatorStep(1)}
                                                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-bold hover:text-white transition-all cursor-pointer"
                                                        >
                                                            Back to QR Code
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >

                        {/* 2FA Verification Overlay for OAuth Sync */}
                        <AnimatePresence>
                            {
                                show2FAOverlay && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                            className="w-full max-w-md glass p-10 rounded-[48px] border border-white/10 shadow-3xl text-center relative overflow-hidden"
                                        >
                                            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-accent/20 blur-[100px] rounded-full"></div>

                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="w-20 h-20 bg-accent rounded-[24px] flex items-center justify-center shadow-[0_0_50px_var(--accent-glow)] mb-10">
                                                    <Shield className="text-white w-10 h-10" />
                                                </div>

                                                <h2 className="text-3xl font-black text-white uppercase mb-4 tracking-tighter">Two-Factor Authentication</h2>
                                                <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-[280px]">
                                                    Your account is protected. Please enter the 6-digit code from your authenticator app to continue.
                                                </p>

                                                <form onSubmit={handle2FAVerify} className="w-full space-y-6">
                                                    <div className="relative group">
                                                        <Lock className="absolute left-6 top-5 w-5 h-5 text-slate-500" />
                                                        <input
                                                            type="text"
                                                            maxLength={6}
                                                            value={totpCode}
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9]/g, "");
                                                                setTotpCode(val);
                                                                if (verify2FAError) setVerify2FAError(null);
                                                                if (val.length === 6) {
                                                                    // Auto-submit if needed, or just let them click
                                                                }
                                                            }}
                                                            autoFocus
                                                            placeholder="000000"
                                                            className={`w-full bg-white/5 border ${verify2FAError ? 'border-rose-500/50' : 'border-white/5'} rounded-full py-5 pl-14 pr-7 focus:border-accent/40 focus:bg-white/10 outline-none transition-all text-2xl font-black text-white tracking-[0.5em] text-center placeholder:text-slate-800 placeholder:tracking-normal placeholder:text-sm placeholder:font-medium`}
                                                        />
                                                        {verify2FAError && <p className="text-[10px] text-rose-500 font-bold mt-2 uppercase tracking-wider">{verify2FAError}</p>}
                                                    </div>

                                                    <button
                                                        disabled={isVerifying2FA || totpCode.length !== 6}
                                                        className="w-full py-5 rounded-full bg-accent text-white font-black uppercase tracking-widest hover:shadow-[0_0_40px_var(--accent-glow)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                                    >
                                                        {isVerifying2FA ? "Verifying..." : "Verify & Sign In"}
                                                        {!isVerifying2FA && <ArrowRight className="w-5 h-5" />}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShow2FAOverlay(false);
                                                            router.push('/auth');
                                                        }}
                                                        className="text-xs text-slate-500 hover:text-white transition-colors"
                                                    >
                                                        Back to login
                                                    </button>
                                                </form>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            }
                        </AnimatePresence >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <input
                            type="file"
                            ref={whiteLabelLogoInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const result = event.target?.result as string;
                                        processImageUpload(result, 'logo').then(url => {
                                            if (url) {
                                                if (activeTab === 'settings' && settingsSubTab === 'organization') {
                                                    setWhiteLabel(prev => ({ ...prev, corporateLogo: url }));
                                                } else {
                                                    setOnboardingData(prev => ({ ...prev, logo: url }));
                                                }
                                            }
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />

                        {/* Account Deletion Confirmation Modal */}
                        <AnimatePresence>
                            {showDeleteAccountModal && (
                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-8 relative shadow-2xl"
                                    >
                                        <h2 className="text-xl font-bold text-white mb-2">Destroy Account</h2>
                                        <p className="text-xs text-slate-500 mb-8">This action is irreversible. All your data will be permanently purged.</p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowDeleteAccountModal(false)}
                                                className="flex-1 py-3 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setNotification({ message: "Deleting Account...", type: 'loading' });
                                                    // Implementation handled in original logic
                                                    setShowDeleteAccountModal(false);
                                                }}
                                                className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all cursor-pointer"
                                            >
                                                Destroy
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* Leave Workspace Modal */}
                            {showLeaveWorkspaceModal && (
                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full max-w-md bg-[#080808] border border-white/5 rounded-2xl p-8 relative shadow-2xl overflow-hidden"
                                    >
                                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Leave Organization</h2>

                                        <AnimatePresence>
                                            {showLeaveError && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex gap-3">
                                                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                                                        <p className="text-[11px] font-bold leading-relaxed">
                                                            There has to be at least one organization member with the minimum required permissions
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                                            Are you sure you want to leave this organization? You will lose access to this organization and its applications.
                                        </p>
                                        <p className="text-xs text-rose-500 font-bold mb-6">
                                            This action is permanent and irreversible.
                                        </p>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block pl-1">
                                                    Type "{whiteLabel.corporateName || "Relay"}" below to continue.
                                                </label>
                                                <input
                                                    type="text"
                                                    value={workspaceLeaveConfirmName}
                                                    onChange={(e) => setWorkspaceLeaveConfirmName(e.target.value)}
                                                    placeholder={whiteLabel.corporateName || "Relay"}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-medium focus:border-rose-500 outline-none transition-all placeholder:text-slate-800"
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="flex gap-3 justify-end items-center">
                                                <button
                                                    onClick={() => {
                                                        setShowLeaveWorkspaceModal(false);
                                                        setWorkspaceLeaveConfirmName("");
                                                        setShowLeaveError(false);
                                                    }}
                                                    className="text-white text-[10px] font-black uppercase tracking-widest hover:text-slate-400 transition-all cursor-pointer mr-4"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (teamMembers.length <= 1) {
                                                            setShowLeaveError(true);
                                                            return;
                                                        }
                                                        // Handle leave logic...
                                                        setShowLeaveWorkspaceModal(false);
                                                    }}
                                                    disabled={workspaceLeaveConfirmName.trim().toLowerCase() !== (whiteLabel.corporateName || "Relay").trim().toLowerCase()}
                                                    className="px-6 py-3 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                                                >
                                                    Leave organization
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* Workspace Deletion Confirmation Modal */}
                            {showDeleteWorkspaceModal && (
                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full max-w-md bg-[#080808] border border-white/10 rounded-2xl p-8 relative shadow-2xl"
                                    >
                                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Delete organization</h2>

                                        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                                            Are you sure you want to delete this organization?
                                        </p>
                                        <p className="text-xs text-rose-500 font-bold mb-6">
                                            This action is permanent and irreversible.
                                        </p>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block pl-1">
                                                    Type "{whiteLabel.corporateName || "Relay"}" below to continue.
                                                </label>
                                                <input
                                                    type="text"
                                                    value={workspaceDeleteConfirmName}
                                                    onChange={(e) => setWorkspaceDeleteConfirmName(e.target.value)}
                                                    placeholder={whiteLabel.corporateName || "Relay"}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-medium focus:border-rose-500 outline-none transition-all placeholder:text-slate-800"
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteWorkspaceModal(false);
                                                        setWorkspaceDeleteConfirmName("");
                                                    }}
                                                    className="text-white text-[10px] font-black uppercase tracking-widest hover:text-slate-400 transition-all cursor-pointer mr-4"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setNotification({ message: "Deleting Workspace...", type: 'loading' });
                                                        // Start onboarding flow after delete simulated
                                                        setTimeout(() => {
                                                            setShowDeleteWorkspaceModal(false);
                                                            setOnboardingStep(0); // Start onboarding
                                                            setNotification(null);
                                                        }, 2000);
                                                    }}
                                                    disabled={workspaceDeleteConfirmName.trim().toLowerCase() !== (whiteLabel.corporateName || "Relay").trim().toLowerCase()}
                                                    className="px-6 py-3 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                                                >
                                                    Delete organization
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* Domain Verification Modal */}
                            {isDomainModalOpen && (
                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-8 relative shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Verify Domain</h2>
                                            <button onClick={() => setIsDomainModalOpen(false)} className="text-slate-500 hover:text-white transition-all">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                                            Connect this protocol to a verified identity. Enter an email address that matches the domain hostname.
                                        </p>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Domain Hostname</label>
                                                <input
                                                    type="text"
                                                    value={domainHostname}
                                                    onChange={(e) => setDomainHostname(e.target.value)}
                                                    placeholder="relay-notify.com"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-accent outline-none transition-all placeholder:text-slate-700"
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleVerifyDomainConfirm()}
                                                disabled={isUploading || !domainHostname}
                                                className="w-full py-4 rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                                            >
                                                {isUploading ? 'SYNCHRONIZING...' : 'Add Domain'}
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {isCommandPaletteOpen && (
                                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4 bg-black/60 shadow-2xl backdrop-blur-sm" onClick={() => setIsCommandPaletteOpen(false)}>
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full max-w-[650px] bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                                    >
                                        <div className="flex items-center px-4 py-3 border-b border-white/5 gap-3">
                                            <Search className="w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                autoFocus
                                                value={commandSearchTerm}
                                                onChange={(e) => setCommandSearchTerm(e.target.value)}
                                                placeholder="Type a command, search or ask Relay AI..."
                                                className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder:text-slate-500 font-medium"
                                            />
                                            <button className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 bg-white/5 border border-white/5" onClick={() => setIsCommandPaletteOpen(false)}>
                                                ESC
                                            </button>
                                        </div>
                                        <div className="max-h-[360px] overflow-y-auto scrollbar-hide py-2 flex flex-col">

                                            <div className="px-4 py-1.5 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-600">Workflows & Routing</div>
                                            <button onClick={() => { setActiveTab('scenarios'); setIsCommandPaletteOpen(false); }} className="mx-2 px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-accent/10 border border-transparent hover:border-accent/20 group transition-all text-left">
                                                <div className="w-6 h-6 rounded border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/30 group-hover:text-accent"><Network className="w-3 h-3 text-slate-400 group-hover:text-accent" /></div>
                                                <div className="flex-1 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">Create Workflow</span>
                                                </div>
                                            </button>

                                            <div className="px-4 py-1.5 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-600">Actions</div>
                                            <button onClick={() => { setIsDomainModalOpen(true); setIsCommandPaletteOpen(false); }} className="mx-2 px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-accent/10 border border-transparent hover:border-accent/20 group transition-all text-left">
                                                <div className="w-6 h-6 rounded border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/30 group-hover:text-accent"><Globe className="w-3 h-3 text-slate-400 group-hover:text-accent" /></div>
                                                <div className="flex-1 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">Add Domain</span>
                                                </div>
                                            </button>
                                            <button onClick={() => { window.open('/docs', '_blank'); setIsCommandPaletteOpen(false); }} className="mx-2 px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-accent/10 border border-transparent hover:border-accent/20 group transition-all text-left">
                                                <div className="w-6 h-6 rounded border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/30 group-hover:text-accent"><FileText className="w-3 h-3 text-slate-400 group-hover:text-accent" /></div>
                                                <div className="flex-1 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">Check Documentation</span>
                                                </div>
                                            </button>

                                            <div className="px-4 py-1.5 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-600">Navigation</div>
                                            {[
                                                { label: "Go to Inbox", id: "inbox", icon: <MessageSquare /> },
                                                { label: "Quotas & Billing", id: "settings", subtab: "usage", icon: <Activity /> },
                                                { label: "Go to Identity", id: "settings", subtab: "profile", icon: <UserCircle /> },
                                                { label: "Go to Co-pilot", id: "settings", subtab: "copilot", icon: <Bot /> },
                                                { label: "Go to Workspace", id: "settings", subtab: "workspace", icon: <Settings /> },
                                                { label: "Go to API & SDKs", id: "integration", icon: <Terminal /> },
                                                { label: "Recipients", id: "subscribers", icon: <Users /> },
                                                { label: "Segments", id: "topics", icon: <Layers /> },
                                                { label: "Analytics", id: "logs", icon: <BarChart3 /> }
                                            ].map((item: any, i: number) => (
                                                <button key={i} onClick={() => {
                                                    setActiveTab(item.id);
                                                    if (item.subtab) {
                                                        setTimeout(() => { const event = new CustomEvent('relay_set_subtab', { detail: item.subtab }); window.dispatchEvent(event); }, 100);
                                                    }
                                                    setIsCommandPaletteOpen(false);
                                                }} className="mx-2 px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-accent/10 border border-transparent hover:border-accent/20 group transition-all text-left">
                                                    <div className="w-6 h-6 rounded border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/30 group-hover:text-accent">
                                                        {React.cloneElement(item.icon, { className: "w-3 h-3 text-slate-400 group-hover:text-accent" })}
                                                    </div>
                                                    <div className="flex-1 flex justify-between items-center">
                                                        <span className="text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <span className="font-sans border border-white/10 rounded px-1">↑</span>
                                                <span className="font-sans border border-white/10 rounded px-1">↓</span>
                                                Navigate
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold tracking-wide border border-rose-500/20">Go to section ↵</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                </>
            )
            }

            {/* Scenario Deletion Confirmation Modal */}
            <AnimatePresence>
                {scenarioToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500/0 via-rose-500 to-rose-500/0 opacity-50" />
                            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
                                <Trash2 className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
                            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                                You are about to permanently delete {(Array.isArray(scenarioToDelete) ? scenarioToDelete.length : 1)} scenario(s). This action cannot be undone.
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setScenarioToDelete(null)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-slate-300 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeDeleteScenario}
                                    className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all font-sans"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Notifications Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-10 right-10 z-[200]"
                    >
                        <div className={`px-6 py-4 rounded-2xl backdrop-blur-xl border flex items-center gap-4 shadow-2xl ${notification.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                            notification.type === 'loading' ? 'bg-accent/10 border-accent/20 text-accent' :
                                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}>
                            {notification.type === 'loading' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            <span className="text-xs font-bold uppercase tracking-widest">{notification.message}</span>
                            {notification.type !== 'loading' && (
                                <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 text-current">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
