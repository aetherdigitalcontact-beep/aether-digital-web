import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="h-screen w-full bg-[#050505] text-white flex flex-col font-sans overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full p-12">
                <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Terms of Service</h1>
                <p className="text-slate-400 mb-8">Last Updated: April 2026</p>
                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">1. Acceptance of Terms</h2>
                        <p>By accessing or using Relay Notification Engine (&ldquo;Relay&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">2. Description of Service</h2>
                        <p>Relay is a B2B notification distribution platform that enables developers to send notifications across multiple channels (Email, WhatsApp, SMS, Telegram, Slack, etc.) through a unified API. The platform is currently in Alpha and features may change without notice.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">3. Acceptable Use</h2>
                        <p className="mb-4">You agree not to use Relay to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Send unsolicited commercial messages (spam)</li>
                            <li>Distribute malware, phishing, or fraudulent content</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe upon the rights of third parties</li>
                            <li>Attempt to reverse-engineer or compromise platform security</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">4. Intellectual Property</h2>
                        <p>All intellectual property related to the Relay platform, including but not limited to software, design, trademarks, and documentation, is owned by Aether Digital and is protected by applicable laws.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">5. Disclaimer of Warranties</h2>
                        <p>Relay is provided &ldquo;as is&rdquo; without warranties of any kind. During the Alpha phase, service availability and feature completeness are not guaranteed.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">6. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, Aether Digital shall not be liable for any indirect, incidental, or consequential damages arising from your use of Relay.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">7. Contact</h2>
                        <p>For questions regarding these Terms, contact us at <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a>.</p>
                    </section>
                </div>
                <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between text-sm text-slate-500">
                    <p>&copy; 2026 Aether Digital · Relay Protocol</p>
                    <Link href="/" className="text-blue-400 hover:underline">← Back</Link>
                </div>
            </div>
        </div>
    );
}
