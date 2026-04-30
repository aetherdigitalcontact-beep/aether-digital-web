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

    // Re-verify if getUserId is still there (some might have it, some might already be imported)
    content = content.replace(/import jwt from 'jsonwebtoken';\s*const JWT_SECRET = [^\n]+;\s*async function getUserId\(req: NextRequest\) \{[\s\S]*?\n\}/, "import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';");

    // Catch-all for the leftover getUserId if the block above didn't match perfectly
    content = content.replace(/async function getUserId\(req: NextRequest\) \{[\s\S]*?\n\}/, "");

    // Use wsError instead of error to avoid collision
    const replacePattern = /(const|let) \{ (workspaceId|userId), error, status \} = await requireWorkspaceAccess\(req\);/g;
    const replacement = `$1 { userId, workspaceId, error: wsError, status } = await requireWorkspaceAccess(req);\n    if (wsError) return NextResponse.json({ error: wsError }, { status: status || 401 });`;

    // Also handle cases where I might have already replaced it with the buggy one
    content = content.replace(/const \{ workspaceId, error, status \} = await requireWorkspaceAccess\(req\);\s*if \(error\) return NextResponse\.json\(\{ error \}, \{ status: status \|\| 401 \}\);/g, replacement);

    // Replace user_id, userId with workspaceId on where clauses
    content = content.replace(/\.eq\('user_id', userId\)/g, ".eq('user_id', workspaceId)");
    content = content.replace(/user_id: userId/g, "user_id: workspaceId");

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed and updated ${file}`);
}
