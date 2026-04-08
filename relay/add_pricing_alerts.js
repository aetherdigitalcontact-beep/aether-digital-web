const fs = require('fs');

try {
    let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

    const langs = [
        `            alerts: {
                downgrade: "Action Denied: You currently have the {userPlan} plan. You cannot switch to a lower plan ({targetPlan}) from here.",
                alreadyActive: "Action Denied: You already have the {targetPlan} plan active on your account!",
                mpNoNeed: "Action Denied: You currently have the {userPlan} plan. You do not need to purchase this limited offer!",
                mpAuth: "Please sign in to Relay first to access the regional discount.",
                mpError: "An error occurred connecting to Mercado Pago.",
                critical: "Critical connection failure. Check your internet."
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "Acción Denegada: Actualmente cuentas con el plan {userPlan}. No puedes cambiar a un plan inferior ({targetPlan}) desde aquí.",
                alreadyActive: "Acción Denegada: ¡Ya tienes el plan {targetPlan} activado en tu cuenta!",
                mpNoNeed: "Acción Denegada: Actualmente cuentas con el plan {userPlan}. ¡No tienes necesidad de comprar esta oferta limitada!",
                mpAuth: "Inicia sesión en Relay primero para poder acceder al descuento regional.",
                mpError: "Ocurrió un error en la conexión con Mercado Pago.",
                critical: "Fallo de conexión crítico. Revisa tu internet."
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "Ação Negada: Atualmente você tem o plano {userPlan}. Você não pode mudar para um plano inferior ({targetPlan}) daqui.",
                alreadyActive: "Ação Negada: Você já tem o plano {targetPlan} ativo na sua conta!",
                mpNoNeed: "Ação Negada: Atualmente você tem o plano {userPlan}. Você não precisa comprar esta oferta limitada!",
                mpAuth: "Faça login no Relay primeiro para acessar o desconto regional.",
                mpError: "Ocorreu um erro ao conectar ao Mercado Pago.",
                critical: "Falha crítica de conexão. Verifique sua internet."
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "В действии отказано: сейчас у вас тариф {userPlan}. Вы не можете перейти на более низкий тариф ({targetPlan}) отсюда.",
                alreadyActive: "В действии отказано: тариф {targetPlan} уже активен в вашей учетной записи!",
                mpNoNeed: "В действии отказано: сейчас у вас тариф {userPlan}. Вам не нужно приобретать это ограниченное предложение!",
                mpAuth: "Пожалуйста, сначала войдите в систему, чтобы получить региональную скидку.",
                mpError: "Произошла ошибка при подключении к Mercado Pago.",
                critical: "Критическая ошибка подключения."
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "Action refusée: Vous avez actuellement le forfait {userPlan}. Vous ne pouvez pas passer à un forfait inférieur ({targetPlan}).",
                alreadyActive: "Action refusée: Vous avez déjà le forfait {targetPlan} actif sur votre compte!",
                mpNoNeed: "Action refusée: Vous avez actuellement le forfait {userPlan}. Vous n'avez pas besoin d'acheter cette offre limitée!",
                mpAuth: "Veuillez d'abord vous connecter pour accéder à la réduction régionale.",
                mpError: "Une erreur s'est produite lors de la connexion.",
                critical: "Échec de connexion critique."
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "Aktion verweigert: Sie haben derzeit den {userPlan}-Plan. Sie können nicht zu einem niedrigeren Plan ({targetPlan}) wechseln.",
                alreadyActive: "Aktion verweigert: Sie haben den {targetPlan}-Plan bereits aktiv!",
                mpNoNeed: "Aktion verweigert: Sie haben derzeit den {userPlan}-Plan. Sie müssen dieses Angebot nicht kaufen!",
                mpAuth: "Bitte melden Sie sich zuerst an, um auf den Rabatt zuzugreifen.",
                mpError: "Ein Fehler ist aufgetreten.",
                critical: "Kritischer Verbindungsfehler."
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "操作被拒绝：您当前的计划是 {userPlan}。无法降级到 ({targetPlan})。",
                alreadyActive: "操作被拒绝：您的账户已经启用了 {targetPlan} 计划！",
                mpNoNeed: "操作被拒绝：您当前的计划是 {userPlan}。您不需要购买此优惠！",
                mpAuth: "请先登录以享受区域折扣。",
                mpError: "连接时发生错误。",
                critical: "严重的连接失败。"
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "拒否：現在のプランは {userPlan} です。下位プラン ({targetPlan}) に変更することはできません。",
                alreadyActive: "拒否：すでに {targetPlan} プランが有効になっています！",
                mpNoNeed: "拒否：現在のプランは {userPlan} です。このオファーを購入する必要はありません！",
                mpAuth: "割引を利用するにはログインしてください。",
                mpError: "接続中にエラーが発生しました。",
                critical: "致命的な接続エラー。"
            },\n            checkout: {`,
        `            alerts: {
                downgrade: "Azione negata: Hai il piano {userPlan}. Non puoi passare a un piano inferiore ({targetPlan}).",
                alreadyActive: "Azione negata: Hai già il piano {targetPlan} attivo!",
                mpNoNeed: "Azione negata: Hai il piano {userPlan}. Non hai bisogno di questa offerta!",
                mpAuth: "Accedi per poter accedere allo sconto regionale.",
                mpError: "Si è verificato un errore.",
                critical: "Errore critico di connessione."
            },\n            checkout: {`
    ];

    const parts = code.split('            checkout: {');

    // There should be 10 parts if checkout: { appears 9 times.
    if (parts.length === 10) {
        let newCode = parts[0];
        for (let i = 0; i < 9; i++) {
            newCode += langs[i] + parts[i + 1];
        }
        fs.writeFileSync('src/lib/i18n.ts', newCode, 'utf8');
        console.log('Success! Replaced all 9 instances.');
    } else {
        console.error('Expected 9 instances of checkout: {, found ' + (parts.length - 1));
    }
} catch (e) {
    console.error(e);
}
