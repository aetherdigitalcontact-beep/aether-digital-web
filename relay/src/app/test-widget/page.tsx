"use client";

import React, { useState, useEffect } from 'react';
import { RelayInbox } from '@/components/external/RelayInbox';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TestWidgetPage() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [appId, setAppId] = useState<string | null>(null);
    const [subscriberId, setSubscriberId] = useState<string | null>(null);
    const isDark = theme === 'dark';

    // Fetch the real workspace ID and subscriber from the authenticated session
    useEffect(() => {
        const loadSessionData = async () => {
            // Use getUser() — always returns the freshest user data (not stale JWT claims)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setAppId(user.id);                                          // workspace UUID
                setSubscriberId(user.email || user.user_metadata?.email || user.id);  // always prefer email
            }
        };
        loadSessionData();
    }, []);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Nav */}
            <nav className={`border-b px-8 py-4 flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">S</div>
                    <span className="font-bold text-slate-800 text-lg tracking-tight">SaaS Client Protocol</span>
                </div>

                <div className="flex items-center gap-6">
                    <span className={`text-sm font-medium cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>Dashboard</span>
                    <span className={`text-sm font-medium cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>Projects</span>
                    <span className={`text-sm font-medium cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>Settings</span>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className={`p-2 rounded-full transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {/* HERE IS THE DROP-IN WIDGET — now using real session IDs */}
                    {appId && subscriberId ? (
                        <RelayInbox
                            appId={appId}
                            subscriberId={subscriberId}
                            position="bottom-right"
                            className="ml-2"
                            theme={theme}
                        />
                    ) : (
                        <div className="ml-2 p-2">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        </div>
                    )}

                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-slate-200 ml-2"
                    />
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-12 mt-10">
                <h1 className={`text-4xl font-extrabold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome back, Exequiel.</h1>
                <p className={`text-lg mb-4 max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    This is a simulation of how a 3rd party developer using your platform would embed the <code className={`font-mono px-2 py-1 rounded-md ${isDark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50'}`}>{"<RelayInbox />"}</code> widget into their own React/Next.js application.
                </p>

                {/* Debug Info */}
                <div className={`mb-10 p-4 rounded-xl border font-mono text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <p><span className="text-emerald-500">appId</span> = {appId ?? '⟳ loading...'}</p>
                    <p><span className="text-blue-500">subscriberId</span> = {subscriberId ?? '⟳ loading...'}</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`p-6 rounded-2xl border shadow-sm flex flex-col gap-4 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div className={`w-6 h-6 rounded-md ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                            </div>
                            <div className={`h-4 rounded w-1/2 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                            <div className={`h-3 rounded w-full ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`} />
                            <div className={`h-3 rounded w-4/5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
