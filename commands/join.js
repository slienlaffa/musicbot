exports.commandData = {
    name: 'join',
    description: 'Join a voice channel.',
    usage: 'join',
    aliases: ['j'],
    needQueue: false,
}

exports.run = async (guildQueue, message, client) => {
    let queue = client.player.createQueue(message.guild.id, {
        data: { message },
    })
    await queue.join(message.member.voice.channel)
}
