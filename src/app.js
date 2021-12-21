const config = require('../config.json');
const { Client, Intents, Collection } = require('discord.js');
const player = require('./core/playerManager');
const fs = require('fs');


const client = new Client({
   intents: [
       Intents.FLAGS.GUILDS,
       Intents.FLAGS.GUILD_MESSAGES,
       Intents.FLAGS.GUILD_VOICE_STATES
   ]
});

client.login(config.token);


client.commands = new Collection();

const cmdFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for(let file of cmdFiles){
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    console.log('Ready as ' + client.user.tag);
    await player.initiate(client);
});

client.on('messageCreate', async (message) => {
    if(!message.content.startsWith(config.prefix)) return;

    let args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;

    try {
        await client.commands.get(command).execute(message, args);
    }catch(error){
        console.error(error);
    }
})

module.exports.client = client;
