exports.commandData = {
    name: 'loopqueue',
    description: 'Loop the queue.',
    usage: 'loopqueue',
    aliases: [],
    needQueue: true,
}

const { RepeatMode } = require('discord-music-player')

exports.run = (guildQueue, message) => {
    guildQueue.setRepeatMode(RepeatMode.QUEUE) // or 2 instead of RepeatMode.QUEUE
    message.react('🔂')
}
