const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
if (!urlMatch || !keyMatch) throw new Error("Missing env vars");
const url = urlMatch[1].trim().replace(/['"]/g, '');
const key = keyMatch[1].trim().replace(/['"]/g, '');

fetch(url + '/rest/v1/scenarios?select=id,name', {
    headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key
    }
})
    .then(r => r.json())
    .then(d => console.log('SCENARIOS:', JSON.stringify(d, null, 2)))
    .catch(console.error);
