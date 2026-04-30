const fs = require('fs');

const path = "c:\\Users\\Exequiel\\OneDrive\\Desktop\\Datos para el trabajo\\AetherDigital\\relay\\src\\app\\dashboard\\page.tsx";
let content = fs.readFileSync(path, 'utf8');

// Replace simple standard fetches like fetch('/api/stats')
content = content.replace(/await fetch\((['"`])\/api\/([a-zA-Z0-9_\/]+)\1\)/g, "await fetch(`/api/$2${activeWorkspaceId ? '?workspaceId='+activeWorkspaceId : ''}`)");

// Replace fetches already containing query params like fetch('/api/logs?limit=50')
content = content.replace(/await fetch\((['"`])\/api\/([a-zA-Z0-9_\/]+)\?([^'"`]+)\1\)/g, "await fetch(`/api/$2?$3${activeWorkspaceId ? '&workspaceId='+activeWorkspaceId : ''}`)");

// Handle POST/PATCH which passes URL in arguments, e.g. fetch('/api/admin/accounts', { method: 'POST' })
// This regex specifically avoids altering the second argument of fetch
content = content.replace(/await fetch\((['"`])\/api\/([a-zA-Z0-9_\/]+)\1,\s*\{/g, "await fetch(`/api/$2${activeWorkspaceId ? '?workspaceId='+activeWorkspaceId : ''}`, {");

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully appended activeWorkspaceId to fetch commands.");
