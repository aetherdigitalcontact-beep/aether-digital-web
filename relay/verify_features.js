const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const { data: keyData } = await supabase.from('api_keys').select('key_hash').limit(1).single();
    if (!keyData) {
        console.error('No API keys found');
        return;
    }
    const apiKey = keyData.key_hash;
    console.log(`Using API Key: ${apiKey}`);

    // Create or Update a scenario for testing
    const testScenario = {
        name: 'VERIFICATION_TEST',
        is_active: true,
        category: 'VERIFY',
        nodes: [
            { id: '1', type: 'triggerNode', data: { label: 'Catch VERIFY' } },
            { id: '2', type: 'actionNode', data: { platform: 'discord', target_address: 'http://localhost:9999/discord_mock', message_template: 'SCENARIO MATCH: {{item}} for ${{value}}!' } },
            { id: '3', type: 'webhookNode', data: { target_url: 'http://localhost:9999/webhook_verify' } }
        ]
    };

    const { data: userData } = await supabase.from('api_keys').select('user_id').eq('key_hash', apiKey).single();

    await supabase.from('scenarios').delete().eq('name', 'VERIFICATION_TEST');
    await supabase.from('scenarios').insert({ ...testScenario, user_id: userData.user_id });

    console.log('Test Scenario inserted.');

    // Trigger the engine
    const res = await fetch('http://localhost:3000/api/relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({
            category: 'VERIFY',
            item: 'Quantum Accelerator',
            value: 99.99
        })
    });

    const result = await res.json();
    console.log('Engine Response:', JSON.stringify(result, null, 2));
}

run();
