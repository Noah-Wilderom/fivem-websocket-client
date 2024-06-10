const { v4: uuidv4 } = require("uuid")
const { WebSocket } = require("ws")
import Blob from 'cross-blob';

let callbacks = []
let connections = []

const Connect = (data) =>
{
    let id = uuidv4()
    let url = `${data.schema}://${data.ip}:${data.port ? ':' + data.port : ''}}/${data.route ?? ''}`
    if (data.params)
    {
        let openingQuery = '?'
        for (const [key, value] of Object.entries(data.params)) {
            url = `${url}${openingQuery}${key}=${value}`
            openingQuery = '&'
        }
    }

    const socket = new WebSocket(url);
    console.log(url)

    socket.addEventListener('open', (event) =>
    {
        if (!connections[id]) { return; }

        callbacks[`${id}-OnOpen`]()
    })

    socket.addEventListener('message', (event) =>
    {
        if (!connections[id]) { return; }

        callbacks[`${id}-OnMessage`](event.data)
    })

    socket.addEventListener('close', (event) =>
    {
        if (!connections[id]) { return; }

        callbacks[`${id}-OnClose`]()
    })

    socket.addEventListener('error', (error) =>
    {
        console.log(error)
        if (!connections[id]) { return; }

        callbacks[`${id}-OnError`](error)
    })

    connections[id] = socket

    return id
}

const Send = (id, data) =>
{
    if (connections[id])
    {
        data = JSON.stringify({
            data: data
        })

        console.log(`Sending (${new Blob([data]).size}) bytes message...`)
        connections[id].send(data)
    }
}

const OnOpen = (websocketConnectionId, callback) =>
{
    callbacks[`${websocketConnectionId}-OnOpen`] = callback
}

const OnClose = (websocketConnectionId, callback) =>
{
    callbacks[`${websocketConnectionId}-OnClose`] = callback
}

const OnError = (websocketConnectionId, callback) =>
{
    callbacks[`${websocketConnectionId}-OnError`] = callback
}

const OnMessage = (websocketConnectionId, callback) =>
{
    callbacks[`${websocketConnectionId}-OnMessage`] = callback
}


global.exports('Connect', Connect)
global.exports('Send', Send)
global.exports('OnOpen', OnOpen)
global.exports('OnClose', OnClose)
global.exports('OnError', OnError)
global.exports('OnMessage', OnMessage)
