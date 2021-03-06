const config = require('../../config.json');
const presenceManager = require('../helper/presenceManager');

const {
    joinVoiceChannel,
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus
} = require('@discordjs/voice');

const stationManager = require('./stationManager');
const connectionListener = require('../helper/connectionListener');

const player = createAudioPlayer();

function playUrl(url, name){
    const resource = createAudioResource(url, {
        inputType: StreamType.Arbitrary,
    });
    player.play(resource);
    presenceManager.update(name);
    return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

async function connectToChannel(channel){
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
    });
    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    }catch(error) {
        connection.destroy();
        throw error;
    }
}

exports.initiate = async function(client){

    const stations = require('../../stations.json');

    try {
        await playUrl(stations.currentUrl, stations.currentStation);
    }catch(error){
        console.error(error);
    }

    let channel = client.channels.cache.get(config.channel);
    if(channel){
        try {
            const connection = await connectToChannel(channel);
            connection.subscribe(player);
        }catch(error){
            console.error(error);
        }
    }

     await connectionListener.listen();
}

exports.play = async function(url, name){
    try {
        await playUrl(url, name);
    }catch(error){
        console.error(error);
    }
}

