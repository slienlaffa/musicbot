exports.commandData = {
    name: 'pause',
    description: 'Pause the music.',
    usage: 'pause',
    aliases: [],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    guildQueue.setPaused(true)
    message.react('⏸️')
}
