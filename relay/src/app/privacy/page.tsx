"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

const SECTIONS = [
    { id: 'basics', label: '1. The Basics' },
    { id: 'our-role', label: '2. Our Role' },
    { id: 'definitions', label: '3. Definitions' },
    { id: 'legal-bases', label: '4. Legal Bases' },
    { id: 'as-processor', label: '5. Data as Processor' },
    { id: 'as-controller', label: '6. Data as Controller' },
    { id: 'marketing', label: '7. Marketing' },
    { id: 'sharing', label: '8. Data Sharing' },
    { id: 'transfers', label: '9. International Transfers' },
    { id: 'security', label: '10. Security' },
    { id: 'rights', label: '11. Your Rights' },
    { id: 'retention', label: '12. Data Retention' },
    { id: 'cookies', label: '13. Cookies' },
    { id: 'children', label: '14. Children' },
    { id: 'changes', label: '15. Policy Changes' },
];

export default function PrivacyPolicy() {
    const [activeId, setActiveId] = useState('basics');

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
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050509]/90 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/30 transition-all">
                            <Zap className="text-white w-4 h-4" fill="currentColor" />
                        </div>
                        <span className="font-black text-lg tracking-tighter">RELAY</span>
                    </Link>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-16 flex gap-16">

                {/* Main Content */}
                <main className="flex-1 min-w-0 max-w-3xl">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            Legal Document
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                            Privacy Policy
                        </h1>
                        <p className="text-slate-500 text-sm">Last updated: May 2026&nbsp;&nbsp;·&nbsp;&nbsp;Applies to all Relay Services</p>
                    </div>

                    <div className="space-y-16 text-slate-300 leading-relaxed">

                        {/* 1 */}
                        <section id="basics">
                            <SH n="1." t="The Basics" />
                            <div className="space-y-4">
                                <p><strong className="text-white">Who we are.</strong> Aether Digital operates <strong className="text-white">Relay</strong> — a professional multi-channel notification infrastructure platform designed to help engineering teams deliver reliable, high-throughput product notifications across Email, WhatsApp, SMS, Telegram, Slack, and more through a single, unified API. Our platform is accessible at <a href="https://relay-notify.com" className="text-blue-400 hover:underline">relay-notify.com</a>.</p>
                                <p>This Privacy Policy explains what personal data we collect, why we collect it, how we use and protect it, and what rights and choices you have regarding your data. It applies to all visitors to our website and all users of the Relay platform.</p>
                                <p>If you have questions about your privacy, want to exercise any of the rights described below, or need to contact our data protection team, please reach out at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. We commit to responding to all data-related inquiries within five (5) business days.</p>
                                <p>This Privacy Policy is part of and should be read alongside our <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>. We recommend reviewing both documents periodically, as they may be updated to reflect changes in our practices or applicable law.</p>
                            </div>
                        </section>

                        {/* 2 */}
                        <section id="our-role">
                            <SH n="2." t="Our Role: Controller and Processor" />
                            <div className="space-y-4">
                                <p>Data protection law distinguishes between two types of parties: a <strong className="text-white">controller</strong>, who determines why and how personal data is processed, and a <strong className="text-white">processor</strong>, who handles personal data solely on the controller's behalf and in accordance with their instructions.</p>
                                <p><strong className="text-white">When you visit our website or create a Relay account</strong>, Aether Digital acts as a <strong className="text-white">controller</strong>. We determine the purposes for which data is collected and processed in those contexts.</p>
                                <p><strong className="text-white">When you use Relay to send notifications to your own end-users or customers</strong>, Aether Digital acts as a <strong className="text-white">processor</strong>. In this case, you (as our customer) are the controller of your end-users' personal data, and we process that data solely to deliver the Services you have requested. See Section 5 for more details on our role as a processor.</p>
                                <p>We take both roles seriously. In each scenario, we apply appropriate safeguards and operate with full respect for applicable data protection regulations, including the GDPR where applicable.</p>
                            </div>
                        </section>

                        {/* 3 */}
                        <section id="definitions">
                            <SH n="3." t="Definitions & Key Terms" />
                            <p className="mb-6">Throughout this Privacy Policy, the following terms carry the meanings set out below:</p>
                            <ul className="space-y-4 border-l-2 border-white/10 pl-6">
                                {[
                                    ['"Personal Data"', 'Any information that identifies or can reasonably be used to identify a natural person, directly or indirectly. This includes names, email addresses, IP addresses, device identifiers, and online behavioural data.'],
                                    ['"Services"', 'The Relay platform, APIs, SDKs, documentation, dashboard, and all associated products made available by Aether Digital.'],
                                    ['"User"', 'Any individual or organization that creates an account on the Relay platform or otherwise accesses the Services.'],
                                    ['"End-User"', 'A downstream recipient of notifications sent via the Relay platform by one of our customers.'],
                                    ['"Visitor"', 'Any individual who visits the Relay website at relay-notify.com without necessarily creating an account.'],
                                    ['"Controller"', 'The party that determines the purposes and means of processing personal data.'],
                                    ['"Processor"', 'The party that processes personal data on behalf of a controller, following the controller\'s instructions.'],
                                ].map(([term, def]) => (
                                    <li key={term as string}><strong className="text-white">{term}</strong> — {def}</li>
                                ))}
                            </ul>
                        </section>

                        {/* 4 */}
                        <section id="legal-bases">
                            <SH n="4." t="Legal Bases for Processing" />
                            <div className="space-y-4">
                                <p>Certain jurisdictions, particularly those subject to the EU General Data Protection Regulation (<strong className="text-white">"GDPR"</strong>), require that every act of personal data processing must rest on a valid legal basis. Aether Digital only processes personal data where a legal basis has been established. The legal bases we rely upon include:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Performance of a contract:</strong> Processing necessary to fulfill our obligations to you under our Terms of Service, such as creating and managing your account or delivering the Services you have subscribed to.</li>
                                    <li><strong className="text-white">Legitimate interests:</strong> Processing in our or a third party's legitimate interests, provided those interests are not overridden by your rights. This includes improving our platform, preventing fraud, and ensuring security.</li>
                                    <li><strong className="text-white">Consent:</strong> Where we rely on your consent (for example, for certain marketing communications), you always have the right to withdraw that consent at any time.</li>
                                    <li><strong className="text-white">Legal obligation:</strong> Processing required to comply with applicable laws, regulations, court orders, or lawful government requests.</li>
                                </ul>
                                <p>Where specific legal bases apply to a particular processing activity, we identify them in the relevant sections below.</p>
                            </div>
                        </section>

                        {/* 5 */}
                        <section id="as-processor">
                            <SH n="5." t="Personal Data We Process as a Processor" />
                            <div className="space-y-4">
                                <p>When our customers use Relay to send notifications to their end-users, we process personal data about those end-users solely on behalf of the customer and according to their instructions. In these circumstances, we are a processor and the customer is the controller of that data.</p>
                                <p>The personal data we may process in our capacity as a processor can include: full name, email address, phone number, device tokens for push notifications, and any additional metadata supplied by the customer through our API for the purpose of personalizing notification content.</p>
                                <p>If you are an end-user of one of our customers and have questions about how your personal data is used, or wish to exercise your privacy rights, you should contact the customer directly — they are the controller of your data and are responsible for responding to such requests.</p>
                                <p>A Data Processing Agreement (<strong className="text-white">"DPA"</strong>) is available to our customers upon request. The DPA governs the terms under which we process end-user data and outlines our respective obligations. Contact <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a> to request a copy.</p>
                            </div>
                        </section>

                        {/* 6 */}
                        <section id="as-controller">
                            <SH n="6." t="Personal Data We Collect as a Controller" />
                            <div className="space-y-6">
                                <p>The following describes the personal data we collect directly from Visitors and Users, why we collect it, how we use it, and the legal basis for doing so.</p>

                                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-3">
                                    <h3 className="text-white font-bold text-base">6.1 Website Visitors</h3>
                                    <p><strong className="text-white">Contact form submissions:</strong> When you reach out via our contact form or sign up for our newsletter, we collect the information you provide (name, company, email, message content). We use this information to respond to your inquiry or to send you product updates you have opted into. <em className="text-slate-400">Legal basis: performance of a contract / legitimate interests.</em></p>
                                    <p><strong className="text-white">Browsing and activity data:</strong> We automatically collect technical data when you visit our site, including your IP address, browser type, pages visited, time spent on each page, and referring URLs. This data is used for analytics, security monitoring, and to improve the user experience. <em className="text-slate-400">Legal basis: legitimate interests.</em></p>
                                </div>

                                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-3">
                                    <h3 className="text-white font-bold text-base">6.2 Registered Users</h3>
                                    <p><strong className="text-white">Registration data:</strong> To create an account, we collect your full name and email address. If you register using a third-party provider (e.g. GitHub or Google), we also receive basic profile information from that provider such as your username, email, and profile photo. We use registration data to create and manage your account, protect platform security, and communicate with you about the Services. <em className="text-slate-400">Legal basis: performance of a contract.</em></p>
                                    <p><strong className="text-white">Platform usage data:</strong> We collect data about how you interact with the Relay dashboard and API, including features used, configuration changes, and notification throughput. This data is used to maintain platform stability, prevent abuse, and improve our product offering. <em className="text-slate-400">Legal basis: legitimate interests.</em></p>
                                    <p><strong className="text-white">Billing data:</strong> If you subscribe to a paid plan, payment information is collected and processed by our third-party payment provider. We do not store complete payment card details on our servers. We receive transaction confirmation and billing metadata for account management purposes. <em className="text-slate-400">Legal basis: performance of a contract.</em></p>
                                </div>
                            </div>
                        </section>

                        {/* 7 */}
                        <section id="marketing">
                            <SH n="7." t="Our Marketing Activities" />
                            <div className="space-y-4">
                                <p>We may use your contact information to send you product updates, feature announcements, and informational newsletters about Relay and the notification infrastructure space. We aim to keep marketing communications relevant, infrequent, and genuinely useful.</p>
                                <p><strong className="text-white">How to opt out:</strong> You can unsubscribe from marketing emails at any time by clicking the "Unsubscribe" link found in the footer of any marketing email, or by contacting us directly at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. Opting out of marketing communications will not affect transactional or service-related messages, which we may still need to send you as part of providing the Services (for example, billing receipts, security alerts, or critical platform notices).</p>
                            </div>
                        </section>

                        {/* 8 */}
                        <section id="sharing">
                            <SH n="8." t="How We Share Personal Data" />
                            <div className="space-y-4">
                                <p>We do not sell your personal data to third parties. We share personal data only in the circumstances described below:</p>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Service Providers (Sub-processors)</h3>
                                        <p>We engage trusted third-party service providers to help us operate the platform. These providers are permitted to process personal data only to deliver their specific services to us, are bound by confidentiality obligations, and are prohibited from using your data for any other purpose. Categories of sub-processors we use include:</p>
                                        <div className="overflow-x-auto mt-4">
                                            <table className="w-full text-sm border-collapse">
                                                <thead><tr className="border-b border-white/10 text-left text-slate-400">
                                                    <th className="pb-3 pr-6 font-semibold">Category</th>
                                                    <th className="pb-3 pr-6 font-semibold">Purpose</th>
                                                    <th className="pb-3 font-semibold">Data Shared</th>
                                                </tr></thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {[
                                                        ['Cloud Infrastructure', 'Hosting, storage, and compute for the Platform', 'All data processed through the platform'],
                                                        ['Email & Communication', 'Sending transactional and marketing emails', 'Name, email address'],
                                                        ['Payment Processing', 'Handling subscription billing and invoicing', 'Billing name, email, payment metadata'],
                                                        ['Error Monitoring', 'Detecting and diagnosing platform errors', 'IP address, anonymized usage traces'],
                                                        ['Analytics', 'Understanding website and platform usage', 'IP address, browser data, usage events'],
                                                    ].map(([cat, purpose, data]) => (
                                                        <tr key={cat} className="text-slate-400">
                                                            <td className="py-3 pr-6 text-slate-300 font-medium">{cat}</td>
                                                            <td className="py-3 pr-6">{purpose}</td>
                                                            <td className="py-3">{data}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Business Transfers</h3>
                                        <p>In the event of a merger, acquisition, restructuring, or sale of all or part of our business, personal data may be transferred as part of that transaction. If such a transfer occurs, your data will continue to be subject to the protections described in this Privacy Policy, and we will notify you of any material changes.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Legal Disclosure</h3>
                                        <p>We may disclose personal data to law enforcement agencies, regulatory authorities, or other third parties where we are legally required to do so, or where we believe disclosure is necessary to protect our rights, the safety of our users, or to prevent illegal activity.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 9 */}
                        <section id="transfers">
                            <SH n="9." t="International Data Transfers" />
                            <div className="space-y-4">
                                <p>Aether Digital and some of our service providers operate across jurisdictions, which may result in your personal data being processed in countries outside your country of residence, including countries outside the European Economic Area (<strong className="text-white">"EEA"</strong>).</p>
                                <p>Where we transfer personal data internationally, we implement appropriate safeguards to ensure your data receives a level of protection consistent with this Privacy Policy and applicable data protection law. These safeguards may include:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Transferring data to countries that have been recognized by the relevant authority (e.g. the European Commission) as providing an adequate level of data protection.</li>
                                    <li>Executing Standard Contractual Clauses (SCCs) approved by the European Commission with recipients of personal data outside the EEA.</li>
                                    <li>Applying supplementary technical and organizational security measures where the circumstances require.</li>
                                </ul>
                                <p>To learn more about the specific mechanisms used for any particular international transfer of your data, please contact us at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>.</p>
                            </div>
                        </section>

                        {/* 10 */}
                        <section id="security">
                            <SH n="10." t="Security" />
                            <div className="space-y-4">
                                <p>The security of your personal data is a fundamental priority for us. Relay applies industry-standard technical and organizational security measures to protect your data against unauthorized access, accidental loss, destruction, or disclosure. These measures include data encryption in transit (TLS) and at rest, access controls based on the principle of least privilege, secure API key management, and regular security reviews of our systems and processes.</p>
                                <p>While we invest significantly in securing the platform, no system can guarantee absolute security. The overall security of your data also depends on the precautions you take on your own side — such as keeping your account credentials confidential, using strong and unique passwords, and securing the devices you use to access the Services. We strongly recommend enabling two-factor authentication on your account where available.</p>
                                <p>If you discover or suspect a security vulnerability in the Relay platform, please disclose it responsibly by contacting us immediately at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. We treat all security reports with urgency and confidentiality.</p>
                            </div>
                        </section>

                        {/* 11 */}
                        <section id="rights">
                            <SH n="11." t="Your Rights" />
                            <div className="space-y-4">
                                <p>Depending on the laws that apply to you, you may have certain rights over your personal data. Below is a summary of common rights, particularly those granted under the GDPR. To exercise any of these rights, contact us at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. We may ask for reasonable evidence of your identity before processing your request.</p>
                                <div className="space-y-3">
                                    {[
                                        ['Right of Access', 'You may request a copy of the personal data we hold about you and information about how we use it.'],
                                        ['Right to Rectification', 'You may request that we correct any inaccurate or incomplete personal data we hold about you.'],
                                        ['Right to Erasure', 'You may request deletion of your personal data where there is no longer a compelling reason for us to retain it. Note that certain data may need to be retained to comply with legal obligations.'],
                                        ['Right to Restrict Processing', 'You may request that we pause processing of your personal data in certain circumstances, for example while we verify the accuracy of data you dispute.'],
                                        ['Right to Data Portability', 'Where processing is based on consent or contract, you may request a structured, machine-readable export of the personal data you provided to us.'],
                                        ['Right to Object', 'You may object to processing based on our legitimate interests, including processing for direct marketing purposes. We will stop such processing unless we can demonstrate compelling legitimate grounds that override your interests.'],
                                        ['Right to Withdraw Consent', 'Where processing is based on your consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing carried out before withdrawal.'],
                                        ['Right to Lodge a Complaint', 'If you are located in the EU or UK, you have the right to submit a complaint to your local data protection authority. We would appreciate the opportunity to address your concerns first.'],
                                    ].map(([right, desc]) => (
                                        <div key={right as string} className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                                            <p className="text-white font-semibold text-sm mb-1">{right}</p>
                                            <p className="text-slate-400 text-sm">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 12 */}
                        <section id="retention">
                            <SH n="12." t="Data Retention" />
                            <div className="space-y-4">
                                <p>We retain personal data only for as long as is necessary to fulfill the purposes for which it was collected, including satisfying legal, regulatory, or reporting requirements. When a retention period has expired, we securely delete or anonymize the relevant data.</p>
                                <p>The specific retention periods we apply vary depending on the type of data and the purpose for which it was collected. Factors we consider when setting retention periods include the sensitivity of the data, the potential risk of harm from unauthorized disclosure, the purpose for which it was originally collected, and whether we can achieve the same purpose by retaining less data.</p>
                                <p>Please note that our service providers and sub-processors maintain their own independent data retention policies. To obtain details about the specific retention periods applicable to particular types of personal data we process, contact us at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>.</p>
                            </div>
                        </section>

                        {/* 13 */}
                        <section id="cookies">
                            <SH n="13." t="Cookies & Tracking Technologies" />
                            <div className="space-y-4">
                                <p>Cookies are small text files that a website places on your device to store lightweight data. We, and certain third-party services we use, place cookies on your browser when you visit relay-notify.com. Similar technologies — such as local storage, pixel tags, and session tokens — may also be used for equivalent purposes.</p>
                                <p>The cookies we use fall broadly into the following categories:</p>
                                <div className="overflow-x-auto mt-2">
                                    <table className="w-full text-sm border-collapse">
                                        <thead><tr className="border-b border-white/10 text-left text-slate-400">
                                            <th className="pb-3 pr-6 font-semibold">Type</th>
                                            <th className="pb-3 font-semibold">Purpose</th>
                                        </tr></thead>
                                        <tbody className="divide-y divide-white/5">
                                            {[
                                                ['Essential', 'Required for the site and platform to function. These cannot be disabled.'],
                                                ['Functional', 'Remember your preferences, such as language selection or dashboard layout.'],
                                                ['Security', 'Help prevent fraud and protect session integrity.'],
                                                ['Analytics', 'Collect anonymized usage data to help us understand and improve the platform.'],
                                            ].map(([type, purpose]) => (
                                                <tr key={type} className="text-slate-400">
                                                    <td className="py-3 pr-6 text-slate-300 font-medium">{type}</td>
                                                    <td className="py-3">{purpose}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p>Most browsers accept cookies by default, but you can adjust your browser settings to refuse all or certain types of cookies. Please note that disabling cookies may affect the functionality of parts of the Services. You can also delete existing cookies from your browser at any time.</p>
                            </div>
                        </section>

                        {/* 14 */}
                        <section id="children">
                            <SH n="14." t="Children's Privacy" />
                            <div className="space-y-4">
                                <p>The Relay platform is designed for professional use by businesses and developers and is not directed at children under the age of sixteen (16). We do not knowingly collect personal data from individuals under this age. If you become aware that a minor has created an account or provided us with personal data without appropriate parental consent, please notify us immediately at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a> and we will take steps to delete such data promptly.</p>
                            </div>
                        </section>

                        {/* 15 */}
                        <section id="changes">
                            <SH n="15." t="Changes to This Policy" />
                            <div className="space-y-4">
                                <p>We may update this Privacy Policy periodically to reflect changes in our data practices, legal requirements, or the features of the Services. When we make material changes, we will update the "Last updated" date at the top of this document and, where appropriate, notify you by email or via a prominent notice within the platform.</p>
                                <p>We encourage you to review this Privacy Policy from time to time to stay informed about how we are protecting your data. Your continued use of the Services after any update to this Policy constitutes your acknowledgment of the changes and, where required by law, your consent to the updated practices.</p>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
                            <p>© 2026 Aether Digital · Relay Protocol · All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                                <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
                                <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">← Back to Relay</Link>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Sticky TOC Sidebar */}
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
