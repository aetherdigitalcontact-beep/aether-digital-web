"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Terminal, Code2, Globe } from 'lucide-react';

const snippets = {
    'Next.js': `import { RelayInbox } from '@relay/react';

export default function Layout({ children }) {
  return (
    <header>
      <Logo />
      <RelayInbox 
        apiKey="RELAY_PK_X89..." 
        subscriberId="user_123" 
      />
    </header>
  );
}`,
    'React': `import { RelayInbox } from '@relay/react';

function App() {
  return (
    <div className="navbar">
      <h1>My App</h1>
      <RelayInbox 
        apiKey="RELAY_PK_X89..." 
        subscriberId="user_123" 
      />
    </div>
  );
}`,
    'Vanilla JS': `<!-- Add to your <head> -->
<script src="https://relay.sh/sdk.js"></script>

<script>
  Relay.init({
    selector: '#inbox-target',
    apiKey: 'RELAY_PK_X89...',
    subscriberId: 'user_123'
  });
</script>

<div id="inbox-target"></div>`
};

export default function IntegrationGuide() {
    const [activeTab, setActiveTab] = useState<'Next.js' | 'React' | 'Vanilla JS'>('Next.js');
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(snippets[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass border border-white/10 rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest">Just copy and ship</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">Integration in under 60 seconds</p>
                    </div>
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    {Object.keys(snippets).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                ${activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative group">
                <pre className="p-8 font-mono text-xs leading-relaxed text-slate-300 bg-[#080809] overflow-x-auto min-h-[220px]">
                    {snippets[activeTab]}
                </pre>

                <button
                    onClick={copyToClipboard}
                    className="absolute top-6 right-6 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group-hover:scale-110 active:scale-95 flex items-center gap-2"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-accent" />
                    ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
            </div>

            <div className="p-6 bg-accent/5 flex items-center gap-4 border-t border-accent/10">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Terminal className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 tracking-tight">
                    Running in production? Make sure to use <span className="text-white">HMAC security</span> to prevent subscriber spoofing.
                </p>
            </div>
        </div>
    );
}
