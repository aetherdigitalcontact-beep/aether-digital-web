const jwt = require('jsonwebtoken');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const pUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const pKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const jwtSecret = env.match(/JWT_SECRET=(.*)/) ? env.match(/JWT_SECRET=(.*)/)[1].trim() : 'fallback-secret-for-dev-only-change-in-prod';

// User 1361dedc...
const token = jwt.sign({ id: '1361dedc-e72b-4abf-82bb-07bbd9c68ff0', email: 'etrthyt@gmail.com', role: 'user' }, jwtSecret);

fetch('http://localhost:3000/api/profile/update', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Cookie': `relay_session=${token}`
    },
    body: JSON.stringify({ email: 'newemail999@gmail.com', current_password: 'testPassword123' })
}).then(r => r.text()).then(console.log).catch(console.error);
