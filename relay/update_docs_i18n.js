const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enKeys = `
            "responseTitle": "Response Protocols",
            "successLabel": "SUCCESS",
            "errorLabel": "ERROR",
            "statusTitle": "Status Code Reference",
            "colCode": "Code",
            "colScenario": "Scenario",
            "colResolution": "Resolution",
            "modeMessage": "Message",
            "modeTemplate": "Template"
`;

const esKeys = `
            "responseTitle": "Protocolos de Respuesta",
            "successLabel": "ÉXITO",
            "errorLabel": "ERROR",
            "statusTitle": "Referencia de Códigos de Estado",
            "colCode": "Código",
            "colScenario": "Escenario",
            "colResolution": "Resolución",
            "modeMessage": "Mensaje",
            "modeTemplate": "Plantilla"
`;

// Insert keys into English docs
content = content.replace(/en:\s*{\s*docs:\s*{/, (match) => match + enKeys + ',');

// Insert keys into Spanish docs (since ES is after EN, we find it carefully)
content = content.replace(/es:\s*{\s*docs:\s*{/, (match) => match + esKeys + ',');

fs.writeFileSync(filePath, content);
console.log('i18n.ts updated with new doc keys for EN and ES.');
