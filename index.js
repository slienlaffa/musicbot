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
    leaveOnEnd: false,
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

client.player
    .on('channelEmpty', (queue) =>
        queue.data.message.channel.send(
            `Everyone left the Voice Channel, queue ended.`
        )
    )
    .on('playlistAdd', (queue, playlist) =>
        queue.data.message.channel.send(
            `Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`
        )
    )
    .on('queueEnd', (queue) =>
        queue.data.message.channel.send(`The queue has ended.`)
    )
    /* .on('songChanged', (queue, newSong, oldSong) => {
        console.log(queue.data.message.channel.members.size)
        // todo: it show the members when the message was send
        // if no one else is in the voice channel, leave the channel
        if (queue.data.message.channel.members.size === 1) {
            console.log(queue.data.message.channel.members.size)
            console.log('No one is in the voice channel, leaving...')
            queue.destroy()
        }
    })*/
    .on('songFirst', (queue, song) =>
        queue.data.message.channel.send(
            `Started playing ${song}. ${client.emojis.cache.get(
                '903523328520769588'
            )}`
        )
    )
    .on('clientDisconnect', (queue) =>
        queue.data.message.channel.send(
            `I was kicked from the Voice Channel, queue ended.`
        )
    )
    .on('clientUndeafen', (queue) =>
        queue.data.message.channel.send(`I got undefeanded.`)
    )
    .on('error', (error, queue) => {
        logError(error, queue)
        queue.data.message.channel.send(
            `There was an error playing this song. ${queue.songs[0]?.name}`
        )
    })

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    if (!message.member.voice.channel) return

    let guildQueue = client.player.getQueue(message.guild.id)

    const dynamicCommand =
        client.commands.get(command) ||
        client.commands.get(client.aliases.get(command)) // get the command using an alias

    if (!dynamicCommand) return

    // when the is no guildQueue and the command need guildqueue, cant execute the command
    if (!guildQueue && dynamicCommand.commandData.needQueue) return

    await dynamicCommand.run(guildQueue, message, client, args)
})
