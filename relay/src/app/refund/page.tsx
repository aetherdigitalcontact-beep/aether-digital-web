import Link from 'next/link';

export default function RefundPolicy() {
    return (
        <div className="h-screen w-full bg-[#050505] text-white flex flex-col font-sans overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full p-12">
                <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Refund Policy</h1>
                <p className="text-slate-400 mb-8">Last Updated: April 2026</p>
                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">1. Alpha Phase</h2>
                        <p>Relay is currently in Alpha. During this phase, no paid subscriptions are active. All features are provided free of charge to early adopters on our waitlist.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">2. Future Paid Plans</h2>
                        <p>When paid plans are introduced, we will offer a <strong className="text-white">14-day money-back guarantee</strong> for all new subscriptions. Requests must be submitted within 14 days of the billing date to be eligible.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">3. Eligibility</h2>
                        <p className="mb-4">Refunds will be considered for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Billing errors or duplicate charges</li>
                            <li>Service unavailability exceeding our SLA commitments</li>
                            <li>Cancellations within the 14-day window (once paid plans launch)</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">4. Non-Refundable Items</h2>
                        <p>Usage-based charges, add-ons consumed prior to cancellation, and fees for custom integrations are non-refundable.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">5. How to Request</h2>
                        <p>To request a refund, email <a href="mailto:aetherdigital.contact@gmail.com" className="text-blue-400 hover:underline">aetherdigital.contact@gmail.com</a> with your account details and reason. We aim to process all refund requests within 5 business days.</p>
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
