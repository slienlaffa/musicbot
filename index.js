const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});
const { token } = require('./config.json');
const prefix= '-';

const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEnd: false, // This options are optional.
    volume: 40,
    timeout: 5
});
// You can define the Player as *client.player* to easly access it.
client.player = player;

client.on("ready", () => {
    console.log("I am ready to Play with DMP 🎶");
});

client.login(token);

// Init the event listener only once (at the top of your code).
client.player
    // Emitted when channel was empty.
    .on('channelEmpty',  (queue) =>
        queue.data.message.channel.send(`Everyone left the Voice Channel, queue ended.`))
    // Emitted when a song was added to the queue.
 //   .on('songAdd',  (queue, song) =>
 //       queue.data.message.channel.send(`Song ${song} was added to the queue.`))
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd',  (queue, playlist) =>
        queue.data.message.channel.send(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
    // Emitted when there was no more music to play.
    .on('queueEnd',  (queue) =>
        queue.data.message.channel.send(`The queue has ended.`))
    // Emitted when a song changed.
    .on('songChanged', (queue, newSong, oldSong) =>
        queue.data.message.channel.send(`${newSong} is now playing.`))
    // Emitted when a first song in the queue started playing.
    .on('songFirst',  (queue, song) =>
        queue.data.message.channel.send(`Started playing ${song}.`))
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        queue.data.message.channel.send(`I was kicked from the Voice Channel, queue ended.`))
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) =>
        queue.data.message.channel.send(`I got undefeanded.`))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        queue.data.message.channel.send(`Error: ${error} in ${queue.guild.name}`);
    });

const { RepeatMode } = require('discord-music-player');

client.on('messageCreate', async (message) => {
    if(!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);

    if(command === 'play' || command === 'p') {
        let queue = client.player.createQueue(message.guild.id, { data: { message } });
        await queue.join(message.member.voice.channel);
        let functionPlay = /youtube.com\/watch.*list/.test(args[0]) ? queue.playlist : queue.play
        let song = await functionPlay.call(queue,args.join(' ')).catch(err => {
            console.log(err)
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'playlist' || command === 'pl') {
        let queue = client.player.createQueue(message.guild.id, { data: { message } });
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'skip' || command === 's') {
        // añadir que existe
        guildQueue.skip();
    }

    if(command === 'stop') {
        guildQueue.stop();
    }

    if(command === 'removeLoop') {
        guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
    }

    if(command === 'toggleLoop') {
        guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
    }

    if(command === 'toggleQueueLoop') {
        guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
    }

    if(command === 'setVolume') {
        guildQueue.setVolume(parseInt(args[0]));
    }

    if(command === 'seek') {
        guildQueue.seek(parseInt(args[0]) * 1000);
    }

    if(command === 'clearQueue') {
        guildQueue.clearQueue();
    }

    if(command === 'shuffle') {
        guildQueue.shuffle();
        message.channel.send('Shuffleando')
    }

    if(command === 'queue' || command === 'q') {
        // cambiar a solo 10
        message.channel.send(guildQueue.songs.slice(0,9).join('\n'))
    }

    if(command === 'getVolume') {
        console.log(guildQueue.volume)
    }

    if(command === 'nowPlaying') {
        console.log(`Now playing: ${guildQueue.nowPlaying}`);
    }

    if(command === 'pause') {
        guildQueue.setPaused(true);
    }

    if(command === 'resume' || command === 'r') {
        guildQueue.setPaused(false);
    }

    if(command === 'leave' || command === 'l') {
        message.channel.send('Que pasa larva, me queri echar')
    //    client.player.lea
    }

    if(command === 'remove') {
        guildQueue.remove(parseInt(args[0]));
    }

    if(command === 'createProgressBar') {
        const ProgressBar = guildQueue.createProgressBar();
        
        // [======>              ][00:35/2:20]
        console.log(ProgressBar.prettier);
    }

    if(command === 'help' || command === 'h') {
        message.channel.send('Puta perro perdon, no te puedo ayudar ahora, toy viendo videos de gatos en youtube')
    }
})