const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const stationManager = require('../core/stationManager');
const {client} = require("../app");

module.exports = {
    name: "playradio",
    async execute(message, args) {

        const { client } = require('../app');

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('radioselector_'+message.author.id)
                    .setPlaceholder('Wähle was du hören möchtest!')
            )
        const stations = stationManager.getStationList();
        for(let station of stations){
            let item = {
                label: '📻 '+station.split(' | ')[1],
                description: 'Spiele '+station.split(' | ')[1]+' ab',
                value: station.split(' | ')[0]
            }
            row.components[0].options.push(item);
        }
        let embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription('🎶 Welche Radiostation möchtest du hören?')
            .setColor('RANDOM')

        message.reply({embeds: [embed], components: [row]})

        client.on('interactionCreate', async (interaction) => {
            if(!interaction.isSelectMenu()) return;

            if(interaction.customId.split('_')[1] !== message.author.id) return;

            let stationId = interaction.values[0];
            let station = stationManager.getStation(stationId);
            console.log(station);
            if(!station) return;

            let embed = new MessageEmbed()
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription('🎶 Du hörst jetzt ' + station.name + '!')
                .setColor('RANDOM')

            interaction.reply({embeds: [embed], ephemeral: true})

            await stationManager.switchStation(stationId);

         });
    }
}
