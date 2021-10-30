exports.logError = (error, queue) => {
    console.log(timeNow() + 'En: ' + queue.guild.name + ' Error: ' + error)
}

function timeNow() {
    return new Date(Date.now()).toLocaleTimeString('en-GB', {
        timezone: 'America/Santiago',
    })
}
