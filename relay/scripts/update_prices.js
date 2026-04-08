const fs = require('fs');
let s = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Replace ANY price inside "enterprise: { ... }" with "$99"
s = s.replace(/(enterprise:\s*\{[^}]*?price:\s*)"[^"]+"/g, '$1"$99"');

// Insert API limits as the FIRST item in the features array of each plan
s = s.replace(/(hobby:\s*\{[^}]*?features:\s*\[)/g, '$1"1 API Key", ');
s = s.replace(/(starter:\s*\{[^}]*?features:\s*\[)/g, '$1"2 API Keys", ');
s = s.replace(/(pro:\s*\{[^}]*?features:\s*\[)/g, '$1"4 API Keys", ');
s = s.replace(/(enterprise:\s*\{[^}]*?features:\s*\[)/g, '$1"Unlimited API Keys", ');

fs.writeFileSync('src/lib/i18n.ts', s);
console.log("Done updating i18n.ts");
