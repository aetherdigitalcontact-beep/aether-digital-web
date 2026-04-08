const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const translations = {
    en: {
        errorInvalidCredentials: "Invalid login credentials.",
        scenarios: "SCENARIOS",
        connectors: "CONNECTORS",
        scenariosTitle: "Scenarios Engine",
        scenariosSubtitle: "Design logic pipelines for event routing",
        newFlow: "NEW FLOW",
        savePipeline: "SAVE PIPELINE",
        deletePipeline: "DELETE PIPELINE",
        routingStatus: "ROUTING STATUS",
        pipelineEditor: "PIPELINE EDITOR",
        webhookInput: "WEBHOOKS / INPUT",
        routeTo: "ROUTE TO",
        onEvent: "ON EVENT"
    },
    es: {
        errorInvalidCredentials: "Credenciales de acceso inválidas.",
        scenarios: "ESCENARIOS",
        connectors: "CONECTORES",
        scenariosTitle: "Motor de Escenarios",
        scenariosSubtitle: "Diseña flujos lógicos para enrutamiento de eventos",
        newFlow: "NUEVO FLUJO",
        savePipeline: "GUARDAR FLUJO",
        deletePipeline: "BORRAR FLUJO",
        routingStatus: "ESTADO DE RUTA",
        pipelineEditor: "EDITOR DE FLUJO",
        webhookInput: "WEBHOOK / ENTRADA",
        routeTo: "ENRUTAR A",
        onEvent: "AL EVENTO"
    },
    pt: {
        errorInvalidCredentials: "Credenciais de login inválidas.",
        scenarios: "CENÁRIOS",
        connectors: "CONECTORES",
        scenariosTitle: "Motor de Cenários",
        scenariosSubtitle: "Projete pipelines lógicos para roteamento",
        newFlow: "NOVO FLUXO",
        savePipeline: "SALVAR FLUXO",
        deletePipeline: "EXCLUIR FLUXO",
        routingStatus: "STATUS DE ROTA",
        pipelineEditor: "EDITOR DE FLUXO",
        webhookInput: "WEBHOOK / ENTRADA",
        routeTo: "ROTEAR PARA",
        onEvent: "NO EVENTO"
    },
    ru: {
        errorInvalidCredentials: "Недействительные учетные данные.",
        scenarios: "СЦЕНАРИИ",
        connectors: "КОННЕКТОРЫ",
        scenariosTitle: "Движок сценариев",
        scenariosSubtitle: "Проектирование логических цепочек",
        newFlow: "НОВЫЙ ПОТОК",
        savePipeline: "СОХРАНИТЬ ПОТОК",
        deletePipeline: "УДАЛИТЬ ПОТОК",
        routingStatus: "СТАТУС МАРШРУТА",
        pipelineEditor: "РЕДАКТОР ПОТОКА",
        webhookInput: "WEBHOOK / ВВОД",
        routeTo: "МАРШРУТ К",
        onEvent: "ПО СОБЫТИЮ"
    },
    fr: {
        errorInvalidCredentials: "Identifiants de connexion invalides.",
        scenarios: "SCÉNARIOS",
        connectors: "CONNECTEURS",
        scenariosTitle: "Moteur de scénarios",
        scenariosSubtitle: "Concevoir des pipelines logiques",
        newFlow: "NOUVEAU FLUX",
        savePipeline: "SAUVEGARDER FLUX",
        deletePipeline: "SUPPRIMER FLUX",
        routingStatus: "STATUT DU ROUTAGE",
        pipelineEditor: "ÉDITEUR DE FLUX",
        webhookInput: "WEBHOOK / ENTRÉE",
        routeTo: "ROUTER VERS",
        onEvent: "SUR L'ÉVÉNEMENT"
    },
    de: {
        errorInvalidCredentials: "Ungültige Anmeldedaten.",
        scenarios: "SZENARIEN",
        connectors: "VERBINDUNGEN",
        scenariosTitle: "Szenarien-Engine",
        scenariosSubtitle: "Entwerfen Sie logische Pipelines",
        newFlow: "NEUER FLUSS",
        savePipeline: "FLUSS SPEICHERN",
        deletePipeline: "FLUSS LÖSCHEN",
        routingStatus: "ROUTING-STATUS",
        pipelineEditor: "FLUSS-EDITOR",
        webhookInput: "WEBHOOK / EINGANG",
        routeTo: "ROUTE NACH",
        onEvent: "BEI EREIGNIS"
    },
    zh: {
        errorInvalidCredentials: "登录凭据无效。",
        scenarios: "场景",
        connectors: "连接器",
        scenariosTitle: "场景引擎",
        scenariosSubtitle: "设计逻辑路由管道",
        newFlow: "新流程",
        savePipeline: "保存流程",
        deletePipeline: "删除流程",
        routingStatus: "路由状态",
        pipelineEditor: "流程编辑器",
        webhookInput: "WEBHOOK / 输入",
        routeTo: "路由到",
        onEvent: "在事件上"
    },
    ja: {
        errorInvalidCredentials: "無効なログイン資格情報。",
        scenarios: "シナリオ",
        connectors: "コネクタ",
        scenariosTitle: "シナリオエンジン",
        scenariosSubtitle: "論理パイプラインの設計",
        newFlow: "新しいフロー",
        savePipeline: "フローを保存",
        deletePipeline: "フローを削除",
        routingStatus: "ルーティングステータス",
        pipelineEditor: "フローエディター",
        webhookInput: "WEBHOOK / 入力",
        routeTo: "ルート先",
        onEvent: "イベント時"
    },
    it: {
        errorInvalidCredentials: "Credenziali d'accesso non valide.",
        scenarios: "SCENARI",
        connectors: "CONNETTORI",
        scenariosTitle: "Motore Scenari",
        scenariosSubtitle: "Progetta pipeline logiche",
        newFlow: "NUOVO FLUSSO",
        savePipeline: "SALVA FLUSSO",
        deletePipeline: "ELIMINA FLUSSO",
        routingStatus: "STATO DEL ROUTING",
        pipelineEditor: "EDITOR DI FLUSSO",
        webhookInput: "WEBHOOK / INGRESSO",
        routeTo: "ROTTA VERSO",
        onEvent: "ALL'EVENTO"
    }
};

for (const lang in translations) {
    const t = translations[lang];
    // Add auth errors
    let regexAuth = new RegExp(`(${lang}:\\s*{[\\s\\S]*?auth:\\s*{[\\s\\S]*?)errorUnconfirmed:`, "g");
    code = code.replace(regexAuth, `$1errorInvalidCredentials: "${t.errorInvalidCredentials}",\n            errorUnconfirmed:`);

    // Add sidebar items
    let regexSidebar = new RegExp(`(${lang}:\\s*{[\\s\\S]*?sidebar:\\s*{[\\s\\S]*?)"settings"`, "g");
    code = code.replace(regexSidebar, `$1"settings", "scenarios": "${t.scenarios}", "connectors": "${t.connectors}"`);

    // Add scenario section
    let regexDash = new RegExp(`(${lang}:\\s*{[\\s\\S]*?dashboard:\\s*{[\\s\\S]*?)welcome:`, "g");
    code = code.replace(regexDash, `$1scenarios: { "title": "${t.scenariosTitle}", "subtitle": "${t.scenariosSubtitle}", "newFlow": "${t.newFlow}", "savePipeline": "${t.savePipeline}", "deletePipeline": "${t.deletePipeline}", "routingStatus": "${t.routingStatus}", "pipelineEditor": "${t.pipelineEditor}", "webhookInput": "${t.webhookInput}", "routeTo": "${t.routeTo}", "onEvent": "${t.onEvent}" },\n            welcome:`);
}

fs.writeFileSync('src/lib/i18n.ts', code);
