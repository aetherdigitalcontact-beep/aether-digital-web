import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://yiljzwyewbccfrwconet.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGp6d3lld2JjY2Zyd2NvbmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3NTExMCwiZXhwIjoyMDkwMzUxMTEwfQ.FcdgkDoMM_9MF3ZNHtJi0gAzrJnucHrkJ1eJkN2AN1A'
);

async function check() {
    console.log("Checking topics...");
    const { data: topics, error } = await supabase.from('topics').select('*');
    console.log("Topics:", JSON.stringify(topics, null, 2));

    console.log("Checking subscribers...");
    const { data: subs } = await supabase.from('subscribers').select('*');
    console.log("Subs:", JSON.stringify(subs, null, 2));
}

check();
