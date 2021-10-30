exports.commandData = {
    name: 'shuffle',
    description: 'Shuffle the queue.',
    usage: 'shuffle',
    aliases: [],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    guildQueue.shuffle()
    message.react('🔀')
}
