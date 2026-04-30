const fs = require('fs');

const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace {notification.message || notification.content} with {notification.message}
content = content.replace(/\{notification\.message \|\| notification\.content\}/g, '{notification.message}');
// For type safety, maybe it was `(notification as any).content` but usually I can just remove it
content = content.replace(/notification\.content/g, '(notification as any).content');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed notification type error!');
