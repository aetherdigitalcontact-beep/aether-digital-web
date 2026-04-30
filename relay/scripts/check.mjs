import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY')).split('=')[1].trim();

async function checkQueue() {
    const now = new Date().toISOString();
    console.log("NOW:", now);
    try {
        const res = await fetch(`${url}/rest/v1/relay_queue?select=*&type=eq.DELAY&status=eq.pending&scheduled_for=lte.${encodeURIComponent(now)}`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        const data = await res.json();
        console.log("DB DATA SIZE:", data.length);
        if (data.length > 0) {
            console.log("FIRST EL:", data[0].scheduled_for);
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

checkQueue();
