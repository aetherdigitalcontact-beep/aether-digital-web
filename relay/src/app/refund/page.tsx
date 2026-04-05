"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Ban, ShieldAlert, CreditCard } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { dictionaries, Language } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function RefundPage() {
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
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{d.legal?.refund || "Refund Policy"}</h1>
                    <p className="text-slate-500 text-lg uppercase font-bold tracking-widest">Digital Service Protocols</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-invert prose-slate max-w-none space-y-12"
                >
                    <section className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Ban className="w-16 h-16 text-red-500" strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3 text-red-500">
                            No Refund Policy
                        </h2>
                        <p className="text-slate-300 leading-relaxed font-medium">
                            Due to the digital and instantaneous nature of the Relay notification infrastructure and the associated usage quotas (API keys, message credits), <strong>all sales are final</strong>. Once a subscription is activated, we cannot provide refunds, credits, or prorated billing for unused portions of the billing cycle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-accent" />
                            Cancellations
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            You can cancel your subscription at any time via the dashboard. Access to the Relay Uplink will remain active until the end of your current billing period, after which your account will revert to the Hobby tier. No further charges will be incurred after cancellation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-accent" />
                            Exceptions
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Relay reserves the right to issue refunds at its sole discretion in cases of documented service negligence where a 99.9% SLA was missed for established Enterprise customers. For all other billing inquiries, contact <code className="bg-white/5 px-2 py-1 rounded text-accent">aetherdigital.contact@gmail.com</code>.
                        </p>
                    </section>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
