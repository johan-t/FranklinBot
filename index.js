const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { client_id, token, guild_id } = require('./config.json');
const { handleClub100 } = require('./commands/club100');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Register the single /club100 command
const commands = [{
    name: 'club100',
    description: 'Join the 100 club!',
}];

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    const rest = new REST({ version: '9' }).setToken(token);
    
    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(client_id, guild_id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    })();
});

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'club100') {
        try {
            await interaction.reply('Check your DMs! 📩');
            handleClub100(interaction);
        } catch (error) {
            console.error(`Failed to handle /club100 command: ${error}`);
        }
    }
});

client.login(token);
