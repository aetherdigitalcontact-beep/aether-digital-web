const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yiljzwyewbccfrwconet.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGp6d3lld2JjY2Zyd2NvbmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3NTExMCwiZXhwIjoyMDkwMzUxMTEwfQ.FcdgkDoMM_9MF3ZNHtJi0gAzrJnucHrkJ1eJkN2AN1A';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function inspectSchema() {
    console.log('[Diagnostic] Inspecting accounts table...');
    // We can't use 'DESCRIBE' in Supabase easily via JS client, but we can try to select one row and see the keys
    const { data, error } = await supabase.from('accounts').select('*').limit(1).single();

    if (error) {
        console.error('[Diagnostic] Error fetching row:', error.message);
        return;
    }

    console.log('[Diagnostic] Columns found:', Object.keys(data));
}

inspectSchema();
