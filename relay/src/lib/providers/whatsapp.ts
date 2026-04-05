export async function sendWhatsApp(to: string, message: string) {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
        throw new Error('WHATSAPP_CREDENTIALS_MISSING');
    }

    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

    // Basic implementation for text messages. 
    // In production, we should handle Meta Template IDs for marketing/utility messages.
    const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
            preview_url: false,
            body: message
        }
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}
