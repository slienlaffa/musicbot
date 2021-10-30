exports.commandData = {
    name: 'leave',
    description: 'Leave the voice channel.',
    usage: 'leave',
    aliases: ['l'],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    guildQueue.stop()
}
