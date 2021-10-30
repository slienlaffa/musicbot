exports.commandData = {
    name: 'help',
    description: 'Show a list of the commands.',
    usage: 'help',
    aliases: ['h'],
    needQueue: false,
}

exports.run = (guildQueue, message, client) => {
    let helpPretty = 'Command list\n\n'
    for (const command of client.commands) {
        if (command[1].commandData.hidden) continue
        helpPretty += `${command[0]}: ${command[1].commandData.description}\n`
    }
    message.channel.send('```' + helpPretty + '```')
}
