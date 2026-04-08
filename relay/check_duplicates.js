const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Exequiel', 'OneDrive', 'Desktop', 'Datos para el trabajo', 'AetherDigital', 'relay', 'src', 'lib', 'i18n.ts');
const content = fs.readFileSync(filePath, 'utf8');

// A very simple regex-based check for duplicate keys in the same object block
// This is a heuristic check
const languages = ['en', 'es', 'pt', 'ru', 'fr', 'de', 'zh', 'ja', 'it'];

languages.forEach(lang => {
    const langStart = content.indexOf(`\n    ${lang}: {`);
    if (langStart === -1) return;

    // Find next language or end of object
    let nextLangStart = content.length;
    languages.forEach(otherLang => {
        if (otherLang === lang) return;
        const otherStart = content.indexOf(`\n    ${otherLang}: {`, langStart + 10);
        if (otherStart !== -1 && otherStart < nextLangStart) {
            nextLangStart = otherStart;
        }
    });

    const langBlock = content.slice(langStart, nextLangStart);

    // Check for duplicate top-level keys like legal: or faq:
    const keys = ['legal:', 'faq:', 'footer:', 'auth:', 'dashboard:'];
    keys.forEach(key => {
        const first = langBlock.indexOf(`\n        ${key}`);
        const last = langBlock.lastIndexOf(`\n        ${key}`);
        if (first !== -1 && first !== last) {
            console.log(`DUPLICATE KEY FOUND in ${lang}: ${key}`);
            const firstSnippet = langBlock.slice(first, first + 100).replace(/\n/g, ' ');
            const lastSnippet = langBlock.slice(last, last + 100).replace(/\n/g, ' ');
            console.log(`  First: ${firstSnippet}`);
            console.log(`  Last:  ${lastSnippet}`);
        }
    });
});
