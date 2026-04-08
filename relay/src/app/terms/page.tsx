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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="prose prose-invert prose-slate max-w-none space-y-12"
                    >
                        {[
                            { id: '01', title: d.legal.sections.agreement, desc: d.legal.sections.agreementDesc },
                            { id: '02', title: d.legal.sections.usage, desc: d.legal.sections.usageDesc },
                            { id: '03', title: d.legal.sections.ip, desc: d.legal.sections.ipDesc },
                            { id: '04', title: d.legal.sections.availability, desc: d.legal.sections.availabilityDesc }
                        ].map((section) => (
                            <section key={section.id}>
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">{section.id}</span>
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
