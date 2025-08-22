const init = (client) => {
    client.on('clientReady', () => {
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

export { CustomEvent, init as CustomEventsInit }