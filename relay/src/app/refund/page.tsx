"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

const SECTIONS = [
    { id: 'overview', label: '1. Overview' },
    { id: 'alpha', label: '2. Alpha Phase' },
    { id: 'paid-plans', label: '3. Paid Subscriptions' },
    { id: 'eligibility', label: '4. Refund Eligibility' },
    { id: 'non-refundable', label: '5. Non-Refundable Items' },
    { id: 'process', label: '6. Refund Process' },
    { id: 'timeline', label: '7. Processing Timeline' },
    { id: 'disputes', label: '8. Disputes & Chargebacks' },
    { id: 'cancellation', label: '9. Cancellation Policy' },
    { id: 'contact', label: '10. Contact' },
];

export default function RefundPolicy() {
    const [activeId, setActiveId] = useState('overview');

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
                { rootMargin: '-20% 0px -70% 0px' }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach(o => o.disconnect());
    }, []);

    return (
        <div className="min-h-screen bg-[#050509] text-white font-sans">
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050509]/90 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/30 transition-all">
                            <Zap className="text-white w-4 h-4" fill="currentColor" />
                        </div>
                        <span className="font-black text-lg tracking-tighter">RELAY</span>
                    </Link>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/dpa" className="hover:text-white transition-colors">DPA</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-16 flex gap-16">
                <main className="flex-1 min-w-0 max-w-3xl">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            Legal Document
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                            Refund Policy
                        </h1>
                        <p className="text-slate-500 text-sm">Last updated: May 2026&nbsp;&nbsp;·&nbsp;&nbsp;Applies to all Relay paid plans</p>
                    </div>

                    <div className="space-y-16 text-slate-300 leading-relaxed">

                        <section id="overview">
                            <SH n="1." t="Overview" />
                            <div className="space-y-4">
                                <p>This Refund Policy governs all payment transactions made in connection with the Relay notification infrastructure platform, operated by Aether Digital (<strong className="text-white">"Relay"</strong>, <strong className="text-white">"we"</strong>, <strong className="text-white">"us"</strong>, or <strong className="text-white">"our"</strong>). It should be read in conjunction with our <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>.</p>
                                <p>We are committed to fair and transparent billing practices. Our goal is to ensure that every customer paying for the Services feels confident that their investment is protected. If you encounter any billing issue, we encourage you to contact us before initiating any dispute with your payment provider — we resolve the overwhelming majority of cases quickly and without friction.</p>
                                <p>By subscribing to any paid plan offered by Relay, you acknowledge that you have read and agree to this Refund Policy.</p>
                            </div>
                        </section>

                        <section id="alpha">
                            <SH n="2." t="Alpha Phase — No Charges Apply" />
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    <p className="text-blue-300 text-sm font-medium">Relay is currently operating in its <strong>Alpha phase</strong>. During this period, access to the platform is provided entirely free of charge to approved early adopters and waitlist members. No payment information is required to use the Services during Alpha, and therefore no refund requests will arise from this period.</p>
                                </div>
                                <p>The Alpha phase is designed to gather real-world feedback, validate infrastructure performance, and iteratively improve the platform before commercial launch. Participants in the Alpha program gain early access to all features without any financial commitment.</p>
                                <p>We will provide clear advance notice — communicated via email to all registered users — before any paid plan is activated or required. This Refund Policy is published in advance so that users understand the billing terms that will apply when commercial plans are introduced.</p>
                            </div>
                        </section>

                        <section id="paid-plans">
                            <SH n="3." t="Paid Subscriptions" />
                            <div className="space-y-4">
                                <p>When Relay commercially launches paid subscription tiers, the following billing terms will apply:</p>
                                <ul className="list-disc pl-6 space-y-3">
                                    <li><strong className="text-white">Billing cycle:</strong> Subscriptions are billed in advance on a monthly or annual basis, depending on the plan selected at checkout. The billing date is set at the time of initial purchase and recurs on the same calendar day each period.</li>
                                    <li><strong className="text-white">Automatic renewal:</strong> All subscriptions renew automatically unless cancelled prior to the renewal date. You will receive a reminder email at least seven (7) days before any renewal charge is processed.</li>
                                    <li><strong className="text-white">Plan changes:</strong> Upgrades take effect immediately and are billed on a prorated basis for the remainder of the current billing cycle. Downgrades take effect at the start of the next billing cycle, with no partial credit issued for the current period.</li>
                                    <li><strong className="text-white">Trial periods:</strong> Where a free trial is offered, no charge is made until the trial period expires. You may cancel at any time during the trial without being charged. Trial extensions are at Relay's sole discretion.</li>
                                    <li><strong className="text-white">Currency and taxes:</strong> All fees are stated in US Dollars (USD) and are exclusive of applicable taxes. You are responsible for all taxes imposed on your subscription in your jurisdiction.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="eligibility">
                            <SH n="4." t="Refund Eligibility" />
                            <div className="space-y-4">
                                <p>Relay offers a <strong className="text-white">14-day money-back guarantee</strong> for all new paid subscriptions. If you are not satisfied with the Services for any reason, you may request a full refund of your most recent subscription fee within fourteen (14) calendar days of the initial charge. This guarantee applies to first-time purchases only and may not be applied to subsequent billing cycles or renewal charges.</p>
                                <p>In addition to the 14-day guarantee, refund requests will be considered — at our reasonable discretion — in the following circumstances:</p>
                                <div className="space-y-3">
                                    {[
                                        ['Billing error', 'You were charged an incorrect amount, charged twice for the same period, or charged after a valid cancellation confirmation was received.'],
                                        ['Extended service outage', 'The Relay platform experienced unplanned downtime exceeding the availability commitments stated in your plan\'s Service Level Agreement (SLA) within the billing period in question.'],
                                        ['Feature unavailability', 'A core feature explicitly advertised as included in your plan was materially unavailable for an extended period not caused by scheduled maintenance.'],
                                        ['Unauthorized charge', 'A charge was made to your payment method without your authorization, and you notify us within thirty (30) days of the transaction date.'],
                                    ].map(([title, desc]) => (
                                        <div key={title as string} className="flex gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
                                                <p className="text-slate-400 text-sm">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p>All refund requests outside the 14-day guarantee window are evaluated on a case-by-case basis. Relay reserves the right to decline refund requests that do not meet the eligibility criteria described above.</p>
                            </div>
                        </section>

                        <section id="non-refundable">
                            <SH n="5." t="Non-Refundable Items" />
                            <div className="space-y-4">
                                <p>The following items and charges are explicitly non-refundable under this policy:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Subscription fees for any billing period that has already commenced and been partially consumed, except where the 14-day guarantee or SLA breach provisions apply.</li>
                                    <li>Usage-based charges, such as per-notification fees or overage charges for message volume exceeding plan limits, once those notifications have been dispatched.</li>
                                    <li>Fees for professional services, custom integrations, or dedicated onboarding engagements that have been fully or partially delivered.</li>
                                    <li>Add-ons, premium features, or supplementary packages that have been activated and used prior to the cancellation or refund request.</li>
                                    <li>Subscription fees for accounts that have been terminated by Relay due to a material breach of the Terms of Service by the User.</li>
                                    <li>Annual subscription fees requested for refund after the 14-day window has expired, except where a verified SLA breach or billing error applies.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="process">
                            <SH n="6." t="How to Request a Refund" />
                            <div className="space-y-4">
                                <p>To initiate a refund request, please contact our billing team by emailing <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a> with the subject line <strong className="text-white">"Refund Request — [Your Account Email]"</strong>. Your request should include:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>The email address associated with your Relay account.</li>
                                    <li>The date and approximate amount of the charge you are disputing.</li>
                                    <li>A brief description of the reason for your refund request.</li>
                                    <li>Any relevant supporting documentation, such as error logs, screenshots, or communication records, if applicable.</li>
                                </ul>
                                <p>Our team will acknowledge your request within two (2) business days and will provide a decision within five (5) business days. If additional information is required to process your request, we will notify you during this window. Approved refunds will be issued to the original payment method and may not be redirected to a different card, account, or payment provider.</p>
                            </div>
                        </section>

                        <section id="timeline">
                            <SH n="7." t="Refund Processing Timeline" />
                            <div className="space-y-4">
                                <p>Once a refund has been approved, we initiate the transaction immediately. However, the time required for the refunded amount to appear in your account depends on your payment provider and financial institution:</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead><tr className="border-b border-white/10 text-left text-slate-400">
                                            <th className="pb-3 pr-6 font-semibold">Payment Method</th>
                                            <th className="pb-3 font-semibold">Estimated Return Time</th>
                                        </tr></thead>
                                        <tbody className="divide-y divide-white/5">
                                            {[
                                                ['Credit / Debit Card', '5–10 business days'],
                                                ['PayPal', '3–5 business days'],
                                                ['Bank Transfer (ACH / SEPA)', '5–14 business days'],
                                                ['Cryptocurrency', 'Non-refundable (contact us for alternatives)'],
                                            ].map(([method, timeline]) => (
                                                <tr key={method} className="text-slate-400">
                                                    <td className="py-3 pr-6 text-slate-300 font-medium">{method}</td>
                                                    <td className="py-3">{timeline}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p>Relay bears no responsibility for delays attributable to your bank or payment processor beyond our control. If your refund has not been received after fifteen (15) business days from the approval date, please contact us and we will investigate with the payment processor on your behalf.</p>
                            </div>
                        </section>

                        <section id="disputes">
                            <SH n="8." t="Disputes & Chargebacks" />
                            <div className="space-y-4">
                                <p>We strongly encourage you to contact Relay directly before initiating a chargeback or dispute with your card issuer or bank. In the vast majority of cases, billing issues can be resolved faster and more completely through direct communication with our team than through a third-party dispute process.</p>
                                <p>If a chargeback is initiated without prior contact with Relay, we reserve the right to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Immediately suspend access to the Services pending resolution of the dispute.</li>
                                    <li>Provide the payment processor with all available evidence of service delivery in order to contest the chargeback.</li>
                                    <li>Permanently terminate the associated account upon a finding of fraudulent chargeback activity.</li>
                                </ul>
                                <p>If a chargeback is ruled in your favor by the payment provider, Relay will accept that outcome. If we successfully contest a chargeback that we determine was made in bad faith, we may pursue recovery of all associated fees, including processing fees imposed on us by the payment provider as a result of the dispute.</p>
                            </div>
                        </section>

                        <section id="cancellation">
                            <SH n="9." t="Cancellation Policy" />
                            <div className="space-y-4">
                                <p>You may cancel your Relay subscription at any time through the account settings panel in your dashboard or by contacting us at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. Cancellations take effect at the end of the current billing period — your access to the Services and all associated features will remain active until that date.</p>
                                <p>Cancellation does not entitle you to a refund of any subscription fee already paid for the current billing period, unless you are within the 14-day money-back guarantee window described in Section 4. Cancelling your subscription will prevent any future automatic renewal charges from being applied.</p>
                                <p>Upon cancellation, your account data (including notification logs, templates, subscriber records, and API configurations) will be retained for sixty (60) days to allow you to export or retrieve your data before it is permanently deleted from our systems.</p>
                                <p>Relay reserves the right to cancel or suspend any account at any time for breach of our Terms of Service. In such cases, refunds will not be issued unless the termination resulted from a platform error attributable to Relay.</p>
                            </div>
                        </section>

                        <section id="contact">
                            <SH n="10." t="Contact & Support" />
                            <div className="space-y-4">
                                <p>For all billing inquiries, refund requests, or questions about this policy, please reach out to our team at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. We aim to respond to all billing-related inquiries within two (2) business days.</p>
                                <p>When contacting us, please include your account email address and, where relevant, the transaction reference number provided in your billing confirmation email. This allows us to locate your account and resolve your inquiry as efficiently as possible.</p>
                                <p>For general product support or technical issues unrelated to billing, please use the same contact address with a clear description of your issue, and our engineering team will assist you.</p>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
                            <p>© 2026 Aether Digital · Relay Protocol · All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <Link href="/dpa" className="hover:text-white transition-colors">DPA</Link>
                                <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">← Back to Relay</Link>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">On this page</p>
                        <nav className="space-y-1">
                            {SECTIONS.map(({ id, label }) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    onClick={e => {
                                        e.preventDefault();
                                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`block text-sm py-1.5 px-3 rounded-lg transition-all duration-200 ${activeId === id
                                            ? 'bg-blue-500/10 text-blue-400 font-semibold border-l-2 border-blue-500'
                                            : 'text-slate-500 hover:text-slate-300 border-l-2 border-transparent'
                                        }`}
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <Link href="/" className="flex items-center gap-2 text-xs text-slate-600 hover:text-white transition-colors">
                                ← Back to Relay
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function SH({ n, t }: { n: string; t: string }) {
    return (
        <div className="flex items-baseline gap-3 mb-6 pb-3 border-b border-white/10">
            <span className="text-blue-500 font-black text-2xl">{n}</span>
            <h2 className="text-2xl font-black text-white tracking-tight">{t}</h2>
        </div>
    );
}
