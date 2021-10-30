exports.commandData = {
    name: 'resume',
    description: 'Resume the music.',
    usage: 'resume',
    aliases: ['r'],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    guildQueue.setPaused(false)
    message.react('▶️')
}
