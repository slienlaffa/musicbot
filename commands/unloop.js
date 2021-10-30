exports.commandData = {
    name: 'unloop',
    description: 'Stop the loop.',
    usage: 'unloop',
    aliases: [],
    needQueue: true,
}

const { RepeatMode } = require('discord-music-player')

exports.run = (guildQueue, message) => {
    guildQueue.setRepeatMode(RepeatMode.DISABLED) // or 0 instead of RepeatMode.DISABLED
    message.react('➡️')
}
