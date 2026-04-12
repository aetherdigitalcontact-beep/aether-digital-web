fetch('http://localhost:3000/api/relay', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'RELAY_PK_X8XZUFLMII'
    },
    body: JSON.stringify({
        platform: 'whatsapp',
        target: '543425502817',
        message: '¡Se logró, bro! Este es un mensaje de Relay de prueba. WhatsApp ya está rugiendo 🚀🤖'
    })
})
    .then(res => res.json())
    .then(data => console.log('Respuesta del servidor:', data))
    .catch(err => console.error('Error:', err));
