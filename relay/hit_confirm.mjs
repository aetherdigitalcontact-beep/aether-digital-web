async function runTest() {
    console.log('Fetching confirm endpoint...');
    const url = 'http://localhost:3000/api/auth/confirm?code=17b58359-f228-4949-95ac-cb83cbf4e11a';

    try {
        const res = await fetch(url, { redirect: 'manual' });
        console.log('Status:', res.status);
        console.log('Headers:', res.headers);
        console.log('Location:', res.headers.get('location'));
        const text = await res.text();
        console.log('Body snippet:', text.substring(0, 100));
    } catch (e) {
        console.error(e);
    }
}

runTest();
