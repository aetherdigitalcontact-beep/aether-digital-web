const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const languages = ['en', 'es', 'pt', 'ru', 'fr', 'de', 'zh', 'ja', 'it'];

const trans = {
    en: {
        err: "Invalid login credentials.",
        sb: { overview: "OVERVIEW", analytics: "ANALYTICS", apiKeys: "API KEYS", logs: "LOGS", relayAi: "RELAY AI", status: "STATUS", testLab: "TEST LAB", templates: "TEMPLATES", webhooks: "WEBHOOKS", domains: "DOMAINS", scenarios: "SCENARIOS", connectors: "CONNECTORS", settings: "SETTINGS" },
        sc: { title: "Scenarios Engine", subtitle: "Design logic pipelines for event routing", newFlow: "NEW FLOW", savePipeline: "SAVE PIPELINE", deletePipeline: "DELETE PIPELINE", routingStatus: "ROUTING STATUS", pipelineEditor: "PIPELINE EDITOR", webhookInput: "WEBHOOKS / INPUT", routeTo: "ROUTE TO", onEvent: "ON EVENT", back: "BACK TO LIST", saved: "PIPELINE SAVED", deleteConfirm: "Are you sure you want to delete this scenario?", deleteSelected: "DELETE SELECTED", countSelected: "{count} selected", bulkDeleteConfirm: "Delete {count} scenarios? This cannot be undone." }
    },
    es: {
        err: "Credenciales de acceso inválidas.",
        sb: { overview: "VISTA GENERAL", analytics: "ANALÍTICA", apiKeys: "CLAVES API", logs: "LOGS", relayAi: "RELAY AI", status: "ESTADO", testLab: "TEST LAB", templates: "PLANTILLAS", webhooks: "WEBHOOKS", domains: "DOMINIOS", scenarios: "ESCENARIOS", connectors: "CONECTORES", settings: "AJUSTES" },
        sc: { title: "Motor de Escenarios", subtitle: "Diseña flujos lógicos para enrutamiento de eventos", newFlow: "NUEVO FLUJO", savePipeline: "GUARDAR FLUJO", deletePipeline: "BORRAR FLUJO", routingStatus: "ESTADO DE RUTA", pipelineEditor: "EDITOR DE FLUJO", webhookInput: "WEBHOOK / ENTRADA", routeTo: "ENRUTAR A", onEvent: "AL EVENTO", back: "VOLVER A LA LISTA", saved: "FLUJO GUARDADO", deleteConfirm: "¿Estás seguro de que quieres eliminar este escenario?", deleteSelected: "BORRAR SELECCIONADOS", countSelected: "{count} seleccionados", bulkDeleteConfirm: "¿Borrar {count} escenarios? Esta acción no se puede deshacer." }
    },
    pt: {
        err: "Credenciais de login inválidas.",
        sb: { overview: "GERAL", analytics: "ANÁLISE", apiKeys: "CHAVES API", logs: "LOGS", relayAi: "RELAY AI", status: "STATUS", testLab: "TEST LAB", templates: "TEMPLATES", webhooks: "WEBHOOKS", domains: "DOMÍNIOS", scenarios: "CENÁRIOS", connectors: "CONECTORES", settings: "CONFIGURAÇÕES" },
        sc: { title: "Motor de Cenários", subtitle: "Projete pipelines lógicos para roteamento", newFlow: "NOVO FLUXO", savePipeline: "SALVAR FLUXO", deletePipeline: "EXCLUIR FLUXO", routingStatus: "STATUS DE ROTA", pipelineEditor: "EDITOR DE FLUJO", webhookInput: "WEBHOOK / ENTRADA", routeTo: "ROTEAR PARA", onEvent: "NO EVENTO", back: "VOLTAR À LISTA", saved: "FLUXO SALVO", deleteConfirm: "Tem certeza de que deseja excluir este cenário?", deleteSelected: "EXCLUIR SELECIONADOS", countSelected: "{count} selecionados", bulkDeleteConfirm: "Excluir {count} cenários? Isso não pode ser desfeito." }
    },
    ru: {
        err: "Недействительные учетные данные.",
        sb: { overview: "ОБЗОР", analytics: "АНАЛИТИКА", apiKeys: "КЛЮЧИ API", logs: "ЛОГИ", relayAi: "RELAY AI", status: "СТАТУС", testLab: "TEST LAB", templates: "ШАБЛОНЫ", webhooks: "ВЕБХУКИ", domains: "ДОМЕНЫ", scenarios: "СЦЕНАРИИ", connectors: "КОННЕКТОРЫ", settings: "НАСТРОЙКИ" },
        sc: { title: "Движок сценариев", subtitle: "Проектирование логических цепочек", newFlow: "НОВЫЙ ПОТОК", savePipeline: "СОХРАНИТЬ ПОТОК", deletePipeline: "УДАЛИТЬ ПОТОК", routingStatus: "СТАТУС МАРШРУТА", pipelineEditor: "РЕДАКТОР ПОТОКА", webhookInput: "WEBHOOK / ВВОД", routeTo: "МАРШРУТ К", onEvent: "ПО СОБЫТИЮ", back: "НАЗАД К СПИСКУ", saved: "ПОТОК СОХРАНЕН", deleteConfirm: "Вы уверены, что хотите удалить этот сценарий?", deleteSelected: "УДАЛИТЬ ВЫБРАННЫЕ", countSelected: "Выбрано: {count}", bulkDeleteConfirm: "Удалить {count} сценариев? Это нельзя отменить." }
    },
    fr: {
        err: "Identifiants de connexion invalides.",
        sb: { overview: "APERÇU", analytics: "ANALYSE", apiKeys: "CLÉS API", logs: "LOGS", relayAi: "RELAY AI", status: "STATUT", testLab: "LAB TEST", templates: "MODÈLES", webhooks: "WEBHOOKS", domains: "DOMAINES", scenarios: "SCÉNARIOS", connectors: "CONNECTEURS", settings: "PARAMÈTRES" },
        sc: { title: "Moteur de scénarios", subtitle: "Concevoir des pipelines logiques", newFlow: "NOUVEAU FLUX", savePipeline: "SAUVEGARDER FLUX", deletePipeline: "SUPPRIMER FLUX", routingStatus: "STATUT DU ROUTAGE", pipelineEditor: "ÉDITEUR DE FLUX", webhookInput: "WEBHOOK / ENTRÉE", routeTo: "ROUTER VERS", onEvent: "SUR L'ÉVÉNEMENT", back: "RETOUR À LA LISTE", saved: "FLUX SAUVEGARDÉ", deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce scénario ?", deleteSelected: "SUPPRIMER LA SÉLECTION", countSelected: "{count} sélectionnés", bulkDeleteConfirm: "Supprimer {count} scénarios ? Cela ne peut pas être annulé." }
    },
    de: {
        err: "Ungültige Anmeldedaten.",
        sb: { overview: "ÜBERSICHT", analytics: "ANALYSE", apiKeys: "API-SCHLÜSSEL", logs: "PROTOKOLLE", relayAi: "RELAY AI", status: "STATUS", testLab: "TESTLABOR", templates: "VORLAGEN", webhooks: "WEBHOOKS", domains: "DOMÄNEN", scenarios: "SZENARIEN", connectors: "VERBINDUNGEN", settings: "EINSTELLUNGEN" },
        sc: { title: "Szenarien-Engine", subtitle: "Entwerfen Sie logische Pipelines", newFlow: "NEUER FLUSS", savePipeline: "FLUSS SPEICHERN", deletePipeline: "FLUSS LÖSCHEN", routingStatus: "ROUTING-STATUS", pipelineEditor: "FLUSS-EDITOR", webhookInput: "WEBHOOK / EINGANG", routeTo: "ROUTE NACH", onEvent: "BEI EREIGNIS", back: "ZURÜCK ZUR LISTE", saved: "FLUSS GESPEICHERT", deleteConfirm: "Sind Sie sicher, dass Sie dieses Szenario löschen möchten?", deleteSelected: "AUSWAHL LÖSCHEN", countSelected: "{count} ausgewählt", bulkDeleteConfirm: "{count} Szenarien löschen? Dies kann nicht rückgängig gemacht werden." }
    },
    zh: {
        err: "登录凭据无效。",
        sb: { overview: "概览", analytics: "分析", apiKeys: "API 密钥", logs: "日志", relayAi: "RELAY AI", status: "状态", testLab: "测试实验室", templates: "模板", webhooks: "网络钩子", domains: "域名", scenarios: "场景", connectors: "连接器", settings: "设置" },
        sc: { title: "场景引擎", subtitle: "设计逻辑路由管道", newFlow: "新流程", savePipeline: "保存流程", deletePipeline: "删除流程", routingStatus: "路由状态", pipelineEditor: "流程编辑器", webhookInput: "WEBHOOK / 输入", routeTo: "路由到", onEvent: "在事件上", back: "返回列表", saved: "流程已保存", deleteConfirm: "您确定要删除此场景吗？", deleteSelected: "删除已选", countSelected: "已选 {count}", bulkDeleteConfirm: "确认删除 {count} 个场景？此操作不可撤销。" }
    },
    ja: {
        err: "無効なログイン資格情報。",
        sb: { overview: "概要", analytics: "分析", apiKeys: "APIキー", logs: "ログ", relayAi: "RELAY AI", status: "ステータス", testLab: "テストラボ", templates: "テンプレート", webhooks: "ウェブフック", domains: "ドメイン", scenarios: "シナリオ", connectors: "コネクタ", settings: "設定" },
        sc: { title: "シナリオエンジン", subtitle: "論理パイプラインの設計", newFlow: "新しいフロー", savePipeline: "フローを保存", deletePipeline: "フローを削除", routingStatus: "ルーティングステータス", pipelineEditor: "フローエディター", webhookInput: "WEBHOOK / 入力", routeTo: "ルート先", onEvent: "イベント時", back: "リストに戻る", saved: "フローを保存しました", deleteConfirm: "このシナリオを削除してもよろしいですか？", deleteSelected: "選択項目を削除", countSelected: "{count} 件選択中", bulkDeleteConfirm: "{count} 件のシナリオを削除しますか？この操作は取り消せません。" }
    },
    it: {
        err: "Credenziali d'accesso non valide.",
        sb: { overview: "PANORAMICA", analytics: "ANALITICA", apiKeys: "CHIAVI API", logs: "LOG", relayAi: "RELAY AI", status: "STATO", testLab: "LAB TEST", templates: "TEMPLATE", webhooks: "WEBHOOK", domains: "DOMINI", scenarios: "SCENARI", connectors: "CONNETTORI", settings: "IMPOSTAZIONI" },
        sc: { title: "Motore Scenari", subtitle: "Progetta pipeline logiche", newFlow: "NUOVO FLUSSO", savePipeline: "SALVA FLUSSO", deletePipeline: "ELIMINA FLUSSO", routingStatus: "STATO DEL ROUTING", pipelineEditor: "EDITOR DI FLUSSO", webhookInput: "WEBHOOK / INGRESSO", routeTo: "ROTTA VERSO", onEvent: "ALL'EVENTO", back: "TORNA ALLA LISTA", saved: "FLUSSO SALVATO", deleteConfirm: "Sei sicuro di voler eliminare questo scenario?", deleteSelected: "ELIMINA SELEZIONATI", countSelected: "{count} selezionati", bulkDeleteConfirm: "Eliminare {count} scenari? L'azione non è reversibile." }
    }
};

function cleanStringify(obj, indent) {
    return JSON.stringify(obj, null, 2)
        .replace(/\"([^(\")"]+)\":/g, "$1:")
        .replace(/\n/g, "\n" + (indent || ""));
}

for (const lang of languages) {
    const t = trans[lang];
    let startIdx = code.indexOf(`\n    ${lang}: {`);
    if (startIdx === -1) startIdx = code.indexOf(`    ${lang}: {`);
    if (startIdx === -1) continue;

    let endIdx = code.length;
    for (const other of languages) {
        if (other === lang) continue;
        let otherIdx = code.indexOf(`\n    ${other}: {`, startIdx + 5);
        if (otherIdx !== -1 && otherIdx < endIdx) endIdx = otherIdx;
    }

    let block = code.substring(startIdx, endIdx);
    block = block.replace(/sidebar:\s*{[\s\S]*?},/, `sidebar: ${cleanStringify(t.sb, "            ")},`);
    block = block.replace(/errorInvalidCredentials:\s*".*?",\s*/g, '');
    block = block.replace(/(auth:\s*{[\s\S]*?)errorUnconfirmed:/, `$1errorInvalidCredentials: "${t.err}",\n            errorUnconfirmed:`);
    block = block.replace(/scenarios:\s*{[\s\S]*?},\s*/g, '');
    block = block.replace(/(dashboard:\s*{[\s\S]*?)welcome:/, `$1scenarios: ${cleanStringify(t.sc, "                ")},\n            welcome:`);

    code = code.substring(0, startIdx) + block + code.substring(endIdx);
}

fs.writeFileSync('src/lib/i18n.ts', code);
console.log('i18n.ts bulk selection ready.');
