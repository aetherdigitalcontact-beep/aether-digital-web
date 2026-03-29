
// Final Production API for Resend Integration
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, industry, investment, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not defined in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Aether Digital <onboarding@resend.dev>',
                to: ['aetherdigital.contact@gmail.com'],
                subject: `Nueva Propuesta: ${name} (${industry})`,
                html: `
          <div style="font-family: sans-serif; padding: 20px; color: #0f172a; line-height: 1.6;">
            <h2 style="color: #3b82f6;">Nueva Propuesta de Negocio</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Industria:</strong> ${industry}</p>
            <p><strong>Inversión Estimada:</strong> ${investment}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p><strong>Detalles del Proyecto:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, id: data.id });
        } else {
            console.error('Resend API Error:', data);
            return res.status(response.status).json({ error: data.message || 'Error sending email' });
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
