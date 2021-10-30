exports.commandData = {
    name: 'clear',
    description: 'Clear the queue.',
    usage: 'clear',
    aliases: [],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    guildQueue.clearQueue()
    message.channel.send('Queue limpiada')
    // change for a react, maybe
}
