"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

const SECTIONS = [
    { id: 'general', label: 'A. General' },
    { id: 'privacy', label: 'B. Privacy Integration' },
    { id: 'definitions', label: 'C. Definitions' },
    { id: 'permitted-use', label: 'D. Permitted Use' },
    { id: 'account', label: 'E. Account & Registration' },
    { id: 'ip', label: 'F. Intellectual Property' },
    { id: 'billing', label: 'G. Paid Services & Billing' },
    { id: 'enforcement', label: 'H. Enforcement' },
    { id: 'liability', label: 'I. Liability & Risk' },
    { id: 'licensing', label: 'J. Open Infrastructure' },
    { id: 'third-party', label: 'K. Third-Party Services' },
    { id: 'miscellaneous', label: 'L. General Provisions' },
];

export default function TermsOfService() {
    const [activeId, setActiveId] = useState('general');

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
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-16 flex gap-16">

                {/* Main Content */}
                <main className="flex-1 min-w-0 max-w-3xl">
                    {/* Title */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            Legal Document
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                            Terms of Service
                        </h1>
                        <p className="text-slate-500 text-sm">Last updated: May 2026&nbsp;&nbsp;·&nbsp;&nbsp;Effective immediately upon use</p>
                    </div>

                    <div className="space-y-16 text-slate-300 leading-relaxed">

                        {/* A */}
                        <section id="general">
                            <SectionHeading label="A." title="General" />
                            <div className="space-y-4">
                                <p>These Terms of Service (<strong className="text-white">"Terms"</strong>) constitute a legally binding agreement between you and Aether Digital (<strong className="text-white">"Relay"</strong>, <strong className="text-white">"we"</strong>, <strong className="text-white">"us"</strong>, or <strong className="text-white">"our"</strong>) governing your access to and use of the Relay website located at <a href="https://relay-notify.com" className="text-blue-400 hover:underline">relay-notify.com</a> and the Relay notification infrastructure platform (together, the <strong className="text-white">"Services"</strong>). By accessing, browsing, or making any use of the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms in full. If you do not agree to any part of these Terms, you must immediately discontinue all use of the Services.</p>
                                <p>Relay reserves the right to revise, update, or replace these Terms at any time and entirely at our discretion, with or without advance notice. The date of the most recent revision appears at the top of this document. Your continued use of the Services following any modification constitutes your unconditional acceptance of the updated Terms. We encourage you to review this page periodically.</p>
                                <p>In the event of any inconsistency or conflict between these Terms and any other content, promotional materials, or communications published in connection with the Services, the provisions of these Terms shall take precedence.</p>
                            </div>
                        </section>

                        {/* B */}
                        <section id="privacy">
                            <SectionHeading label="B." title="Privacy Integration" />
                            <div className="space-y-4">
                                <p>These Terms incorporate by reference and should be read in conjunction with our <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>, which describes how we collect, process, secure, and handle personal data in connection with the Services. By accepting these Terms, you also acknowledge that you have reviewed and agree to our Privacy Policy.</p>
                                <p>If you integrate Relay into your application and, in doing so, supply Relay with personal data belonging to your own end-users or customers (<strong className="text-white">"End-User Data"</strong>), you represent and warrant that: (i) you have obtained all legally required consents, notices, and authorizations necessary to transfer such data to Relay for the purpose of delivering the Services; (ii) you have a documented legal basis under all applicable privacy laws, including but not limited to GDPR and CCPA, for each processing activity; (iii) you will not transmit to Relay sensitive categories of personal data — including but not limited to health records, financial account details, biometric data, or data relating to minors under the age of thirteen — unless you have entered into a separate written agreement with Relay authorizing such transmission; and (iv) you acknowledge that, with respect to End-User Data, you act as the data controller and Relay acts solely as a data processor executing your instructions.</p>
                                <p>A Data Processing Agreement (<strong className="text-white">"DPA"</strong>) is available upon request at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. Once executed, the DPA is incorporated into and forms part of these Terms and governs all processing of End-User Data. You agree to fulfill your own obligations as a data controller under applicable law at all times.</p>
                            </div>
                        </section>

                        {/* C */}
                        <section id="definitions">
                            <SectionHeading label="C." title="Definitions" />
                            <p className="mb-6">The following capitalized terms carry the meanings set out below throughout these Terms, unless the context expressly requires otherwise:</p>
                            <ul className="space-y-4 border-l-2 border-white/10 pl-6">
                                {[
                                    ['"Services"', 'Refers collectively to the Relay website, the Relay notification infrastructure API and dashboard, all related documentation, software development kits (SDKs), and any supplementary services provided by Aether Digital.'],
                                    ['"Platform"', 'The cloud-based developer infrastructure provided by Relay through which registered Users can configure, dispatch, and monitor multi-channel notifications.'],
                                    ['"Account"', 'A registered profile created by a User or organization that grants authenticated access to the Platform and its management features.'],
                                    ['"User" or "You"', 'Any individual or legal entity that creates an Account, accesses the Platform, or otherwise interacts with the Services.'],
                                    ['"End-User"', 'A downstream recipient of notifications sent via the Platform by a User on behalf of the User\'s product or service.'],
                                    ['"API Key"', 'A unique authentication credential issued by Relay to a registered User, used to authorize programmatic access to the Platform.'],
                                    ['"Content"', 'Any data, text, images, code, notification templates, or other material uploaded to, stored on, or transmitted through the Platform by a User.'],
                                    ['"Device"', 'Any computer, mobile device, server, or network-connected hardware through which you access or consume the Services.'],
                                ].map(([term, def]) => (
                                    <li key={term as string}>
                                        <strong className="text-white">{term}</strong> — {def}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* D */}
                        <section id="permitted-use">
                            <SectionHeading label="D." title="Permitted Use of the Platform" />
                            <div className="space-y-4">
                                <p>Subject to your full compliance with these Terms, Relay grants you a limited, personal, non-exclusive, non-transferable, revocable license to access and use the Services solely for your lawful internal business or development purposes. This license does not include any right to sublicense, resell, or otherwise make the Services available to third parties unless expressly authorized in writing by Relay.</p>
                                <p>You are solely responsible for ensuring that any Device you use to connect to the Services satisfies the technical requirements necessary for a functioning and secure experience. Relay bears no liability for any degraded experience resulting from incompatible hardware, outdated software, or inadequate network connectivity on your end.</p>
                                <p className="font-semibold text-white">You expressly agree that you will <em>not</em>:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Impersonate any person, organization, or legal entity, or misrepresent your identity or affiliation with any party.</li>
                                    <li>Submit false, misleading, or fabricated information during registration or at any point during your use of the Services.</li>
                                    <li>Upload, transmit, or otherwise introduce to the Platform any malicious code, software viruses, trojans, worms, ransomware, or any other harmful or disruptive program.</li>
                                    <li>Use the Platform to distribute unsolicited bulk messages, spam, phishing communications, or any content that violates anti-spam legislation in any jurisdiction.</li>
                                    <li>Reverse-engineer, decompile, disassemble, or attempt to derive the source code or underlying architecture of any component of the Services.</li>
                                    <li>Reproduce, copy, mirror, cache, frame, or otherwise embed any portion of the Services on external websites without the prior written consent of Relay.</li>
                                    <li>Use automated bots, crawlers, scrapers, data miners, or similar tools to systematically extract, index, or harvest content or metadata from the Services.</li>
                                    <li>Circumvent, disable, or otherwise interfere with security-related features of the Platform, including features that prevent or restrict use or copying of any Content.</li>
                                    <li>Use the Services in any manner that could damage, disable, overburden, or impair the Platform infrastructure or the experience of other Users.</li>
                                    <li>Violate any applicable law, regulation, or third-party right, including intellectual property rights and data protection laws, in connection with your use of the Services.</li>
                                    <li>Use the Services to process, transmit, or store content that is unlawful, defamatory, harassing, abusive, fraudulent, obscene, or otherwise objectionable.</li>
                                    <li>Attempt to gain unauthorized access to any part of the Services, other Accounts, or any systems or networks connected to the Platform.</li>
                                </ul>
                                <p>Relay reserves the right to investigate suspected violations of these prohibitions and to take any action it deems appropriate, including suspension or termination of your Account, without prior notice or liability.</p>
                            </div>
                        </section>

                        {/* E */}
                        <section id="account">
                            <SectionHeading label="E." title="Account & Registration" />
                            <div className="space-y-4">
                                <p>Access to certain features of the Services requires the creation of an Account. By registering, you affirm that all information you provide is truthful, complete, and current, and you agree to maintain the accuracy of this information throughout the duration of your Account. If you are registering on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms.</p>
                                <p>You are solely responsible for maintaining the confidentiality of your Account credentials, including your password and any API Keys issued to your Account. You agree not to share your credentials with any third party and to take reasonable precautions to prevent unauthorized access. If you suspect that your credentials have been compromised, you must notify Relay immediately at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a> and change your password without delay. Relay will not be held liable for any loss or damage arising from unauthorized access resulting from your failure to protect your credentials.</p>
                                <p>You are fully responsible for all activity that occurs under your Account, whether performed by you, your employees, your contractors, or any unauthorized party. Relay may, in its sole and absolute discretion, suspend, restrict, or permanently terminate any Account at any time and without prior notice if it determines that the Account is being used in violation of these Terms, applicable law, or in a manner that poses risk to the Platform or its users. Termination of an Account shall not entitle you to any compensation or refund, except as may be separately provided under Section G.</p>
                                <p>Each legal entity or individual may maintain only one active Account unless Relay has granted explicit written permission for multiple Accounts.</p>
                            </div>
                        </section>

                        {/* F */}
                        <section id="ip">
                            <SectionHeading label="F." title="Intellectual Property" />
                            <div className="space-y-4">
                                <p>All rights, title, and interest in and to the Services — including without limitation the Platform, the Relay website, all software code, algorithms, APIs, visual design elements, user interfaces, documentation, trademarks, trade names, service marks, logos, and all other proprietary materials — are and shall remain the exclusive property of Aether Digital or its licensors. Nothing contained in these Terms shall be construed as conferring upon you any ownership right or license in or to any such intellectual property, beyond the limited access license described in Section D.</p>
                                <p>The Relay name, logo, and all related marks are trademarks of Aether Digital. You are not permitted to use any Relay trademark, trade name, or service mark in any manner — including but not limited to advertising, promotional materials, or domain names — without the prior written consent of Aether Digital. Unauthorized use of Relay's trademarks may constitute infringement and will be enforced to the fullest extent of the law.</p>
                                <p>You retain all ownership rights in Content that you upload or transmit through the Platform. By submitting Content to the Platform, you grant Relay a limited, non-exclusive, royalty-free, worldwide license to process, store, transmit, and display your Content solely to the extent necessary to provide and improve the Services. Relay does not claim ownership over your Content and will not use it for any purpose beyond service delivery.</p>
                                <p>Unless you expressly instruct otherwise in writing, Relay may identify you as a customer and display your company name and logo for marketing and reference purposes, subject to any trademark usage guidelines you communicate to us.</p>
                                <p>You must not remove, obscure, or modify any copyright notices, trademark symbols, or other proprietary legends included in or on any part of the Services.</p>
                            </div>
                        </section>

                        {/* G */}
                        <section id="billing">
                            <SectionHeading label="G." title="Paid Services & Billing" />
                            <div className="space-y-4">
                                <p>Certain features of the Services are available exclusively under paid subscription plans (<strong className="text-white">"Paid Services"</strong>). A detailed description of available plans, their pricing, included usage limits, and any applicable feature restrictions will be made available during the purchase or upgrade flow, prior to any financial commitment on your part.</p>
                                <p>All fees for Paid Services are stated exclusive of applicable taxes. You are responsible for the payment of all taxes, levies, duties, or similar governmental assessments applicable to your subscription, including sales tax, VAT, GST, or equivalent, as determined by your jurisdiction of residence or operation.</p>
                                <p>Payment for Paid Services is processed at the start of each billing cycle. Subscriptions renew automatically unless cancelled prior to the renewal date. You authorize Relay to charge your designated payment method on a recurring basis for the applicable subscription fee. If any payment fails or is declined, Relay reserves the right to suspend access to Paid Services immediately and for up to thirty (30) calendar days following written notice. If the outstanding balance is not resolved within that period, Relay may permanently terminate your access to the affected Paid Services without further obligation.</p>
                                <p>Relay reserves the right to adjust pricing for Paid Services at any time with a minimum of thirty (30) days' advance written notice. Continued use of the Paid Services following the effective date of a price change constitutes your acceptance of the revised pricing.</p>
                            </div>
                        </section>

                        {/* H */}
                        <section id="enforcement">
                            <SectionHeading label="H." title="Enforcement" />
                            <div className="space-y-4">
                                <p>Relay may take enforcement action — including, without limitation, issuing warnings, temporarily suspending, rate-limiting, or permanently terminating your access to the Services — at any time and without prior notice if any of the following circumstances arise:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Relay has reasonable grounds to believe that you have breached or are in the process of breaching any provision of these Terms.</li>
                                    <li>Relay is unable to verify the accuracy or legitimacy of any information you provided during registration or thereafter.</li>
                                    <li>Your use of the Platform is determined, in Relay's reasonable judgment, to pose a security, financial, or reputational risk to Relay or to other users of the Platform.</li>
                                    <li>Relay receives a valid legal request, court order, or regulatory directive requiring it to restrict or terminate your access.</li>
                                    <li>Your account remains inactive for a prolonged period and, despite notification, you have not responded or taken steps to reactivate it.</li>
                                </ul>
                                <p>Any enforcement action taken by Relay shall not entitle you to any compensation, refund, or claim unless separately provided under applicable law or these Terms. Relay's failure to enforce any provision of these Terms on one occasion shall not constitute a waiver of its right to enforce that provision or any other provision in the future.</p>
                            </div>
                        </section>

                        {/* I */}
                        <section id="liability">
                            <SectionHeading label="I." title="Liability & Risk" />
                            <div className="space-y-4">
                                <p>THE SERVICES ARE PROVIDED ON AN <strong className="text-white">"AS IS"</strong> AND <strong className="text-white">"AS AVAILABLE"</strong> BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, RELAY EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.</p>
                                <p>Relay makes reasonable efforts to maintain Platform availability and data integrity; however, the Services are delivered over the internet and on systems that inherently carry risks, including but not limited to: network failures, cybersecurity incidents, third-party service outages, software defects, and force majeure events. Relay does not warrant that the Services will be uninterrupted, error-free, or free from malicious interference.</p>
                                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER AETHER DIGITAL NOR ANY OF ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS SHALL BE LIABLE FOR: (i) ANY INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES; (ii) LOSS OF PROFITS, REVENUE, BUSINESS, GOODWILL, OR DATA; OR (iii) DAMAGES ARISING FROM UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR CONTENT OR ACCOUNT — EVEN IF RELAY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN ALL CASES, RELAY'S AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF ONE HUNDRED US DOLLARS (USD $100) OR THE TOTAL FEES PAID BY YOU TO RELAY IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</p>
                                <p>You acknowledge that you are solely responsible for the security of your own Device and network environment. Actions such as jailbreaking or rooting your Device, using insecure networks, or failing to keep your software up to date may expose your data and Relay credentials to third-party compromise. Relay accepts no liability for damages arising from such circumstances.</p>
                                <p>You agree to indemnify, defend, and hold harmless Aether Digital and its affiliates, officers, employees, and agents from any claims, damages, losses, costs, and expenses (including reasonable legal fees) arising from: (i) your use of the Services; (ii) your Content; (iii) your breach of these Terms; or (iv) your violation of any applicable law or third-party right.</p>
                            </div>
                        </section>

                        {/* J */}
                        <section id="licensing">
                            <SectionHeading label="J." title="Open Infrastructure & Licensing" />
                            <div className="space-y-4">
                                <p>Portions of the Relay Platform incorporate or build upon open-source software components. Where applicable, such components remain subject to their respective open-source licenses, and your use of those components is governed accordingly. Nothing in these Terms shall be interpreted to override or restrict rights granted to you under an applicable open-source license.</p>
                                <p>Relay's proprietary software, APIs, infrastructure logic, and dashboard interface are not open-source and are protected by copyright and trade secret law. Any open-source components incorporated into the Platform are clearly identified in the accompanying documentation or attribution files.</p>
                                <p>By using the Platform, you agree to comply with the terms of any applicable open-source license covering components you interact with. Relay makes no representation that the combination of open-source components used within the Platform is compatible with every use case or jurisdiction, and you assume responsibility for evaluating such compatibility for your own deployment.</p>
                            </div>
                        </section>

                        {/* K */}
                        <section id="third-party">
                            <SectionHeading label="K." title="Third-Party Services" />
                            <div className="space-y-4">
                                <p>The Services may contain links to, integrations with, or references to third-party websites, APIs, or services that are not owned or controlled by Relay (<strong className="text-white">"Third-Party Services"</strong>). These links and integrations are provided solely for your convenience and do not constitute an endorsement, sponsorship, or recommendation by Relay of any Third-Party Service or its content.</p>
                                <p>Relay has no control over the content, privacy practices, terms of service, or availability of any Third-Party Service. You access and use any Third-Party Service at your own risk and subject to the terms and policies of that third party. Relay expressly disclaims all responsibility for any loss, damage, or inconvenience you may experience as a result of your reliance on or interaction with Third-Party Services.</p>
                                <p>Relay may partner with third-party providers for payment processing, cloud infrastructure, email delivery, or authentication. Such providers operate under their own terms and privacy policies, and by using features dependent on those providers, you agree to comply with their applicable policies in addition to these Terms.</p>
                                <p>If you discover content within the Services or linked from the Services that appears to be unlawful, harmful, or otherwise inappropriate, please report it to us at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>.</p>
                            </div>
                        </section>

                        {/* L */}
                        <section id="miscellaneous">
                            <SectionHeading label="L." title="General Provisions" />
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-white font-bold mb-2">Governing Law & Jurisdiction</h3>
                                    <p>These Terms and any dispute or claim arising out of or in connection with them or their subject matter (including non-contractual disputes) shall be governed by and construed in accordance with the laws of the jurisdiction in which Aether Digital is registered, without regard to conflict-of-law provisions. You hereby irrevocably submit to the exclusive jurisdiction of the courts of that jurisdiction for the resolution of any such dispute.</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Severability</h3>
                                    <p>If any provision of these Terms is found to be invalid, unlawful, or unenforceable by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it enforceable, or, if modification is not possible, severed from these Terms. The remaining provisions shall continue in full force and effect.</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Entire Agreement</h3>
                                    <p>These Terms, together with our Privacy Policy and any DPA or other written agreement signed by the parties, constitute the entire agreement between you and Relay with respect to the subject matter hereof and supersede all prior representations, understandings, or agreements, whether oral or written.</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Notices & Communications</h3>
                                    <p>Relay may send notices and administrative communications to you via the email address associated with your Account, through in-platform notifications, or by posting updates to this page. Notices are deemed received immediately upon display in-platform or twenty-four (24) hours after dispatch by email, unless the sending party is notified of a delivery failure.</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Contact</h3>
                                    <p>For any questions, concerns, or legal notices regarding these Terms, please contact the Relay legal team at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>. We aim to respond to all formal inquiries within five (5) business days.</p>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
                            <p>© 2026 Aether Digital · Relay Protocol · All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
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
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-xs text-slate-600 hover:text-white transition-colors"
                            >
                                ← Back to Relay
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
    return (
        <div className="flex items-baseline gap-3 mb-6 pb-3 border-b border-white/10">
            <span className="text-blue-500 font-black text-2xl">{label}</span>
            <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
        </div>
    );
}
