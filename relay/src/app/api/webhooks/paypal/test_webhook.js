const fetch = require('node-fetch');

const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/paypal';
const TEST_EMAIL = 'quiel.g538.archived@gmail.com'; // Verified email from DB
const PLAN_TO_TEST = 'pro';

const mockEvent = {
    event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
    resource: {
        custom_id: `${TEST_EMAIL}|${PLAN_TO_TEST}`
    }
};

async function testWebhook() {
    console.log(`[Diagnostic] Sending mock event for ${TEST_EMAIL}...`);
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockEvent)
        });

        const result = await response.json();
        console.log('[Diagnostic] Response:', result);
    } catch (error) {
        console.error('[Diagnostic] Error:', error.message);
    }
}

testWebhook();
