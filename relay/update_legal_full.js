const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Exequiel', 'OneDrive', 'Desktop', 'Datos para el trabajo', 'AetherDigital', 'relay', 'src', 'lib', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enLegal = `            sections: {
                agreement: "Agreement to Terms",
                agreementDesc: "By accessing or using the Relay platform, you agree to be bound by these Terms of Service. These terms govern your use of our notification infrastructure, API, and dashboard.",
                usage: "API Usage & Limits",
                usageDesc: "Users are responsible for maintaining the confidentiality of their API keys. Usage is subject to the monthly limits defined by your selected subscription plan. Automated abuse or attempts to bypass rate limits result in immediate termination.",
                ip: "Intellectual Property",
                ipDesc: "The Relay protocol, branding, and infrastructure are the exclusive property of Aether Digital Architecture. Users maintain ownership of their message content but grant Relay the necessary rights to process and deliver those packets.",
                availability: "Service Availability",
                availabilityDesc: "While we strive for 99.9% uptime, Relay is provided 'as is'. We are not liable for upstream provider outages (Telegram, WhatsApp, Discord) that may affect delivery telemetry.",
                collection: "Data Collection",
                collectionDesc: "Relay collects minimal data required to provide our notification services. This includes your email (for authentication), organization name, and delivery telemetry. We do not store message content long-term.",
                security: "Security Protocols",
                securityDesc: "All API requests are encrypted via TLS. Your API keys are hashed at rest. We implement strict isolation for Edge Functions, ensuring your message packets never co-mingle with other tenant data.",
                disclosure: "Third-Party Disclosures",
                disclosureDesc: "We do not sell user data. To deliver notifications, we must pass your content to the target platforms (Telegram, WhatsApp, Discord) as instructed by your API payload.",
                noRefund: "No Refund Policy",
                noRefundDesc: "Due to the digital nature of the Relay infrastructure and associated usage quotas, all sales are final. Once a subscription is activated, we cannot provide refunds or credits.",
                cancellation: "Cancellations",
                cancellationDesc: "You can cancel your subscription at any time via the dashboard. Access remains active until the end of your current billing period.",
                exceptions: "Exceptions",
                exceptionsDesc: "Relay reserves the right to issue refunds at its sole discretion in cases of documented service negligence for established Enterprise customers."
            }`;

const esLegal = `            sections: {
                agreement: "Aceptación de Términos",
                agreementDesc: "Al acceder o usar la plataforma Relay, aceptas estar sujeto a estos Términos de Servicio. Estos términos rigen el uso de nuestra infraestructura de notificaciones, API y panel de control.",
                usage: "Uso de API y Límites",
                usageDesc: "Los usuarios son responsables de mantener la confidencialidad de sus claves API. El uso está sujeto a los límites mensuales definidos por su plan. El abuso automatizado resultará en la terminación inmediata.",
                ip: "Propiedad Intelectual",
                ipDesc: "El protocolo Relay, la marca y la infraestructura son propiedad exclusiva de Aether Digital Architecture. Los usuarios conservan la propiedad de su contenido pero otorgan a Relay los derechos para procesarlo.",
                availability: "Disponibilidad del Servicio",
                availabilityDesc: "Aunque nos esforzamos por un tiempo de actividad del 99,9 %, Relay se proporciona 'tal cual'. No somos responsables por caídas de proveedores externos (Telegram, WhatsApp, Discord).",
                collection: "Recolección de Datos",
                collectionDesc: "Relay recolecta los datos mínimos necesarios: email, nombre de organización y telemetría de entrega. No almacenamos el contenido de los mensajes a largo plazo.",
                security: "Protocolos de Seguridad",
                securityDesc: "Todas las peticiones API están cifradas vía TLS. Tus claves API están hasheadas en reposo. Implementamos aislamiento estricto para asegurar la privacidad de tus paquetes.",
                disclosure: "Divulgación a Terceros",
                disclosureDesc: "No vendemos datos de usuarios. Para entregar notificaciones, debemos pasar tu contenido a las plataformas destino (Telegram, WhatsApp, Discord) según tus instrucciones.",
                noRefund: "Política de No Reembolso",
                noRefundDesc: "Debido a la naturaleza digital de Relay y sus cuotas de uso, todas las ventas son finales. Una vez activada la suscripción, no podemos proporcionar reembolsos ni créditos.",
                cancellation: "Cancelaciones",
                cancellationDesc: "Podés cancelar tu suscripción en cualquier momento. El acceso permanecerá activo hasta el final del periodo de facturación actual.",
                exceptions: "Excepciones",
                exceptionsDesc: "Relay se reserva el derecho de emitir reembolsos a su entera discreción en casos de negligencia comprobada para clientes corporativos."
            }`;

// Inject before 'footer:' in each language (replacing the previous simple sections)
content = content.replace(/en:\s*{[\s\S]*?sections:\s*{[\s\S]*?}/, (match) => match.split('sections:')[0] + enLegal);
content = content.replace(/es:\s*{[\s\S]*?sections:\s*{[\s\S]*?}/, (match) => match.split('sections:')[0] + esLegal);

fs.writeFileSync(filePath, content);
console.log('Legal content expanded successfully');
