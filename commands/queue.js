exports.commandData = {
    name: 'queue',
    description: 'Show the queue.',
    usage: 'queue',
    aliases: ['q'],
    needQueue: true,
}

exports.run = (guildQueue, message) => {
    if (!guildQueue.songs.length) return
    const queuePretty = guildQueue.songs
        .slice(0, 9)
        .map((song, index) => `${index + 1}- ${song.name}\n`)
        .join('\n')
    message.channel.send('```' + queuePretty + '```')
}
