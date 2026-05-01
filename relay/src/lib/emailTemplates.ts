import { renderLayoutToHtml } from './layoutRenderer';

export interface EmailOptions {
    lang: 'en' | 'es';
    name?: string;
    url?: string;
    type: 'confirm' | 'resend' | 'email_change' | 'password_alert' | 'reset' | 'relay' | 'verification_code';
    oldEmail?: string;
    fromName?: string;
    customLayout?: any[]; // JSON block data
    isEnterprise?: boolean;
}

export function renderEmailTemplate(options: EmailOptions) {
    const { lang, name, url, type } = options;
    const isEs = lang === 'es';

    // Content Dictionary
    const content = {
        confirm: {
            en: {
                subject: "Confirm Your Signup - RELAY",
                title: "Activate Your Protocol",
                greeting: `Hello ${name || 'Developer'},`,
                body: "Welcome to RELAY. Your account has been provisioned. Please confirm your email to initiate the uplink and start managing your API keys.",
                button: "Activate Account",
                footer: "If you did not request this, please ignore this signal."
            },
            es: {
                subject: "Confirma tu Registro - RELAY",
                title: "Activa tu Protocolo",
                greeting: `Hola ${name || 'Desarrollador'},`,
                body: "Bienvenido a RELAY. Tu cuenta ha sido provisionada. Por favor, confirma tu correo para iniciar el enlace y comenzar a gestionar tus llaves de API.",
                button: "Activar Cuenta",
                footer: "Si no solicitaste esto, puedes ignorar esta señal."
            }
        },
        resend: {
            en: {
                subject: "New Activation Link - RELAY",
                title: "Protocol Reconnection",
                greeting: `Hello ${name || 'Developer'},`,
                body: "You requested a new activation link. Use the button below to verify your identity and access the dashboard.",
                button: "Verify Identity",
                footer: "Security link expires in 24 hours."
            },
            es: {
                subject: "Nuevo Enlace de Activación - RELAY",
                title: "Reconexión de Protocolo",
                greeting: `Hola ${name || 'Desarrollador'},`,
                body: "Has solicitado un nuevo enlace de activación. Usa el botón de abajo para verificar tu identidad y acceder al panel de control.",
                button: "Verificar Identidad",
                footer: "El enlace de seguridad expira en 24 horas."
            }
        },
        email_change: {
            en: {
                subject: "Confirm New Email - RELAY",
                title: "Security Link",
                greeting: `Hello ${name || 'Developer'},`,
                body: "You requested to update your email to this address. Use the button below to confirm the change and rotate your protocol identity.",
                button: "Confirm New Email",
                footer: "Old sessions will remain active until swap."
            },
            es: {
                subject: "Confirma tu Nuevo Email - RELAY",
                title: "Enlace de Seguridad",
                greeting: `Hola ${name || 'Desarrollador'},`,
                body: "Has solicitado actualizar tu correo a esta dirección. Usa el botón de abajo para confirmar el cambio y rotar tu identidad de protocolo.",
                button: "Confirmar Nuevo Email",
                footer: "Las sesiones antiguas seguirán activas hasta el intercambio."
            }
        },
        password_alert: {
            en: {
                subject: "Security Alert: Password Changed - RELAY",
                title: "Protocol Update",
                greeting: `Hello ${name || 'Developer'},`,
                body: "Your account password was recently changed. If this wasn't you, please initiate a hard reset immediately from your dashboard settings.",
                button: "Go to Dashboard",
                footer: "Secure alert for account integrity."
            },
            es: {
                subject: "Alerta de Seguridad: Contraseña Cambiada - RELAY",
                title: "Actualización de Protocolo",
                greeting: `Hola ${name || 'Desarrollador'},`,
                body: "La contraseña de tu cuenta fue cambiada recientemente. Si no fuiste tú, por favor inicia un restablecimiento forzado inmediatamente desde la configuración del panel.",
                button: "Ir al Panel",
                footer: "Alerta de seguridad para la integridad de la cuenta."
            }
        },
        reset: {
            en: {
                subject: "Reset Your Password - RELAY",
                title: "Password Recovery",
                greeting: `Hello ${name || 'Developer'},`,
                body: "We received a request to reset your RELAY account password. Use the button below to establish a new secure credential for your protocol.",
                button: "Reset Password",
                footer: "If you did not request this, your account is still secure. No action is required."
            },
            es: {
                subject: "Restablecer tu Contraseña - RELAY",
                title: "Recuperación de Contraseña",
                greeting: `Hola ${name || 'Desarrollador'},`,
                body: "Recibimos una solicitud para restablecer la contraseña de tu cuenta de RELAY. Usa el botón de abajo para establecer una nueva credencial segura para tu protocolo.",
                button: "Restablecer Contraseña",
                footer: "Si no solicitaste esto, tu cuenta sigue siendo segura. No se requiere ninguna acción."
            }
        },
        relay: {
            en: {
                subject: "RELAY Protocol Signal",
                title: "Incoming Transmission",
                greeting: "Encrypted signal detected,",
                body: name || "You have a new message relayed through your Aether Digital infrastructure.",
                button: "Open Dashboard",
                footer: "Authentication confirmed. Delivery finalized."
            },
            es: {
                subject: "Señal de Protocolo RELAY",
                title: "Transmisión Entrante",
                greeting: "Señal encriptada detectada,",
                body: name || "Tienes un nuevo mensaje retransmitido a través de tu infraestructura de Aether Digital.",
                button: "Abrir Panel",
                footer: "Autenticación confirmada. Entrega finalizada."
            }
        },
        verification_code: {
            en: {
                subject: "Your Verification Code - RELAY",
                title: "Email Verification",
                greeting: `Hello ${name || 'Developer'},`,
                body: "To link this email to your account, please enter the following verification code in your dashboard. This code is valid for 10 minutes.",
                button: url || "000000",
                footer: "If you did not request this code, you can safely ignore this email."
            },
            es: {
                subject: "Tu Código de Verificación - RELAY",
                title: "Verificación de Email",
                greeting: `Hola ${name || 'Desarrollador'},`,
                body: "Para vincular este correo a tu cuenta, por favor ingresa el siguiente código de verificación en tu panel de control. El código es válido por 10 minutos.",
                button: url || "000000",
                footer: "Si no solicitaste este código, puedes ignorar este correo de forma segura."
            }
        }
    }[type][isEs ? 'es' : 'en'];

    // If a custom layout is provided (usually for 'relay' type), wrap the content
    if (type === 'relay' && options.customLayout) {
        const wrapOptions = {
            corporateName: options.fromName || (isEs ? 'Aether Digital' : 'Aether Digital'),
            isEnterprise: options.isEnterprise
        };

        // Find the 'variable' block in the layout where content should be injected
        // or just append to text blocks if specifically marked? 
        // In our current simple LayoutRenderer, we look for {{content}} placeholder.
        const layoutHtml = renderLayoutToHtml(options.customLayout, wrapOptions);

        // Replace the placeholder in the layout with our template body
        const finalHtml = layoutHtml.replace(/\{\{\s*content\s*\}\}/g, content.body);

        return {
            subject: content.subject,
            html: finalHtml
        };
    }

    return {
        subject: content.subject,
        html: `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #1e293b; border-radius: 24px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px;">
                            <div style="background-color: #3b82f6; width: 48px; height: 48px; border-radius: 12px; display: inline-block; padding: 0; margin-bottom: 20px; text-align: center; line-height: 48px;">
                                <span style="color: white; font-size: 24px;">⚡</span>
                            </div>
                            <h1 style="margin: 0; font-size: 14px; font-weight: 900; letter-spacing: 0.2em; color: #3b82f6; text-transform: uppercase;">
                                RELAY <span style="font-weight: 400; color: #94a3b8; font-size: 10px; vertical-align: top;">PRO</span>
                            </h1>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <h2 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.025em; line-height: 1.2;">${content.title}</h2>
                            <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 600; color: #f1f5f9;">${content.greeting}</p>
                            <p style="margin: 0 0 32px 0; font-size: 16px; color: #94a3b8; line-height: 1.6;">${content.body}</p>

                            <!-- Button or Code -->
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" bgcolor="#3b82f6" style="border-radius: ${type === 'verification_code' ? '16px' : '9999px'};">
                                        ${type === 'verification_code' ? `
                                            <div style="padding: 20px 40px; font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 0.2em; font-family: monospace;">
                                                ${content.button}
                                            </div>
                                        ` : `
                                            <a href="${url}" target="_blank" style="padding: 16px 40px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; display: inline-block; letter-spacing: -0.01em;">
                                                ${content.button}
                                            </a>
                                        `}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 32px 40px; background-color: #0f172a; border-top: 1px solid #334155;">
                            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 500; color: #64748b;">${content.footer}</p>
                            <p style="margin: 0; font-size: 11px; color: #475569; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 700;">&copy; 2026 AETHER DIGITAL • RELAY PROTOCOL</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `
    };
}
