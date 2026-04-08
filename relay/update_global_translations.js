const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Exequiel', 'OneDrive', 'Desktop', 'Datos para el trabajo', 'AetherDigital', 'relay', 'src', 'lib', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const translations = {
    pt: {
        legal: {
            terms: "Termos de Serviço",
            privacy: "Política de Privacidade",
            refund: "Política de Reembolso",
            support: "Contato de Suporte",
            sections: {
                agreement: "Acordo de Termos",
                usage: "Uso da API e Limites",
                ip: "Propriedade Intelectual",
                availability: "Disponibilidade do Serviço",
                collection: "Coleta de Dados",
                security: "Protocolos de Segurança",
                disclosure: "Divulgação a Terceiros",
                noRefund: "Política de Não Reembolso",
                cancellation: "Cancelamentos",
                exceptions: "Exceções"
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
        }
    },
    ru: {
        legal: {
            terms: "Условия использования",
            privacy: "Политика конфиденциальности",
            refund: "Политика возврата",
            support: "Служба поддержки",
            sections: {
                agreement: "Согласие с условиями",
                usage: "Использование API и лимиты",
                ip: "Интеллектуальная собственность",
                availability: "Доступность сервиса",
                collection: "Сбор данных",
                security: "Протоколы безопасности",
                disclosure: "Раскрытие информации",
                noRefund: "Политика отсутствия возврата",
                cancellation: "Отмена подписки",
                exceptions: "Исключения"
            }
        },
        faq: {
            title: "Часто задаваемые вопросы",
            items: [
                { q: "Как начать отправлять уведомления?", a: "Просто создайте API-ключ в панели управления и отправьте POST-запрос на наш сервер. Ознакомьтесь с документацией для примеров кода." },
                { q: "Уровень Hobby действительно бесплатный?", a: "Да, навсегда. Вы получаете 100 уведомлений в месяц и поддержку сообщества совершенно бесплатно." },
                { q: "Могу ли я сменить тарифный план?", a: "Вы можете повысить план мгновенно. Понижение вступает в силу в конце текущего расчетного периода." },
                { q: "Вы храните данные моих уведомлений?", a: "Нет. Мы храним только метаданные (время, статус) для аналитики. Содержимое сообщения удаляется сразу после доставки." }
            ]
        }
    },
    fr: {
        legal: {
            terms: "Conditions d'utilisation",
            privacy: "Politique de confidentialité",
            refund: "Politique de remboursement",
            support: "Contact Support",
            sections: {
                agreement: "Acceptation des conditions",
                usage: "Utilisation de l'API & Limites",
                ip: "Propriété intellectuelle",
                availability: "Disponibilité du service",
                collection: "Collecte de données",
                security: "Protocoles de sécurité",
                disclosure: "Divulgation à des tiers",
                noRefund: "Politique de non-remboursement",
                cancellation: "Annulations",
                exceptions: "Exceptions"
            }
        },
        faq: {
            title: "Questions fréquemment posées",
            items: [
                { q: "Comment commencer à envoyer des alertes ?", a: "Créez simplement une clé API dans le tableau de bord et envoyez une requête POST à notre uplink global. Consultez la documentation pour les exemples." },
                { q: "Le niveau Hobby est-il vraiment gratuit ?", a: "Oui, pour toujours. Vous bénéficiez de 100 alertes par mois et d'un support communautaire gratuit." },
                { q: "Puis-je changer mon abonnement ?", a: "Vous pouvez passer au niveau supérieur instantanément. Les rétrogradations prennent effet à la fin de votre cycle de facturation." },
                { q: "Stockez-vous mes données de notification ?", a: "Non. Nous stockons uniquement les métadonnées pour vos analyses. Le contenu est supprimé immédiatement après la livraison." }
            ]
        }
    },
    de: {
        legal: {
            terms: "Nutzungsbedingungen",
            privacy: "Datenschutzrichtlinie",
            refund: "Rückerstattungsrichtlinie",
            support: "Kundensupport",
            sections: {
                agreement: "Zustimmung zu den Bedingungen",
                usage: "API-Nutzung & Limits",
                ip: "Geistiges Eigentum",
                availability: "Serviceverfügbarkeit",
                collection: "Datenerfassung",
                security: "Sicherheitsprotokolle",
                disclosure: "Weitergabe an Dritte",
                noRefund: "Keine Rückerstattung",
                cancellation: "Stornierungen",
                exceptions: "Ausnahmen"
            }
        },
        faq: {
            title: "Häufig gestellte Fragen",
            items: [
                { q: "Wie fange ich an, Warnungen zu senden?", a: "Erstellen Sie einfach einen API-Schlüssel im Dashboard und senden Sie einen POST-Request an unseren globalen Uplink. Beispiele finden Sie in der Dokumentation." },
                { q: "Ist die Hobby-Stufe wirklich kostenlos?", a: "Ja, für immer. Sie erhalten 100 Warnungen pro Monat und Community-Support, ohne einen Cent zu bezahlen." },
                { q: "Kann ich ein Upgrade oder Downgrade durchführen?", a: "Ein Upgrade ist sofort möglich. Downgrades werden am Ende Ihres aktuellen Abrechnungszeitraums wirksam." },
                { q: "Speichern Sie meine Benachrichtigungsdaten?", a: "Nein. Wir speichern nur Metadaten für Ihre Analysen. Der Inhalt wird sofort nach der Zustellung gelöscht." }
            ]
        }
    },
    zh: {
        legal: {
            terms: "服务条款",
            privacy: "隐私政策",
            refund: "退款政策",
            support: "联系支持",
            sections: {
                agreement: "条款协议",
                usage: "API 使用与限制",
                ip: "知识产权",
                availability: "服务可用性",
                collection: "数据收集",
                security: "安全协议",
                disclosure: "第三方披露",
                noRefund: "无退款政策",
                cancellation: "取消政策",
                exceptions: "例外情况"
            }
        },
        faq: {
            title: "常见问题解答",
            items: [
                { q: "如何开始发送警报？", a: "只需在仪表板中创建 API 密钥，然后向我们的全球上行链路发送 POST 请求。查看文档以获取代码段。" },
                { q: "Hobby 级别真的免费吗？", a: "是的，永远免费。您每月可获得 100 条警报和社区支持，无需支付任何费用。" },
                { q: "我可以升级或降级吗？", a: "您可以立即升级。降级将在当前计费周期结束时生效。" },
                { q: "你们存储我的通知数据吗？", a: "不。我们只存储用于您的分析的元数据。消息内容在送达后立即删除。" }
            ]
        }
    },
    ja: {
        legal: {
            terms: "利用規約",
            privacy: "プライバシーポリシー",
            refund: "返金ポリシー",
            support: "サポート担当",
            sections: {
                agreement: "規約の同意",
                usage: "APIの使用と制限",
                ip: "知的財産権",
                availability: "サービスの可用性",
                collection: "データ収集",
                security: "セキュリティプロトコル",
                disclosure: "第三者への開示",
                noRefund: "返金不可ポリシー",
                cancellation: "キャンセル",
                exceptions: "例外事項"
            }
        },
        faq: {
            title: "よくある質問",
            items: [
                { q: "アラートの送信を開始するにはどうすればよいですか？", a: "ダッシュボードでAPIキーを作成し、グローバルアップリンクにPOSTリクエストを送信するだけです。詳細はドキュメントを確認してください。" },
                { q: "Hobbyプランは本当に無料ですか？", a: "はい、永遠に無料です。月間100件のアラートとコミュニティサポートを無料で利用できます。" },
                { q: "アップグレードやダウングレードは可能ですか？", a: "即時アップグレードが可能です。ダウングレードは現在の請求サイクルの終了時に適用されます。" },
                { q: "通知データは保存されますか？", a: "いいえ。分析用のメタデータのみを保存し、メッセージ内容は配信後すぐに削除されます。" }
            ]
        }
    },
    it: {
        legal: {
            terms: "Termini di Servizio",
            privacy: "Informativa sulla Privacy",
            refund: "Politica di Rimborso",
            support: "Contatta el Supporto",
            sections: {
                agreement: "Accettazione dei Termini",
                usage: "Utilizzo API & Limiti",
                ip: "Proprietà Intellettuale",
                availability: "Disponibilità del Servizio",
                collection: "Raccolta Dati",
                security: "Protocolli di Sicurezza",
                disclosure: "Divulgazione a Terzi",
                noRefund: "Politica di No Rimborso",
                cancellation: "Cancellazioni",
                exceptions: "Eccezioni"
            }
        },
        faq: {
            title: "Domande Frequenti",
            items: [
                { q: "Come inizio a inviare avvisi?", a: "Crea un'API Key nella dashboard e invia una richiesta POST al nostro uplink globale. Consulta la documentazione per esempi." },
                { q: "Il piano Hobby è davvero gratuito?", a: "Sì, per sempre. Ricevi 100 avvisi al mese e supporto della community senza costi." },
                { q: "Posso fare upgrade o downgrade?", a: "L'upgrade è istantaneo. I downgrade diventano effettivi alla fine del ciclo di fatturazione corrente." },
                { q: "Archiviate i miei dati di notifica?", a: "No. Archiviamo solo metadati per l'analisi. Il contenuto del messaggio viene eliminato dopo la consegna." }
            ]
        }
    }
};

for (const lang in translations) {
    const langKey = `${lang}: {`;
    const searchString = `    ${langKey}`; // Match the indentation

    // Find where this language dictionary starts
    const langIndex = content.indexOf(searchString);
    if (langIndex !== -1) {
        // Find the location after checkout object to insert legal/faq
        const checkoutEndString = 'confirm: "'; // A unique part of checkout confirm in various languages
        // Actually, searching for footer might be safer as it is always there and has a standardized structure
        const footerIndex = content.indexOf('footer: "', langIndex);

        if (footerIndex !== -1) {
            const insertionPoint = content.lastIndexOf('},', footerIndex);
            if (insertionPoint !== -1 && insertionPoint > langIndex) {
                const legalFaqString = `\n        legal: ${JSON.stringify(translations[lang].legal, null, 12).replace(/\n\s+}/g, '\n        }')},\n        faq: ${JSON.stringify(translations[lang].faq, null, 12).replace(/\n\s+}/g, '\n        }')},`.replace(/\"([^(\")"]+)\":/g, "$1:");

                // Clean up the stringified JSON slightly to match style (less aggressive indentation)
                const polishedString = legalFaqString.replace(/\s{12}/g, '            ').replace(/\s{10}/g, '        ');

                content = content.slice(0, insertionPoint + 2) + polishedString + content.slice(insertionPoint + 2);
                console.log(`Updated ${lang}`);
            }
        }
    }
}

fs.writeFileSync(filePath, content);
console.log("Global update complete.");
