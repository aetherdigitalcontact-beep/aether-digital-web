const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/binanceError: "An error occurred connecting to Binance Pay."/g, `binanceError: "An error occurred connecting to Binance Pay.",\n                contactCopied: "Email copied to clipboard! You can also reach us at aetherdigital.contact@gmail.com"`);
content = content.replace(/binanceError: "Hubo un error contactando a Binance Pay."/g, `binanceError: "Hubo un error contactando a Binance Pay.",\n                contactCopied: "¡Email copiado al portapapeles! También puedes escribirnos a aetherdigital.contact@gmail.com"`);
content = content.replace(/binanceError: "Ocorreu um erro ao conectar ao Binance Pay."/g, `binanceError: "Ocorreu um erro ao conectar ao Binance Pay.",\n                contactCopied: "Email copiado para a área de transferência! Você também pode nos contatar em aetherdigital.contact@gmail.com"`);
content = content.replace(/binanceError: "Une erreur est survenue lors de la connexion à Binance Pay."/g, `binanceError: "Une erreur est survenue lors de la connexion à Binance Pay.",\n                contactCopied: "Email copié dans le presse-papiers ! Vous pouvez également nous contacter à aetherdigital.contact@gmail.com"`);
content = content.replace(/binanceError: "Fehler beim Verbinden mit Binance Pay."/g, `binanceError: "Fehler beim Verbinden mit Binance Pay.",\n                contactCopied: "Email in die Zwischenablage kopiert! Sie können uns auch unter aetherdigital.contact@gmail.com erreichen"`);

fs.writeFileSync(filePath, content);
console.log('i18n.ts updated with contactCopied keys.');
