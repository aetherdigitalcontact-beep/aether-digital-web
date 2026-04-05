"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Code2, Copy, Check, ArrowLeft, Terminal, Bot, MessageSquare, Shield, ChevronDown, Settings, Cpu, Webhook, Hash, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { dictionaries, Language } from "@/lib/i18n";

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

export default function DocsPage() {
    const [copied, setCopied] = useState<string | null>(null);
    const [lang, setLang] = useState<Language>('en');
    const [isLangOpen, setIsLangOpen] = useState(false);

    // Snippet Generator State
    const [genPlatform, setGenPlatform] = useState("telegram");
    const [genTarget, setGenTarget] = useState("@chat_id");
    const [genMessage, setGenMessage] = useState("Situation: {{situation}} detected in {{location}}");
    const [genVars, setGenVars] = useState('{\n  "situation": "Fire Alarm",\n  "location": "Warehouse A"\n}');

    useEffect(() => {
        const savedLang = localStorage.getItem('relay-lang') as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        }
    }, []);

    const d = dictionaries[lang]?.docs;
    const currentLang = languages.find(l => l.code === lang) || languages[0];

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const codeExamples = {
        curl: `curl -X POST https://relay.aether.digital/api/relay \\
  -H "x-api-key: RELAY_PK_XXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "platform": "${genPlatform}",
    "target": "${genTarget}",
    "message": "${genMessage}",
    "category": "Security / Alarm",
    "botName": "Aether Sentinel",
    "variables": ${genVars}
  }'`,
        javascript: `// Modern Fetch API
const relay = async () => {
  const response = await fetch('https://relay.aether.digital/api/relay', {
    method: 'POST',
    headers: { 'x-api-key': 'RELAY_PK_XXXX', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      platform: '${genPlatform}',
      target: '${genTarget}',
      message: \`${genMessage}\`,
      category: 'Situation-Trigger',
      variables: ${genVars}
    })
  });
  const data = await response.json();
  console.log(data);
};`,
        python: `import requests\n\nurl = "https://relay.aether.digital/api/relay"\npayload = {\n    "platform": "${genPlatform}",\n    "target": "${genTarget}",\n    "message": "${genMessage}",\n    "category": "Automation",\n    "variables": ${genVars}\n}\nheaders = {"x-api-key": "RELAY_PK_XXXX", "Content-Type": "application/json"}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.text)`,
        php: `<?php\n\n$url = "https://relay.aether.digital/api/relay";\n$payload = json_encode([\n    "platform" => "${genPlatform}",\n    "target" => "${genTarget}",\n    "message" => "${genMessage}",\n    "category" => "Billing",\n    "variables" => ${genVars.replace(/:/g, '=>')}\n]);\n\n$ch = curl_init($url);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json", "x-api-key: RELAY_PK_XXXX"]);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $payload);\n$response = curl_exec($ch);`,
        go: `package main\nimport ("bytes"; "net/http")\nfunc main() {\n\turl := "https://relay.aether.digital/api/relay"\n\tjson := []byte(\`{"platform":"${genPlatform}","target":"${genTarget}","message":"${genMessage}"}\`)\n\treq, _ := http.NewRequest("POST", url, bytes.NewBuffer(json))\n\treq.Header.Set("x-api-key", "RELAY_PK_XXXX")\n\thttp.DefaultClient.Do(req)\n}`
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-accent/30 selection:text-white pb-32">
            <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center glass border-b border-white/5 shadow-2xl">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Terminal</span>
                </Link>
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)] hidden sm:flex">
                    <Zap className="text-white w-5 h-5 relative z-10" fill="currentColor" />
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-40">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Protocol <span className="text-accent underline decoration-accent/20">Documentation</span></h1>
                    <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                        Master the Relay Uplink. Integrate professional-grade notifications into your technology stack in seconds.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="p-8 rounded-[40px] glass bg-accent/5 border-accent/20 border-dashed">
                        <Cpu className="text-accent w-8 h-8 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4 italic">Situation Automation</h3>
                        <p className="text-sm text-slate-400">Trigger notifications based on real-world events. Use categories to route messages automatically.</p>
                    </div>
                    <div className="p-8 rounded-[40px] glass bg-emerald-500/5 border-emerald-500/20 border-dashed">
                        <Webhook className="text-emerald-400 w-8 h-8 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4 italic">Universal Catchall</h3>
                        <p className="text-sm text-slate-400">Point any webhook to our catchall endpoint. We parse your JSON automatically.</p>
                    </div>
                    <div className="p-8 rounded-[40px] glass bg-blue-500/5 border-blue-500/20 border-dashed">
                        <Bot className="text-blue-400 w-8 h-8 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4 italic" >Global Branding</h3>
                        <p className="text-sm text-slate-400">Set your bot name and avatar globally or override per request in your code.</p>
                    </div>
                </div>

                {/* SDK Configurator */}
                <section className="space-y-12">
                    <div className="flex items-center gap-3 mb-10">
                        <Code2 className="text-accent w-8 h-8" />
                        <h2 className="text-3xl font-bold text-white tracking-tight">Integration SDK v26.4</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-8 rounded-[40px] glass bg-accent/[0.02] border-white/5 shadow-2xl">
                        <div className="lg:col-span-1 space-y-6 border-r border-white/5 pr-8">
                            <h4 className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Settings className="w-3 h-3" /> CONFIGURATOR
                            </h4>
                            <div>
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform</label>
                                <select value={genPlatform} onChange={(e) => setGenPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-accent">
                                    <option value="telegram" className="bg-[#020617]">Telegram</option>
                                    <option value="discord" className="bg-[#020617]">Discord</option>
                                    <option value="whatsapp" className="bg-[#020617]">WhatsApp</option>
                                    <option value="sms" className="bg-[#020617]">SMS (Twilio)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Target ID</label>
                                <input type="text" value={genTarget} onChange={(e) => setGenTarget(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-accent" />
                            </div>
                        </div>
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Message Schema</label>
                                <textarea value={genMessage} onChange={(e) => setGenMessage(e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-accent resize-none shadow-inner" />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Variables (Context JSON)</label>
                                <textarea value={genVars} onChange={(e) => setGenVars(e.target.value)} rows={4} className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-accent outline-none focus:border-accent font-mono resize-none shadow-inner" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {Object.entries(codeExamples).map(([id, code]) => (
                            <div key={id} className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4">
                                    <span>{id} implementation</span>
                                    <button onClick={() => copyToClipboard(code, id)} className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                                        {copied === id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        {copied === id ? 'Copied' : 'Copy SDK'}
                                    </button>
                                </div>
                                <div className="p-8 rounded-[32px] bg-black/60 border border-white/5 font-mono text-xs leading-relaxed text-slate-300 shadow-2xl overflow-x-auto">
                                    <pre className={id === 'curl' ? 'text-accent' : id === 'javascript' || id === 'go' ? 'text-emerald-400' : 'text-amber-400'}>
                                        {code}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Target Addressing Guide */}
                <section className="mt-16 mb-20 p-10 rounded-[48px] glass bg-blue-500/5 border border-blue-500/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4 italic underline decoration-white/10 relative z-10">
                        Target Addressing Guide
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl relative z-10">
                        The syntax for your <code>target</code> parameter shifts depending on the selected destination. To guarantee successful delivery, format your targets exactly as dictated below.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="p-6 rounded-[32px] bg-black/40 border border-white/5 space-y-3 shadow-inner hover:bg-black/60 transition-colors">
                            <h4 className="text-xs font-black text-sky-400 uppercase tracking-widest flex items-center gap-2"><Bot className="w-4 h-4" /> Telegram</h4>
                            <p className="text-xs text-slate-400 mb-2">Literal numerical Chat ID or mapped Username Alias.</p>
                            <code className="text-[10px] text-white bg-white/10 px-2 py-1 rounded inline-block">1780002457</code> <span className="text-[10px] text-slate-600 mx-1">OR</span> <code className="text-[10px] text-white bg-white/10 px-2 py-1 rounded inline-block">@MyChannel</code>
                        </div>

                        <div className="p-6 rounded-[32px] bg-black/40 border border-white/5 space-y-3 shadow-inner hover:bg-black/60 transition-colors">
                            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Hash className="w-4 h-4" /> Slack</h4>
                            <p className="text-xs text-slate-400 mb-2">Member ID or public Channel ID routing hash.</p>
                            <code className="text-[10px] text-white bg-white/10 px-2 py-1 rounded inline-block">U0AQHJA77QB</code> <span className="text-[10px] text-slate-600 mx-1">OR</span> <code className="text-[10px] text-white bg-white/10 px-2 py-1 rounded inline-block">C12345ABCDE</code>
                        </div>

                        <div className="p-6 rounded-[32px] bg-black/40 border border-white/5 space-y-3 shadow-inner hover:bg-black/60 transition-colors">
                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Webhook className="w-4 h-4" /> Discord</h4>
                            <p className="text-xs text-slate-400 mb-2">Zero-auth webhook URL. Sourced from Server Integrations.</p>
                            <code className="text-[10px] text-white bg-white/10 px-2 py-1.5 rounded inline-block break-all block w-full">https://discord.com/api/webhooks/123/xyz...</code>
                        </div>

                        <div className="p-6 rounded-[32px] bg-black/40 border border-white/5 space-y-3 shadow-inner hover:bg-black/60 transition-colors">
                            <h4 className="text-xs font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2"><Mail className="w-4 h-4" /> Email</h4>
                            <p className="text-xs text-slate-400 mb-2">Standard globally routed electronic mail address.</p>
                            <code className="text-[10px] text-white bg-white/10 px-2 py-1 rounded inline-block">director@aether.digital</code>
                        </div>
                    </div>
                </section>

                {/* Catchall Documentation */}
                <section className="mt-32 p-12 rounded-[48px] bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden">
                    <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4 italic underline decoration-white/10">
                        Universal Catchall Adapter
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                        Relay can ingest <strong>any</strong> payload from Shopify, WooCommerce, Stripe, or your custom ERP without modifications.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">HOW TO INTEGRATE</h4>
                            <p className="text-xs text-slate-500">1. Set your webhook URL to our Catchall endpoint.</p>
                            <p className="text-xs text-slate-500">2. Append your <code>api_key</code> and desired <code>platforms</code> as query parameters.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 font-mono text-[10px] text-emerald-400 break-all leading-relaxed shadow-xl">
                            https://relay.aether.digital/api/webhooks/relay?api_key=your_key&platforms=telegram,whatsapp
                        </div>
                    </div>
                </section>
            </main>
        </div >
    );
}
