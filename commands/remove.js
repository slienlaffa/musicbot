exports.commandData = {
    name: 'remove',
    description: 'Remove one song from the queue.',
    usage: 'remove [number]',
    aliases: [],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    guildQueue.remove(parseInt(args[0]))
    message.react('513547150697955338')
}
