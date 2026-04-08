const API_KEY = 'RELAY_PK_X8XZUFLMII';
const BASE_URL = 'http://localhost:3000';

async function testUniversalWebhook() {
    console.log('--- Testing Universal Catchall Webhook ---');

    const payload = {
        event: 'sale_completed',
        amount: 250.50,
        currency: 'USD',
        customer: {
            name: 'Exequiel Gutierrez',
            email: 'exequiel@aether.digital'
        },
        metadata: {
            source: 'Custom ERP'
        }
    };

    const url = `${BASE_URL}/api/webhooks/relay?api_key=${API_KEY}&platforms=telegram&target=@exequiel_alerts&category=HighValueSale`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testUniversalWebhook();
