exports.commandData = {
    name: 'play',
    description: 'Play a song or a playlist.',
    usage: 'play [link|name]',
    aliases: ['p'],
    needQueue: false,
}

const { logError } = require('../util.js')

exports.run = async (guildQueue, message, client, args) => {
    let queue = client.player.createQueue(message.guild.id, {
        data: { message },
    })
    await queue.join(message.member.voice.channel)
    let functionPlay =
        /youtube.com\/.*list/.test(args[0]) ||
        /spotify.com\/playlist/.test(args[0])
            ? queue.playlist
            : queue.play
    await functionPlay.call(queue, args.join(' ')).catch((error) => {
        logError(error, queue)
        message.channel.send('There was an error playing this.')
        if (!guildQueue) queue.stop()
    })
}
