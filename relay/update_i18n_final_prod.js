const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const binanceErrors = {
    en: 'An error occurred connecting to Binance Pay.',
    es: 'Hubo un error contactando a Binance Pay.',
    pt: 'Ocorreu um erro ao conectar ao Binance Pay.',
    ru: 'Произошла ошибка при подключении к Binance Pay.',
    fr: 'Une erreur est survenue lors de la connexion à Binance Pay.',
    de: 'Fehler beim Verbinden mit Binance Pay.',
    zh: '连接 Binance Pay 时出错。',
    ja: 'Binance Pay への接続中にエラーが発生しました。',
    it: 'Errore durante la connessione a Binance Pay.'
};

// Insert binanceError after mpError for each language
for (const [lang, msg] of Object.entries(binanceErrors)) {
    const searchStr = `mpError: "`;
    // We need to find the specific mpError for this language
    // Since dictionaries[lang] is the structure, we can try to find the block
    // But a safer way is to find the mpError within each dictionary
}

// Actually, simpler: replace unique strings or use blocks
// Let's do a more robust string replacement for the known dictionary structure

content = content.replace(/mpError: "An error occurred connecting to Mercado Pago."/g, `mpError: "An error occurred connecting to Mercado Pago.",\n                binanceError: "An error occurred connecting to Binance Pay."`);
content = content.replace(/mpError: "Ocurrió un error en la conexión con Mercado Pago."/g, `mpError: "Ocurrió un error en la conexión con Mercado Pago.",\n                binanceError: "Hubo un error contactando a Binance Pay."`);
content = content.replace(/mpError: "Ocorreu um erro ao conectar ao Mercado Pago."/g, `mpError: "Ocorreu um erro ao conectar ao Mercado Pago.",\n                binanceError: "Ocorreu um erro ao conectar ao Binance Pay."`);
content = content.replace(/mpError: "Ошибка подключения к Mercado Pago."/g, `mpError: "Ошибка подключения к Mercado Pago.",\n                binanceError: "Ошибка при подключении к Binance Pay."`);
content = content.replace(/mpError: "Une erreur est survenue lors de la connexion à Mercado Pago."/g, `mpError: "Une erreur est survenue lors de la connexion à Mercado Pago.",\n                binanceError: "Une erreur est survenue lors de la connexion à Binance Pay."`);
content = content.replace(/mpError: "Fehler beim Verbinden mit Mercado Pago."/g, `mpError: "Fehler beim Verbinden mit Mercado Pago.",\n                binanceError: "Fehler beim Verbinden mit Binance Pay."`);
content = content.replace(/mpError: "连接 Mercado Pago 时出错。"/g, `mpError: "连接 Mercado Pago 时出错。",\n                binanceError: "连接 Binance Pay 时出错。"`);
content = content.replace(/mpError: "Mercado Pago への接続中にエラーが発生しました。"/g, `mpError: "Mercado Pago への接続中にエラーが発生しました。",\n                binanceError: "Binance Pay への接続中にエラーが発生しました。"`);
content = content.replace(/mpError: "Errore durante la connessione a Mercado Pago."/g, `mpError: "Errore durante la connessione a Mercado Pago.",\n                binanceError: "Errore durante la connessione a Binance Pay."`);

fs.writeFileSync(filePath, content);
console.log('i18n.ts updated with binanceError keys for all 9 languages.');
