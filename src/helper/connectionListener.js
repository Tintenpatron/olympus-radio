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
const stationManager = require('../core/stationManager');
const playerManager = require('../core/playerManager');
const config = require('../../config.json');

exports.listen = async () => {
    const { client } = require('../app');
    setInterval(async () => {
        const connection = await getVoiceConnection(config.guild);
        if(connection._state.status === 'disconnected'){
            await playerManager.initiate(client);
        }else if(connection._state.status === 'ready'){
            if(!connection.receiver.connectionData.speaking){
                let connection = getVoiceConnection(config.guild);
                await connection.destroy();
                await playerManager.initiate(client);
            }
        }
    }, 1000);
};
