const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const pUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const pKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

fetch(`${pUrl}/rest/v1/accounts?email=eq.quiel.g538@gmail.com`, {
    headers: { 'apikey': pKey, 'Authorization': `Bearer ${pKey}` }
}).then(res => res.json()).then(data => {
    console.log("USERS EXACT MATCH:", JSON.stringify(data, null, 2));
}).catch(console.error);
