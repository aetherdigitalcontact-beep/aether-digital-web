export async function sendSlack(webhookUrl: string, content: string) {
    // Slack Markdown is slightly different from Discord but similar in core
    const markdownContent = content
        .replace(/<b>/g, '*').replace(/<\/b>/g, '*') // Slack uses *bold*
        .replace(/<strong>/g, '*').replace(/<\/strong>/g, '*')
        .replace(/<i>/g, '_').replace(/<\/i>/g, '_') // Slack uses _italic_
        .replace(/<em>/g, '_').replace(/<\/em>/g, '_')
        .replace(/<br\s*\/?>/g, '\n');

    return fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: markdownContent }),
    });
}
