const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const pUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const pKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

async function test() {
    const { data: user } = await fetch(`${pUrl}/rest/v1/accounts?limit=1`, {
        headers: { 'apikey': pKey, 'Authorization': `Bearer ${pKey}` }
    }).then(r => r.json());

    if (!user || user.length === 0) return console.log("No user found");

    const longString = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZW5kaW5nRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzEzNDg5NTY4LCJleHAiOjE3MTM0OTMxNjh9.shortsign";

    const res = await fetch(`${pUrl}/rest/v1/accounts?id=eq.${user[0].id}`, {
        method: 'PATCH',
        headers: { 'apikey': pKey, 'Authorization': `Bearer ${pKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation_code: longString })
    });

    if (!res.ok) console.log("ERROR:", await res.text());
    else console.log("SUCCESS");
}

test();
