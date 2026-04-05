export async function sendEmail(target: string, subject: string, html: string) {
    // This is a stub for an email provider like Resend or SendGrid
    // For now, we'll log it if no API key is provided
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.warn(`[RelayEmail] No RESEND_API_KEY found. Mocking email to ${target}`);
        return { ok: true, status: 200, json: async () => ({ message: 'Mocked email sent' }) };
    }

    return fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
            from: 'Relay AI <notifications@relay-ai.com>',
            to: [target],
            subject: subject || 'Relay Notification',
            html: html
        })
    });
}
