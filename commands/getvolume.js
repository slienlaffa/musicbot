exports.commandData = {
    name: 'getvolume',
    description: 'Get the volume of the bot.',
    usage: 'getvolume',
    aliases: [],
    needQueue: true,
    hidden: true,
}

const { ownerId } = require('../config.json')

exports.run = (guildQueue, message) => {
    message.channel.send(`The volume is ${guildQueue.volume}`)
}
