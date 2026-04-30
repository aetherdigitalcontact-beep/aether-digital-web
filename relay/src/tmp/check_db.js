const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yiljzwyewbccfrwconet.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGp6d3lld2JjY2Zyd2NvbmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3NTExMCwiZXhwIjoyMDkwMzUxMTEwfQ.FcdgkDoMM_9MF3ZNHtJi0gAzrJnucHrkJ1eJkN2AN1A';

async function check() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.from('inbox_messages').insert({
        project_id: '2ada50fb-2b28-4fe1-a284-cac607b72bd8', // the user workspace
        subscriber_id: null,
        title: 'Test',
        content: 'testing null subscriber',
        platform: 'discord'
    }).select('*');
    if (error) console.error("INSERT ERROR", error);
    else console.log(JSON.stringify(data, null, 2));
}

check();
