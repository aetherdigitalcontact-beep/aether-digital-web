import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
    console.log("🚀 Iniciando prueba End-to-End de Fan-out (Segments & Recipients)...");

    try {
        // 1. Obtener primera API Key y User ID válida
        const { data: apiKeyData, error: apiError } = await supabase
            .from('api_keys')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single();

        if (apiError || !apiKeyData) throw new Error("No API Key found: " + apiError?.message);

        const userId = apiKeyData.user_id;
        const apiKey = apiKeyData.key_hash;
        console.log(`✅ Autenticado con User ID: ${userId}`);

        // 2. Crear Recipients de Prueba
        const recipients = [
            { user_id: userId, external_id: `fanout_test_alpha_${Date.now()}`, email: 'alfa@test.com' },
            { user_id: userId, external_id: `fanout_test_beta_${Date.now()}`, email: 'beta@test.com' }
        ];

        console.log(`⚙️  Insertando ${recipients.length} Recipients (Subscribers) de prueba...`);
        const { data: insertedRecipients, error: subsError } = await supabase
            .from('subscribers')
            .insert(recipients)
            .select();

        if (subsError) throw subsError;

        // 3. Crear Segment de Prueba
        const segmentKey = `test-segment-fanout-${Date.now()}`;
        console.log(`⚙️  Creando Segment (Topic) con Key: ${segmentKey}`);
        const { data: segmentData, error: topicError } = await supabase
            .from('topics')
            .insert({ user_id: userId, name: 'Fanout Integration Test', key: segmentKey })
            .select()
            .single();

        if (topicError) throw topicError;

        // 4. Asociar Recipients al Segment
        console.log(`🔗 Asociando Recipients al Segment...`);
        const relations = insertedRecipients.map(r => ({
            topic_id: segmentData.id,
            subscriber_id: r.id
        }));

        const { error: relError } = await supabase
            .from('topic_subscribers')
            .insert(relations);

        if (relError) throw relError;

        console.log(`✅ Datos de prueba preparados correctamente.`);

        // 5. Enviar Petición a Relay Engine (Usando API Local)
        console.log(`\n📤 Disparando payload de notificación dirigido a topicKey: ${segmentKey}...`);

        const payload = {
            message: "This is an automated E2E test for Segment Fan-out!",
            category: 'System Alert',
            topicKey: segmentKey,
            platforms: ['email']
            // Target is deliberately skipped, as topicKey will resolve multiple targets
        };

        const startTime = Date.now();
        const response = await fetch('http://localhost:3000/api/relay', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Fast-API response failed: ${response.status} - ${errText}`);
        }

        const resData = await response.json();
        console.log(`✅ Motor de Relay aceptó el trabajo (HTTP ${response.status}):`, resData);

        // 6. Verificar Logs Generados
        console.log(`⏳ Esperando 3 segundos a que el background worker despache las notificaciones de Fan-Out...`);
        await sleep(3000);

        console.log(`🔍 Examinando la tabla de Logs para buscar los despachos de Fan-Out...`);
        const { data: logsData, error: logsError } = await supabase
            .from('logs')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', new Date(startTime).toISOString())
        // Filtering those that were successfully expanded!

        if (logsError) throw logsError;

        const fanOutLogs = logsData.filter(log => log.payload?.topicKey === segmentKey);

        if (fanOutLogs.length === recipients.length) {
            console.log(`\n🎉 ¡FAN-OUT E2E EXITOSO! 🎉`);
            console.log(`El Motor de Relay recibió 1 petición, pero disparó ${fanOutLogs.length} notificaciones independientes en paralelo.`);
            // Limpieza
            await supabase.from('subscribers').delete().in('id', insertedRecipients.map(r => r.id));
            await supabase.from('topics').delete().eq('id', segmentData.id);
            console.log(`🧹 Datos de prueba limpiados de la DB.`);
            process.exit(0);
        } else {
            console.error(`❌ FRACASO FAN-OUT: Esperábamos ${recipients.length} despachos, pero se encontraron ${fanOutLogs.length} en los logs.`);

            // Debugging output
            console.log("=== LOGS ENCONTRADOS ===");
            console.log(JSON.stringify(fanOutLogs, null, 2));

            process.exit(1);
        }

    } catch (e: any) {
        console.error("❌ E2E ERROR:", e);
        process.exit(1);
    }
}

runTest();
