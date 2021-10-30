exports.commandData = {
    name: 'skip',
    description: 'Skip a song.',
    usage: 'skip',
    aliases: ['s'],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    if (guildQueue.songs.length == 0) return
    guildQueue.skip()
    message.react('⏭️')
}
