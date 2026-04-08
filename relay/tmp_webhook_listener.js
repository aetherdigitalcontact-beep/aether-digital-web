const http = require('http');

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        console.log('--- WEBHOOK RECEIVED ---');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', JSON.stringify(JSON.parse(body), null, 2));
        console.log('------------------------');
        res.writeHead(200);
        res.end('OK');
    });
});

server.listen(9999, () => {
    console.log('Webhook listener running on http://localhost:9999');
});
