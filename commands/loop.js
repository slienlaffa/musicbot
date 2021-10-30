exports.commandData = {
    name: 'loop',
    description: 'Loop a song.',
    usage: 'loop',
    aliases: [],
    needQueue: true,
}

const { RepeatMode } = require('discord-music-player')

exports.run = (guildQueue, message) => {
    guildQueue.setRepeatMode(RepeatMode.SONG) // or 1 instead of RepeatMode.SONG
    message.react('🔁')
}
