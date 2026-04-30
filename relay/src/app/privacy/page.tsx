export default function PrivacyPolicy() {
    return (
        <div className="h-screen w-full bg-[#050505] text-white flex flex-col font-sans overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full p-12">
                <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Data Privacy Policy</h1>

                <p className="text-slate-400 mb-8">Last Updated: April 2026</p>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">1. Introduction</h2>
                        <p>
                            At <strong className="text-white">Relay Notification Engine</strong>, we take your privacy and data security seriously. As a B2B notification distribution platform, we process audience data solely for the purpose of ensuring message deliverability on behalf of our clients.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">2. Information We Request</h2>
                        <p className="mb-4">
                            Relay processes the following basic data necessary to connect notifications to Recipients:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>External Identifiers:</strong> Unique database IDs passed by the client workspace.</li>
                            <li><strong>Contact Channels:</strong> Email addresses and push notification tokens.</li>
                            <li><strong>Custom Metadata:</strong> Additional JSON properties optionally supplied via API for rendering text templates (such as user first names).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">3. Zero-Knowledge Stance</h2>
                        <p>
                            We act purely as an intermediary processing node. Relay does <strong>not</strong> track the contents of your push notifications except for temporary logging (error states). Your message layouts, business logic, and PII are obfuscated wherever possible.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">4. Sub-processors</h2>
                        <p>
                            Relay delivers communications through external protocols (e.g. AWS SES, Resend, Discord Webhooks, Twilio). Using Relay implies an automatic compliance to their distribution policies.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
                    <p>&copy; 2026 Aether Digital Cloud Infrastructure | Private Deployment</p>
                </div>
            </div>
        </div>
    );
}
