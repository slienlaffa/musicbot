exports.commandData = {
    name: 'stop',
    description: 'Stop the music.',
    usage: 'stop',
    aliases: [],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    guildQueue.clearQueue()
    guildQueue.skip()
    message.react('⏹️')
}
