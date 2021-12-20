const radio = require('./radio.js')
exports.init = async function (client, config, bool) {
    if(!bool){
        let guild = client.guilds.cache.get(config.guild)
        if(!guild) return;
        if(!guild.me.voice.channel){
            let channel = client.channels.cache.get(config.channel) || (await client.channels.fetch(config.channel));
            if (!channel) return;
            const connection = await channel.join();
            let {currentUrl} = require('../storage/stations.json')
            connection.play(currentUrl)
        }else{
            let member = guild.members.cache.get(client.user.id)
            await member.voice.kick();
            let channel = client.channels.cache.get(config.channel) || (await client.channels.fetch(config.channel));
            if (!channel) return;
            const connection = await channel.join();
            let {currentUrl} = require('../storage/stations.json')
            connection.play(currentUrl)
        }
        setInterval(async () => {
            if(!guild.me.voice.channel) {
                let channel = client.channels.cache.get(config.channel) || (await client.channels.fetch(config.channel));
                if (!channel) return;
                const connection = await channel.join();
                let {currentUrl} = require('../storage/stations.json')
                connection.play(currentUrl)
            }
        }, 100)

        setInterval(async () => {
            if(guild.me.voice.channel){
                let member = guild.members.cache.get(client.user.id);
                await member.voice.kick();
                let channel = client.channels.cache.get(config.channel) || (await client.channels.fetch(config.channel));
                if(!channel) return;
                const connection = await channel.join();
                let {currentUrl} = require('../storage/stations.json');
                connection.play(currentUrl);
            }else{
                let channel = client.channels.cache.get(config.channel) || (await client.channels.fetch(config.channel));
                if (!channel) return;
                const connection = await channel.join();
                let {currentUrl} = require('../storage/stations.json')
                connection.play(currentUrl)
            }
        }, 3600000)
        await new Promise(resolve => setTimeout(resolve, 1000))
        client.user.setPresence({
            status: 'online',
            activity: {
                name: config.status.text.replace('{radio}', await radio.currentStation()),
                type: config.status.type
            }
        })
        console.log('lol')
    }else {

        const connection = client.voice.connections.get(config.guild);
        let {currentUrl} = require('../storage/stations.json')
        connection.play(currentUrl)
        await new Promise(resolve => setTimeout(resolve, 1000))
        client.user.setPresence({
            status: 'online',
            activity: {
                name: config.status.text.replace('{radio}', await radio.currentStation()),
                type: config.status.type
            }
        })

    };


}
