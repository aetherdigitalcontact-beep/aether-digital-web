import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://yiljzwyewbccfrwconet.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGp6d3lld2JjY2Zyd2NvbmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3NTExMCwiZXhwIjoyMDkwMzUxMTEwfQ.FcdgkDoMM_9MF3ZNHtJi0gAzrJnucHrkJ1eJkN2AN1A'
);

async function check() {
    console.log("Checking relations...");
    const { data: rels } = await supabase.from('topic_subscribers').select('*');
    console.log("Topic Subscribers:", JSON.stringify(rels, null, 2));

    console.log("Checking GET logic...");
    let query = supabase.from('topics')
        .select(`
                id,
                name,
                key,
                created_at,
                topic_subscribers ( count )
            `);
    const { data: tops } = await query;
    console.log("Topics with count:", JSON.stringify(tops, null, 2));
}

check();
