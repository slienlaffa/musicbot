exports.commandData = {
    name: 'nowplaying',
    description: 'Show the current song.',
    usage: 'nowplaying',
    aliases: ['now', 'n'],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    const ProgressBar = guildQueue.createProgressBar()
    message.channel.send(
        `Now playing: ${guildQueue.nowPlaying}\n${ProgressBar.prettier}`
    )
}
