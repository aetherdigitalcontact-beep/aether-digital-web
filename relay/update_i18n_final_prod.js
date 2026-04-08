const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Exequiel', 'OneDrive', 'Desktop', 'Datos para el trabajo', 'AetherDigital', 'relay', 'src', 'lib', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enExtensions = `
        legal: {
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            refund: "Refund Policy",
            support: "Contact Support",
            sections: {
                agreement: "Agreement to Terms",
                usage: "API Usage & Limits",
                ip: "Intellectual Property",
                availability: "Service Availability",
                collection: "Data Collection",
                security: "Security Protocols",
                disclosure: "Third-Party Disclosures",
                noRefund: "No Refund Policy",
                cancellation: "Cancellations",
                exceptions: "Exceptions"
            }
        },
        faq: {
            title: "Frequently Asked Questions",
            items: [
                { q: "How do I start sending alerts?", a: "Simply create an API Key in the dashboard and send a POST request to our global uplink. Check the docs for code snippets." },
                { q: "Is the Hobby tier really free?", a: "Yes, forever. You get 100 alerts per month and community support without paying a cent." },
                { q: "Can I upgrade or downgrade?", a: "You can upgrade instantly. Downgrades take effect at the end of your current billing cycle to ensure you get what you paid for." },
                { q: "Do you store my notification data?", a: "No. We only store metadata (timing, status) for your analytics. The message content is deleted immediately after delivery." }
            ]
        },`;

const esExtensions = `
        legal: {
            terms: "Términos de Servicio",
            privacy: "Política de Privacidad",
            refund: "Política de Reembolso",
            support: "Contacto Soporte",
            sections: {
                agreement: "Aceptación de Términos",
                usage: "Uso de API y Límites",
                ip: "Propiedad Intelectual",
                availability: "Disponibilidad del Servicio",
                collection: "Recolección de Datos",
                security: "Protocolos de Seguridad",
                disclosure: "Divulgación a Terceros",
                noRefund: "Política de No Reembolso",
                cancellation: "Cancelaciones",
                exceptions: "Excepciones"
            }
        },
        faq: {
            title: "Preguntas Frecuentes",
            items: [
                { q: "¿Cómo empiezo a enviar alertas?", a: "Simplemente creá una API Key en el dashboard y enviá una solicitud POST a nuestro uplink global. Mirá la documentación para ver ejemplos." },
                { q: "¿El plan Hobby es realmente gratis?", a: "Sí, para siempre. Tenés 100 alertas por mes y soporte comunitario sin pagar un centavo." },
                { q: "¿Puedo cambiar de plan?", a: "Podés subir de nivel al instante. Las bajas de plan se aplican al final del ciclo de facturación actual." },
                { q: "¿Guardan los datos de mis notificaciones?", a: "No. Solo guardamos metadatos (hora, estado) para tus analíticas. El contenido del mensaje se borra tras la entrega." }
            ]
        },`;

// Inject before 'footer:' in each language
content = content.replace(/(en:\s*{[\s\S]*?)(footer:)/, `$1${enExtensions}\n        $2`);
content = content.replace(/(es:\s*{[\s\S]*?)(footer:)/, `$1${esExtensions}\n        $2`);

fs.writeFileSync(filePath, content);
console.log('i18n.ts updated successfully');
