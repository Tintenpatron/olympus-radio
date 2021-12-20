const Discord = require('discord.js');
const config = require('./storage/config.json')
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS |
        Discord.Intents.FLAGS.GUILD_MESSAGES |
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
});
const fs = require('fs');
const Player = require('./helper/Player.js')


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command)
}

client.on("ready", () => {
    console.log('Logged in as ' + client.user.tag)

    Player.init(client, config, false).then(async () => {
        console.log('Successfully initiated player')
    }).catch(async (error) => {
        console.log('Failed to initiate player: ' + error)
    });
});

client.on("messageCreate", async (message) => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;

    let args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;

    try {
        await client.commands.get(command).execute(message, args)
    }catch(error){
        console.error(error);

    }

})


client.login(config.token)
