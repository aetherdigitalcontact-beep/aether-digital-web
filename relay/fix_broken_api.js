const fs = require('fs');

const targets = [
    'src/app/api/logs/route.ts',
    'src/app/api/stats/route.ts',
    'src/app/api/keys/route.ts',
    'src/app/api/inbox/route.ts',
    'src/app/api/templates/route.ts',
    'src/app/api/webhooks/route.ts',
    'src/app/api/scenarios/route.ts'
];

for (const file of targets) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // Fix the broken $1 replacement
    content = content.replace(/\$1 \{ userId/g, "const { userId");

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Manually fixed $1 in ${file}`);
}
