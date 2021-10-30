const { Client, Intents, Collection } = require('discord.js')
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
})

client.commands = new Collection()
client.aliases = new Collection()

const fs = require('fs')

fs.readdir(`./commands/`, (err, files) => {
    if (err) throw err
    for (const file of files) {
        const props = require(`./commands/${file}`)
        client.commands.set(props.commandData.name, props)
        for (const alias of props.commandData.aliases) {
            client.aliases.set(alias, props.commandData.name)
        }
    }
})

const { token } = require('./config.json')
const prefix = '-'

const { Player } = require('discord-music-player')
const player = new Player(client, {
    leaveOnEnd: false, // This options are optional.
    volume: 50,
    quality: 'low',
})
// You can define the Player as *client.player* to easly access it.
client.player = player

client.on('ready', () => {
    console.log('I am ready to Play with DMP 🎶')
})

client.login(token)

const { logError } = require('./util.js')

client.on('error', (e) => console.error(e))
client.on('warn', (e) => console.warn(e))

// Init the event listener only once (at the top of your code).
client.player
    // Emitted when channel was empty.
    .on('channelEmpty', (queue) =>
        queue.data.message.channel.send(
            `Everyone left the Voice Channel, queue ended.`
        )
    )
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd', (queue, playlist) =>
        queue.data.message.channel.send(
            `Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`
        )
    )
    // Emitted when there was no more music to play.
    .on('queueEnd', (queue) =>
        queue.data.message.channel.send(`The queue has ended.`)
    )
    // Emitted when a song changed.
    /*   .on('songChanged', (queue, newSong, oldSong) =>
        queue.data.message.channel.send(`${newSong} is now playing.`)
        // when 403 error, there is no song to get name
    )*/
    // Emitted when a first song in the queue started playing.
    .on('songFirst', (queue, song) =>
        queue.data.message.channel.send(
            `Started playing ${song}. ${client.emojis.cache.get(
                '903523328520769588'
            )}`
        )
    )
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        queue.data.message.channel.send(
            `I was kicked from the Voice Channel, queue ended.`
        )
    )
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) =>
        queue.data.message.channel.send(`I got undefeanded.`)
    )
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        logError(error, queue)
    })

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    if (!message.member.voice.channel) return

    let guildQueue = client.player.getQueue(message.guild.id)

    //
    /*if (command === 'playlist' || command === 'pl') {
        let queue = client.player.createQueue(message.guild.id, {
            data: { message },
        })
        await queue.join(message.member.voice.channel)
        await queue.playlist(args.join(' ')).catch((error) => {
            logError(error, queue)
            message.channel.send('No pregunti por qué, pero la wea no funciona')
            if (!guildQueue) queue.stop()
        })
    }*/

    /*   if (command === 'setvolume') {
        guildQueue.setVolume(parseInt(args[0]))
    }
    
    if (command === 'getvolume') {
        message.channel.send(guildQueue.volume)
    }*/

    const dynamicCommand =
        client.commands.get(command) ||
        client.commands.get(client.aliases.get(command)) // get the command using an alias

    if (!dynamicCommand) return

    // when the is no guildQueue and the command need guildqueue, cant execute the command
    if (!guildQueue && dynamicCommand.commandData.needQueue) return

    await dynamicCommand.run(guildQueue, message, client, args)
})
