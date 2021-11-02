exports.logError = (error, queue) => {
    console.log(
        timeNow() + ' In: ' + queue.guild?.name + ' Error: ' + error.toString()
    )
    console.log(queue.songs[0]?.url)
}

function timeNow() {
    return new Date(Date.now()).toLocaleTimeString('en-GB', {
        timezone: 'America/Santiago',
    })
}
