// Asegúrate de cambiar "TU_API_KEY_DE_RELAY" por tu clave real y el Segment ID
fetch('http://localhost:3000/api/relay', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer RELAY_PK_IW1844W8FE' // Debes crear una desde Settings en Relay
  },
  body: JSON.stringify({
     apiKey: "RELAY_PK_IW1844W8FE", // La validación actual del local lo pedía doble a veces
     message: "¡Hola Segmento! Esto es un testing real desde el Workspace.",
     category: "Marketing",
     topicKey: "investors-2026", // Ej: "investors2026"
     platforms: ["email", "discord"] 
  })
})
.then(res => res.json())
.then(console.log);