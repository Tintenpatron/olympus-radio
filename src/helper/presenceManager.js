exports.update = function(name){
    const { client } = require('../app');

    if(client.user.presence.activities[0]?.name !== name){
        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    type: 'LISTENING',
                    name: name
                }
            ]
        });
    }
}
