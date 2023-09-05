const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { client_id, token, guild_id } = require('./config.json');
const { handleClub100 } = require('./commands/club100');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });

// Your other code remains unchanged

client.once('ready', () => {
    console.log('Ready and Logged in! 🚀');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'club100') {
        try {
            await interaction.reply('Check your DMs! 📩');
            handleClub100(interaction, client);
        } catch (error) {
            console.error(`Failed to handle /club100 command: ${error}`);
        }
    }
});

client.login(token);
