"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap, Mail } from 'lucide-react';

const SECTIONS = [
    { id: 'intro', label: '1. Introduction' },
    { id: 'definitions', label: '2. Definitions' },
    { id: 'processing', label: '3. Processing Instructions' },
    { id: 'controller', label: '4. Controller Obligations' },
    { id: 'employees', label: '5. Confidentiality' },
    { id: 'security', label: '6. Security Measures' },
    { id: 'breach', label: '7. Personal Data Breach' },
    { id: 'subprocessors', label: '8. Sub-Processors' },
    { id: 'rights', label: '9. Data Subject Rights' },
    { id: 'dpia', label: '10. DPIA Assistance' },
    { id: 'deletion', label: '11. Deletion & Return' },
    { id: 'audit', label: '12. Audit Rights' },
    { id: 'liability', label: '13. Liability' },
    { id: 'general', label: '14. General Terms' },
    { id: 'schedule1', label: 'Schedule 1: Processing Details' },
];

export default function DPAPage() {
    const [activeId, setActiveId] = useState('intro');

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
                        <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-16 flex gap-16">
                <main className="flex-1 min-w-0 max-w-3xl">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest">
                            GDPR Compliance
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                            Data Processing Agreement
                        </h1>
                        <p className="text-slate-500 text-sm mb-6">Last updated: May 2026&nbsp;&nbsp;·&nbsp;&nbsp;Legally binding upon execution</p>

                        {/* CTA Banner */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20">
                            <div className="flex-1">
                                <p className="text-white font-bold text-sm mb-1">Need a signed DPA for your organization?</p>
                                <p className="text-slate-400 text-sm">Enterprise and GDPR-regulated customers can request a countersigned DPA by contacting our compliance team.</p>
                            </div>
                            <a
                                href="mailto:aetherdigital.contact@gmail.com?subject=DPA Request — Relay&body=Hi Relay team,%0D%0A%0D%0AI'd like to request a signed Data Processing Agreement for my organization.%0D%0A%0D%0ACompany name: %0D%0AContact name: %0D%0AAccount email: "
                                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all active:scale-95"
                            >
                                <Mail className="w-4 h-4" />
                                Request DPA
                            </a>
                        </div>
                    </div>

                    <div className="space-y-16 text-slate-300 leading-relaxed">

                        <section id="intro">
                            <SH n="1." t="Introduction" />
                            <div className="space-y-4">
                                <p>This Data Processing Agreement (<strong className="text-white">"DPA"</strong>) is incorporated into and forms a binding part of the Relay <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> (the <strong className="text-white">"Agreement"</strong>) between Aether Digital (<strong className="text-white">"Relay"</strong> or <strong className="text-white">"Processor"</strong>) and the customer accepting those Terms (<strong className="text-white">"Controller"</strong>).</p>
                                <p>This DPA applies wherever Relay, in the course of providing its notification infrastructure services, processes Personal Data on behalf of the Controller. It establishes the rights and obligations of each party with respect to such processing, in compliance with applicable Data Protection Laws including the EU General Data Protection Regulation (GDPR/EU 2016/679) and all national implementing legislation.</p>
                                <p>In the event of any conflict between this DPA and the Agreement with respect to the processing of Personal Data, the provisions of this DPA shall prevail.</p>
                            </div>
                        </section>

                        <section id="definitions">
                            <SH n="2." t="Definitions" />
                            <p className="mb-6">Unless otherwise defined in context, the following terms have the meanings set out below. Terms defined in the GDPR (including "Controller", "Processor", "Data Subject", "Personal Data", "Personal Data Breach", "Processing", and "Supervisory Authority") carry those GDPR meanings throughout this DPA.</p>
                            <ul className="space-y-4 border-l-2 border-white/10 pl-6">
                                {[
                                    ['"Agreement"', 'The Relay Terms of Service entered into between Controller and Processor, to which this DPA is attached and made part of.'],
                                    ['"Applicable Law"', 'Regulation (EU) 2016/679 (GDPR), all applicable national data protection legislation implementing or supplementing the GDPR, and any equivalent laws applicable in the jurisdictions where the Services are delivered.'],
                                    ['"Controller Personal Data"', 'Any Personal Data processed by Processor on behalf of Controller pursuant to or in connection with the Agreement.'],
                                    ['"Services"', 'The Relay notification infrastructure platform and all related services provided by Processor as described in the Agreement.'],
                                    ['"Standard Contractual Clauses" (SCCs)', 'The standard contractual clauses for international transfers of personal data as adopted by the European Commission under Implementing Decision (EU) 2021/914.'],
                                    ['"Sub-Processor"', 'Any third party engaged by Processor to process Controller Personal Data on behalf of Controller in support of the delivery of the Services.'],
                                ].map(([term, def]) => (
                                    <li key={term as string}><strong className="text-white">{term}</strong> — {def}</li>
                                ))}
                            </ul>
                        </section>

                        <section id="processing">
                            <SH n="3." t="Processing Instructions" />
                            <div className="space-y-4">
                                <p>Processor shall process Controller Personal Data exclusively on documented instructions from Controller, as set out in this DPA and the Agreement, including with respect to transfers of Controller Personal Data to third countries or international organizations. Processor shall not process Controller Personal Data for any other purpose without prior written authorization from Controller.</p>
                                <p>Where Processor is required by Applicable Law to process Controller Personal Data beyond the scope of Controller's instructions, Processor shall notify Controller of that legal requirement before commencing such processing, unless prohibited by law from doing so on grounds of public interest.</p>
                                <p>Controller hereby authorizes Processor to: (i) process Controller Personal Data to the extent necessary for the delivery of the Services; (ii) transfer Controller Personal Data to any country or territory required for the provision of the Services, subject to compliance with Section 3 of this DPA and all applicable transfer requirements under Applicable Law; and (iii) engage Sub-Processors in accordance with Section 8.</p>
                            </div>
                        </section>

                        <section id="controller">
                            <SH n="4." t="Controller Obligations" />
                            <div className="space-y-4">
                                <p>Controller represents and warrants that it holds, and shall maintain throughout the term of the Agreement and this DPA, all rights, consents, and legal authorizations required to provide Controller Personal Data to Processor for the processing described herein. Controller is solely responsible for ensuring that all processing of Controller Personal Data by Processor is lawful under Applicable Law.</p>
                                <p>Controller is responsible for obtaining and maintaining all necessary consents from Data Subjects as required by Applicable Law, and for keeping records of such consents in accordance with applicable requirements. Controller agrees to comply with all of its obligations as a controller under Applicable Law, including but not limited to providing appropriate privacy notices to Data Subjects regarding the processing of their data through the Services.</p>
                            </div>
                        </section>

                        <section id="employees">
                            <SH n="5." t="Confidentiality of Processing" />
                            <div className="space-y-4">
                                <p>Processor shall ensure that access to Controller Personal Data is restricted to Processor personnel who require such access for the purpose of performing the Services (the principle of least privilege). All such personnel shall be bound by written confidentiality obligations or professional statutory obligations of confidentiality with respect to Controller Personal Data.</p>
                                <p>Processor shall maintain appropriate access controls, credential management policies, and activity logging for all personnel with access to systems processing Controller Personal Data. Processor shall promptly revoke access for any personnel who no longer require it.</p>
                            </div>
                        </section>

                        <section id="security">
                            <SH n="6." t="Security Measures" />
                            <div className="space-y-4">
                                <p>Processor shall implement and maintain appropriate technical and organizational measures to ensure a level of security appropriate to the risk presented by the processing of Controller Personal Data, taking into account the state of the art, the cost of implementation, the nature, scope, context and purposes of processing, and the likelihood and severity of risks to Data Subject rights and freedoms.</p>
                                <p>Such measures shall include, at minimum:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Encryption of Controller Personal Data in transit (TLS 1.2 or higher) and at rest.</li>
                                    <li>Role-based access control and multi-factor authentication for all systems processing Controller Personal Data.</li>
                                    <li>Regular security assessments, vulnerability scanning, and penetration testing of platform infrastructure.</li>
                                    <li>Documented incident response procedures, including procedures for detecting and reporting Personal Data Breaches.</li>
                                    <li>Physical and logical access controls to data center facilities where Controller Personal Data is stored.</li>
                                    <li>Regular staff training on data protection and security best practices.</li>
                                </ul>
                                <p>Processor shall review and update these security measures periodically and shall notify Controller of any material changes that may affect the protection of Controller Personal Data.</p>
                            </div>
                        </section>

                        <section id="breach">
                            <SH n="7." t="Personal Data Breach Notification" />
                            <div className="space-y-4">
                                <p>In the event that Processor becomes aware of a confirmed or reasonably suspected Personal Data Breach affecting Controller Personal Data, Processor shall notify Controller without undue delay and, where feasible, within <strong className="text-white">72 hours</strong> of becoming aware of the breach.</p>
                                <p>The breach notification shall, to the extent available at the time of notification, include:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>A description of the nature of the breach, including the categories and approximate number of Data Subjects and personal data records affected.</li>
                                    <li>The name and contact details of the data protection contact point from whom more information can be obtained.</li>
                                    <li>A description of the likely consequences of the breach.</li>
                                    <li>A description of the measures taken or proposed to address the breach, including measures to mitigate its possible adverse effects.</li>
                                </ul>
                                <p>Where it is not possible to provide all of the above information simultaneously, Processor may provide such information in phases without undue further delay. Processor shall cooperate with Controller and take commercially reasonable steps, as agreed by the parties or required by Applicable Law, to assist in the investigation, containment, mitigation, and remediation of any such breach.</p>
                            </div>
                        </section>

                        <section id="subprocessors">
                            <SH n="8." t="Sub-Processors" />
                            <div className="space-y-4">
                                <p>Controller hereby provides general authorization for Processor to engage Sub-Processors for the purpose of delivering the Services, subject to the requirements of this Section.</p>
                                <p>Processor shall give Controller reasonable prior notice of any intended appointment of a new Sub-Processor. If Controller raises reasonable written objections to such appointment within seven (7) calendar days of notice, the parties shall cooperate in good faith to resolve those objections. If no resolution is reached within a further seven (7) days, either party may terminate the portion of the Services that requires use of the proposed Sub-Processor, without liability to the other party arising from that specific termination.</p>
                                <p>Before engaging any new Sub-Processor, Processor shall conduct appropriate due diligence to confirm that the Sub-Processor is capable of providing the level of data protection required by this DPA, and shall enter into a written agreement with the Sub-Processor imposing data protection obligations at least equivalent to those in this DPA. Processor remains fully liable to Controller for the performance of any Sub-Processor's obligations under this DPA.</p>
                                <p>An up-to-date list of current Sub-Processors may be requested at any time by contacting <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>.</p>
                            </div>
                        </section>

                        <section id="rights">
                            <SH n="9." t="Data Subject Rights" />
                            <div className="space-y-4">
                                <p>Controller is solely responsible for receiving, evaluating, and responding to requests from Data Subjects exercising their rights under Applicable Law (including rights of access, rectification, erasure, restriction, portability, and objection).</p>
                                <p>Processor shall, upon Controller's written request and at Controller's reasonable expense, provide commercially reasonable assistance to help Controller fulfill its obligations with respect to Data Subject requests, including by providing access to relevant processing records and tools to retrieve or delete specific data where technically feasible.</p>
                                <p>If Processor receives a Data Subject request that relates to Controller Personal Data, Processor shall promptly notify Controller without responding to such request, unless required to do so by Applicable Law. In such event, Processor shall notify Controller in advance of responding to the extent permitted by law.</p>
                            </div>
                        </section>

                        <section id="dpia">
                            <SH n="10." t="Data Protection Impact Assessments" />
                            <div className="space-y-4">
                                <p>At Controller's written request and reasonable expense, Processor shall provide such information and assistance as is reasonably necessary to enable Controller to carry out any Data Protection Impact Assessment (DPIA) or prior consultation with a Supervisory Authority, as required under Article 35 or Article 36 of the GDPR, in connection with the processing of Controller Personal Data by Processor.</p>
                                <p>Processor shall make available to Controller such documentation, records, and summaries of its security and processing practices as are reasonably necessary for Controller to fulfill its obligations under Applicable Law in relation to such assessments.</p>
                            </div>
                        </section>

                        <section id="deletion">
                            <SH n="11." t="Deletion & Return of Data" />
                            <div className="space-y-4">
                                <p>Upon termination or expiry of the Agreement, or upon written request from Controller, Processor shall, within <strong className="text-white">sixty (60) calendar days</strong>, either securely delete or return all copies of Controller Personal Data in Processor's possession or control, as directed in writing by Controller. Processor shall confirm completion of such deletion or return in writing upon request.</p>
                                <p>Processor may retain Controller Personal Data beyond this period only to the extent and for the duration required by Applicable Law. Where Processor retains data pursuant to a legal obligation, it shall notify Controller of such retention and the applicable legal basis, unless prohibited from doing so by law.</p>
                            </div>
                        </section>

                        <section id="audit">
                            <SH n="12." t="Audit Rights" />
                            <div className="space-y-4">
                                <p>Upon Controller's prior written request (submitted with a minimum of thirty (30) days' notice), Processor shall make available to Controller or Controller's designated reputable third-party auditor such information, records, and facilities as are reasonably necessary to demonstrate Processor's compliance with this DPA. Any such auditor shall be bound by professional confidentiality obligations acceptable to Processor before being granted access to Processor's systems or data.</p>
                                <p>Any audit or inspection shall: (i) be conducted at Controller's sole cost and expense; (ii) occur during Processor's normal business hours with minimum disruption to Processor's operations; (iii) be limited to no more than one (1) audit per calendar year, except where Controller reasonably suspects a material compliance failure or is required by a Supervisory Authority to conduct additional audits; and (iv) be subject to Processor's reasonable security and confidentiality policies.</p>
                                <p>The results of any audit shall be treated as Processor's confidential information and shall not be disclosed to any third party without Processor's prior written consent, unless disclosure is required by Applicable Law.</p>
                            </div>
                        </section>

                        <section id="liability">
                            <SH n="13." t="Liability" />
                            <div className="space-y-4">
                                <p>Each party's liability to the other in connection with this DPA shall be subject to the limitations on liability set out in the Agreement. Nothing in this DPA shall be construed to limit either party's liability to Data Subjects or Supervisory Authorities under Applicable Law.</p>
                                <p>Controller shall indemnify, defend, and hold harmless Processor and its officers, employees, and agents from and against any claims, fines, penalties, damages, and costs (including reasonable legal fees) arising directly or indirectly from: (i) Controller's breach of this DPA or Applicable Law in its capacity as Controller; or (ii) Controller's provision of unlawful instructions to Processor that result in Processor processing Controller Personal Data in breach of Applicable Law.</p>
                            </div>
                        </section>

                        <section id="general">
                            <SH n="14." t="General Terms" />
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-white font-bold mb-2">Governing Law & Jurisdiction</h3>
                                    <p>This DPA and any non-contractual obligations arising out of or in connection with it shall be governed by and construed in accordance with the laws of the jurisdiction applicable to the Agreement, unless otherwise required by Applicable Law. The parties submit to the jurisdiction specified in the Agreement for the resolution of any disputes arising under this DPA.</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Order of Precedence</h3>
                                    <p>This DPA supplements and does not limit or reduce Processor's obligations under the Agreement with respect to the protection of Controller Personal Data. In the event of any conflict between this DPA and the Agreement regarding the processing of Personal Data, the provisions of this DPA prevail.</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Amendments</h3>
                                    <p>Controller may request amendments to this DPA where necessary to comply with changes in Applicable Law, by providing at least forty-five (45) days' prior written notice to Processor. Processor shall make commercially reasonable efforts to accommodate such requested amendments. Either party may propose consequential amendments to the other in connection with any such changes.</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Severability</h3>
                                    <p>If any provision of this DPA is held invalid or unenforceable, the remainder of the DPA shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it enforceable, or if not possible, shall be severed.</p>
                                </div>
                            </div>
                        </section>

                        <section id="schedule1">
                            <SH n="Sched. 1" t="Details of Processing" />
                            <div className="space-y-6 text-sm">
                                <p>This Schedule sets out the particulars of the processing of Controller Personal Data as required by Article 28(3) of the GDPR.</p>

                                {[
                                    ['Subject Matter & Duration', 'The subject matter and duration of processing are as specified in the Agreement. Processing continues for the duration of the Agreement and any applicable data retention periods under Applicable Law.'],
                                    ['Nature & Purpose of Processing', 'Processor processes Controller Personal Data to deliver the notification infrastructure Services, including routing, dispatch, and delivery tracking of multi-channel notifications (email, SMS, push, WhatsApp, and other channels) on behalf of Controller.'],
                                    ['Types of Personal Data Processed', 'Controller Personal Data may include: full name, email address, phone number, device push notification tokens, IP addresses, and any additional metadata fields supplied by Controller through the API for notification personalization purposes.'],
                                    ['Categories of Data Subjects', 'Data Subjects are the end-users, subscribers, or customers of Controller who are recipients of notifications dispatched through the Services.'],
                                    ['Obligations & Rights of Controller', 'The obligations and rights of Controller are as set out in the Agreement, this DPA, and Applicable Law. Controller determines the purposes for which Controller Personal Data is processed and the instructions given to Processor for such processing.'],
                                ].map(([title, content]) => (
                                    <div key={title as string} className="border border-white/[0.08] rounded-xl overflow-hidden">
                                        <div className="px-5 py-3 bg-white/[0.03] border-b border-white/[0.08]">
                                            <p className="text-white font-bold text-sm">{title}</p>
                                        </div>
                                        <div className="px-5 py-4">
                                            <p className="text-slate-400">{content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
                            <p>© 2026 Aether Digital · Relay Protocol · All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
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
                                            ? 'bg-violet-500/10 text-violet-400 font-semibold border-l-2 border-violet-500'
                                            : 'text-slate-500 hover:text-slate-300 border-l-2 border-transparent'
                                        }`}
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                            <p className="text-violet-400 text-xs font-bold mb-2">Need a signed copy?</p>
                            <p className="text-slate-500 text-xs mb-3">Request a countersigned DPA for your compliance records.</p>
                            <a
                                href="mailto:aetherdigital.contact@gmail.com?subject=DPA Request — Relay"
                                className="flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                <Mail className="w-3 h-3" />
                                Request DPA →
                            </a>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5">
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
            <span className="text-violet-500 font-black text-2xl">{n}</span>
            <h2 className="text-2xl font-black text-white tracking-tight">{t}</h2>
        </div>
    );
}
