const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://yiljzwyewbccfrwconet.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGp6d3lld2JjY2Zyd2NvbmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3NTExMCwiZXhwIjoyMDkwMzUxMTEwfQ.FcdgkDoMM_9MF3ZNHtJi0gAzrJnucHrkJ1eJkN2AN1A'
);

async function findKey() {
    const { data: keys, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('is_active', true)
        .limit(1);

    if (error) console.error(error);
    console.log(JSON.stringify(keys, null, 2));
}

findKey();
