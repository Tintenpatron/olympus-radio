require("../helper/ExtendedMessage.js");
const api = require('../helper/radio.js')
const { MessageEmbed } = require('discord.js')
const config = require('../storage/config.json')

module.exports = {
    name: "playradio",
    description: "ping pong",
    async execute(message, args){
        const client = message.client;
        if(!args[0]){
            let stationList = await api.getStationList();
            let embed = new MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL(), 'https://discord.gg/office')
                .setColor('#0ff1ce')
                .setDescription('Benutz '+config.prefix+'playradio <1-'+stationList.length+'>, um ein Radio zu starten. Folgende gibt es:\n\n'+stationList.join('\n'))
                .setFooter('discord.gg/office')
                .setTimestamp();
            return message.inlineReply(embed)
        }
        if(await api.isStation(args.join(' '))){
            let data = await api.getData(args.join(' '))
            await api.switchStation(message.client, data)
            let embed = new MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL(), 'https://discord.gg/office')
                .setColor('#0ff1ce')
                .setDescription('Ab jetzt läuft **'+data.name+'**')
                .setFooter('discord.gg/office')
                .setTimestamp();
            message.inlineReply(embed)
        }else{
            let embed = new MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL(), 'https://discord.gg/office')
                .setColor('#0ff1ce')
                .setDescription('Das ist keine gültige Radiostation')
                .setFooter('discord.gg/office')
                .setTimestamp();
            return message.inlineReply(embed)
        }
    }
}
