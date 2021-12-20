require("../helper/ExtendedMessage.js");
const api = require('../helper/radio.js')
const { MessageEmbed } = require('discord.js')
const config = require('../storage/config.json')

module.exports = {
    name: "addstation",
    description: "ping pong",
    async execute(message, args) {

        if(!args[0]){
            let embed = new MessageEmbed()
                .setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://discord.gg/office')
                .setColor('#0ff1ce')
                .setDescription('Benutz '+config.prefix+'addstation <URL> <Name>')
                .setFooter('discord.gg/office')
                .setTimestamp();
            return message.inlineReply(embed)
        }else{
            function isUrl(string){
                let res = string.match(new RegExp('(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ipv4
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // querystring
                    '(\\#[-a-z\\d_]*)?','i'))
                return (res !== null)
            }
            if(isUrl(args[0])){
                if(!args[1]){
                    let embed = new MessageEmbed()
                        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://discord.gg/office')
                        .setColor('#0ff1ce')
                        .setDescription('Benutz '+config.prefix+'addstation <URL> <Name>')
                        .setFooter('discord.gg/office')
                        .setTimestamp();
                    return message.inlineReply(embed)
                }else{
                    let count = (await api.getStationCount())+1;
                    console.log(count)
                    let data = {
                        name: args.slice(1).join(' '),
                        url: args[0],
                        count: count
                    }
                    await api.addStation(message.client, data).then(async (res) => {
                        if(!res) res = 'success'
                        if(!(res.toString().includes('Something went wrong:'))){
                            console.log('hmpd')
                            let embed = new MessageEmbed()
                                .setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://discord.gg/office')
                                .setColor('#0ff1ce')
                                .setDescription('**['+data.name + ']' + '('+data.url+')** wurde zu den Radiostations hinzugefügt')
                                .setFooter('discord.gg/office')
                                .setTimestamp();
                            return message.inlineReply(embed)
                        }else{
                            let embed = new MessageEmbed()
                                .setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://discord.gg/office')
                                .setColor('#ee1111')
                                .setDescription('**['+data.name + ']' + '('+data.url+')** existiert bereits')
                                .setFooter('discord.gg/office')
                                .setTimestamp();
                            return message.inlineReply(embed)
                        }

                    }).catch(async (error) => {
                        let embed = new MessageEmbed()
                            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://discord.gg/office')
                            .setColor('#ee1111')
                            .setDescription('Ein Fehler ist aufgetreten')
                            .setFooter('discord.gg/office')
                            .setTimestamp();
                    })


                }
            }else{
                let embed = new MessageEmbed()
                    .setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://discord.gg/office')
                    .setColor('#0ff1ce')
                    .setDescription('Benutz '+config.prefix+'addstation <URL> <Name>')
                    .setFooter('discord.gg/office')
                    .setTimestamp();
                return message.inlineReply(embed)
            }
        }

    }
};
