"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { dictionaries, Language } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function TermsPage() {
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
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{d.legal?.terms || "Terms of Service"}</h1>
                    <p className="text-slate-500 text-lg uppercase font-bold tracking-widest">Protocol Revision 1.0.0</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-invert prose-slate max-w-none space-y-12"
                >
                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">01</span>
                            Agreement to Terms
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            By accessing or using the Relay platform, you agree to be bound by these Terms of Service. These terms govern your use of our notification infrastructure, API, and dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">02</span>
                            API Usage & Limits
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Users are responsible for maintaining the confidentiality of their API keys. Usage is subject to the monthly limits defined by your selected subscription plan. Automated abuse or attempts to bypass rate limits result in immediate termination of the uplink.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">03</span>
                            Intellectual Property
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            The Relay protocol, branding, and infrastructure are the exclusive property of Aether Digital Architecture. Users maintain ownership of their message content but grant Relay the necessary rights to process and deliver those packets to the intended targets.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">04</span>
                            Service Availability
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            While we strive for 99.9% uptime (guaranteed for Enterprise tiers), Relay is provided "as is". We are not liable for upstream provider outages (Telegram, WhatsApp, Discord) that may affect delivery telemetry.
                        </p>
                    </section>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
