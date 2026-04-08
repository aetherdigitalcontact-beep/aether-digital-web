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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="prose prose-invert prose-slate max-w-none space-y-12"
                    >
                        {[
                            { icon: ShieldCheck, title: d.legal.sections.collection, desc: d.legal.sections.collectionDesc },
                            { icon: Lock, title: d.legal.sections.security, desc: d.legal.sections.securityDesc },
                            { icon: EyeOff, title: d.legal.sections.disclosure, desc: d.legal.sections.disclosureDesc }
                        ].map((section, idx) => (
                            <section key={idx}>
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <section.icon className="w-6 h-6 text-accent" />
                                    {section.title}
                                </h2>
                                <p className="text-slate-400 leading-relaxed">
                                    {section.desc}
                                </p>
                            </section>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
