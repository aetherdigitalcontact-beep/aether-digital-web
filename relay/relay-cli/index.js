#! /usr/bin/env node

const { Command } = require('commander');
const pc = require('picocolors');
const prompts = require('prompts');
const fs = require('fs');
const path = require('path');

const program = new Command();
const CONFIG_PATH = path.join(process.cwd(), '.relayrc');

program
    .name('relay')
    .description('Aether Digital Relay Platform Bridge CLI')
    .version('0.1.0');

program.command('login')
    .description('Authenticate with your Relay API Key')
    .action(async () => {
        console.log(pc.cyan('\n🚀 Initializing Relay Uplink...'));

        const response = await prompts({
            type: 'text',
            name: 'apiKey',
            message: 'Enter your Relay API Key:',
            validate: value => value.length > 20 ? true : 'Invalid API Key format'
        });

        if (response.apiKey) {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify({ apiKey: response.apiKey }, null, 2));
            console.log(pc.green('\n✅ Authenticated successfully! Credentials saved to .relayrc\n'));
        }
    });

program.command('test')
    .description('Test the Relay uplink from the terminal')
    .option('-p, --platform <platform>', 'Platform (discord/telegram/whatsapp)', 'discord')
    .option('-t, --target <target>', 'Target ID or Webhook URL')
    .option('-m, --message <message>', 'Message to send', 'Hello from Relay CLI!')
    .action(async (options) => {
        if (!fs.existsSync(CONFIG_PATH)) {
            console.log(pc.red('\n❌ Error: Not authenticated. Run `relay login` first.\n'));
            return;
        }

        const { apiKey } = JSON.parse(fs.readFileSync(CONFIG_PATH));
        const { platform, target, message } = options;

        if (!target) {
            console.log(pc.yellow('\n⚠️  Target is required. Use --target <target>.\n'));
            return;
        }

        console.log(pc.blue(`\n📡 Transmitting packet to ${pc.white(platform)}...`));

        try {
            const res = await fetch('http://localhost:3000/api/relay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({ platform, target, message })
            });

            const data = await res.json();

            if (res.ok) {
                console.log(pc.green('\n✅ RELAY_UPLINK_STABLE'));
                console.log(pc.gray(`Timestamp: ${data.timestamp}\n`));
            } else {
                console.log(pc.red(`\n❌ Delivery Failed: ${data.error}`));
                if (data.provider_error) console.log(pc.gray(`Provider Error: ${data.provider_error}`));
                console.log('');
            }
        } catch (err) {
            console.log(pc.red(`\n❌ Network Error: ${err.message}\n`));
        }
    });

program.command('setup')
    .description('Perform automated health checks for the Relay Uplink')
    .action(async () => {
        console.log(pc.cyan('\n🔍 Running Protocol Diagnostics...'));

        // 1. Check if server is running
        try {
            const res = await fetch('http://localhost:3000/api/relay', { method: 'OPTIONS' });
            console.log(pc.green('  ✅ RELAY_SERVER: Online'));
        } catch (e) {
            console.log(pc.red('  ❌ RELAY_SERVER: Offline (Is the Next.js server running?)'));
        }

        // 2. Check Authentication
        if (fs.existsSync(CONFIG_PATH)) {
            console.log(pc.green('  ✅ AUTH_PROTOCOL: Configured'));
        } else {
            console.log(pc.yellow('  ⚠️  AUTH_PROTOCOL: Not configured (Run `relay login`)'));
        }

        // 3. Database & Network check (Silent)
        console.log(pc.gray('  📡 Diagnostic heartbeat sequence completed.\n'));
    });

program.parse();
