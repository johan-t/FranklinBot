const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { client_id, token, guild_id } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.login(token);

