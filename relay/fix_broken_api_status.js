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

    // Rename status to wsStatus
    content = content.replace(/status \} = await requireWorkspaceAccess/g, "status: wsStatus } = await requireWorkspaceAccess");
    content = content.replace(/status: status \|\| 401/g, "status: wsStatus || 401");

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Renamed status to wsStatus in ${file}`);
}
