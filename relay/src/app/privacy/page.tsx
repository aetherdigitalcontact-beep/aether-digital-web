"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { dictionaries, Language } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
    const [lang, setLang] = useState<Language>("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("relay-lang") as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        }
    }, []);

    const d = dictionaries[lang];

    return (
        <main className="min-h-screen bg-[#05070a] text-white">
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center glass border-b-0 rounded-b-2xl max-w-7xl mx-auto left-0 right-0 mt-4">
                <Link href="/" className="flex items-center gap-2 group translate-x-0 hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="font-bold text-lg tracking-tight">RELAY</span>
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{d.legal?.privacy || "Privacy Policy"}</h1>
                    <p className="text-slate-500 text-lg uppercase font-bold tracking-widest">Effective Date: April 2, 2026</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-invert prose-slate max-w-none space-y-12"
                >
                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-accent" />
                            Data Collection
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Relay collects minimal data required to provide our notification services. This includes your email (for authentication), organization name, and delivery telemetry (timing, status codes, and provider responses). We do not store the content of your messages beyond the transient processing window required for fan-out.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-accent" />
                            Security Protocols
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            All API requests are encrypted via TLS. Your API keys are hashed at rest. We implement strict hardware-level isolation for Vercel Edge Functions, ensuring your message packets never co-mingle with other tenant data during the relay process.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <EyeOff className="w-6 h-6 text-accent" />
                            Third-Party Disclosures
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            We do not sell user data. To deliver notifications, we must pass your content to the target platforms (Telegram, WhatsApp, Discord) as instructed by your API payload. These platforms have their own privacy policies which govern the data once it reaches their clusters.
                        </p>
                    </section>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
