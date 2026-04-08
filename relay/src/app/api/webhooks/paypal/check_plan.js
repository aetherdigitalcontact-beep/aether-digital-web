const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yiljzwyewbccfrwconet.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGp6d3lld2JjY2Zyd2NvbmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3NTExMCwiZXhwIjoyMDkwMzUxMTEwfQ.FcdgkDoMM_9MF3ZNHtJi0gAzrJnucHrkJ1eJkN2AN1A';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkPlan() {
    const email = 'quiel.g538.archived@gmail.com';
    console.log(`[Diagnostic] Checking plan for ${email}...`);
    const { data, error } = await supabase.from('accounts').select('plan').eq('email', email).single();

    if (error) {
        console.error('[Diagnostic] Error:', error.message);
        return;
    }

    console.log('[Diagnostic] Current Plan in DB:', data.plan);
}

checkPlan();
