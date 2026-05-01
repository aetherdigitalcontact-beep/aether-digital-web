
interface Block {
    id: string;
    type: 'text' | 'button' | 'image' | 'social' | 'divider' | 'footer' | 'variable';
    content?: string;
    style?: any;
    data?: any;
}

interface RenderOptions {
    corporateName?: string;
    corporateLogo?: string;
    userEmail?: string;
    isEnterprise?: boolean; // If true, hide "Powered by Relay" branding
}

export function renderLayoutToHtml(blocks: Block[], options: RenderOptions = {}): string {
    const {
        corporateName = 'Relay',
        corporateLogo = '',
        userEmail = '',
        isEnterprise = false
    } = options;

    const styles = `
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
        .header { padding: 40px; border-bottom: 1px solid #f1f5f9; }
        .content { padding: 40px; }
        .footer { padding: 40px; background: #fafafa; border-top: 1px solid #f1f5f9; text-align: center; }
        .branding { margin-top: 40px; opacity: 0.5; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; }
        .btn { display: inline-block; padding: 12px 32px; background-color: #000000; color: #ffffff !important; border-radius: 100px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .social-icons { margin: 20px 0; }
        .social-icons img { width: 16px; margin: 0 10px; opacity: 0.3; }
        p { margin-bottom: 1.5em; }
        img { max-width: 100%; height: auto; }
    `;

    let contentHtml = '';

    blocks.forEach(block => {
        const textAlign = block.style?.textAlign || 'left';

        switch (block.type) {
            case 'text':
                contentHtml += `<div style="text-align: ${textAlign};">${block.content}</div>`;
                break;
            case 'button':
                contentHtml += `
                    <div style="text-align: ${textAlign}; margin: 30px 0;">
                        <a href="#" class="btn">${block.content || 'Click Me'}</a>
                    </div>`;
                break;
            case 'divider':
                contentHtml += `<hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 40px 0;" />`;
                break;
            case 'image':
                if (block.content) {
                    contentHtml += `<div style="text-align: ${textAlign}; margin: 20px 0;"><img src="${block.content}" style="border-radius: 20px;" /></div>`;
                }
                break;
            case 'social':
                contentHtml += `
                    <div class="social-icons" style="text-align: ${textAlign};">
                        ${(block.data?.platforms || ['twitter', 'linkedin']).map((p: string) => `
                            <a href="#"><img src="https://relay-protocol.com/assets/icons/${p}.png" alt="${p}" /></a>
                        `).join('')}
                    </div>`;
                break;
            case 'variable':
                contentHtml += `<div style="text-align: ${textAlign}; font-family: monospace; color: #000000; background: #f8fafc; padding: 10px; border-radius: 8px;">{{${block.content}}}</div>`;
                break;
            default:
                break;
        }
    });

    // Branding Footer
    const brandingHtml = isEnterprise ? '' : `
        <div style="margin-top: 48px; display: table; margin-left: auto; margin-right: auto;">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; vertical-align: middle; padding-right: 8px;">Powered by</td>
                    <td style="vertical-align: middle;">
                        <table cellpadding="0" cellspacing="0" border="0" style="background-color: #3B82F6; border-radius: 6px;">
                            <tr>
                                <td style="padding: 4px 8px; font-size: 10px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: -0.05em;">RELAY</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    `;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <table width="100%">
                <tr>
                    <td>
                        <img src="${corporateLogo || 'https://relay-protocol.com/logo.png'}" style="height: 32px;" alt="Logo" />
                    </td>
                    <td align="right">
                        <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #000;">${corporateName}</div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="content">
            ${contentHtml}
        </div>
        <div class="footer">
            <div class="social-icons">
                <a href="#"><img src="https://relay-protocol.com/assets/icons/twitter.png" alt="Twitter" /></a>
                <a href="#"><img src="https://relay-protocol.com/assets/icons/linkedin.png" alt="LinkedIn" /></a>
            </div>
            <div style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">${corporateName}</div>
            <div style="font-size: 10px; color: #cbd5e1; margin-top: 5px;">Sent via Relay Protocol Infrastructure</div>
            ${brandingHtml}
        </div>
    </div>
</body>
</html>
    `.trim();
}
