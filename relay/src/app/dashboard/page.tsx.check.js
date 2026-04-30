const fs = require('fs');
const content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const tags = [];
const stack = [];

// Very simple regex-based tag extractor
const regex = /<(\/)?([a-zA-Z0-9]+)([^>]*?)(\/)?>/g;
let match;

while ((match = regex.exec(content)) !== null) {
    const [full, isClosing, name, attrs, isSelfClosing] = match;
    if (isSelfClosing) continue;
    if (isClosing) {
        if (stack.length > 0) {
            const last = stack.pop();
            if (last.name !== name) {
                console.log(`Mismatch: Opened <${last.name}> at line ${getLine(content, last.pos)} but CLOSED with </${name}> at line ${getLine(content, match.index)}`);
            }
        } else {
            console.log(`Extra closing tag </${name}> at line ${getLine(content, match.index)}`);
        }
    } else {
        stack.push({ name, pos: match.index });
    }
}

function getLine(str, pos) {
    return str.substring(0, pos).split('\n').length;
}

console.log('Remaining tags on stack:', stack.map(t => `<${t.name}> at line ${getLine(content, t.pos)}`).join(', '));
