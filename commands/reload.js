exports.commandData = {
    name: 'reload',
    description: 'Reload a command after been updated.',
    usage: 'reload [command]',
    aliases: [],
    needQueue: false,
    hidden: true,
}

const { ownerId } = require('../config.json')

exports.run = (guildQueue, message, client, args) => {
    if (message.author.id != ownerId) return
    if (!args)
        return message.channel.send('Must provide a command name to reload.')
    const command = client.commands.get(args[0])
    if (!command) return message.channel.send('That command does not exist')

    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${command.commandData.name}.js`)]
    // We also need to delete and reload the command from the container.commands Enmap
    client.commands.delete(command.commandData.name)
    const props = require(`./${command.commandData.name}.js`)
    client.commands.set(command.commandData.name, props)

    message.channel.send(
        `The command \`${command.commandData.name}\` has been reloaded`
    )
}
