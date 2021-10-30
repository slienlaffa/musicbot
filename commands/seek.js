exports.commandData = {
    name: 'seek',
    description: 'Select time in seconds.',
    usage: 'seek [seconds]',
    aliases: [],
    needQueue: true,
}

exports.run = (guildQueue, message, client, args) => {
    guildQueue.seek(parseInt(args[0]) * 1000)
    message.react('⏩')
}
