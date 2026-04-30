const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://yiljzwyewbccfrwconet.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGp6d3lld2JjY2Zyd2NvbmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3NTExMCwiZXhwIjoyMDkwMzUxMTEwfQ.FcdgkDoMM_9MF3ZNHtJi0gAzrJnucHrkJ1eJkN2AN1A';

async function check() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: accounts, error: err1 } = await supabase.from('accounts').select('id, email');
    const { data: emails, error: err2 } = await supabase.from('account_emails').select('*');

    console.log("ACCOUNTS:");
    console.log(JSON.stringify(accounts, null, 2));
    console.log("ACCOUNT_EMAILS:");
    console.log(JSON.stringify(emails, null, 2));
}

check();
