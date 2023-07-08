const init = (client) => {
    client.on('ready', () => {
        setInterval(dateChangeEventLoop, 1000, client)
    })
}

const dateChangeEventLoop = (client) => {
    const currentDate = new Date()
    if (currentDate.getDate() !== dateChangeEventLoop.previousDate) {
        dateChangeEventLoop.previousDate = currentDate.getDate()
        client.emit(CustomEvent.DateChange, client)
    }
}

const CustomEvent = {
    DateChange: 'dateChange'
}

module.exports = { CustomEvent, CustomEventsInit: init }