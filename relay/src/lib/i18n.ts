export type Language = 'en' | 'es' | 'pt' | 'ru' | 'fr' | 'de' | 'zh' | 'ja' | 'it';

export const dictionaries: Record<Language, any> = {
    en: {
        docs: {
            "responseTitle": "Response Protocols",
            "successLabel": "SUCCESS",
            "errorLabel": "ERROR",
            "statusTitle": "Status Code Reference",
            "colCode": "Code",
            "colScenario": "Scenario",
            "colResolution": "Resolution",
            "modeMessage": "Message",
            "modeTemplate": "Template"
            ,
            "backBtn": "Back to Terminal",
            "titleProtocol": "Protocol",
            "titleDocs": "Documentation",
            "subtitle": "Master the Relay Uplink. Integrate professional-grade notifications into your technology stack in minutes.",
            "authTitle": "Authentication",
            "authContent": "Relay uses API Keys to authorize your requests. Include your key in the `x-api-key` header of every request.",
            "endpointTitle": "Endpoint",
            "endpointContent": "All message routing is handled via a single POST endpoint. No complex SDKs needed.",
            "examplesTitle": "Implementation Examples",
            "copyBtn": "Copy",
            "copiedBtn": "Copied",
            "scaleTitle": "Ready to Scale?",
            "scaleContent": "Relay is built for production loads. If you need dedicated throughput or custom whitelabeling, check our enterprise solutions.",
            "enterpriseBtn": "View Enterprise Plans",
            "platforms": {
                "title": "Platform Connection Guide",
                "discord": {
                    "title": "Discord Webhooks",
                    "step1": "Go to Server Settings > Integrations > Webhooks",
                    "step2": "Create a New Webhook and copy the URL",
                    "step3": "Paste the URL as the 'Target' in the Relay Console"
                },
                "telegram": {
                    "title": "Telegram Bots",
                    "step1": "Start a chat with @BotFather to create a new bot",
                    "step2": "Copy your API Token and add it to .env.local",
                    "step3": "Get your Chat ID from @userinfobot to use as 'Target'"
                }
            }
        },
        nav: { features: "Features", docs: "Docs", pricing: "Pricing", getStarted: "Get Started" },
        hero: {
            phase: "PHASE 1: LIVE",
            title1: "Deliver alerts to any ",
            highlight: "channel",
            title2: " in 2 seconds.",
            desc: "The most elegant notification API for high-performance developers. Route messages to Telegram, Discord, and WhatsApp with a single, clean payload.",
            start: "Start your Project",
            viewDocs: "View API Docs",
            dashboardLink: "Go to Dashboard"
        },
        features: {
            title: "Why Relay?",
            items: [
                { title: "Ultra-Low Latency", desc: "Powered by Vercel Edge Functions for worldwide delivery in milliseconds." },
                { title: "Secure & Encrypted", desc: "Advanced API Key management and end-to-end data safety protocols." },
                { title: "Developer First", desc: "Clean JSON payloads and documentation that doesn't suck." }
            ]
        },
        api: {
            title: "Integrate in seconds",
            desc: "A single POST request is all you need. No complex SDKs required."
        },
        pricing: {
            title: "Simple, transparent pricing",
            desc: "Built to scale with your business. No hidden fees.",
            hobby: {
                name: "Hobby",
                price: "$0",
                yearlyPrice: "$0",
                desc: "Perfect for side projects.",
                features: ["1 API Key", "100 alerts / month", "1 active channel", "Standard latency", "Community support"]
            },
            starter: {
                name: "Starter",
                price: "$19",
                yearlyPrice: "$15",
                desc: "For growing side hustles.",
                features: ["2 API Keys", "5,000 alerts / month", "2 active channels", "Standard latency", "Email support"]
            },
            pro: {
                name: "Pro",
                price: "$49",
                yearlyPrice: "$39",
                desc: "For serious developers.",
                features: ["4 API Keys", "20,000 alerts / month", "All channels (TG, WA, Discord)", "Pro Analytics", "Priority Support"]
            },
            enterprise: {
                name: "Enterprise",
                price: "Custom",
                yearlyPrice: "Custom",
                desc: "Automate your business tracking.",
                features: ["Unlimited API Keys",
                    "Unlimited Alerts & Higher Limits",
                    "Individual Client Tracking",
                    "Whitelabeling (Your Logo)",
                    "24/7 Dedicated WhatsApp Support",
                    "99.9% Uptime SLA Guarantee"
                ]
            },
            cta: "Get Started",
            ctaLemon: "🍋 Card (Lemon Squeezy)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "Contact Sales",
            billing: {
                monthly: "Monthly",
                yearly: "Yearly",
                save: "Save 20%"
            },
            regional: {
                title: "🇦🇷 Limited Offer for Argentina",
                desc: "Save 30% by paying in ARS via Mercado Pago. Secure your price today.",
                cta: "Pay with Mercado Pago"
            },
            alerts: {
                downgrade: "Action Denied: You currently have the {userPlan} plan. You cannot switch to a lower plan ({targetPlan}) from here.",
                alreadyActive: "Action Denied: You already have the {targetPlan} plan active on your account!",
                mpNoNeed: "Action Denied: You currently have the {userPlan} plan. You do not need to purchase this limited offer!",
                mpAuth: "Please sign in to Relay first to access the regional discount.",
                mpError: "An error occurred connecting to Mercado Pago.",
                binanceError: "An error occurred connecting to Binance Pay.",
                contactCopied: "Email copied to clipboard! You can also reach us at aetherdigital.contact@gmail.com",
                critical: "Critical connection failure. Check your internet."
            },
            checkout: {
                title: "Simulate Checkout",
                successTitle: "Uplink Success",
                successDesc: "Your plan has been upgraded. Synchronizing protocol...",
                tier: "Tier",
                identity: "Protocol Identity",
                session: "Verified Active Session",
                mode: "Simulation Mode",
                modeDesc: "This is a high-fidelity checkout simulation. Clicking confirm will update your account permissions and trigger a Relay notification. No actual funds will be charged.",
                abort: "Abort",
                confirm: "Confirm Protocol Upgrade"
            }
        },

        legal: {
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            refund: "Refund Policy",
            support: "Contact Support",
            sections: {
                agreement: "Agreement of Terms",
                agreementDesc: "By accessing the Relay protocol, you agree to be bound by these functional terms. Our infrastructure is provided as-is for high-performance notification delivery.",
                usage: "API Usage & Limits",
                usageDesc: "Users must adhere to rate limits and fair use policies. Automated abuse or targeting of non-authorized endpoints will result in immediate protocol revocation.",
                ip: "Intellectual Property",
                ipDesc: "All Relay code, branding, and telemetry systems remain the exclusive property of Aether Digital. Reproduction without authorization is prohibited.",
                availability: "Service Availability",
                availabilityDesc: "We strive for 99.9% uptime. While our edge network is global, regional availability may vary based on provider health.",
                collection: "Data Collection",
                collectionDesc: "We only capture necessary message metadata (timestamp, priority, status) to provide delivery analytics. Content is never logged permanently.",
                security: "Security Protocols",
                securityDesc: "All transmissions are secured via TLS 1.3. API Keys are stored using salted cryptographic hashing to ensure identity protection.",
                disclosure: "Third-Party Disclosure",
                disclosureDesc: "Relay does not sell user data. Metadata is only processed through encrypted provider uplinks required for final message delivery.",
                noRefund: "No Refund Policy",
                noRefundDesc: "Due to the instantaneous nature of digital notification credits and protocol access, all Relay purchases are final.",
                cancellation: "Cancellations",
                cancellationDesc: "You may cancel your subscription at any time. Protocol access and features will remain active until the end of your current billing cycle.",
                exceptions: "Exceptions",
                exceptionsDesc: "Refund requests will only be reviewed in cases of verifiable system failure preventing access to the Relay terminal for >24 hours."
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
        },
        footer: "Aether Digital Architecture. Built for Excellence.",
        auth: {
            welcome: "Welcome to RELAY",
            desc: "Sign in with your corporate account or use a Magic Link to enter the terminal.",
            google: "Sign in with Google",
            github: "Sign in with GitHub",
            apple: "Sign in with Apple",
            magic: "Or use magic link",
            placeholder: "name@company.com",
            send: "Send Magic Link",
            loading: "Processing...",
            success: "Check your email for the link!",
            noAccount: "Don't have an account?",
            register: "Register Now",
            terms: "Terms of Protocol",
            loginTitle: "Sign In",
            registerTitle: "Create Account",
            email: "Email Address",
            password: "Secure Password",
            name: "Full Name",
            company: "Company / Project Name",
            signIn: "Sign In",
            signUp: "Create Account",
            forgotPassword: "Forgot Password?",
            alreadyHaveAccount: "Already have an account?",
            backToLogin: "Back to Login",
            registerSuccess: "Account created! You can now sign in.",
            checkEmail: "Check your inbox",
            verificationSent: "We've sent a verification link to your email. Please click it to activate your account.",
            resendEmail: "Resend verification email",
            emailResent: "Verification email sent again.",
            alreadyRegistered: "This email is already registered. Please sign in or reset your password.",
            errorInvalidCredentials: "Invalid login credentials.",
            errorUnconfirmed: "Please confirm your email before signing in.",
            validation: {
                required: "This field is required",
                invalidEmail: "Invalid email address",
                passwordTooShort: "Password is too short (min. 6 characters)"
            }
        },
        dashboard: {
            quickstart: { "title": "Quick Start", "firstMsg": "# Relay your first message", "baseEndpoint": "Base Endpoint", "curlExample": "CURL Example", "desc": "Use any generated key from the list to authorize your terminal uplink.", "viewDocs": "VIEW FULL PROTOCOL DOCS" },
            sidebar: {
                overview: "OVERVIEW",
                analytics: "ANALYTICS",
                apiKeys: "API KEYS",
                logs: "LOGS",
                relayAi: "RELAY AI",
                status: "STATUS",
                testLab: "TEST LAB",
                templates: "TEMPLATES",
                webhooks: "WEBHOOKS",
                domains: "DOMAINS",
                scenarios: "SCENARIOS",
                connectors: "CONNECTORS",
                settings: "SETTINGS"
            },
            status: {
                title: "SYSTEM STATUS",
                subtitle: "REAL-TIME MONITORING OF THE RELAY UPLINK AND PROVIDER HEALTH",
                pulse: "NETWORK PULSE: {status}",
                latency: "AVG. LATENCY",
                uptime: "SYSTEM UPTIME",
                reports: "DIAGNOSTIC REPORTS",
                stable: "STABLE",
                degraded: "DEGRADED",
                offline: "OFFLINE"
            },
            webhooks: { "title": "Protocol Endpoints", "subtitle": "Configure HTTP callbacks for real-time delivery events", "createBtn": "Create Webhook", "colLabel": "Label / Status", "colDestUrl": "Destination URL", "colSecret": "Secret Token", "colActions": "Actions", "scanning": "SCANNING ENDPOINTS...", "empty": "No active webhooks configured for this account.", "unnamed": "Unnamed Webhook" },
            logs: { "title": "PROTOCOL LOGS", "subtitle": "REAL-TIME DELIVERY TELEMETRY AND DIAGNOSTIC REPORTING", "refresh": "REFRESH TELEMETRY", "colMethod": "METHOD / PLATFORM", "colKey": "AUTHENTICATORY KEY", "colStatus": "STATUS", "colTiming": "TIMING", "colSync": "SYNCHRONIZATION", "empty": "NULL ACTIVITY DETECTED ON THE RELAY UPLINK.", "diagTitle": "AUTOMATED DIAGNOSTIC PROTOCOL", "diagDesc": "Relay captures provider telemetry to decrease your MTTR (Mean-Time-to-Recovery) by identifying delivery faults instantly.", "telemetryActive": "TELEMETRY ACTIVE" },
            testlab: { "title": "Test Lab", "subtitle": "Verify your integration payload and delivery protocols in real-time.", "platform": "PLATFORM", "targetUrl": "TARGET ID / URL", "msgBody": "MESSAGE BODY", "msgPlaceholder": "Enter your test message...", "variables": "VARIABLES (JSON)", "execute": "EXECUTE PROTOCOL", "consoleTitle": "RELAY DIAGNOSTIC CONSOLE", "waiting": "Waiting for execution..." },
            templates: { "title": "Message Templates", "subtitle": "Create reusable message blueprints with dynamic variables.", "createBtn": "CREATE TEMPLATE", "emptyTitle": "No templates found", "emptyDesc": "Build your first template to send personalized notifications at scale." },
            domains: { "title": "IDENTITY VAULT", "subtitle": "VERIFY DOMAINS FOR ORIGIN WHITELISTING AND CUSTOM BRANDING", "addBtn": "ADD DOMAIN", "colHostname": "HOSTNAME", "colStatus": "VERIFICATION STATUS", "colCreated": "CREATED", "colActions": "ACTIONS", "empty": "NO AUTHORIZED DOMAINS FOUND IN YOUR REGISTRY." },
            scenarios: {
                title: "Scenarios Engine",
                subtitle: "Design logic pipelines for event routing",
                newFlow: "NEW FLOW",
                savePipeline: "SAVE PIPELINE",
                deletePipeline: "DELETE PIPELINE",
                routingStatus: "ROUTING STATUS",
                pipelineEditor: "PIPELINE EDITOR",
                webhookInput: "WEBHOOKS / INPUT",
                routeTo: "ROUTE TO",
                onEvent: "ON EVENT",
                back: "BACK TO LIST",
                saved: "PIPELINE SAVED",
                deleteConfirm: "Are you sure you want to delete this scenario?",
                deleteSelected: "DELETE SELECTED",
                countSelected: "{count} selected",
                bulkDeleteConfirm: "Delete {count} scenarios? This cannot be undone."
            },
            welcome: "Welcome back,",
            subtitle: "Your network pulse is stable. {count} packets delivered this month.",
            newKey: "New API Key",
            stats: {
                success: "Successful Deliveries",
                failure: "Failure Rate",
                latency: "Avg. Latency"
            },
            table: {
                title: "Active Protocol Keys",
                docs: "View All Documentation",
                calls: "calls",
                secret: "Secret"
            },
            nav: {
                overview: "API Keys",
                keys: "API Keys",
                analytics: "Logs",
                settings: "Settings",
                signOut: "Sign Out"
            },
            modal: {
                title: "New Protocol Key",
                label: "Key Label",
                success: "Key generated successfully. Copy it now, it will only be shown once.",
                placeholder: "e.g. Production Shop",
                create: "Generate Key",
                copy: "Copy Key",
                close: "Done"
            },
            settings: {
                fullName: "FULL NAME",
                corporateEmail: "CORPORATE EMAIL",
                organization: "ORGANIZATION",
                saveBtn: "SAVE SETTINGS",
                profileTitle: "Profile Configuration",
                profileSubtitle: "Identity & Organization",
                accountId: "Account ID",
                activePlan: "Active Plan",
                upgrade: "Upgrade",
                whiteLabelTitle: "White Label / Custom Branding",
                whiteLabelSubtitle: "Business Identity",
                corpName: "Corporate Name",
                corpLogo: "Corporate Logo",
                upgradeEnterprise: "Upgrade to Enterprise to unlock",
                saveSettings: "SAVE SETTINGS",
                specialOptions: "Special Options",
                autoRefresh: "Auto-refresh Analytics",
                autoRefreshDesc: "Sync telemetry data every 30 seconds automatically.",
                protocolAlerts: "Protocol Alerts",
                protocolAlertsDesc: "Receive real-time notifications for failed relay attempts.",
                performanceMax: "Performance Max",
                performanceMaxDesc: "Enable advanced GPU-accelerated UI transitions.",
                securityTitle: "Protocol Security",
                updateCredentials: "Update Credentials",
                updateCredentialsDesc: "Rotate access keys and update security methods.",
                hardReset: "Hard Reset",
                hardResetDesc: "Revoke all active sessions of this account.",
                protocolOwner: "PROTOCOL OWNER:",
                brandingSignature: "Sent via {brand}"
            },
            presets: {
                title: "ENTERPRISE PRESETS & SIMULATORS",
                libraryTitle: "System Presets (Library)",
                alarm: { name: "Daily Auto-Alarm", title: "**⏰ SYSTEM ALARM**", body: "Hello {{user}},\nIt's time for your scheduled reminder.\n\n_Message: {{msg}}_" },
                stripe: { name: "Stripe Sale", title: "**💰 STRIPE: PAYMENT SUCCESSFUL**", body: "Customer: **{{customer_name}}**\nAmount: **{{amount}} {{currency}}**\nPlan: {{plan_name}}\n\n*Invoice: {{invoice_id}}*" },
                shopify: { name: "Shopify Order", title: "**🛍️ SHOPIFY: NEW ORDER #{{order_number}}**", body: "Items: {{item_count}}\nTotal: **{{total_price}}**\nShipping: {{shipping_city}}, {{shipping_country}}\n\n*Check the admin panel for fulfillment.*" },
                clerk: { name: "Clerk Signup", title: "**👤 CLERK: NEW USER SIGNUP**", body: "Email: **{{user_email}}**\nProvider: {{oauth_provider}}\nStatus: **Active**\n\n*User ID: {{user_id}}*" },
                hubspot: { name: "HubSpot Deal", title: "**🤝 HUBSPOT: NEW DEAL WON!**", body: "Deal: **{{deal_name}}**\nAmount: **{{amount}}**\nOwner: {{owner_name}}\n\n🎉 *Congratulations to the team!*" },
                github: { name: "GitHub Alert", title: "**🛡️ GITHUB: SECURITY ALERT**", body: "Repo: **{{repo_name}}**\nSeverity: **HIGH**\nIssue: {{description}}\n\n⚠️ *Please audit dependency graph immediately.*" },
                security: { name: "Security", title: "**⚠️ SECURITY ALERT**", body: "A suspicious login attempt was detected from {{location}}.\n\n📱 **Device:** {{device}}\n🕒 **Time:** {{time}}\n\nIf this was not you, please revoke access immediately." },
                email: { name: "Welcome Email", title: "**✨ WELCOME TO RELAY ENTERPRISE**", body: "Hi **{{user_name}}**,\n\nYour organization is now connected to the global relay network. Start building your automation pipelines today.\n\nBest,\nThe Relay Team" }
            }
        }
    },
    es: {
        docs: {
            "responseTitle": "Protocolos de Respuesta",
            "successLabel": "ÉXITO",
            "errorLabel": "ERROR",
            "statusTitle": "Referencia de Códigos de Estado",
            "colCode": "Código",
            "colScenario": "Escenario",
            "colResolution": "Resolución",
            "modeMessage": "Mensaje",
            "modeTemplate": "Plantilla"
            ,
            "backBtn": "Volver a la Terminal",
            "titleProtocol": "Documentación del",
            "titleDocs": "Protocolo",
            "subtitle": "Domina el enlace de Relay. Integra notificaciones profesionales en tu stack tecnológico en minutos.",
            "authTitle": "Autenticación",
            "authContent": "Relay utiliza API Keys para autorizar tus solicitudes. Incluye tu clave en el encabezado `x-api-key` de cada solicitud.",
            "endpointTitle": "Endpoint",
            "endpointContent": "Todo el enrutamiento de mensajes se maneja a través de un solo endpoint POST. Sin SDKs complejos.",
            "examplesTitle": "Ejemplos de Implementación",
            "copyBtn": "Copiar",
            "copiedBtn": "Copiado",
            "scaleTitle": "¿Listo para escalar?",
            "scaleContent": "Relay está construido para la producción. Si necesitas más capacidad o branding personalizado, revisa nuestras soluciones empresariales.",
            "enterpriseBtn": "Ver Planes Empresariales",
            "platforms": {
                "title": "Guía de Conexión",
                "discord": {
                    "title": "Webhooks de Discord",
                    "step1": "Ve a Ajustes del Servidor > Integraciones > Webhooks",
                    "step2": "Crea un nuevo Webhook y copia la URL",
                    "step3": "Pega la URL como 'Target' en la Consola de Relay"
                },
                "telegram": {
                    "title": "Bots de Telegram",
                    "step1": "Habla con @BotFather para crear un nuevo bot",
                    "step2": "Copia tu API Token y añádelo a tu .env.local",
                    "step3": "Consigue tu Chat ID con @userinfobot para usarlo como 'Target'"
                }
            }
        },
        nav: { features: "Funciones", docs: "API", pricing: "Precios", getStarted: "Entrar" },
        hero: {
            phase: "FASE 1: ACTIVA",
            title1: "Envía alertas a cualquier ",
            highlight: "canal",
            title2: " en 2 segundos.",
            desc: "La API de notificaciones más elegante para desarrolladores de alto rendimiento. Enruta mensajes a Telegram, Discord y WhatsApp con un solo código limpio.",
            start: "Inicia tu Proyecto",
            viewDocs: "Ver Documentación",
            dashboardLink: "Ir al Dashboard"
        },
        features: {
            title: "¿Por qué Relay?",
            items: [
                { title: "Latencia Ultra-Baja", desc: "Impulsado por Vercel Edge Functions para entrega mundial en milisegundos." },
                { title: "Seguro y Encriptado", desc: "Gestión avanzada de API Keys y protocolos de seguridad de extremo a extremo." },
                { title: "Enfoque Desarrollador", desc: "Cargas JSON limpias y una documentación que da gusto leer." }
            ]
        },
        api: {
            title: "Intégralo en segundos",
            desc: "Una simple petición POST es todo lo que necesitas. Sin SDKs complejos."
        },
        pricing: {
            title: "Precios simples y transparentes",
            desc: "Diseñado para escalar con tu negocio. Sin comisiones ocultas.",
            hobby: {
                name: "Hobby",
                price: "$0",
                yearlyPrice: "$0",
                desc: "Perfecto para proyectos personales.",
                features: ["1 API Key", "100 alertas / mes", "1 canal activo", "Latencia estándar", "Soporte comunitario"]
            },
            starter: {
                name: "Starter",
                price: "$19",
                yearlyPrice: "$15",
                desc: "Para proyectos en crecimiento.",
                features: ["2 API Keys", "5,000 alertas / mes", "2 canales activos", "Latencia estándar", "Soporte por email"]
            },
            pro: {
                name: "Pro",
                price: "$49",
                yearlyPrice: "$39",
                desc: "Para desarrolladores serios.",
                features: ["4 API Keys", "20,000 alertas / mes", "Todos los canales (TG, WA, Discord)", "Analíticas Pro", "Soporte Prioritario"]
            },
            enterprise: {
                name: "Enterprise",
                price: "Personalizado",
                yearlyPrice: "Personalizado",
                desc: "Automatiza el rastreo de tu negocio.",
                features: ["Unlimited API Keys",
                    "Alertas ilimitadas y mayores límites",
                    "Seguimiento de clientes individual",
                    "Marca blanca (Tu Logo)",
                    "Soporte 24/7 por WhatsApp Privado",
                    "Garantía de SLA del 99.9%"
                ]
            },
            cta: "Comenzar",
            ctaLemon: "🍋 Tarjeta (Lemon Squeezy)",
            ctaCrypto: "⚡ Cripto (Binance Pay)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "Contactar Ventas",
            billing: {
                monthly: "Mensual",
                yearly: "Anual",
                save: "Ahorra 20%"
            },
            regional: {
                title: "🇦🇷 Oferta Limitada para Argentina",
                desc: "Ahorra un 30% extra pagando en ARS con Mercado Pago. Asegura tu precio hoy.",
                cta: "Pagar con Mercado Pago"
            },
            alerts: {
                downgrade: "Acción Denegada: Actualmente cuentas con el plan {userPlan}. No puedes cambiar a un plan inferior ({targetPlan}) desde aquí.",
                alreadyActive: "Acción Denegada: ¡Ya tienes el plan {targetPlan} activado en tu cuenta!",
                mpNoNeed: "Acción Denegada: Actualmente cuentas con el plan {userPlan}. ¡No tienes necesidad de comprar esta oferta limitada!",
                mpAuth: "Inicia sesión en Relay primero para poder acceder al descuento regional.",
                mpError: "Ocurrió un error en la conexión con Mercado Pago.",
                binanceError: "Hubo un error contactando a Binance Pay.",
                contactCopied: "¡Email copiado al portapapeles! También puedes escribirnos a aetherdigital.contact@gmail.com",
                critical: "Fallo de conexión crítico. Revisa tu internet."
            },
            checkout: {
                title: "Simular Pago",
                successTitle: "Enlace Exitoso",
                successDesc: "Tu plan ha sido actualizado. Sincronizando protocolo...",
                tier: "Nivel",
                identity: "Identidad del Protocolo",
                session: "Sesión Activa Verificada",
                mode: "Modo Simulación",
                modeDesc: "Esta es una simulación de pago de alta fidelidad. Al confirmar se actualizarán tus permisos y se activará una notificación. No se realizarán cargos reales.",
                abort: "Abortar",
                confirm: "Confirmar Upgrade"
            },
            legal: {
                terms: "Términos de Servicio",
                privacy: "Política de Privacidad",
                refund: "Política de Reembolso",
                support: "Contacto Soporte",
                sections: {
                    agreement: "Aceptación de Términos",
                    agreementDesc: "Al acceder al protocolo Relay, aceptas cumplir con estos términos funcionales. Nuestra infraestructura se proporciona 'tal cual' para la entrega de notificaciones de alto rendimiento.",
                    usage: "Uso de API y Límites",
                    usageDesc: "Los usuarios deben adherirse a los límites de velocidad y políticas de uso justo. El abuso automatizado o el targeting de endpoints no autorizados resultará en la revocación inmediata del protocolo.",
                    ip: "Propiedad Intelectual",
                    ipDesc: "Todo el código de Relay, marca y sistemas de telemetría siguen siendo propiedad exclusiva de Aether Digital. La reproducción sin autorización está prohibida.",
                    availability: "Disponibilidad del Servicio",
                    availabilityDesc: "Nos esforzamos por un tiempo de actividad del 99.9%. Aunque nuestra red edge es global, la disponibilidad regional puede variar según la salud del proveedor.",
                    collection: "Recolección de Datos",
                    collectionDesc: "Solo capturamos los metadatos necesarios del mensaje (marca de tiempo, prioridad, estado) para proporcionar análisis de entrega. El contenido nunca se registra permanentemente.",
                    security: "Protocolos de Seguridad",
                    securityDesc: "Todas las transmisiones están aseguradas a través de TLS 1.3. Las claves de API se almacenan mediante hashing criptográfico con sal para garantizar la protección de la identidad.",
                    disclosure: "Divulgación a Terceros",
                    disclosureDesc: "Relay no vende los datos del usuario. Los metadatos solo se procesan a través de enlaces de proveedores cifrados necesarios para la entrega final del mensaje.",
                    noRefund: "Política de No Reembolso",
                    noRefundDesc: "Debido a la naturaleza instantánea de los créditos de notificación digital y el acceso al protocolo, todas las compras de Relay son definitivas.",
                    cancellation: "Cancelaciones",
                    cancellationDesc: "Puedes cancelar tu suscripción en cualquier momento. El acceso al protocolo y las funciones permanecerán activos hasta el final de tu ciclo de facturación actual.",
                    exceptions: "Excepciones",
                    exceptionsDesc: "Las solicitudes de reembolso solo se revisarán en casos de fallas verificables del sistema que impidan el acceso a la terminal Relay por más de 24 horas."
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
            }
        },
        footer: "Arquitectura Aether Digital. Construido para la Excelencia.",
        auth: {
            welcome: "Bienvenido a RELAY",
            desc: "Inicia sesión con tu cuenta corporativa o usa un Magic Link para acceder.",
            google: "Entrar con Google",
            github: "Entrar con GitHub",
            apple: "Entrar con Apple",
            magic: "O usa un magic link",
            placeholder: "nombre@empresa.com",
            send: "Enviar Magic Link",
            loading: "Procesando...",
            success: "¡Revisa tu correo para el enlace!",
            noAccount: "¿No tienes cuenta?",
            register: "Regístrate ahora",
            terms: "Términos del Protocolo",
            loginTitle: "Iniciar Sesión",
            registerTitle: "Crear Cuenta",
            email: "Correo Electrónico",
            password: "Contraseña Segura",
            name: "Nombre Completo",
            company: "Empresa / Proyecto",
            signIn: "Entrar",
            signUp: "Crear Cuenta",
            forgotPassword: "¿Olvidaste tu contraseña?",
            alreadyHaveAccount: "¿Ya tienes cuenta?",
            backToLogin: "Volver",
            registerSuccess: "¡Cuenta creada! Ya puedes iniciar sesión.",
            checkEmail: "Revisa tu bandeja de entrada",
            verificationSent: "Hemos enviado un enlace de verificación a tu correo. Haz clic para activar tu cuenta.",
            resendEmail: "Reenviar correo de verificación",
            emailResent: "Correo de verificación reenviado.",
            alreadyRegistered: "Este correo ya está registrado. Por favor, inicia sesión o recupera tu contraseña.",
            errorInvalidCredentials: "Credenciales de acceso inválidas.",
            errorUnconfirmed: "Por favor, confirma tu correo antes de iniciar sesión.",
            validation: {
                required: "Este campo es obligatorio",
                invalidEmail: "Correo electrónico inválido",
                passwordTooShort: "La contraseña es muy corta (mín. 6 caracteres)"
            }
        },
        dashboard: {
            quickstart: { "title": "Inicio Rápido", "firstMsg": "# Retransmite tu primer mensaje", "baseEndpoint": "Endpoint Base", "curlExample": "Ejemplo CURL", "desc": "Maneja las claves generadas en la lista para autorizar el enlace de tu terminal.", "viewDocs": "VER DOCS DEL PROTOCOLO" },
            sidebar: {
                overview: "VISTA GENERAL",
                analytics: "ANALÍTICA",
                apiKeys: "CLAVES API",
                logs: "LOGS",
                relayAi: "RELAY AI",
                status: "ESTADO",
                testLab: "TEST LAB",
                templates: "PLANTILLAS",
                webhooks: "WEBHOOKS",
                domains: "DOMINIOS",
                scenarios: "ESCENARIOS",
                connectors: "CONECTORES",
                settings: "AJUSTES"
            },
            status: {
                title: "ESTADO DEL SISTEMA",
                subtitle: "MONITOREO EN TIEMPO REAL DEL ENLACE RELAY Y SALUD DE PROVEEDORES",
                pulse: "PULSO DE RED: {status}",
                latency: "LATENCIA PROM.",
                uptime: "TIEMPO ACTIVO",
                reports: "REPORTES DE DIAGNÓSTICO",
                stable: "ESTABLE",
                degraded: "DEGRADADO",
                offline: "FUERA DE LÍNEA"
            },
            webhooks: { "title": "Endpoints del Protocolo", "subtitle": "Configura callbacks HTTP para eventos de entrega en tiempo real", "createBtn": "Crear Webhook", "colLabel": "Etiqueta / Estado", "colDestUrl": "URL de Destino", "colSecret": "Token Secreto", "colActions": "Acciones", "scanning": "ESCANEANDO ENDPOINTS...", "empty": "No hay webhooks activos configurados para esta cuenta.", "unnamed": "Webhook sin nombre" },
            logs: { "title": "LOGS DEL PROTOCOLO", "subtitle": "TELEMETRÍA DE ENTREGA Y REPORTES DE DIAGNÓSTICO EN TIEMPO REAL", "refresh": "REFRESCAR TELEMETRÍA", "colMethod": "MÉTODO / PLATAFORMA", "colKey": "CLAVE DE AUTENTICACIÓN", "colStatus": "ESTADO", "colTiming": "TIEMPO", "colSync": "SINCRONIZACIÓN", "empty": "NO SE DETECTÓ ACTIVIDAD EN EL ENLACE RELAY.", "diagTitle": "PROTOCOLO DE DIAGNÓSTICO AUTOMATIZADO", "diagDesc": "Relay captura la telemetría del proveedor para disminuir tu TMR (Tiempo Medio de Recuperación) identificando fallos de entrega al instante.", "telemetryActive": "TELEMETRÍA ACTIVA" },
            testlab: { "title": "Laboratorio", "subtitle": "Verifica el payload de integración y los protocolos de entrega en tiempo real.", "platform": "PLATAFORMA", "targetUrl": "ID DE DESTINO / URL", "msgBody": "CUERPO DEL MENSAJE", "msgPlaceholder": "Escribe tu mensaje de prueba...", "variables": "VARIABLES (JSON)", "execute": "EJECUTAR PROTOCOLO", "consoleTitle": "CONSOLA DE DIAGNÓSTICO RELAY", "waiting": "Esperando ejecución..." },
            templates: { "title": "Plantillas de Mensaje", "subtitle": "Crea planos de mensajes reutilizables con variables dinámicas.", "createBtn": "CREAR PLANTILLA", "emptyTitle": "No se encontraron plantillas", "emptyDesc": "Construye tu primera plantilla para enviar notificaciones personalizadas a escala." },
            domains: { "title": "BÓVEDA DE IDENTIDAD", "subtitle": "VERIFICA DOMINIOS PARA LISTAS BLANCAS Y BRANDING PERSONALIZADO", "addBtn": "AÑADIR DOMINIO", "colHostname": "NOMBRE DE HOST", "colStatus": "ESTADO DE VERIFICACIÓN", "colCreated": "CREADO", "colActions": "ACCIONES", "empty": "NO SE ENCONTRARON DOMINIOS AUTORIZADOS EN TU REGISTRO." },
            scenarios: {
                title: "Motor de Escenarios",
                subtitle: "Diseña flujos lógicos para enrutamiento de eventos",
                newFlow: "NUEVO FLUJO",
                savePipeline: "GUARDAR FLUJO",
                deletePipeline: "BORRAR FLUJO",
                routingStatus: "ESTADO DE RUTA",
                pipelineEditor: "EDITOR DE FLUJO",
                webhookInput: "WEBHOOK / ENTRADA",
                routeTo: "ENRUTAR A",
                onEvent: "AL EVENTO",
                back: "VOLVER A LA LISTA",
                saved: "FLUJO GUARDADO",
                deleteConfirm: "¿Estás seguro de que quieres eliminar este escenario?",
                deleteSelected: "BORRAR SELECCIONADOS",
                countSelected: "{count} seleccionados",
                bulkDeleteConfirm: "¿Borrar {count} escenarios? Esta acción no se puede deshacer."
            },
            welcome: "Bienvenido de nuevo,",
            subtitle: "El pulso de tu red es estable. {count} paquetes entregados este mes.",
            newKey: "Nueva API Key",
            stats: {
                success: "Entregas Exitosas",
                failure: "Tasa de Fallo",
                latency: "Latencia Promedio"
            },
            table: {
                title: "Claves de Protocolo Activas",
                docs: "Ver Toda la Documentación",
                calls: "llamadas",
                secret: "Secreto"
            },
            nav: {
                overview: "Claves API",
                keys: "API Keys",
                analytics: "Logs",
                settings: "Ajustes",
                signOut: "Cerrar Sesión"
            },
            modal: {
                title: "Nueva Clave de Protocolo",
                label: "Etiqueta",
                success: "Clave generada. Cópiala ahora, solo se mostrará una vez.",
                placeholder: "ej. Tienda Producción",
                create: "Generar Clave",
                copy: "Copiar Clave",
                close: "Listo"
            },
            settings: {
                fullName: "NOMBRE COMPLETO",
                corporateEmail: "CORREO CORPORATIVO",
                organization: "ORGANIZACIÓN",
                saveBtn: "GUARDAR AJUSTES",
                profileTitle: "Configuración de Perfil",
                profileSubtitle: "Identidad y Organización",
                accountId: "ID de Cuenta",
                activePlan: "Plan Activo",
                upgrade: "Mejorar",
                whiteLabelTitle: "Marca Blanca / Branding Personalizado",
                whiteLabelSubtitle: "Identidad Corporativa",
                corpName: "Nombre de la Empresa",
                corpLogo: "Logo Corporativo",
                upgradeEnterprise: "Mejora a Enterprise para desbloquear",
                saveSettings: "GUARDAR CAMBIOS",
                specialOptions: "Opciones Especiales",
                autoRefresh: "Auto-refrescar Analíticas",
                autoRefreshDesc: "Sincroniza datos telemétricos cada 30 segundos automáticamente.",
                protocolAlerts: "Alertas de Protocolo",
                protocolAlertsDesc: "Notificaciones en tiempo real de fallos de retransmisión.",
                performanceMax: "Rendimiento Máximo",
                performanceMaxDesc: "Activa transiciones de interfaz aceleradas por GPU.",
                securityTitle: "Seguridad del Protocolo",
                updateCredentials: "Actualizar Credenciales",
                updateCredentialsDesc: "Rotar claves de acceso y métodos de seguridad.",
                hardReset: "Maestro Reset",
                hardResetDesc: "Revocar todas las sesiones activas de esta cuenta.",
                protocolOwner: "PROPIETARIO DEL PROTOCOLO:",
                brandingSignature: "Enviado vía {brand}"
            },
            presets: {
                title: "PRESETS EMPRESARIALES Y SIMULADOR",
                libraryTitle: "Biblioteca de Presets",
                alarm: { name: "Alarma / Aviso", title: "**⏰ ALARMA DE SISTEMA**", body: "Hola {{user}},\nEs la hora de tu recordatorio programado.\n\n_Mensaje: {{msg}}_" },
                stripe: { name: "Venta Stripe", title: "**💰 STRIPE: PAGO EXITOSO**", body: "Cliente: **{{customer_name}}**\nMonto: **{{amount}} {{currency}}**\nPlan: {{plan_name}}\n\n*Recibo: {{invoice_id}}*" },
                shopify: { name: "Orden Shopify", title: "**🛍️ SHOPIFY: NUEVA ORDEN #{{order_number}}**", body: "Artículos: {{item_count}}\nTotal: **{{total_price}}**\nEnvío a: {{shipping_city}}, {{shipping_country}}\n\n*Revisa el panel de admin para preparar envío.*" },
                clerk: { name: "Registro Clerk", title: "**👤 CLERK: NUEVO USUARIO REGISTRADO**", body: "Correo: **{{user_email}}**\nProveedor: {{oauth_provider}}\nEstado: **Activo**\n\n*User ID: {{user_id}}*" },
                hubspot: { name: "Trato HubSpot", title: "**🤝 HUBSPOT: ¡NUEVO TRATO GANADO!**", body: "Trato: **{{deal_name}}**\nMonto: **{{amount}}**\nAgente: {{owner_name}}\n\n🎉 *¡Felicitaciones a todo el equipo!*" },
                github: { name: "Alerta GitHub", title: "**🛡️ GITHUB: ALERTA DE SEGURIDAD**", body: "Repo: **{{repo_name}}**\nSeveridad: **ALTA**\nProblema: {{description}}\n\n⚠️ *Por favor, audita el árbol de dependencias de inmediato.*" },
                security: { name: "Seguridad", title: "**⚠️ ALERTA DE SEGURIDAD**", body: "Intento de inicio de sesión sospechoso detectado en {{location}}.\n\n📱 **Dispositivo:** {{device}}\n🕒 **Hora:** {{time}}\n\nSi no fuiste tú, por favor revoca el acceso de inmediato." },
                email: { name: "Correo Entrada", title: "**✨ BIENVENIDO A RELAY ENTERPRISE**", body: "Hola **{{user_name}}**,\n\nTu organización ya está conectada a la red relay global. Empieza a construir tus automatizaciones hoy mismo.\n\nSaludos,\nEl Equipo Relay" }
            }
        }
    },
    pt: {
        docs: {
            "backBtn": "Voltar ao Terminal",
            "titleProtocol": "Documentação do",
            "titleDocs": "Protocolo",
            "subtitle": "Domine o uplink do Relay. Integre notificações profissionais no seu stack de tecnologia em minutos.",
            "authTitle": "Autenticação",
            "authContent": "O Relay usa API Keys para autorizar suas solicitações. Inclua sua chave no cabeçalho `x-api-key`.",
            "endpointTitle": "Endpoint",
            "endpointContent": "Todo o roteamento é tratado através de um único endpoint POST. Sem SDKs complexos.",
            "examplesTitle": "Exemplos de Implementação",
            "copyBtn": "Copiar",
            "copiedBtn": "Copiado",
            "scaleTitle": "Pronto para expandir?",
            "scaleContent": "O Relay foi projetado para altas cargas. Se precisar de taxa de transferência ou whitelabel, veja nossas soluções empresariais.",
            "enterpriseBtn": "Ver Planos Enterprise"
        },
        nav: { features: "Recursos", docs: "API", pricing: "Preços", getStarted: "Entrar" },
        hero: {
            phase: "FASE 1: ATIVA",
            title1: "Envie alertas para qualquer ",
            highlight: "canal",
            title2: " em 2 segundos.",
            desc: "A API de notificação mais elegante para desenvolvedores de alto desempenho. Roteie mensagens para Telegram, Discord e WhatsApp com uma única carga limpa.",
            start: "Inicie seu Projeto",
            viewDocs: "Ver Documentación",
            dashboardLink: "Ir ao Dashboard"
        },
        features: {
            title: "Por que Relay?",
            items: [
                { title: "Latência Ultra-Baixa", desc: "Alimentado por Vercel Edge Functions para entrega mundial em milissegundos." },
                { title: "Seguro & Criptografado", desc: "Gerenciamento avançado de API Keys e protocolos de segurança de ponta a ponta." },
                { title: "Foco no Dev", desc: "Cargas JSON limpas e documentação que dá gosto de ler." }
            ]
        },
        api: {
            title: "Integre em segundos",
            desc: "Uma simples requisição POST é tudo o que você precisa. Sem SDKs complexos."
        },
        pricing: {
            title: "Preços simples e transparentes",
            desc: "Construído para escalar com seu negócio. Sem taxas ocultas.",
            hobby: {
                name: "Hobby",
                price: "$0",
                yearlyPrice: "$0",
                desc: "Perfeito para projetos paralelos.",
                features: ["1 API Key", "100 alertas / mês", "1 canal activo", "Latência padrão", "Suporte da comunidade"]
            },
            starter: {
                name: "Starter",
                price: "$19",
                yearlyPrice: "$15",
                desc: "Para projetos em crescimento.",
                features: ["2 API Keys", "5.000 alertas / mês", "2 canais ativos", "Latência padrão", "Suporte por e-mail"]
            },
            pro: {
                name: "Pro",
                price: "$49",
                yearlyPrice: "$39",
                desc: "Para desenvolvedores sérios.",
                features: ["4 API Keys", "20.000 alertas / mês", "Todos os canais (TG, WA, Discord)", "Analytics Pro", "Suporte Prioritário"]
            },
            enterprise: {
                name: "Enterprise",
                price: "Personalizado",
                yearlyPrice: "Personalizado",
                desc: "Automatize o rastreamento do seu negócio.",
                features: ["Unlimited API Keys",
                    "Alertas ilimitados e limites maiores",
                    "Rastreamento Individual de Clientes",
                    "Whitelabeling (Sua Marca)",
                    "Suporte 24/7 via WhatsApp Privado",
                    "Garantia SLA de 99.9% Uptime"
                ]
            },
            cta: "Começar",
            ctaLemon: "🍋 Cartão (Lemon Squeezy)",
            ctaCrypto: "⚡ Cripto (Binance Pay)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "Fale Conosco",
            billing: {
                monthly: "Mensal",
                yearly: "Anual",
                save: "Economize 20%"
            },
            regional: {
                title: "🇦🇷 Oferta Limitada para a Argentina",
                desc: "Economize 30% extras pagando em ARS via Mercado Pago. Garanta seu preço hoje.",
                cta: "Pagar com Mercado Pago"
            },
            alerts: {
                downgrade: "Ação Negada: Atualmente você tem o plano {userPlan}. Você não pode mudar para um plano inferior ({targetPlan}) daqui.",
                alreadyActive: "Ação Negada: Você já tem o plano {targetPlan} ativo na sua conta!",
                mpNoNeed: "Ação Negada: Atualmente você tem o plano {userPlan}. Você não precisa comprar esta oferta limitada!",
                mpAuth: "Faça login no Relay primeiro para acessar o desconto regional.",
                mpError: "Ocorreu um erro ao conectar ao Mercado Pago.",
                binanceError: "Ocorreu um erro ao conectar ao Binance Pay.",
                contactCopied: "Email copiado para a área de transferência! Você também pode nos contatar em aetherdigital.contact@gmail.com",
                critical: "Falha crítica de conexão. Verifique sua internet."
            },
            checkout: {
                title: "Simular Pagamento",
                successTitle: "Uplink de Sucesso",
                successDesc: "Seu plano foi atualizado. Sincronizando protocolo...",
                tier: "Nível",
                identity: "Identidade do Protocolo",
                session: "Sessão Ativa Verificada",
                mode: "Modo Simulação",
                modeDesc: "Esta é uma simulação de checkout de alta fidelidade. Ao confirmar, suas permissões serão atualizadas. Nenhum valor real será cobrado.",
                abort: "Abortar",
                confirm: "Confirmar Upgrade"
            }
        },
        legal: {
            terms: "Termos de Serviço",
            privacy: "Política de Privacidade",
            refund: "Política de Reembolso",
            support: "Contato de Suporte",
            sections: {
                agreement: "Acordo de Termos",
                agreementDesc: "Ao acessar o protocolo Relay, você concorda em cumprir estes termos funcionais. Nossa infraestrutura é fornecida como está para entrega de notificações de alta performance.",
                usage: "Uso da API e Limites",
                usageDesc: "Os usuários devem aderir aos limites de taxa e políticas de uso justo. O abuso automatizado ou o direcionamento de endpoints não autorizados resultará na revogação imediata do protocolo.",
                ip: "Propriedade Intelectual",
                ipDesc: "Todo o código do Relay, marca e sistemas de telemetria permanecem propriedade exclusiva da Aether Digital. A reprodução sem autorização é proibida.",
                availability: "Disponibilidade do Serviço",
                availabilityDesc: "Esforçamo-nos por 99,9% de disponibilidade. Embora nossa rede edge seja global, a disponibilidade regional pode variar com base na saúde do provedor.",
                collection: "Coleta de Dados",
                collectionDesc: "Capturamos apenas os metadados necessários das mensagens (timestamp, prioridade, status) para fornecer análises de entrega. O conteúdo nunca é registrado permanentemente.",
                security: "Protocolos de Segurança",
                securityDesc: "Todas as transmissões são protegidas via TLS 1.3. As chaves de API são armazenadas usando hashing criptográfico com sal para garantir a proteção da identidade.",
                disclosure: "Divulgação a Terceiros",
                disclosureDesc: "O Relay não vende dados de usuários. Metadados são processados apenas através de conexões de provedores criptografadas para entrega final das mensagens.",
                noRefund: "Política de Não Reembolso",
                noRefundDesc: "Devido à natureza instantânea dos créditos de notificação digital e acesso ao protocolo, todas as compras do Relay são finais.",
                cancellation: "Cancelamentos",
                cancellationDesc: "Você pode cancelar sua assinatura a qualquer momento. O acesso ao protocolo e os recursos permanecerão ativos até o final do seu ciclo de cobrança atual.",
                exceptions: "Exceções",
                exceptionsDesc: "Pedidos de reembolso só serão revisados em casos de falha verificável do sistema impedindo o acesso ao terminal Relay por mais de 24 horas."
            }
        },
        faq: {
            title: "Perguntas Frequentes",
            items: [
                { q: "Como começo a enviar alertas?", a: "Basta criar uma API Key no painel e enviar uma solicitação POST para nosso uplink global. Veja a documentação para exemplos." },
                { q: "O plano Hobby é realmente grátis?", a: "Sim, para sempre. Você recebe 100 alertas por mês e suporte da comunidade sem pagar nada." },
                { q: "Posso fazer upgrade ou downgrade?", a: "Você pode fazer upgrade instantaneamente. Downgrades entram em vigor no final do ciclo de cobrança atual." },
                { q: "Vocês armazenam meus dados de notificação?", a: "Não. Apenas metadados (tempo, status) para análise. O conteúdo da mensagem é excluído após a entrega." }
            ]
        },
        footer: "Arquitetura Aether Digital. Construído para Excelência.",
        auth: {
            welcome: "Bem-vindo ao RELAY",
            desc: "Faça login com sua conta corporativa ou use um Link Mágico para entrar no terminal.",
            google: "Entrar com Google",
            github: "Entrar com GitHub",
            apple: "Entrar com Apple",
            magic: "Ou use o link mágico",
            placeholder: "nome@empresa.com",
            send: "Enviar Link Mágico",
            loading: "Enviando...",
            success: "Verifique seu e-mail para o link mágico!",
            noAccount: "Não tem uma conta?",
            register: "Registre-se",
            terms: "Termos do Protocolo"
        },
        dashboard: {
            quickstart: { "title": "Início Rápido", "firstMsg": "# Transmita sua primeira mensagem", "baseEndpoint": "Endpoint Base", "curlExample": "Exemplo CURL", "desc": "Use qualquer chave gerada da lista para autorizar o link do seu terminal.", "viewDocs": "VER DOCS DO PROTOCOLO" },
            sidebar: {
                overview: "GERAL",
                analytics: "ANÁLISE",
                apiKeys: "CHAVES API",
                logs: "LOGS",
                relayAi: "RELAY AI",
                status: "STATUS",
                testLab: "TEST LAB",
                templates: "TEMPLATES",
                webhooks: "WEBHOOKS",
                domains: "DOMÍNIOS",
                scenarios: "CENÁRIOS",
                connectors: "CONECTORES",
                settings: "CONFIGURAÇÕES"
            },
            webhooks: { "title": "Endpoints de Protocolo", "subtitle": "Configure callbacks HTTP para eventos de entrega em tempo real", "createBtn": "Criar Webhook", "colLabel": "Rótulo / Status", "colDestUrl": "URL de Destino", "colSecret": "Token Secreto", "colActions": "Ações", "scanning": "VERIFICANDO ENDPOINTS...", "empty": "Nenhum webhook ativo configurado para esta conta.", "unnamed": "Webhook sem nome" },
            logs: { "title": "LOGS DE PROTOCOLO", "subtitle": "TELEMETRIA DE ENTREGA EM TEMPO REAL E RELATÓRIOS DE DIAGNÓSTICO", "refresh": "ATUALIZAR TELEMETRIA", "colMethod": "MÉTODO / PLATAFORMA", "colKey": "CHAVE AUTENTICADORA", "colStatus": "STATUS", "colTiming": "TEMPO", "colSync": "SINCRONIZAÇÃO", "empty": "NENHUMA ATIVIDADE DETECTADA NO UPLINK RELAY.", "diagTitle": "PROTOCOLO DE DIAGNÓSTICO AUTOMATIZADO", "diagDesc": "Relay captura a telemetria do provedor para diminuir seu MTTR identificando instantaneamente falhas de entrega.", "telemetryActive": "TELEMETRIA ATIVA" },
            testlab: { "title": "Laboratório", "subtitle": "Verifique o payload de integração e os protocolos de entrega em tempo real.", "platform": "PLATAFORMA", "targetUrl": "ID DE DESTINO / URL", "msgBody": "CORPO DA MENSAGEM", "msgPlaceholder": "Digite sua mensagem de teste...", "variables": "VARIÁVEIS (JSON)", "execute": "EXECUTAR PROTOCOLO", "consoleTitle": "CONSOLE DE DIAGNÓSTICO RELAY", "waiting": "Aguardando execução..." },
            templates: { "title": "Modelos de Mensagem", "subtitle": "Crie projetos de mensagens reutilizáveis com variáveis dinâmicas.", "createBtn": "CRIAR MODELO", "emptyTitle": "Nenhum modelo encontrado", "emptyDesc": "Crie seu primeiro modelo para enviar notificações personalizadas em escala." },
            domains: { "title": "COFRE DE IDENTIDADE", "subtitle": "VERIFIQUE DOMÍNIOS PARA WHITELISTING E BRANDING PERSONALIZADO", "addBtn": "ADICIONAR DOMÍNIO", "colHostname": "NOME DO HOST", "colStatus": "STATUS DE VERIFICAÇÃO", "colCreated": "CRIADO EM", "colActions": "AÇÕES", "empty": "NENHUM DOMÍNIO AUTORIZADO ENCONTRADO EM SEU REGISTRO." },
            scenarios: {
                title: "Motor de Cenários",
                subtitle: "Projete pipelines lógicos para roteamento",
                newFlow: "NOVO FLUXO",
                savePipeline: "SALVAR FLUXO",
                deletePipeline: "EXCLUIR FLUXO",
                routingStatus: "STATUS DE ROTA",
                pipelineEditor: "EDITOR DE FLUJO",
                webhookInput: "WEBHOOK / ENTRADA",
                routeTo: "ROTEAR PARA",
                onEvent: "NO EVENTO",
                back: "VOLTAR À LISTA",
                saved: "FLUXO SALVO",
                deleteConfirm: "Tem certeza de que deseja excluir este cenário?",
                deleteSelected: "EXCLUIR SELECIONADOS",
                countSelected: "{count} selecionados",
                bulkDeleteConfirm: "Excluir {count} cenários? Isso não pode ser desfeito."
            },
            welcome: "Bem-vindo de volta,",
            subtitle: "O pulso da sua rede está estável. {count} pacotes entregues este mês.",
            newKey: "Nova API Key",
            stats: {
                success: "Entregas Bem-sucedidas",
                failure: "Taxa de Falha",
                latency: "Latência Média"
            },
            table: {
                title: "Chaves de Protocolo Ativas",
                docs: "Ver Toda a Documentação",
                calls: "chamadas",
                secret: "Segredo"
            },
            nav: {
                overview: "API Keys",
                keys: "API Keys",
                analytics: "Logs",
                settings: "Configurações",
                signOut: "Sair"
            },
            modal: {
                title: "Nova Chave de Protocolo",
                label: "Rótulo",
                success: "Chave gerada com sucesso. Copie agora, só será exibida uma vez.",
                placeholder: "ex. Loja Produção",
                create: "Gerar Chave",
                copy: "Copiar Chave",
                close: "Concluído"
            },
            settings: {
                fullName: "NOME COMPLETO",
                corporateEmail: "EMAIL CORPORATIVO",
                organization: "ORGANIZAÇÃO",
                saveBtn: "SALVAR CONFIG.",
                profileTitle: "Configuração de Perfil",
                profileSubtitle: "Identidade e Organização",
                accountId: "ID da Conta",
                activePlan: "Plano Ativo",
                upgrade: "Atualizar",
                whiteLabelTitle: "White Label / Branding Personalizado",
                whiteLabelSubtitle: "Identidade Corporativa",
                corpName: "Nome da Empresa",
                corpLogo: "Logo Corporativo",
                upgradeEnterprise: "Atualize para Enterprise para desbloquear",
                saveSettings: "SALVAR CONFIGURAÇÕES",
                specialOptions: "Opções Especiais",
                autoRefresh: "Auto-atualizar Análises",
                autoRefreshDesc: "Sincroniza dados de telemetria automaticamente a cada 30 segundos.",
                protocolAlerts: "Alertas de Protocolo",
                protocolAlertsDesc: "Receba notificações em tempo real para falhas de retransmissão.",
                performanceMax: "Desempenho Máximo",
                performanceMaxDesc: "Ativa transições de UI aceleradas por GPU.",
                securityTitle: "Segurança do Protocolo",
                updateCredentials: "Atualizar Credenciais",
                updateCredentialsDesc: "Rodar chaves de acesso e métodos de segurança.",
                hardReset: "Reset TOTAL",
                hardResetDesc: "Revogar todas as sessões ativas desta conta.",
                protocolOwner: "PROPRIETÁRIO DO PROTOCOLO:",
                brandingSignature: "Enviado via {brand}"
            },
            presets: {
                title: "PRESETS EMPRESARIAIS E SIMULADOR",
                libraryTitle: "Biblioteca de Presets",
                alarm: { name: "Alarme Diário", title: "**⏰ ALARME DE SISTEMA**", body: "Olá {{user}},\nÉ hora do seu lembrete programado.\n\n_Mensagem: {{msg}}_" },
                stripe: { name: "Venda Stripe", title: "**💰 STRIPE: PAGAMENTO BEM-SUCEDIDO**", body: "Cliente: **{{customer_name}}**\nValor: **{{amount}} {{currency}}**\nPlano: {{plan_name}}\n\n*Fatura: {{invoice_id}}*" },
                shopify: { name: "Pedido Shopify", title: "**🛍️ SHOPIFY: NOVO PEDIDO #{{order_number}}**", body: "Itens: {{item_count}}\nTotal: **{{total_price}}**\nEnvio: {{shipping_city}}, {{shipping_country}}\n\n*Verifique o painel administrativo para atendimento.*" },
                clerk: { name: "Registro Clerk", title: "**👤 CLERK: NOVO USUÁRIO REGISTRADO**", body: "Email: **{{user_email}}**\nProvedor: {{oauth_provider}}\nStatus: **Ativo**\n\n*ID de Usuário: {{user_id}}*" },
                hubspot: { name: "Negócio HubSpot", title: "**🤝 HUBSPOT: NOVO NEGÓCIO FECHADO!**", body: "Negócio: **{{deal_name}}**\nValor: **{{amount}}**\nProprietário: {{owner_name}}\n\n🎉 *Parabéns para a equipe!*" },
                github: { name: "Alerta GitHub", title: "**🛡️ GITHUB: ALERTA DE SEGURANÇA**", body: "Repositório: **{{repo_name}}**\nGravidade: **ALTA**\nProblema: {{description}}\n\n⚠️ *Por favor, faça a auditoria imediata das dependências.*" },
                security: { name: "Segurança", title: "**⚠️ ALERTA DE SEGURANÇA**", body: "Foi detectada uma tentativa suspeita de login em {{location}}.\n\n📱 **Dispositivo:** {{device}}\n🕒 **Hora:** {{time}}\n\nSe não foi você, revogue o acesso imediatamente." },
                email: { name: "Email Bem-vindo", title: "**✨ BEM-VINDO AO RELAY ENTERPRISE**", body: "Olá **{{user_name}}**,\n\nSua organização está conectada fisicamente à rede relay global.\n\nAtenciosamente,\nEquipe Relay" }
            }
        }
    },
    ru: {
        docs: {
            "backBtn": "Вернуться в Терминал",
            "titleProtocol": "Протокол",
            "titleDocs": "Документация",
            "subtitle": "Освойте Relay Uplink. Интегрируйте профессиональные уведомления в ваш технологический стек за минуты.",
            "authTitle": "Аутентификация",
            "authContent": "Relay использует API ключи для авторизации. Включите ваш ключ в заголовок `x-api-key` каждого запроса.",
            "endpointTitle": "Endpoint",
            "endpointContent": "Вся маршрутизация сообщений обрабатывается через один POST endpoint. Никаких сложных SDK.",
            "examplesTitle": "Примеры Реализации",
            "copyBtn": "Копировать",
            "copiedBtn": "Скопировано",
            "scaleTitle": "Готовы к масштабированию?",
            "scaleContent": "Relay создан для больших нагрузок. Если вам нужны индивидуальные решения, ознакомьтесь с Enterprise.",
            "enterpriseBtn": "Смотреть Enterprise Планы"
        },
        nav: { features: "Функции", docs: "API", pricing: "Цены", getStarted: "Войти" },
        hero: {
            phase: "ФАЗА 1: АКТИВНА",
            title1: "Доставляйте уведомления в любой ",
            highlight: "канал",
            title2: " за 2 секунды.",
            desc: "Самый элегантный API уведомлений для высокопроизводительных разработчиков. Маршрутизация сообщений в Telegram, Discord и WhatsApp с помощью одного чистого запроса.",
            start: "Начать проект",
            viewDocs: "Документация API",
            dashboardLink: "В консоль"
        },
        features: {
            title: "Почему Relay?",
            items: [
                { title: "Сверхнизкая задержка", desc: "Работает на базе Vercel Edge Functions для доставки по всему миру за миллисекунды." },
                { title: "Безопасность и шифрование", desc: "Улучшенное управление API-ключами и протоколы сквозной безопасности." },
                { title: "Для разработчиков", desc: "Чистые JSON-запросы и отличная документация." }
            ]
        },
        api: {
            title: "Интеграция за секунды",
            desc: "Достаточно одного POST-запроса. Сложные SDK не требуются."
        },
        pricing: {
            title: "Простые и прозрачные цены",
            desc: "Создано для роста вместе с вашим бизнесом. Без скрытых платежей.",
            hobby: {
                name: "Хобби",
                price: "$0",
                yearlyPrice: "$0",
                desc: "Идеально для личных проектов.",
                features: ["1 API Key", "100 уведомлений / месяц", "1 активный канал", "Стандартная задержка", "Поддержка сообщества"]
            },
            starter: {
                name: "Starter",
                price: "$19",
                yearlyPrice: "$15",
                desc: "Для растущих проектов.",
                features: ["2 API Keys", "5 000 уведомлений / месяц", "2 активных канала", "Стандартная задержка", "Поддержка по Email"]
            },
            pro: {
                name: "Про",
                price: "$49",
                yearlyPrice: "$39",
                desc: "Для серьезных разработчиков.",
                features: ["4 API Keys", "20 000 уведомлений / месяц", "Все каналы (TG, WA, Discord)", "Про-Аналитика", "Приоритетная поддержка"]
            },
            enterprise: {
                name: "Enterprise",
                price: "Индивидуальный",
                yearlyPrice: "Индивидуальный",
                desc: "Автоматизируйте отслеживание бизнеса.",
                features: ["Unlimited API Keys",
                    "Безлимитные уведомления и лимиты выше",
                    "Индивидуальный трекинг клиентов",
                    "White-label (Ваш логотип)",
                    "Круглосуточная поддержка WhatsApp",
                    "SLA с гарантией 99.9% аптайма"
                ]
            },
            cta: "Начать",
            ctaLemon: "🍋 Начать (Lemon Squeezy)",
            ctaCrypto: "⚡ Крипто (Binance Pay)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "Связаться",
            billing: {
                monthly: "Ежемесячно",
                yearly: "Ежегодно",
                save: "Скидка 20%"
            },
            regional: {
                title: "🇦🇷 Ограниченное предложение для Аргентины",
                desc: "Сэкономьте дополнительные 30%, оплачивая в ARS через Mercado Pago.",
                cta: "Оплатить через Mercado Pago"
            },
            alerts: {
                downgrade: "В действии отказано: сейчас у вас тариф {userPlan}. Вы не можете перейти на более низкий тариф ({targetPlan}) отсюда.",
                alreadyActive: "В действии отказано: тариф {targetPlan} уже активен в вашей учетной записи!",
                mpNoNeed: "В действии отказано: сейчас у вас тариф {userPlan}. Вам не нужно приобретать это ограниченное предложение!",
                mpAuth: "Пожалуйста, сначала войдите в систему, чтобы получить региональную скидку.",
                mpError: "Произошла ошибка при подключении к Mercado Pago.",
                critical: "Критическая ошибка подключения."
            },
            checkout: {
                title: "Симуляция оплаты",
                successTitle: "Успешное обновление",
                successDesc: "Ваш тарифный план обновлен. Синхронизация протокола...",
                tier: "Уровень",
                identity: "Идентификация протокола",
                session: "Проверенная активная сессия",
                mode: "Режим симуляции",
                modeDesc: "Это высокоточная симуляция оплаты. Нажатие кнопки подтверждения обновит права доступа. Реальные средства списаны не будут.",
                abort: "Отмена",
                confirm: "Подтвердить обновление"
            }
        },
        legal: {
            terms: "Условия использования", privacy: "Политика конфиденциальности", refund: "Политика возврата", support: "Служба поддержки", sections: {
                agreement: "Согласие с условиями",
                agreementDesc: "Доступ к протоколу Relay означает ваше согласие с данными условиями. Наша инфраструктура предоставляется 'как есть' для высокопроизводительной доставки уведомлений.",
                usage: "Использование API и лимиты",
                usageDesc: "Пользователи должны соблюдать лимиты запросов и правила добросовестного использования. Автоматизированное злоупотребление приведет к немедленному аннулированию доступа.",
                ip: "Интеллектуальная собственность",
                ipDesc: "Весь код Relay, брендинг и системы телеметрии являются исключительной собственностью Aether Digital. Воспроизведение без разрешения запрещено.",
                availability: "Доступность сервиса",
                availabilityDesc: "Мы стремимся к доступности 99,9%. Хотя наша сеть является глобальной, региональная доступность может варьироваться в зависимости от состояния провайдеров.",
                collection: "Сбор данных",
                collectionDesc: "Мы собираем только необходимые метаданные сообщений (время, приоритет, статус) для аналитики доставки. Содержимое сообщений никогда не сохраняется постоянно.",
                security: "Протоколы безопасности",
                securityDesc: "Все передачи защищены TLS 1.3. API-ключи хранятся с использованием криптографического хеширования с солью для защиты идентификационных данных.",
                disclosure: "Раскрытие информации",
                disclosureDesc: "Relay не продает данные пользователей. Метаданные обрабатываются только через зашифрованные каналы провайдеров, необходимые для доставки сообщений.",
                noRefund: "Политика отсутствия возврата",
                noRefundDesc: "В связи с мгновенным характером предоставления цифровых кредитов и доступа к протоколу, все покупки в Relay являются окончательными.",
                cancellation: "Отмена подписки",
                cancellationDesc: "Вы можете отменить подписку в любое время. Доступ к функциям сохранится до конца текущего расчетного периода.",
                exceptions: "Исключения",
                exceptionsDesc: "Запросы на возврат рассматриваются только в случаях подтвержденного сбоя системы, препятствующего доступу к терминалу Relay более 24 часов."
            }
        },
        faq: {
            title: "Часто задаваемые вопросы", items: [{
                q: "Как начать отправлять уведомления?", a: "Просто создайте API-ключ в панели управления и отправьте POST-запрос на наш сервер. Ознакомьтесь с документацией для примеров кода."
            }, {
                q: "Уровень Hobby действительно бесплатный?", a: "Да, навсегда. Вы получаете 100 уведомлений в месяц и поддержку сообщества совершенно бесплатно."
            }, {
                q: "Могу ли я сменить тарифный план?", a: "Вы можете повысить план мгновенно. Понижение вступает в силу в конце текущего расчетного периода."
            }, {
                q: "Вы храните данные моих уведомлений?", a: "Нет. Мы храним только метаданные (время, статус) для аналитики. Содержимое сообщения удаляется сразу после доставки."
            }]
        },
        footer: "Архитектура Aether Digital. Создано для совершенства.",
        auth: {
            welcome: "Добро пожаловать в RELAY",
            desc: "Войдите через корпоративный аккаунт или магическую ссылку.",
            google: "Войти через Google",
            github: "Войти через GitHub",
            apple: "Войти через Apple",
            magic: "Или используйте магическую ссылку",
            placeholder: "name@company.com",
            send: "Отправить ссылку",
            loading: "Отправка...",
            success: "Проверьте почту для входа!",
            noAccount: "Нет аккаунта?",
            register: "Регистрация",
            terms: "Условия протокола"
        },
        dashboard: {
            quickstart: { "title": "Быстрый старт", "firstMsg": "# Отправьте ваше первое сообщение", "baseEndpoint": "Базовый Endpoint", "curlExample": "Пример CURL", "desc": "Используйте любой сгенерированный ключ из списка для авторизации терминала.", "viewDocs": "СМОТРЕТЬ ДОКУМЕНТАЦИЮ" },
            sidebar: {
                overview: "ОБЗОР",
                analytics: "АНАЛИТИКА",
                apiKeys: "КЛЮЧИ API",
                logs: "ЛОГИ",
                relayAi: "RELAY AI",
                status: "СТАТУС",
                testLab: "TEST LAB",
                templates: "ШАБЛОНЫ",
                webhooks: "ВЕБХУКИ",
                domains: "ДОМЕНЫ",
                scenarios: "СЦЕНАРИИ",
                connectors: "КОННЕКТОРЫ",
                settings: "НАСТРОЙКИ"
            },
            webhooks: { "title": "Конечные точки протокола", "subtitle": "Настройка HTTP-колбэков для событий доставки в реальном времени", "createBtn": "Создать Webhook", "colLabel": "Метка / Статус", "colDestUrl": "URL назначения", "colSecret": "Секретный токен", "colActions": "Действия", "scanning": "СКАНИРОВАНИЕ КОНЕЧНЫХ ТОЧЕК...", "empty": "Для этой учетной записи не настроено активных веб-хуков.", "unnamed": "Безымянный Webhook" },
            logs: { "title": "ЖУРНАЛЫ ПРОТОКОЛА", "subtitle": "ТЕЛЕМЕТРИЯ ДОСТАВКИ В РЕАЛЬНОМ ВРЕМЕНИ И ОТЧЕТЫ ДИАГНОСТИКИ", "refresh": "ОБНОВИТЬ ТЕЛЕМЕТРИЮ", "colMethod": "МЕТОД / ПЛАТФОРМА", "colKey": "КЛЮЧ АУТЕНТИФИКАЦИИ", "colStatus": "СТАТУС", "colTiming": "ВРЕМЯ", "colSync": "СИНХРОНИЗАЦИЯ", "empty": "АКТИВНОСТЬ НЕ ОБНАРУЖЕНА НА КАНАЛЕ RELAY.", "diagTitle": "АВТОМАТИЗИРОВАННЫЙ ДИАГНОСТИЧЕСКИЙ ПРОТОКОЛ", "diagDesc": "Relay захватывает телеметрию провайдера для снижения MTTR.", "telemetryActive": "ТЕЛЕМЕТРИЯ АКТИВНА" },
            testlab: { "title": "Тестовая Лаборатория", "subtitle": "Проверьте интеграцию и протоколы доставки в реальном времени.", "platform": "ПЛАТФОРМА", "targetUrl": "ЦЕЛЕВОЙ ID / URL", "msgBody": "ТЕЛО СООБЩЕНИЯ", "msgPlaceholder": "Введите тестовое сообщение...", "variables": "ПЕРЕМЕННЫЕ (JSON)", "execute": "ВЫПОЛНИТЬ ПРОТОКОЛ", "consoleTitle": "ДИАГНОСТИЧЕСКАЯ КОНСОЛЬ RELAY", "waiting": "Ожидание выполнения..." },
            templates: { "title": "Шаблоны сообщений", "subtitle": "Создавайте многоразовые схемы сообщений с динамическими переменными.", "createBtn": "СОЗДАТЬ ШАБЛОН", "emptyTitle": "Шаблоны не найдены", "emptyDesc": "Создайте свой первый шаблон для отправки персонализированных уведомлений в масштабе." },
            domains: { "title": "ХРАНИЛИЩЕ ИДЕНТИФИКАЦИИ", "subtitle": "ПРОВЕРКА ДОМЕНОВ ДЛЯ БЕЛОГО СПИСКА И БРЕНДИНГА", "addBtn": "ДОБАВИТЬ ДОМЕН", "colHostname": "ХОСТ", "colStatus": "СТАТУС ПРОВЕРКИ", "colCreated": "СОЗДАНО", "colActions": "ДЕЙСТВИЯ", "empty": "В ВАШЕМ РЕЕСТРЕ НЕ НАЙДЕНО АВТОРИЗОВАННЫХ ДОМЕНОВ." },
            scenarios: {
                title: "Движок сценариев",
                subtitle: "Проектирование логических цепочек",
                newFlow: "НОВЫЙ ПОТОК",
                savePipeline: "СОХРАНИТЬ ПОТОК",
                deletePipeline: "УДАЛИТЬ ПОТОК",
                routingStatus: "СТАТУС МАРШРУТА",
                pipelineEditor: "РЕДАКТОР ПОТОКА",
                webhookInput: "WEBHOOK / ВВОД",
                routeTo: "МАРШРУТ К",
                onEvent: "ПО СОБЫТИЮ",
                back: "НАЗАД К СПИСКУ",
                saved: "ПОТОК СОХРАНЕН",
                deleteConfirm: "Вы уверены, что хотите удалить этот сценарий?",
                deleteSelected: "УДАЛИТЬ ВЫБРАННЫЕ",
                countSelected: "Выбрано: {count}",
                bulkDeleteConfirm: "Удалить {count} сценариев? Это нельзя отменить."
            },
            welcome: "С возвращением,",
            subtitle: "Пульс вашей сети стабилен. В этом месяце доставлено {count} пакетов.",
            newKey: "Новый API-ключ",
            stats: {
                success: "Успешные доставки",
                failure: "Частота отказов",
                latency: "Средняя задержка"
            },
            table: {
                title: "Активные ключи протокола",
                docs: "Просмотреть всю документацию",
                calls: "вызовов",
                secret: "Секрет"
            },
            nav: {
                overview: "API Ключи",
                keys: "API Ключи",
                analytics: "Logs",
                settings: "Настройки",
                signOut: "Выйти"
            },
            modal: {
                title: "Новый ключ протокола",
                label: "Метка ключа",
                success: "Ключ успешно сгенерирован. Скопируйте его сейчас, он будет показан только один раз.",
                placeholder: "например, Магазин",
                create: "Создать ключ",
                copy: "Копировать",
                close: "Готово"
            },
            settings: {
                fullName: "ПОЛНОЕ ИМЯ",
                corporateEmail: "КОРПОРАТИВНАЯ ПОЧТА",
                organization: "ОРГАНИЗАЦИЯ",
                saveBtn: "СОХРАНИТЬ",
                profileTitle: "Настройка профиля",
                profileSubtitle: "Идентификация и организация",
                accountId: "ID учетной записи",
                activePlan: "Активный план",
                upgrade: "Улучшить",
                whiteLabelTitle: "White Label / Брендинг",
                whiteLabelSubtitle: "Корпоративная идентификация",
                corpName: "Название компании",
                corpLogo: "Логотип компании",
                upgradeEnterprise: "Улучшите до Enterprise для разблокировки",
                saveSettings: "СОХРАНИТЬ ИЗМЕНЕНИЯ",
                specialOptions: "Особые опции",
                autoRefresh: "Авто-обновление аналитики",
                autoRefreshDesc: "Синхронизация телеметрии каждые 30 секунд.",
                protocolAlerts: "Оповещения протокола",
                protocolAlertsDesc: "Получайте уведомления об ошибках маршрутизации в реальном времени.",
                performanceMax: "Максимальная производительность",
                performanceMaxDesc: "Включает аппаратное ускорение переходов с помощью GPU.",
                securityTitle: "Безопасность протокола",
                updateCredentials: "Сменить учетные данные",
                updateCredentialsDesc: "Сменить ключи доступа и методы безопасности.",
                hardReset: "Полный сброс",
                hardResetDesc: "Отменить все активные сессии аккаунта.",
                protocolOwner: "ВЛАДЕЛЕЦ ПРОТОКОЛА:",
                brandingSignature: "Отправлено через {brand}"
            },
            presets: {
                title: "ПРЕСЕТЫ ПРЕДПРИЯТИЯ И СИМУЛЯТОР",
                libraryTitle: "Библиотека пресетов",
                alarm: { name: "Ежедневная Сигнализация", title: "**⏰ СИСТЕМНАЯ СИГНАЛИЗАЦИЯ**", body: "Привет, {{user}},\nПришло время вашего запланированного напоминания.\n\n_Сообщение: {{msg}}_" },
                stripe: { name: "Продажа Stripe", title: "**💰 STRIPE: ОПЛАТА УСПЕШНА**", body: "Клиент: **{{customer_name}}**\nСумма: **{{amount}} {{currency}}**\nПлан: {{plan_name}}\n\n*Счет: {{invoice_id}}*" },
                shopify: { name: "Заказ Shopify", title: "**🛍️ SHOPIFY: НОВЫЙ ЗАКАЗ #{{order_number}}**", body: "Товары: {{item_count}}\nИтого: **{{total_price}}**\nДоставка: {{shipping_city}}, {{shipping_country}}\n\n*Проверьте панель админа для выполнения.*" },
                clerk: { name: "Регистрация Clerk", title: "**👤 CLERK: НОВЫЙ ПОЛЬЗОВАТЕЛЬ**", body: "Email: **{{user_email}}**\nПровайдер: {{oauth_provider}}\nСтатус: **Активен**\n\n*User ID: {{user_id}}*" },
                hubspot: { name: "Сделка HubSpot", title: "**🤝 HUBSPOT: НОВАЯ СДЕЛКА!**", body: "Сделка: **{{deal_name}}**\nСумма: **{{amount}}**\nВладелец: {{owner_name}}\n\n🎉 *Поздравляем команду!*" },
                github: { name: "Оповещение GitHub", title: "**🛡️ GITHUB: УГРОЗА БЕЗОПАСНОСТИ**", body: "Репозиторий: **{{repo_name}}**\nКритичность: **ВЫСОКАЯ**\nПроблема: {{description}}\n\n⚠️ *Немедленно проверьте зависимости.*" },
                security: { name: "Безопасность", title: "**⚠️ ПРЕДУПРЕЖДЕНИЕ БЕЗОПАСНОСТИ**", body: "Обнаружена подозрительная попытка входа из {{location}}.\n\n📱 **Устройство:** {{device}}\n🕒 **Время:** {{time}}\n\nЕсли это были не вы, немедленно заблокируйте доступ." },
                email: { name: "Приветственное Письмо", title: "**✨ ДОБРО ПОЖАЛОВАТЬ В RELAY ENTERPRISE**", body: "Привет, **{{user_name}}**,\n\nВаша организация теперь подключена к глобальной сети relay. Начните строить вашу автоматизацию сегодня.\n\nС уважением,\nКоманда Relay" }
            }
        }
    },
    fr: {
        docs: {
            "backBtn": "Retour au Terminal",
            "titleProtocol": "Protocole",
            "titleDocs": "Documentation",
            "subtitle": "Maîtrisez le Relay Uplink. Intégrez des notifications professionnelles dans votre pile technologique en quelques minutes.",
            "authTitle": "Authentification",
            "authContent": "Relay utilise des clés API pour autoriser vos requêtes. Incluez-la dans l'en-tête `x-api-key`.",
            "endpointTitle": "Endpoint",
            "endpointContent": "Le routage des messages s'effectue via un seul point de terminaison POST. Sans SDK complexes.",
            "examplesTitle": "Exemples d'implémentation",
            "copyBtn": "Copier",
            "copiedBtn": "Copié",
            "scaleTitle": "Prêt à évoluer ?",
            "scaleContent": "Relay est taillé pour la production. Si vous avez besoin de solutions personnalisées, vérifiez nos plans.",
            "enterpriseBtn": "Voir les Plans Entreprise"
        },
        nav: { features: "Fonctions", docs: "API", pricing: "Tarifs", getStarted: "Commencer" },
        hero: {
            phase: "PHASE 1: EN DIRECT",
            title1: "Livrez des alertes sur n'importe quel ",
            highlight: "canal",
            title2: " en 2 secondes.",
            desc: "L'API de notification la plus élégante pour les développeurs haute performance. Acheminez les messages vers Telegram, Discord et WhatsApp avec une seule charge utile propre.",
            start: "Démarrez votre projet",
            viewDocs: "Voir la Doc API",
            dashboardLink: "Vers le Dashboard"
        },
        features: {
            title: "Pourquoi Relay?",
            items: [
                { title: "Latence Ultra-Faible", desc: "Propulsé par Vercel Edge Functions pour une livraison mondiale en millisecondes." },
                { title: "Sécurisé & Crypté", desc: "Gestion avancée des clés API et protocoles de sécurité des données de bout en bout." },
                { title: "Développeur First", desc: "Charges utiles JSON propres et documentation qui ne craint pas." }
            ]
        },
        api: {
            title: "Intégrez en secondes",
            desc: "Une simple requête POST est tout ce dont vous avez besoin. Aucun SDK complexe requis."
        },
        pricing: {
            title: "Tarification simple et transparente",
            desc: "Conçu pour évoluer avec votre entreprise. Pas de frais cachés.",
            hobby: {
                name: "Hobby",
                price: "0€",
                yearlyPrice: "0€",
                desc: "Parfait pour les projets secondaires.",
                features: ["1 API Key", "100 alertes / mois", "1 canal actif", "Latence standard", "Support communautaire"]
            },
            starter: {
                name: "Starter",
                price: "19€",
                yearlyPrice: "15€",
                desc: "Pour les projets en croissance.",
                features: ["2 API Keys", "5 000 alertes / mois", "2 canaux actifs", "Latence standard", "Support par email"]
            },
            pro: {
                name: "Pro",
                price: "49€",
                yearlyPrice: "39€",
                desc: "Pour les développeurs sérieux.",
                features: ["4 API Keys", "20 000 alertes / mois", "Tous les canaux (TG, WA, Discord)", "Analyses Pro", "Support Prioritaire"]
            },
            enterprise: {
                name: "Enterprise",
                price: "Personnalisé",
                yearlyPrice: "Personnalisé",
                desc: "Automatisez le suivi de votre entreprise.",
                features: ["Unlimited API Keys",
                    "Alertes illimitées et limites plus élevées",
                    "Suivi Individuel des Clients",
                    "Marque Blanche (Votre Logo)",
                    "Support WhatsApp Dédié 24/7",
                    "Garantia de SLA de 99,9%"
                ]
            },
            cta: "Commencer",
            ctaLemon: "🍋 Commencer (Lemon Squeezy)",
            ctaCrypto: "⚡ Crypto (Binance Pay)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "Contactez-nous",
            billing: {
                monthly: "Mensuel",
                yearly: "Annuel",
                save: "Économisez 20%"
            },
            regional: {
                title: "🇦🇷 Offre Limitée pour l'Argentine",
                desc: "Économisez 30% supplémentaires en payant en ARS via Mercado Pago.",
                cta: "Payer avec Mercado Pago"
            },
            alerts: {
                downgrade: "Action refusée: Vous avez actuellement le forfait {userPlan}. Vous ne pouvez pas passer à un forfait inférieur ({targetPlan}).",
                alreadyActive: "Action refusée: Vous avez déjà le forfait {targetPlan} actif sur votre compte!",
                mpNoNeed: "Action refusée: Vous avez actuellement le forfait {userPlan}. Vous n'avez pas besoin d'acheter cette offre limitée!",
                mpAuth: "Veuillez d'abord vous connecter pour accéder à la réduction régionale.",
                mpError: "Une erreur s'est produite lors de la connexion.",
                critical: "Échec de connexion critique."
            },
            checkout: {
                title: "Simuler le Paiement",
                successTitle: "Succès de la Mise à Jour",
                successDesc: "Votre forfait a été mis à jour. Synchronisation du protocole...",
                tier: "Niveau",
                identity: "Identité du Protocole",
                session: "Session Active Vérifiée",
                mode: "Mode Simulation",
                modeDesc: "Ceci est une simulation de paiement haute fidélité. Confirmer mettra à jour vos permissions. Aucun fonds réel ne sera débité.",
                abort: "Abandonner",
                confirm: "Confirmer la Mise à Jour"
            }
        },
        legal: {
            terms: "Conditions d'utilisation", privacy: "Politique de confidentialité", refund: "Politique de remboursement", support: "Contact Support", sections: {
                agreement: "Acceptation des conditions",
                agreementDesc: "En accédant au protocole Relay, vous acceptez d'être lié par ces conditions fonctionnelles. Notre infrastructure est fournie telle quelle pour une livraison de notifications haute performance.",
                usage: "Utilisation de l'API & Limites",
                usageDesc: "Les utilisateurs doivent respecter les limites de débit et les politiques d'utilisation équitable. Tout abus automatisé entraînera la révocation immédiate du protocole.",
                ip: "Propriété intellectuelle",
                ipDesc: "Tout le code Relay, l'image de marque et les systèmes de télémétrie restent la propriété exclusive d'Aether Digital. Toute reproduction sans autorisation est interdite.",
                availability: "Disponibilité du service",
                availabilityDesc: "Nous visons une disponibilité de 99,9 %. Bien que notre réseau edge soit mondial, la disponibilité régionale peut varier selon la santé du fournisseur.",
                collection: "Collecte de données",
                collectionDesc: "Nous ne capturons que les métadonnées nécessaires (horodatage, priorité, statut) pour les analyses de livraison. Le contenu n'est jamais enregistré de façon permanente.",
                security: "Protocoles de sécurité",
                securityDesc: "Toutes les transmissions sont sécurisées via TLS 1.3. Les clés API sont stockées à l'aide d'un hachage cryptographique salé pour assurer la protection de l'identité.",
                disclosure: "Divulgation à des tiers",
                disclosureDesc: "Relay ne vend pas de données utilisateur. Les métadonnées sont uniquement traitées via des liaisons chiffrées nécessaires à la livraison finale du message.",
                noRefund: "Politique de non-remboursement",
                noRefundDesc: "En raison de la nature instantanée des crédits de notification numérique et de l'accès au protocole, tous les achats Relay sont définitifs.",
                cancellation: "Annulations",
                cancellationDesc: "Vous pouvez annuler votre abonnement à tout moment. L'accès au protocole restera actif jusqu'à la fin de votre cycle de facturation actuel.",
                exceptions: "Exceptions",
                exceptionsDesc: "Les demandes de remboursement ne seront examinées qu'en cas de défaillance vérifiable du système empêchant l'accès au terminal Relay pendant plus de 24 heures."
            }
        },
        faq: {
            title: "Questions fréquemment posées", items: [{
                q: "Comment commencer à envoyer des alertes ?", a: "Créez simplement une clé API dans le tableau de bord et envoyez une requête POST à notre uplink global. Consultez la documentation pour les exemples."
            }, {
                q: "Le niveau Hobby est-il vraiment gratuit ?", a: "Oui, pour toujours. Vous bénéficiez de 100 alertes par mois et d'un support communautaire gratuit."
            }, {
                q: "Puis-je changer mon abonnement ?", a: "Vous pouvez passer au niveau supérieur instantanément. Les rétrogradations prennent effet à la fin de votre cycle de facturation."
            }, {
                q: "Stockez-vous mes données de notification ?", a: "Non. Nous stockons uniquement les métadonnées pour vos analyses. Le contenu est supprimé immédiatement après la livraison."
            }]
        },
        footer: "Architecture Aether Digital. Conçu pour l'Excellence.",
        auth: {
            welcome: "Bienvenue sur RELAY",
            desc: "Connectez-vous avec votre compte professionnel ou un lien magique.",
            google: "Se connecter avec Google",
            github: "Se connecter avec GitHub",
            apple: "Se connecter avec Apple",
            magic: "Ou utilisez un lien magique",
            placeholder: "nom@entreprise.com",
            send: "Envoyer le lien",
            loading: "Envoi...",
            success: "Consultez vos emails !",
            noAccount: "Pas de compte ?",
            register: "S'inscrire",
            terms: "Conditions d'utilisation"
        },
        dashboard: {
            quickstart: { "title": "Démarrage Rapide", "firstMsg": "# Relayer votre premier message", "baseEndpoint": "Endpoint de base", "curlExample": "Exemple CURL", "desc": "Utilisez n'importe quelle clé générée à partir de la liste pour autoriser la liaison de votre terminal.", "viewDocs": "VOIR LA DOCUMENTATION COMPLÈTE" },
            sidebar: {
                overview: "APERÇU",
                analytics: "ANALYSE",
                apiKeys: "CLÉS API",
                logs: "LOGS",
                relayAi: "RELAY AI",
                status: "STATUT",
                testLab: "LAB TEST",
                templates: "MODÈLES",
                webhooks: "WEBHOOKS",
                domains: "DOMAINES",
                scenarios: "SCÉNARIOS",
                connectors: "CONNECTEURS",
                settings: "PARAMÈTRES"
            },
            webhooks: { "title": "Points de terminaison du protocole", "subtitle": "Configurer les rappels HTTP pour les événements de livraison en temps réel", "createBtn": "Créer un Webhook", "colLabel": "Étiquette / Statut", "colDestUrl": "URL de destination", "colSecret": "Jeton Secret", "colActions": "Actions", "scanning": "ANALYSE DES POINTS DE TERMINAISON...", "empty": "Aucun webhook actif configuré pour ce compte.", "unnamed": "Webhook sans nom" },
            logs: { "title": "JOURNAUX DU PROTOCOLE", "subtitle": "TÉLÉMÉTRIE DE LIVRAISON EN TEMPS RÉEL ET RAPPORTS DE DIAGNOSTIC", "refresh": "ACTUALISER LA TÉLÉMÉTRIE", "colMethod": "MÉTHODE / PLATEFORME", "colKey": "CLÉ D'AUTHENTIFICATION", "colStatus": "STATUT", "colTiming": "TEMPS", "colSync": "SYNCHRONISATION", "empty": "AUCUNE ACTIVITÉ DÉTECTÉE SUR LA LIAISON RELAY.", "diagTitle": "PROTOCOLE DE DIAGNOSTIC AUTOMATISÉ", "diagDesc": "Relay capture la télémétrie du fournisseur pour réduire votre MTTR en identifiant instantanément les défaillances de livraison.", "telemetryActive": "TÉLÉMÉTRIE ACTIVE" },
            testlab: { "title": "Laboratoire", "subtitle": "Vérifiez votre charge utile d'intégration et vos protocoles de livraison en temps réel.", "platform": "PLATEFORME", "targetUrl": "ID DE CIBLE / URL", "msgBody": "CORPS DU MESSAGE", "msgPlaceholder": "Entrez votre message de test...", "variables": "VARIABLES (JSON)", "execute": "EXÉCUTER LE PROTOCOLE", "consoleTitle": "CONSOLE DE DIAGNOSTIC RELAY", "waiting": "En attente d'exécution..." },
            templates: { "title": "Modèles de Message", "subtitle": "Créez des plans de messages réutilisables avec des variables dynamiques.", "createBtn": "CRÉER UN MODÈLE", "emptyTitle": "Aucun modèle trouvé", "emptyDesc": "Créez votre premier modèle pour envoyer des notifications personnalisées à grande échelle." },
            domains: { "title": "COFFRE-FORT D'IDENTITÉ", "subtitle": "VÉRIFIEZ LES DOMAINES POUR LA LISTE BLANCHE ET LA MARQUE", "addBtn": "AJOUTER UN DOMAINE", "colHostname": "NOM D'HÔTE", "colStatus": "STATUT DE VÉRIFICATION", "colCreated": "CRÉÉ", "colActions": "ACTIONS", "empty": "AUCUN DOMAINE AUTORISÉ TROUVÉ DANS VOTRE REGISTRE." },
            scenarios: {
                title: "Moteur de scénarios",
                subtitle: "Concevoir des pipelines logiques",
                newFlow: "NOUVEAU FLUX",
                savePipeline: "SAUVEGARDER FLUX",
                deletePipeline: "SUPPRIMER FLUX",
                routingStatus: "STATUT DU ROUTAGE",
                pipelineEditor: "ÉDITEUR DE FLUX",
                webhookInput: "WEBHOOK / ENTRÉE",
                routeTo: "ROUTER VERS",
                onEvent: "SUR L'ÉVÉNEMENT",
                back: "RETOUR À LA LISTE",
                saved: "FLUX SAUVEGARDÉ",
                deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce scénario ?",
                deleteSelected: "SUPPRIMER LA SÉLECTION",
                countSelected: "{count} sélectionnés",
                bulkDeleteConfirm: "Supprimer {count} scénarios ? Cela ne peut pas être annulé."
            },
            welcome: "Bon retour,",
            subtitle: "Le pouls de votre réseau est stable. {count} paquets livrés ce mois-ci.",
            newKey: "Nouvelle clé API",
            stats: {
                success: "Livraisons réussies",
                failure: "Taux d'échec",
                latency: "Latence moyenne"
            },
            table: {
                title: "Clés de protocole actives",
                docs: "Voir toute la documentation",
                calls: "appels",
                secret: "Secret"
            },
            nav: {
                overview: "API Keys",
                keys: "Clés API",
                analytics: "Logs",
                settings: "Réglages",
                signOut: "Déconnexion"
            },
            modal: {
                title: "Nouvelle Clé de Protocole",
                label: "Étiquette",
                success: "Clé générée avec succès. Copiez-la maintenant, elle ne sera affichée qu'une seule fois.",
                placeholder: "ex. Boutique Prod",
                create: "Générer la Clé",
                copy: "Copier la Clé",
                close: "Terminé"
            },
            settings: {
                fullName: "NOM COMPLET",
                corporateEmail: "EMAIL PROFESSIONNEL",
                organization: "ORGANISATION",
                saveBtn: "ENREGISTRER",
                profileTitle: "Configuration du Profil",
                profileSubtitle: "Identité et Organisation",
                accountId: "ID du Compte",
                activePlan: "Plan Actif",
                upgrade: "Améliorer",
                whiteLabelTitle: "Marque Blanche / Branding Personnalisé",
                whiteLabelSubtitle: "Identité de l'Entreprise",
                corpName: "Nom de l'Entreprise",
                corpLogo: "Logo de l'Entreprise",
                upgradeEnterprise: "Passez à Enterprise pour débloquer",
                saveSettings: "ENREGISTRER LES PARAMÈTRES",
                specialOptions: "Options Spéciales",
                autoRefresh: "Auto-actualisation des Analyses",
                autoRefreshDesc: "Synchronise les données télémétriques toutes les 30 secondes automatiquement.",
                protocolAlerts: "Alertes de Protocole",
                protocolAlertsDesc: "Recevez des notifications en temps réel pour les échecs de relais.",
                performanceMax: "Performance Max",
                performanceMaxDesc: "Activez les transitions d'interface accélérées par GPU.",
                securityTitle: "Sécurité du Protocole",
                updateCredentials: "Mettre à jour les Identifiants",
                updateCredentialsDesc: "Faites pivoter les clés d'accès et mettez à jour les méthodes de sécurité.",
                hardReset: "Réinitialisation Totale",
                hardResetDesc: "Révoquez toutes les sessions actives de ce compte.",
                protocolOwner: "PROPRIÉTAIRE DU PROTOCOLE :"
            }
        }
    },
    de: {
        docs: {
            "backBtn": "Zurück zum Terminal",
            "titleProtocol": "Protokoll",
            "titleDocs": "Dokumentation",
            "subtitle": "Meistern Sie den Relay-Uplink. Integrieren Sie professionelle Benachrichtigungen in wenigen Minuten.",
            "authTitle": "Authentifizierung",
            "authContent": "Relay verwendet API-Schlüssel. Geben Sie Ihren Schlüssel im Header `x-api-key` jeder Anfrage an.",
            "endpointTitle": "Endpunkt",
            "endpointContent": "Alle Nachrichten werden über einen einzigen POST-Endpunkt geleitet. Keine komplexen SDKs erforderlich.",
            "examplesTitle": "Implementierungsbeispiele",
            "copyBtn": "Kopieren",
            "copiedBtn": "Kopiert",
            "scaleTitle": "Bereit zur Skalierung?",
            "scaleContent": "Relay ist für Produktionslasten gebaut. Benötigen Sie maßgeschneiderte Lösungen? Sehen Sie sich Enterprise an.",
            "enterpriseBtn": "Enterprise-Pläne ansehen"
        },
        nav: { features: "Funktionen", docs: "API", pricing: "Preise", getStarted: "Starten" },
        hero: {
            phase: "PHASE 1: LIVE",
            title1: "Senden Sie Warnungen an jeden ",
            highlight: "Kanal",
            title2: " in 2 Sekunden.",
            desc: "Die eleganteste Benachrichtigungs-API für Hochleistungsentwickler. Leiten Sie Nachrichten mit einer einzigen, sauberen Payload an Telegram, Discord und WhatsApp weiter.",
            start: "Projekt starten",
            viewDocs: "API-Dokumentation",
            dashboardLink: "Dashboard"
        },
        features: {
            title: "Warum Relay?",
            items: [
                { title: "Ultra-niedrige Latenz", desc: "Unterstützt durch Vercel Edge Functions für die weltweite Zustellung in Millisekunden." },
                { title: "Sicher & Verschlüsselt", desc: "Fortschrittliche API-Schlüsselverwaltung und End-to-End-Datensicherheitsprotokolle." },
                { title: "Entwickler zuerst", desc: "Saubere JSON-Payloads und eine Dokumentation, die nicht nervt." }
            ]
        },
        api: {
            title: "In Sekunden integrieren",
            desc: "Ein einziger POST-Request ist alles, was Sie brauchen. Keine komplexen SDKs erforderlich."
        },
        pricing: {
            title: "Einfache, transparente Preise",
            desc: "Skalierbar mit Ihrem Unternehmen. Keine versteckten Gebühren.",
            hobby: {
                name: "Hobby",
                price: "0€",
                yearlyPrice: "0€",
                desc: "Perfekt für Nebenprojekte.",
                features: ["1 API Key", "100 Warnungen / Monat", "1 aktiver Kanal", "Standardlatenz", "Community-Support"]
            },
            starter: {
                name: "Starter",
                price: "19€",
                yearlyPrice: "15€",
                desc: "Für wachsende Projekte.",
                features: ["2 API Keys", "5.000 Warnungen / Monat", "2 aktive Kanäle", "Standardlatenz", "E-Mail-Support"]
            },
            pro: {
                name: "Pro",
                price: "49€",
                yearlyPrice: "39€",
                desc: "Für ernsthafte Entwickler.",
                features: ["4 API Keys", "20.000 Warnungen / Monat", "Alle Kanäle (TG, WA, Discord)", "Pro-Analyse", "Prioritärer Support"]
            },
            enterprise: {
                name: "Enterprise",
                price: "Individuell",
                yearlyPrice: "Individuell",
                desc: "Automatisieren Sie Ihr Business-Tracking.",
                features: ["Unlimited API Keys",
                    "Unbegrenzte Warnungen & höhere Limits",
                    "Individuelles Kunden-Tracking",
                    "Whitelabeling (Ihr Logo)",
                    "24/7 dedizierter WhatsApp-Support",
                    "99,9% Uptime-SLA-Garantie"
                ]
            },
            cta: "Starten",
            ctaLemon: "🍋 Starten (Lemon Squeezy)",
            ctaCrypto: "⚡ Krypto (Binance Pay)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "Kontaktieren Sie uns",
            billing: {
                monthly: "Monatlich",
                yearly: "Jährlich",
                save: "20% Sparen"
            },
            regional: {
                title: "🇦🇷 Limitiertes Angebot für Argentinien",
                desc: "Sparen Sie zusätzlich 30% bei Zahlung in ARS über Mercado Pago.",
                cta: "Mit Mercado Pago bezahlen"
            },
            alerts: {
                downgrade: "Aktion verweigert: Sie haben derzeit den {userPlan}-Plan. Sie können nicht zu einem niedrigeren Plan ({targetPlan}) wechseln.",
                alreadyActive: "Aktion verweigert: Sie haben den {targetPlan}-Plan bereits aktiv!",
                mpNoNeed: "Aktion verweigert: Sie haben derzeit den {userPlan}-Plan. Sie müssen dieses Angebot nicht kaufen!",
                mpAuth: "Bitte melden Sie sich zuerst an, um auf den Rabatt zuzugreifen.",
                mpError: "Ein Fehler ist aufgetreten.",
                critical: "Kritischer Verbindungsfehler."
            },
            checkout: {
                title: "Zahlung simulieren",
                successTitle: "Update Erfolgreich",
                successDesc: "Ihr Plan wurde aktualisiert. Protokoll-Synchronisierung...",
                tier: "Stufe",
                identity: "Protokoll-Identität",
                session: "Verifizierte aktive Sitzung",
                mode: "Simulationsmodus",
                modeDesc: "Dies ist eine hochpräzise Zahlungssimulation. Das Bestätigen aktualisiert Ihre Berechtigungen. Es werden keine echten Beträge abgebucht.",
                abort: "Abbrechen",
                confirm: "Update bestätigen"
            }
        },
        legal: {
            terms: "Nutzungsbedingungen", privacy: "Datenschutzrichtlinie", refund: "Rückerstattungsrichtlinie", support: "Kundensupport", sections: {
                agreement: "Zustimmung zu den Bedingungen",
                agreementDesc: "Durch den Zugriff auf das Relay-Protokoll erklären Sie sich mit diesen Bedingungen einverstanden. Unsere Infrastruktur wird 'wie besehen' bereitgestellt.",
                usage: "API-Nutzung & Limits",
                usageDesc: "Benutzer müssen sich an Ratelimits und Fair-Use-Richtlinien halten. Automatisierter Missbrauch führt zum sofortigen Widerruf des Protokolls.",
                ip: "Geistiges Eigentum",
                ipDesc: "Sämtlicher Relay-Code, das Branding und die Telemetriesysteme bleiben ausschließliches Eigentum von Aether Digital. Vervielfältigung ist untersagt.",
                availability: "Serviceverfügbarkeit",
                availabilityDesc: "Wir streben eine Verfügbarkeit von 99,9 % an. Während unser Edge-Netzwerk global ist, kann die regionale Verfügbarkeit variieren.",
                collection: "Datenerfassung",
                collectionDesc: "Wir erfassen nur notwendige Nachrichten-Metadaten (Zeitstempel, Priorität, Status) für Lieferanalysen. Inhalte werden nie dauerhaft protokolliert.",
                security: "Sicherheitsprotokolle",
                securityDesc: "Alle Übertragungen sind über TLS 1.3 gesichert. API-Keys werden mit gesalzenem kryptografischem Hashing gespeichert.",
                disclosure: "Weitergabe an Dritte",
                disclosureDesc: "Relay verkauft keine Benutzerdaten. Metadaten werden nur über verschlüsselte Verbindungen verarbeitet, die für die Zustellung erforderlich sind.",
                noRefund: "Keine Rückerstattung",
                noRefundDesc: "Aufgrund der sofortigen Art digitaler Benachrichtigungsguthaben und des Protokollzugriffs sind alle Relay-Käufe endgültig.",
                cancellation: "Stornierungen",
                cancellationDesc: "Sie können Ihr Abonnement jederzeit kündigen. Der Zugriff bleibt bis zum Ende des aktuellen Abrechnungszeitraums aktiv.",
                exceptions: "Ausnahmen",
                exceptionsDesc: "Erstattungsanträge werden nur bei nachweisbarem Systemausfall geprüft, der den Zugriff auf das Relay-Terminal länger als 24 Stunden verhindert."
            }
        },
        faq: {
            title: "Häufig gestellte Fragen", items: [{
                q: "Wie fange ich an, Warnungen zu senden?", a: "Erstellen Sie einfach einen API-Schlüssel im Dashboard und senden Sie einen POST-Request an unseren globalen Uplink. Beispiele finden Sie in der Dokumentation."
            }, {
                q: "Ist die Hobby-Stufe wirklich kostenlos?", a: "Ja, für immer. Sie erhalten 100 Warnungen pro Monat und Community-Support, ohne einen Cent zu bezahlen."
            }, {
                q: "Kann ich ein Upgrade oder Downgrade durchführen?", a: "Ein Upgrade ist sofort möglich. Downgrades werden am Ende Ihres aktuellen Abrechnungszeitraums wirksam."
            }, {
                q: "Speichern Sie meine Benachrichtigungsdaten?", a: "Nein. Wir speichern nur Metadaten für Ihre Analysen. Der Inhalt wird sofort nach der Zustellung gelöscht."
            }]
        },
        footer: "Aether Digital Architecture. Gebaut für Exzellenz.",
        auth: {
            welcome: "Willkommen bei RELAY",
            desc: "Melden Sie sich mit Ihrem Geschäftskonto oder einem Magic Link an.",
            google: "Mit Google anmelden",
            github: "Mit GitHub anmelden",
            apple: "Mit Apple anmelden",
            magic: "Oder Magic Link verwenden",
            placeholder: "name@firma.de",
            send: "Link senden",
            loading: "Senden...",
            success: "E-Mail prüfen!",
            noAccount: "Kein Konto?",
            register: "Registrieren",
            terms: "Protokollbedingungen"
        },
        dashboard: {
            quickstart: { "title": "Schnellstart", "firstMsg": "# Übertragen Sie Ihre erste Nachricht", "baseEndpoint": "Basis-Endpoint", "curlExample": "CURL Beispiel", "desc": "Verwenden Sie einen beliebig generierten Schlüssel aus der Liste zur Autorisierung.", "viewDocs": "DOKUMENTATION ANZEIGEN" },
            sidebar: {
                overview: "ÜBERSICHT",
                analytics: "ANALYSE",
                apiKeys: "API-SCHLÜSSEL",
                logs: "PROTOKOLLE",
                relayAi: "RELAY AI",
                status: "STATUS",
                testLab: "TESTLABOR",
                templates: "VORLAGEN",
                webhooks: "WEBHOOKS",
                domains: "DOMÄNEN",
                scenarios: "SZENARIEN",
                connectors: "VERBINDUNGEN",
                settings: "EINSTELLUNGEN"
            },
            webhooks: { "title": "Protokoll-Endpunkte", "subtitle": "Konfigurieren Sie HTTP-Rückrufe für Echtzeit-Lieferereignisse", "createBtn": "Webhook Erstellen", "colLabel": "Etikett / Status", "colDestUrl": "Ziel-URL", "colSecret": "Geheimes Token", "colActions": "Aktionen", "scanning": "ENDPUNKTE SCANNEN...", "empty": "Für dieses Konto sind keine aktiven Webhooks konfiguriert.", "unnamed": "Unbenannter Webhook" },
            logs: { "title": "PROTOKOLL-PROTOKOLLE", "subtitle": "ECHTZEIT-LIEFERTELEMETRIE UND DIAGNOSTISCHE BERICHTERSTATTUNG", "refresh": "TELEMETRIE AKTUALISIEREN", "colMethod": "METHODE / PLATTFORM", "colKey": "AUTHENTIFIZIERUNGSSCHLÜSSEL", "colStatus": "STATUS", "colTiming": "ZEITMESSUNG", "colSync": "SYNCHRONISATION", "empty": "NULL AKTIVITÄT AUF DEM RELAY-UPLINK ENTDECKT.", "diagTitle": "AUTOMATISIERTES DIAGNOSEPROTOKOLL", "diagDesc": "Relay erfasst Anbieter-Telemetriedaten, um Ihre MTTR durch sofortige Identifizierung von Zustellungsfehlern zu reduzieren.", "telemetryActive": "TELEMETRIE AKTIV" },
            testlab: { "title": "Testlabor", "subtitle": "Überprüfen Sie Ihre Integrationsnutzlast und Lieferprotokolle in Echtzeit.", "platform": "PLATTFORM", "targetUrl": "ZIEL-ID / URL", "msgBody": "NACHRICHTENTEXT", "msgPlaceholder": "Geben Sie Ihre Testnachricht ein...", "variables": "VARIABLEN (JSON)", "execute": "PROTOKOLL AUSFÜHREN", "consoleTitle": "RELAY-DIAGNOSEKONSOLE", "waiting": "Warten auf Ausführung..." },
            templates: { "title": "Nachrichtenvorlagen", "subtitle": "Erstellen Sie wiederverwendbare Nachrichtenentwürfe mit dynamischen Variablen.", "createBtn": "VORLAGE ERSTELLEN", "emptyTitle": "Keine Vorlagen gefunden", "emptyDesc": "Erstellen Sie Ihre erste Vorlage, um personalisierte Benachrichtigungen in großem Maßstab zu versenden." },
            domains: { "title": "IDENTITÄTSTRESOR", "subtitle": "DOMÄNEN FÜR WHITELISTING UND BENUTZERDEFINIERTES BRANDING ÜBERPRÜFEN", "addBtn": "DOMÄNE HINZUFÜGEN", "colHostname": "HOSTNAME", "colStatus": "ÜBERPRÜFUNGSSTATUS", "colCreated": "ERSTELLT", "colActions": "AKTIONEN", "empty": "KEINE AUTORISIERTEN DOMÄNEN IN IHREM REGISTER GEFUNDEN." },
            scenarios: {
                title: "Szenarien-Engine",
                subtitle: "Entwerfen Sie logische Pipelines",
                newFlow: "NEUER FLUSS",
                savePipeline: "FLUSS SPEICHERN",
                deletePipeline: "FLUSS LÖSCHEN",
                routingStatus: "ROUTING-STATUS",
                pipelineEditor: "FLUSS-EDITOR",
                webhookInput: "WEBHOOK / EINGANG",
                routeTo: "ROUTE NACH",
                onEvent: "BEI EREIGNIS",
                back: "ZURÜCK ZUR LISTE",
                saved: "FLUSS GESPEICHERT",
                deleteConfirm: "Sind Sie sicher, dass Sie dieses Szenario löschen möchten?",
                deleteSelected: "AUSWAHL LÖSCHEN",
                countSelected: "{count} ausgewählt",
                bulkDeleteConfirm: "{count} Szenarien löschen? Dies kann nicht rückgängig gemacht werden."
            },
            welcome: "Willkommen zurück,",
            subtitle: "Ihr Netzwerkpuls ist stabil. {count} Pakete in diesem Monat zugestellt.",
            newKey: "Neuer API-Schlüssel",
            stats: {
                success: "Erfolgreiche Zustellungen",
                failure: "Fehlerrate",
                latency: "Durchschn. Latenz"
            },
            table: {
                title: "Aktive Protokollschlüssel",
                docs: "Alle Dokumentationen anzeigen",
                calls: "Anrufe",
                secret: "Geheimnis"
            },
            nav: {
                overview: "API-Schlüssel",
                keys: "API-Schlüssel",
                analytics: "Logs",
                settings: "Einstellungen",
                signOut: "Abmelden"
            },
            modal: {
                title: "Neuer Protokollschlüssel",
                label: "Bezeichnung",
                success: "Schlüssel erfolgreich generiert. Jetzt kopieren, er wird nur einmal angezeigt.",
                placeholder: "z.B. Produktion Shop",
                create: "Schlüssel generieren",
                copy: "Kopieren",
                close: "Fertig"
            },
            settings: {
                fullName: "VOLLSTÄNDIGER NAME",
                corporateEmail: "FIRMEN-EMAIL",
                organization: "ORGANISATION",
                saveBtn: "EINSTELLUNGEN SPEICHERN",
                profileTitle: "Profilkonfiguration",
                profileSubtitle: "Identität & Organisation",
                accountId: "Konto-ID",
                activePlan: "Aktiver Plan",
                upgrade: "Upgrade",
                whiteLabelTitle: "White Label / Eigenes Branding",
                whiteLabelSubtitle: "Unternehmensidentität",
                corpName: "Unternehmensname",
                corpLogo: "Unternehmenslogo",
                upgradeEnterprise: "Upgrade auf Enterprise zum Freischalten",
                saveSettings: "EINSTELLUNGEN SPEICHERN",
                specialOptions: "Spezialoptionen",
                autoRefresh: "Analysen automatisch aktualisieren",
                autoRefreshDesc: "Telemetriedaten alle 30 Sekunden automatisch synchronisieren.",
                protocolAlerts: "Protokoll-Warnungen",
                protocolAlertsDesc: "Echtzeit-Benachrichtigungen bei Relay-Fehlern erhalten.",
                performanceMax: "Performance Max",
                performanceMaxDesc: "GPU-beschleunigte UI-Übergänge aktivieren.",
                securityTitle: "Protokoll-Sicherheit",
                updateCredentials: "Zugangsdaten aktualisieren",
                updateCredentialsDesc: "Zugriffsschlüssel rotieren und Sicherheitsmethoden aktualisieren.",
                hardReset: "Hard Reset",
                hardResetDesc: "Alle aktiven Sitzungen dieses Kontos widerrufen.",
                protocolOwner: "PROTOKOLL-EIGENTÜMER:"
            }
        }
    },
    zh: {
        docs: {
            "backBtn": "返回终端",
            "titleProtocol": "协议",
            "titleDocs": "文档",
            "subtitle": "掌握 Relay Uplink。几分钟内将专业级的通知系统集成到您的技术堆栈中。",
            "authTitle": "身份认证",
            "authContent": "Relay 使用 API 密钥进行授权。请在每个请求的 `x-api-key` 标头中包含您的密钥。",
            "endpointTitle": "端点",
            "endpointContent": "所有消息路由均通过单个 POST 端点处理。无需复杂的 SDK。",
            "examplesTitle": "实施范例",
            "copyBtn": "复制",
            "copiedBtn": "已复制",
            "scaleTitle": "准备好扩展了吗？",
            "scaleContent": "Relay 是为生产负载构建的。如果您需要定制解决方案，请查看我们的企业计划。",
            "enterpriseBtn": "查看企业计划"
        },
        nav: { features: "功能", docs: "API", pricing: "价格", getStarted: "开始" },
        hero: {
            phase: "第一阶段：上线",
            title1: "2秒内将提醒送达任何",
            highlight: "渠道",
            title2: "。",
            desc: "为高性能开发人员提供的最优雅的通知 API。通过一个简洁的有效负载将消息路由到 Telegram、Discord 和 WhatsApp。",
            start: "启动项目",
            viewDocs: "查看 API 文档",
            dashboardLink: "仪表盘"
        },
        features: {
            title: "为什么选择 Relay？",
            items: [
                { title: "超低延迟", desc: "由 Vercel Edge Functions 提供支持，可在毫秒内在全球范围内交付。" },
                { title: "安全加密", desc: "高级 API 密钥管理和端到端数据安全协议。" },
                { title: "开发人员优先", desc: "简洁的 JSON 有效负载和易读的文档。" }
            ]
        },
        api: {
            title: "秒级集成",
            desc: "只需一个 POST 请求便可。无需复杂的 SDK。"
        },
        pricing: {
            title: "简单透明的价格",
            desc: "随您的业务规模而扩展。无隐藏费用。",
            hobby: {
                name: "Hobby",
                price: "¥0",
                yearlyPrice: "¥0",
                desc: "非常适合个人项目。",
                features: ["1 API Key", "每月 100 条提醒", "1 个活动渠道", "标准延迟", "社区支持"]
            },
            starter: {
                name: "Starter",
                price: "¥139",
                yearlyPrice: "¥111",
                desc: "适合成长中的项目。",
                features: ["2 API Keys", "每月 5,000 条提醒", "2 个活动渠道", "标准延迟", "邮件支持"]
            },
            pro: {
                name: "Pro",
                price: "¥349",
                yearlyPrice: "¥279",
                desc: "适用于专业开发人员。",
                features: ["4 API Keys", "每月 20,000 条提醒", "所有渠道 (TG, WA, Discord)", "专业分析", "优先支持"]
            },
            enterprise: {
                name: "Enterprise",
                price: "定制",
                yearlyPrice: "定制",
                desc: "自动化您的业务跟踪。",
                features: ["Unlimited API Keys",
                    "无限提醒与更高限制",
                    "个人客户跟踪",
                    "白标化（您的徽标）",
                    "24/7 专属 WhatsApp 支持",
                    "99.9% 正常运行时间 SLA 保证"
                ]
            },
            cta: "立即开始",
            ctaLemon: "🍋 立即开始 (Lemon Squeezy)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "联系我们",
            billing: {
                monthly: "按月计费",
                yearly: "按年计费",
                save: "节省 20%"
            },
            regional: {
                title: "🇦🇷 阿根廷限时优惠",
                desc: "通过 Mercado Pago 以 ARS 支付，额外节省 30%。立即锁定价格。",
                cta: "使用 Mercado Pago 支付"
            },
            alerts: {
                downgrade: "操作被拒绝：您当前的计划是 {userPlan}。无法降级到 ({targetPlan})。",
                alreadyActive: "操作被拒绝：您的账户已经启用了 {targetPlan} 计划！",
                mpNoNeed: "操作被拒绝：您当前的计划是 {userPlan}。您不需要购买此优惠！",
                mpAuth: "请先登录以享受区域折扣。",
                mpError: "连接时发生错误。",
                critical: "严重的连接失败。"
            },
            checkout: {
                title: "模拟结账",
                successTitle: "升级成功",
                successDesc: "您的计划已升级。正在同步协议...",
                tier: "等级",
                identity: "协议身份",
                session: "已验证活动会话",
                mode: "模拟模式",
                modeDesc: "这是一个高保真的结账模拟。点击确认将更新您的账户权限。不会收取实际费用。",
                abort: "放弃",
                confirm: "确认协议升级"
            }
        },
        legal: {
            terms: "服务条款", privacy: "隐私政策", refund: "退款政策", support: "联系支持", sections: {
                agreement: "条款协议",
                agreementDesc: "访问 Relay 协议即表示您同意受这些功能条款的约束。我们的基础设施按“原样”提供，用于高性能通知传送。",
                usage: "API 使用与限制",
                usageDesc: "用户必须遵守速率限制和公平使用政策。自动滥用或针对非授权端点的攻击将导致协议立即撤销。",
                ip: "知识产权",
                ipDesc: "所有 Relay 代码、品牌和遥测系统均为 Aether Digital 的专属财产。未经授权严禁复制。",
                availability: "服务可用性",
                availabilityDesc: "我们力争实现 99.9% 的正常运行时间。虽然我们的边缘网络是全球性的，但区域可用性可能因提供商健康状况而异。",
                collection: "数据收集",
                collectionDesc: "我们仅捕获必要的消息元数据（代码戳、优先级、状态）以提供传送分析。内容绝不会永久记录。",
                security: "安全协议",
                securityDesc: "所有传输均通过 TLS 1.3 进行保护。API 密钥使用加盐加密哈希存储，以确保身份识别保护。",
                disclosure: "第三方披露",
                disclosureDesc: "Relay 不分售用户数据。元数据仅通过最终消息传送所需的加密提供商上行链路进行处理。",
                noRefund: "无退款政策",
                noRefundDesc: "由于数字通知信用和协议访问的即时性，所有 Relay 购买均为最终决定。",
                cancellation: "取消政策",
                cancellationDesc: "您可以随时取消订阅。协议访问和功能将保持激活状态，直到当前计费周期结束。",
                exceptions: "例外情况",
                exceptionsDesc: "退款请求仅在可证实的系统故障导致无法访问 Relay 终端超过 24 小时的情况下进行审查。"
            }
        },
        faq: {
            title: "常见问题解答", items: [{
                q: "如何开始发送警报？", a: "只需在仪表板中创建 API 密钥，然后向我们的全球上行链路发送 POST 请求。查看文档以获取代码段。"
            }, {
                q: "Hobby 级别真的免费吗？", a: "是的，永远免费。您每月可获得 100 条警报和社区支持，无需支付任何费用。"
            }, {
                q: "我可以升级或降级吗？", a: "您可以立即升级。降级将在当前计费周期结束时生效。"
            }, {
                q: "你们存储我的通知数据吗？", a: "不。我们只存储用于您的分析的元数据。消息内容在送达后立即删除。"
            }]
        },
        footer: "Aether Digital Architecture. 为卓越而生。",
        auth: {
            welcome: "欢迎使用 RELAY",
            desc: "通过企业帐户或魔术链接登录。",
            google: "通过 Google 登录",
            github: "通过 GitHub 登录",
            apple: "通过 Apple 登录",
            magic: "或使用魔术链接",
            placeholder: "name@company.com",
            send: "发送链接",
            loading: "发送中...",
            success: "请检查电子邮件！",
            noAccount: "没有帐号？",
            register: "注册",
            terms: "协议条款"
        },
        dashboard: {
            quickstart: { "title": "快速开始", "firstMsg": "# 转发您的第一条消息", "baseEndpoint": "基本端点", "curlExample": "CURL 示例", "desc": "使用列表中的任何生成金钥来授权您的终端上行链路。", "viewDocs": "查看完整文档" },
            sidebar: {
                overview: "概览",
                analytics: "分析",
                apiKeys: "API 密钥",
                logs: "日志",
                relayAi: "RELAY AI",
                status: "状态",
                testLab: "测试实验室",
                templates: "模板",
                webhooks: "网络钩子",
                domains: "域名",
                scenarios: "场景",
                connectors: "连接器",
                settings: "设置"
            },
            webhooks: { "title": "协议端点", "subtitle": "为实时传送事件配置HTTP回调", "createBtn": "创建 Webhook", "colLabel": "标签/状态", "colDestUrl": "目标URL", "colSecret": "秘密令牌", "colActions": "操作", "scanning": "正在扫描端点...", "empty": "此帐户没有配置活动 Webhook。", "unnamed": "未命名的Webhook" },
            logs: { "title": "协议日志", "subtitle": "实时传输遥测和诊断报告", "refresh": "刷新遥测", "colMethod": "方法 / 平台", "colKey": "身份验证密钥", "colStatus": "状态", "colTiming": "时间", "colSync": "同步", "empty": "在 RELAY 上行链路上未检测到活动。", "diagTitle": "自动诊断协议", "diagDesc": "Relay捕获提供商遥测数据，以通过即时识别传送故障来减少您的MTTR。", "telemetryActive": "遥测活动" },
            testlab: { "title": "测试实验室", "subtitle": "实时验证您的集成有效负载和交付协议。", "platform": "平台", "targetUrl": "目标ID / URL", "msgBody": "消息主体", "msgPlaceholder": "输入您的测试消息...", "variables": "变量 (JSON)", "execute": "执行协议", "consoleTitle": "RELAY 诊断控制台", "waiting": "等待执行..." },
            templates: { "title": "消息模板", "subtitle": "使用动态变量创建可重用的消息蓝图。", "createBtn": "创建模板", "emptyTitle": "未找到模板", "emptyDesc": "构建您的第一个模板以大规模发送个性化通知。" },
            domains: { "title": "身份保险库", "subtitle": "验证域名以进行白名单和自定义品牌推广", "addBtn": "添加域", "colHostname": "主机名", "colStatus": "验证状态", "colCreated": "已创建", "colActions": "操作", "empty": "您的注册表中未找到授权域名。" },
            scenarios: {
                title: "场景引擎",
                subtitle: "设计逻辑路由管道",
                newFlow: "新流程",
                savePipeline: "保存流程",
                deletePipeline: "删除流程",
                routingStatus: "路由状态",
                pipelineEditor: "流程编辑器",
                webhookInput: "WEBHOOK / 输入",
                routeTo: "路由到",
                onEvent: "在事件上",
                back: "返回列表",
                saved: "流程已保存",
                deleteConfirm: "您确定要删除此场景吗？",
                deleteSelected: "删除已选",
                countSelected: "已选 {count}",
                bulkDeleteConfirm: "确认删除 {count} 个场景？此操作不可撤销。"
            },
            welcome: "欢迎回来，",
            subtitle: "您的网络脉搏稳定。本月已交付 {count} 个数据包。",
            newKey: "新建 API 密钥",
            stats: {
                success: "成功交付",
                failure: "失败率",
                latency: "平均延迟"
            },
            table: {
                title: "活跃协议密钥",
                docs: "查看所有文档",
                calls: "次调用",
                secret: "密钥"
            },
            nav: {
                overview: "API 密钥",
                keys: "API 密钥",
                analytics: "Logs",
                settings: "设置",
                signOut: "登出"
            },
            modal: {
                title: "新协议密钥",
                label: "密钥标签",
                success: "密钥生成成功。请立即复制，它只会显示一次。",
                placeholder: "例如：生产环境商店",
                create: "生成密钥",
                copy: "复制密钥",
                close: "完成"
            },
            settings: {
                fullName: "全名",
                corporateEmail: "企业邮箱",
                organization: "组织",
                saveBtn: "保存设置",
                profileTitle: "个人资料配置",
                profileSubtitle: "身份与组织",
                accountId: "账户 ID",
                activePlan: "当前方案",
                upgrade: "升级",
                whiteLabelTitle: "白标 / 自定义品牌",
                whiteLabelSubtitle: "企业身份",
                corpName: "公司名称",
                corpLogo: "公司图标",
                upgradeEnterprise: "升级到 Enterprise 以解锁",
                saveSettings: "保存设置",
                specialOptions: "特殊选项",
                autoRefresh: "自动刷新分析",
                autoRefreshDesc: "每 30 秒自动同步远程测量数据。",
                protocolAlerts: "协议警报",
                protocolAlertsDesc: "实时接收中继失败通知。",
                performanceMax: "性能模式",
                performanceMaxDesc: "启用 GPU 加速的 UI 过渡。",
                securityTitle: "协议安全",
                updateCredentials: "更新凭据",
                updateCredentialsDesc: "轮换访问密钥并更新安全方法。",
                hardReset: "硬重置",
                hardResetDesc: "撤销此账户的所有活动会话。",
                protocolOwner: "协议所有者："
            }
        }
    },
    ja: {
        docs: {
            "backBtn": "ターミナルに戻る",
            "titleProtocol": "プロトコル",
            "titleDocs": "ドキュメント",
            "subtitle": "Relay Uplink をマスターし、わずか数分でプロレベルの通知を技術スタックに統合します。",
            "authTitle": "認証",
            "authContent": "Relay はリクエストを承認するために API キーを使用します。各リクエストの `x-api-key` ヘッダーにキーを含めます。",
            "endpointTitle": "エンドポイント",
            "endpointContent": "すべてのメッセージルーティングは単一の POST エンドポイントを介して処理されます。複雑な SDK は不要です。",
            "examplesTitle": "実装例",
            "copyBtn": "コピー",
            "copiedBtn": "コピー済み",
            "scaleTitle": "スケールの準備はできましたか？",
            "scaleContent": "Relay は実運用向けに構築されています。専用の処理能力やカスタマイズが必要な場合は、エンタープライズプランをご確認ください。",
            "enterpriseBtn": "エンタープライズプランを見る"
        },
        nav: { features: "機能", docs: "API", pricing: "料金", getStarted: "開始" },
        hero: {
            phase: "フェーズ 1: 公開中",
            title1: "あらゆる",
            highlight: "チャネル",
            title2: "に2秒で通知。 ",
            desc: "高性能な開発者のための最も洗練された通知 API。単一のクリーンなペイロードで、Telegram、Discord、WhatsApp にメッセージをルーティングします。",
            start: "プロジェクトを開始",
            viewDocs: "API ドキュメントを表示",
            dashboardLink: "ダッシュボード"
        },
        features: {
            title: "なぜ Relay なのか？",
            items: [
                { title: "超低遅延", desc: "Vercel Edge Functions を活用し、ミリ秒単位で世界中に配信します。" },
                { title: "安全で暗号化", desc: "高度な API キー管理とエンドツーエンドのデータ安全プロトコル。" },
                { title: "開発者重視", desc: "クリーンな JSON ペイロードと使いやすいドキュメント。" }
            ]
        },
        api: {
            title: "数秒で統合",
            desc: "必要なのは 1 つの POST リクエストだけです。複雑な SDK は不要です。"
        },
        pricing: {
            title: "シンプルで透明性の高い料金",
            desc: "ビジネスに合わせて拡張可能。隠れた費用はありません。",
            hobby: {
                name: "Hobby",
                price: "¥0",
                yearlyPrice: "¥0",
                desc: "サイドプロジェクトに最適です。",
                features: ["1 API Key", "月間 100 通知", "1 アクティブチャネル", "標準的な遅延", "コミュニティサポート"]
            },
            starter: {
                name: "Starter",
                price: "¥2,800",
                yearlyPrice: "¥2,240",
                desc: "成長中のプロジェクト向け。",
                features: ["2 API Keys", "月間 5,000 通知", "2 アクティブチャネル", "標準的な遅延", "メールサポート"]
            },
            pro: {
                name: "Pro",
                price: "¥6,800",
                yearlyPrice: "¥5,440",
                desc: "本格的な開発者向け。",
                features: ["4 API Keys", "月間 20,000 通知", "全チャネル (TG, WA, Discord)", "プロ分析", "最優先サポート"]
            },
            enterprise: {
                name: "Enterprise",
                price: "カスタム",
                yearlyPrice: "カスタム",
                desc: "ビジネスの追跡を自動化します。",
                features: ["Unlimited API Keys",
                    "無制限通知とより高い制限",
                    "個別クライアント追跡",
                    "ホワイトラベル対応 (ロゴ変更可能)",
                    "24時間365日の専用 WhatsApp サポート",
                    "99.9% 稼働率 SLA 保証"
                ]
            },
            cta: "今すぐ開始",
            ctaLemon: "🍋 今すぐ開始 (Lemon Squeezy)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "お問い合わせ",
            billing: {
                monthly: "月払い",
                yearly: "年払い",
                save: "20% お得"
            },
            regional: {
                title: "🇦🇷 アルゼンチン限定オファー",
                desc: "Mercado Pago を通じて ARS で支払うことで、さらに 30% お得になります。今すぐ価格を確保しましょう。",
                cta: "Mercado Pago で支払う"
            },
            alerts: {
                downgrade: "拒否：現在のプランは {userPlan} です。下位プラン ({targetPlan}) に変更することはできません。",
                alreadyActive: "拒否：すでに {targetPlan} プランが有効になっています！",
                mpNoNeed: "拒否：現在のプランは {userPlan} です。このオファーを購入する必要はありません！",
                mpAuth: "割引を利用するにはログインしてください。",
                mpError: "接続中にエラーが発生しました。",
                critical: "致命的な接続エラー。"
            },
            checkout: {
                title: "チェックアウトのシミュレーション",
                successTitle: "アップグレード成功",
                successDesc: "プランがアップグレードされました。プロトコルを同期しています...",
                tier: "ティア",
                identity: "プロトコル ID",
                session: "認証済みアクティブセッション",
                mode: "シミュレーションモード",
                modeDesc: "これは高精度なチェックアウトシミュレーションです。確認をクリックするとアカウントの権限が更新されます。実際の請求は発生しません。",
                abort: "中止",
                confirm: "プロトコルのアップグレードを確定"
            }
        },
        legal: {
            terms: "利用規約", privacy: "プライバシーポリシー", refund: "返金ポリシー", support: "サポート担当", sections: {
                agreement: "規約の同意",
                agreementDesc: "Relayプロトコルにアクセスすることにより、これらの機能条項に拘束されることに同意したことになります。当社のインフラストラクチャは、高性能な通知配信のために現在の状態で提供されます。",
                usage: "APIの使用と制限",
                usageDesc: "ユーザーはレート制限とフェアユースポリシーを遵守する必要があります。自動化された悪用や未承認のエンドポイントへの標的設定は、即時のプロトコル取り消しにつながります。",
                ip: "知的財産権",
                ipDesc: "すべてのRelayコード、ブランディング、およびテレメトリシステムは、Aether Digitalの独占的所有物です。許可のない複製は禁止されています。",
                availability: "サービスの可用性",
                availabilityDesc: "99.9%の稼働率を目指しています。当社のエッジネットワークはグローバルですが、地域の可用性はプロバイダーの状態によって異なる場合があります。",
                collection: "データ収集",
                collectionDesc: "配信分析を提供するために、必要なメッセージメタデータ（タイムスタンプ、優先度、ステータス）のみをキャプチャします。コンテンツが永続的にログに記録されることはありません。",
                security: "セキュリティプロトコル",
                securityDesc: "すべての送信はTLS 1.3を介して保護されます。APIキーは、ID保護を確実にするためにソルト化された暗号化ハッシュを使用して保存されます。",
                disclosure: "第三者への開示",
                disclosureDesc: "Relayはユーザーデータを販売しません。メタデータは、最終的なメッセージ配信に必要な暗号化されたプロバイダーアップリンクを通じてのみ処理されます。",
                noRefund: "返金不可ポリシー",
                noRefundDesc: "デジタル通知クレジットおよびプロトコルアクセスの即時性により、すべてのRelay購入は最終的なものとなります。",
                cancellation: "キャンセル",
                cancellationDesc: "サブスクリプションはいつでもキャンセルできます。プロトコルアクセスと機能は、現在の請求サイクルの終了まで有効のままです。",
                exceptions: "例外事項",
                exceptionsDesc: "返金リクエストは、24時間以上にわたってRelayターミナルへのアクセスを妨げる実証可能なシステム障害が発生した場合にのみ審査されます。"
            }
        },
        faq: {
            title: "よくある質問", items: [{
                q: "アラートの送信を開始するにはどうすればよいですか？", a: "ダッシュボードでAPIキーを作成し、グローバルアップリンクにPOSTリクエストを送信するだけです。詳細はドキュメントを確認してください。"
            }, {
                q: "Hobbyプランは本当に無料ですか？", a: "はい、永遠に無料です。月間100件のアラートとコミュニティサポートを無料で利用できます。"
            }, {
                q: "アップグレードやダウングレードは可能ですか？", a: "即時アップグレードが可能です。ダウングレードは現在の請求サイクルの終了時に適用されます。"
            }, {
                q: "通知データは保存されますか？", a: "いいえ。分析用のメタデータのみを保存し、メッセージ内容は配信後すぐに削除されます。"
            }]
        },
        footer: "Aether Digital Architecture. 卓越性のために構築。",
        auth: {
            welcome: "RELAYへようこそ",
            desc: "企業アカウントまたはマジックリンクでサインイン。",
            google: "Googleでサインイン",
            github: "GitHubでサインイン",
            apple: "Appleでサインイン",
            magic: "またはマジックリンクを使用",
            placeholder: "name@company.com",
            send: "リンクを送信",
            loading: "送信中...",
            success: "メールを確認してください！",
            noAccount: "アカウントをお持ちでない方",
            register: "登録",
            terms: "規約"
        },
        dashboard: {
            quickstart: { "title": "クイックスタート", "firstMsg": "# 最初のメッセージを中継する", "baseEndpoint": "ベースエンドポイント", "curlExample": "CURL の例", "desc": "リストから生成したキーを使用して、端末のアップリンクを承認します。", "viewDocs": "完全なドキュメントを見る" },
            sidebar: {
                overview: "概要",
                analytics: "分析",
                apiKeys: "APIキー",
                logs: "ログ",
                relayAi: "RELAY AI",
                status: "ステータス",
                testLab: "テストラボ",
                templates: "テンプレート",
                webhooks: "ウェブフック",
                domains: "ドメイン",
                scenarios: "シナリオ",
                connectors: "コネクタ",
                settings: "設定"
            },
            webhooks: { "title": "プロトコルエンドポイント", "subtitle": "リアルタイム配信イベントの HTTP コールバックを構成する", "createBtn": "Webhookを作成", "colLabel": "ラベル / ステータス", "colDestUrl": "宛先URL", "colSecret": "シークレットトークン", "colActions": "アクション", "scanning": "エンドポイントをスキャンしています...", "empty": "このアカウントにアクティブな Webhookは設定されていません。", "unnamed": "無名のWebhook" },
            logs: { "title": "プロトコルログ", "subtitle": "リアルタイム配信テレメトリと診断レポート", "refresh": "テレメトリを更新", "colMethod": "メソッド / プラットフォーム", "colKey": "認証キー", "colStatus": "ステータス", "colTiming": "タイミング", "colSync": "同期", "empty": "RELAY アップリンクでアクティビティが検出されませんでした。", "diagTitle": "自動診断プロトコル", "diagDesc": "Relayはプロバイダーのテレメトリをキャプチャし、配信障害を即座に特定することで、MTTRを短縮します。", "telemetryActive": "テレメトリアクティブ" },
            testlab: { "title": "テストラボ", "subtitle": "統合ペイロードと配信プロトコルをリアルタイムで検証します。", "platform": "プラットフォーム", "targetUrl": "ターゲットID / URL", "msgBody": "メッセージ本文", "msgPlaceholder": "テストメッセージを入力してください...", "variables": "変数 (JSON)", "execute": "プロトコルを実行", "consoleTitle": "RELAY診断コンソール", "waiting": "実行を待機しています..." },
            templates: { "title": "メッセージテンプレート", "subtitle": "動的変数を使用して再利用可能なメッセージ設計図を作成します。", "createBtn": "テンプレートを作成", "emptyTitle": "テンプレートが見つかりません", "emptyDesc": "大規模なパーソナライズされた通知を送信するための最初のテンプレートを作成します。" },
            domains: { "title": "IDボールト", "subtitle": "ホワイトリストとカスタムブランディングのためのドメインの検証", "addBtn": "ドメインを追加", "colHostname": "ホスト名", "colStatus": "検証ステータス", "colCreated": "作成済み", "colActions": "アクション", "empty": "レジストリに許可されたドメインが見つかりません。" },
            scenarios: {
                title: "シナリオエンジン",
                subtitle: "論理パイプラインの設計",
                newFlow: "新しいフロー",
                savePipeline: "フローを保存",
                deletePipeline: "フローを削除",
                routingStatus: "ルーティングステータス",
                pipelineEditor: "フローエディター",
                webhookInput: "WEBHOOK / 入力",
                routeTo: "ルート先",
                onEvent: "イベント時",
                back: "リストに戻る",
                saved: "フローを保存しました",
                deleteConfirm: "このシナリオを削除してもよろしいですか？",
                deleteSelected: "選択項目を削除",
                countSelected: "{count} 件選択中",
                bulkDeleteConfirm: "{count} 件のシナリオを削除しますか？この操作は取り消せません。"
            },
            welcome: "おかえりなさい、",
            subtitle: "ネットワークパルスは安定しています。今月は {count} パケットが配信されました。",
            newKey: "新しいAPIキー",
            stats: {
                success: "配信成功",
                failure: "失敗率",
                latency: "平均レイテンシ"
            },
            table: {
                title: "アクティブなプロトコルキー",
                docs: "すべてのドキュメントを表示",
                calls: "コール",
                secret: "シークレット"
            },
            nav: {
                overview: "APIキー",
                keys: "APIキー",
                analytics: "Logs",
                settings: "設定",
                signOut: "ログアウト"
            },
            modal: {
                title: "新しいプロトコルキー",
                label: "キーのラベル",
                success: "キーが正常に生成されました。一度しか表示されないので、今すぐコピーしてください。",
                placeholder: "例：本番環境ショップ",
                create: "キーを生成",
                copy: "キーをコピー",
                close: "完了"
            },
            settings: {
                fullName: "氏名",
                corporateEmail: "企業メール",
                organization: "組織",
                saveBtn: "設定を保存",
                profileTitle: "プロフィール設定",
                profileSubtitle: "IDと組織",
                accountId: "アカウントID",
                activePlan: "現在のプラン",
                upgrade: "アップグレード",
                whiteLabelTitle: "ホワイトラベル / カスタムブランディング",
                whiteLabelSubtitle: "企業アイデンティティ",
                corpName: "会社名",
                corpLogo: "コーポレートロゴ",
                upgradeEnterprise: "Enterpriseにアップグレードして解除",
                saveSettings: "設定を保存",
                specialOptions: "特別オプション",
                autoRefresh: "分析の自動更新",
                autoRefreshDesc: "30秒ごとにテレメトリデータを自動同期します。",
                protocolAlerts: "プロトコルアラート",
                protocolAlertsDesc: "リレー失敗のリアルタイム通知を受け取ります。",
                performanceMax: "パフォーマンスマックス",
                performanceMaxDesc: "GPU加速されたUI遷移を有効にします。",
                securityTitle: "プロトコルセキュリティ",
                updateCredentials: "認証情報の更新",
                updateCredentialsDesc: "アクセスキーのローテーションとセキュリティ方法の更新。",
                hardReset: "ハードリセット",
                hardResetDesc: "このアカウントのすべてのアクティブなセッションを取り消します。",
                protocolOwner: "プロトコル所有者："
            }
        }
    },
    it: {
        docs: {
            "backBtn": "Torna al Terminale",
            "titleProtocol": "Protocollo",
            "titleDocs": "Documentazione",
            "subtitle": "Padroneggia il Relay Uplink. Integra notifiche professionali nella tua architettura in pochi minuti.",
            "authTitle": "Autenticazione",
            "authContent": "Relay utilizza le API Keys per autorizzare le richieste. Includi la tua chiave nell'header `x-api-key`.",
            "endpointTitle": "Endpoint",
            "endpointContent": "Tutto il routing dei messaggi è gestito tramite un singolo endpoint POST. Nessun SDK complesso.",
            "examplesTitle": "Esempi di Implementazione",
            "copyBtn": "Copia",
            "copiedBtn": "Copiato",
            "scaleTitle": "Pronto a scalare?",
            "scaleContent": "Relay è costruito per grandi volumi. Se ti servono soluzioni dedicate, controlla i piani enterprise.",
            "enterpriseBtn": "Vedi i Piani Enterprise"
        },
        nav: { features: "Funzioni", docs: "API", pricing: "Prezzi", getStarted: "Inizia" },
        hero: {
            phase: "FASE 1: ATTIVA",
            title1: "Consegna avvisi su qualsiasi ",
            highlight: "canale",
            title2: " in 2 secondi.",
            desc: "L'API de notifica più elegante per sviluppatori ad alte prestazioni. Instrada i messaggi verso Telegram, Discord e WhatsApp con un unico payload pulito.",
            start: "Inizia il tuo progetto",
            viewDocs: "Vedi Doc API",
            dashboardLink: "Dashboard"
        },
        features: {
            title: "Perché Relay?",
            items: [
                { title: "Latenza Ultra-Bassa", desc: "Alimentato da Vercel Edge Functions per una consegna globale in millisecondi." },
                { title: "Sicuro e Crittografato", desc: "Gestione avanzata delle chiavi API e protocolli di sicurezza dei datos end-to-end." },
                { title: "Sviluppatore First", desc: "Payload JSON puliti e documentazione eccellente." }
            ]
        },
        api: {
            title: "Integra in pochi secondi",
            desc: "Un'unica richiesta POST è tutto ciò di cui hai bisogno. Nessun SDK complesso richiesto."
        },
        pricing: {
            title: "Prezzi semplici e trasparenti",
            desc: "Creato per scalare con la tua attività. Nessun costo nascosto.",
            hobby: {
                name: "Hobby",
                price: "0€",
                yearlyPrice: "0€",
                desc: "Perfetto per progetti secondari.",
                features: ["1 API Key", "100 avvisi / mese", "1 canale attivo", "Latenza standard", "Supporto comunitario"]
            },
            starter: {
                name: "Starter",
                price: "19€",
                yearlyPrice: "15€",
                desc: "Per progetti in crescita.",
                features: ["2 API Keys", "5 000 avvisi / mese", "2 canali attivi", "Latenza standard", "Supporto via email"]
            },
            pro: {
                name: "Pro",
                price: "49€",
                yearlyPrice: "39€",
                desc: "Per sviluppatori seri.",
                features: ["4 API Keys", "20 000 avvisi / mese", "Tutti i canali (TG, WA, Discord)", "Analisi Pro", "Supporto Prioritario"]
            },
            enterprise: {
                name: "Enterprise",
                price: "Personalizzato",
                yearlyPrice: "Personalizzato",
                desc: "Automatizza il monitoraggio aziendale.",
                features: ["Unlimited API Keys",
                    "Avvisi illimitati e limiti superiori",
                    "Monitoraggio dei singoli clienti",
                    "Whitelabeling (Il tuo Logo)",
                    "Supporto WhatsApp dedicato 24/7",
                    "Garanzia SLA di uptime al 99,9%"
                ]
            },
            cta: "Inizia",
            ctaLemon: "🍋 Inizia (Lemon Squeezy)",
            ctaMP: "🇦🇷 Mercado Pago (30% OFF)",
            contact: "Contatta le vendite",
            billing: {
                monthly: "Mensile",
                yearly: "Annuale",
                save: "Risparmia il 20%"
            },
            regional: {
                title: "🇦🇷 Offerta Limitata per l'Argentina",
                desc: "Risparmia un ulteriore 30% pagando in ARS tramite Mercado Pago.",
                cta: "Paga con Mercado Pago"
            },
            alerts: {
                downgrade: "Azione negata: Hai il piano {userPlan}. Non puoi passare a un piano inferiore ({targetPlan}).",
                alreadyActive: "Azione negata: Hai già il piano {targetPlan} attivo!",
                mpNoNeed: "Azione negata: Hai il piano {userPlan}. Non hai bisogno di questa offerta!",
                mpAuth: "Accedi per poter accedere allo sconto regionale.",
                mpError: "Si è verificato un errore.",
                critical: "Errore critico di connessione."
            },
            checkout: {
                title: "Simula il Pagamento",
                successTitle: "Aggiornamento Riuscito",
                successDesc: "Il tuo piano è stato aggiornato. Sincronizzazione del protocollo...",
                tier: "Livello",
                identity: "Identità del Protocollo",
                session: "Sessione Attiva Verificata",
                mode: "Modalità Simulazione",
                modeDesc: "Questa è una simolazione di pagamento ad alta fuideltà. Confermare aggiornerà i permessi. Non verranno addebitati fondi reali.",
                abort: "Annulla",
                confirm: "Conferma Aggiornamento"
            }
        },
        legal: {
            terms: "Termini di Servizio", privacy: "Informativa sulla Privacy", refund: "Politica di Rimborso", support: "Contatta el Supporto", sections: {
                agreement: "Accettazione dei Termini",
                agreementDesc: "Accedendo al protocollo Relay, accetti di essere vincolato da questi termini funzionali. La nostra infrastruttura è fornita 'così com'è' per la consegna di notifiche ad alte prestazioni.",
                usage: "Utilizzo API & Limiti",
                usageDesc: "Gli utenti devono rispettare i limiti di velocità e le politiche di utilizzo corretto. L'abuso automatizzato o il targeting di endpoint non autorizzati comporterà la revoca immediata del protocollo.",
                ip: "Proprietà Intellettuale",
                ipDesc: "Tutto il codice Relay, il branding e i sistemi di telemetria rimangono proprietà esclusiva di Aether Digital. La riproduzione senza autorizzazione è vietata.",
                availability: "Disponibilità del Servizio",
                availabilityDesc: "Ci impegniamo per un uptime del 99,9%. Sebbene la nostra rete edge sia globale, la disponibilità regionale può variare in base alla salute del fornitore.",
                collection: "Raccolta Dati",
                collectionDesc: "Acquisiamo solo i metadati necessari dei messaggi (timestamp, priorità, stato) per fornire analisi di consegna. Il contenuto non viene mai registrato in modo permanente.",
                security: "Protocolli di Sicurezza",
                securityDesc: "Tutte le trasmissioni sono protette tramite TLS 1.3. Le chiavi API sono archiviate utilizzando hashing crittografico salato per garantire la protezione dell'identità.",
                disclosure: "Divulgazione a Terzi",
                disclosureDesc: "Relay non vende i dati degli utenti. I metadati vengono elaborati solo tramite collegamenti crittografati dei fornitori necessari per la consegna finale del messaggio.",
                noRefund: "Politica di No Rimborso",
                noRefundDesc: "A causa della natura istantanea dei crediti di notifica digitale e dell'accesso al protocollo, tutti gli acquisti Relay sono definitivi.",
                cancellation: "Cancellazioni",
                cancellationDesc: "Puoi annullare l'abbonamento in qualsiasi momento. L'accesso al protocollo e le funzionalità rimarranno attivi fino alla fine del ciclo di fatturazione corrente.",
                exceptions: "Eccezioni",
                exceptionsDesc: "Le richieste di rimborso verranno esaminate solo in caso di guasto del sistema verificabile che impedisca l'accesso al terminale Relay per più di 24 ore."
            }
        },
        faq: {
            title: "Domande Frequenti", items: [{
                q: "Come inizio a inviare avvisi?", a: "Crea un'API Key nella dashboard e invia una richiesta POST al nostro uplink globale. Consulta la documentazione per esempi."
            }, {
                q: "Il piano Hobby è davvero gratuito?", a: "Sì, per sempre. Ricevi 100 avvisi al mese e supporto della community senza costi."
            }, {
                q: "Posso fare upgrade o downgrade?", a: "L'upgrade è istantaneo. I downgrade diventano effettivi alla fine del ciclo di fatturazione corrente."
            }, {
                q: "Archiviate i miei dati di notifica?", a: "No. Archiviamo solo metadati per l'analisi. Il contenuto del messaggio viene eliminato dopo la consegna."
            }]
        },
        footer: "Architettura Aether Digital. Costruito per l'Eccellenza.",
        auth: {
            welcome: "Benvenuti in RELAY",
            desc: "Accedi con il tuo account aziendale o usa il Magic Link.",
            google: "Accedi con Google",
            github: "Accedi con GitHub",
            apple: "Accedi con Apple",
            magic: "Oppure usa il Magic Link",
            placeholder: "nome@azienda.it",
            send: "Invia link",
            loading: "Invio...",
            success: "Controlla la tua email!",
            noAccount: "Non hai un account?",
            register: "Registrati",
            terms: "Termini d'uso"
        },
        dashboard: {
            quickstart: { "title": "Guida Rapida", "firstMsg": "# Trasmetti il tuo primo messaggio", "baseEndpoint": "Endpoint di Base", "curlExample": "Esempio CURL", "desc": "Usa qualsiasi chiave generata dalla lista per autorizzare l'uplink del tuo terminale.", "viewDocs": "VISUALIZZA DOCS COMPLETA" },
            sidebar: {
                overview: "PANORAMICA",
                analytics: "ANALITICA",
                apiKeys: "CHIAVI API",
                logs: "LOG",
                relayAi: "RELAY AI",
                status: "STATO",
                testLab: "LAB TEST",
                templates: "TEMPLATE",
                webhooks: "WEBHOOK",
                domains: "DOMINI",
                scenarios: "SCENARI",
                connectors: "CONNETTORI",
                settings: "IMPOSTAZIONI"
            },
            webhooks: { "title": "Endpoint del Protocollo", "subtitle": "Configura i callback HTTP per gli eventi di consegna in tempo reale", "createBtn": "Crea Webhook", "colLabel": "Etichetta / Stato", "colDestUrl": "URL di Destinazione", "colSecret": "Token Segreto", "colActions": "Azioni", "scanning": "SCANSIONE ENDPOINT...", "empty": "Nessun webhook attivo configurato per questo account.", "unnamed": "Webhook senza nome" },
            logs: { "title": "LOG DEL PROTOCOLLO", "subtitle": "TELEMETRIA DI CONSEGNA IN TEMPO REALE E REPORTISTICA DIAGNOSTICA", "refresh": "AGGIORNA TELEMETRIA", "colMethod": "METODO / PIATTAFORMA", "colKey": "CHIAVE DI AUTENTICAZIONE", "colStatus": "STATO", "colTiming": "TEMPO", "colSync": "SINCRONIZZAZIONE", "empty": "NESSUNA ATTIVITÀ RILEVATA SULL'UPLINK RELAY.", "diagTitle": "PROTOCOLLO DIAGNOSTICO AUTOMATIZZATO", "diagDesc": "Relay cattura la telemetria del provider per ridurre il tuo MTTR identificando istantaneamente gli errori di consegna.", "telemetryActive": "TELEMETRIA ATTIVA" },
            testlab: { "title": "Laboratorio di Test", "subtitle": "Verifica il payload di integrazione e i protocolli di consegna in tempo reale.", "platform": "PIATTAFORMA", "targetUrl": "ID DI DESTINAZIONE / URL", "msgBody": "CORPO DEL MESSAGGIO", "msgPlaceholder": "Inserisci il tuo messaggio di prova...", "variables": "VARIABILI (JSON)", "execute": "ESEGUI PROTOCOLLO", "consoleTitle": "CONSOLE DIAGNOSTICA RELAY", "waiting": "In attesa di esecuzione..." },
            templates: { "title": "Modelli di Messaggio", "subtitle": "Crea progetti di messaggi riutilizzabili con variabili dinamiche.", "createBtn": "CREA MODELLO", "emptyTitle": "Nessun modello trovato", "emptyDesc": "Crea il tuo primo modello per inviare notifiche personalizzate su larga scala." },
            domains: { "title": "VOLTA DELL'IDENTITÀ", "subtitle": "VERIFICA I DOMINI PER IL WHITELISTING E IL MIO BRAND", "addBtn": "AGGIUNGI DOMINIO", "colHostname": "NOME HOST", "colStatus": "STATO DI VERIFICA", "colCreated": "CREATO", "colActions": "AZIONI", "empty": "NESSUN DOMIO AUTORIZZATO TROVATO NEL TUO REGISTRO." },
            scenarios: {
                title: "Motore Scenari",
                subtitle: "Progetta pipeline logiche",
                newFlow: "NUOVO FLUSSO",
                savePipeline: "SALVA FLUSSO",
                deletePipeline: "ELIMINA FLUSSO",
                routingStatus: "STATO DEL ROUTING",
                pipelineEditor: "EDITOR DI FLUSSO",
                webhookInput: "WEBHOOK / INGRESSO",
                routeTo: "ROTTA VERSO",
                onEvent: "ALL'EVENTO",
                back: "TORNA ALLA LISTA",
                saved: "FLUSSO SALVATO",
                deleteConfirm: "Sei sicuro di voler eliminare questo scenario?",
                deleteSelected: "ELIMINA SELEZIONATI",
                countSelected: "{count} selezionati",
                bulkDeleteConfirm: "Eliminare {count} scenari? L'azione non è reversibile."
            },
            welcome: "Bentornato,",
            subtitle: "Il polso della tua rete è stabile. {count} pacchetti consegnati questo mese.",
            newKey: "Nuova API Key",
            stats: {
                success: "Consegne Riuscite",
                failure: "Taso di Errore",
                latency: "Latenza Media"
            },
            table: {
                title: "Chiavi di Protocollo Attive",
                docs: "Visualizza Tutta la Documentazione",
                calls: "chiamate",
                secret: "Segreto"
            },
            nav: {
                overview: "API Keys",
                keys: "Chiavi API",
                analytics: "Logs",
                settings: "Impostazioni",
                signOut: "Disconnetti"
            },
            modal: {
                title: "Nuova Chiave di Protocollo",
                label: "Etichetta Chiave",
                success: "Chiave generata con successo. Copiala ora, verrà mostrata solo una volta.",
                placeholder: "es. Negozio Produzione",
                create: "Genera Chiave",
                copy: "Copia Chiave",
                close: "Fatto"
            },
            settings: {
                fullName: "NOME COMPLETO",
                corporateEmail: "EMAIL AZIENDALE",
                organization: "ORGANIZZAZIONE",
                saveBtn: "SALVA IMPOSTAZIONI",
                profileTitle: "Configurazione Profilo",
                profileSubtitle: "Identità e Organizzazione",
                accountId: "ID Account",
                activePlan: "Piano Attivo",
                upgrade: "Aggiorna",
                whiteLabelTitle: "White Label / Branding Personalizzato",
                whiteLabelSubtitle: "Identità Aziendale",
                corpName: "Nome Aziendale",
                corpLogo: "Logo Aziendale",
                upgradeEnterprise: "Passa a Enterprise per sbloccare",
                saveSettings: "SALVA IMPOSTAZIONI",
                specialOptions: "Opzioni Speciali",
                autoRefresh: "Auto-aggiornamento Analisi",
                autoRefreshDesc: "Sincronizza i dati ogni 30 secondi automaticamente.",
                protocolAlerts: "Avvisi di Protocollo",
                protocolAlertsDesc: "Ricevi notifiche in tempo reale per fallimenti di relay.",
                performanceMax: "Performance Max",
                performanceMaxDesc: "Abilita transizioni UI accelerate da GPU.",
                securityTitle: "Sicurezza Protocollo",
                updateCredentials: "Aggiorna Credenziali",
                updateCredentialsDesc: "Ruota chiavi di accesso e metodi di sicurezza.",
                hardReset: "Reset Totale",
                hardResetDesc: "Revoca tutte le sessioni attive di questo account.",
                protocolOwner: "PROPRIETARIO PROTOCOLLO:"
            }
        }
    }
};
