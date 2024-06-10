const { v4: uuidv4 } = require("uuid")
const { WebSocket } = require("ws")

class Connection
{
    id 
    url
    socket
    params
    isOpen 

    constructor(data)
    {
        this.callbacks = []
        this.isOpen = false
        this.id = uuidv4()
        this.url = `${data.schema}://${data.ip}:${data.port}` 
        this.params = data.params ?? null

        if (this.params)
        {
            let openingQuery = '?'
            for (const [key, value] of Object.entries(this.params)) {
                this.url = `${this.url}${openingQuery}${key}=${value}`
                openingQuery = '&'
            }
        }

        console.log("Connecting to ", this.url)
        this.socket = new WebSocket(this.url)
        this.registerSocket()
    }

    registerSocket()
    {
        this.socket.addEventListener('open', (event) => {
            if (this.callbacks['OnOpen'])
            {
                this.isOpen = true
                this.callbacks['OnOpen']()
            }
        })

        this.socket.addEventListener('message', (event) => {
            if (this.callbacks['OnMessage'])
            {
                this.callbacks['OnMessage'](event.data)
            }
        })

        this.socket.addEventListener('close', (event) => {
            if (this.callbacks['OnClose'])
            {
                this.isOpen = false
                this.callbacks['OnClose']()
            }
        })

        this.socket.addEventListener('error', (error) => {
            if (this.callbacks['OnError'])
            {
                console.log('after', typeof this.callbacks['OnError'])
                // console.log(this.callbacks['OnError'])
                this.callbacks['OnError'](error)
            }
        })
    }

    IsOpen = () =>
    {
        return this.isOpen
    }

    Id = () =>
    {
        return this.id
    }

    OnOpen = (callback) =>
    {
        this.callbacks['OnOpen'] = callback
    }

    OnClose = (callback) =>
    {
        this.callbacks['OnClose'] = callback
    }

    OnError = (callback) => 
    {
        console.log(typeof this, typeof callback)
        this.callbacks['OnError'] = callback
    }

    OnMessage = (callback) =>
    {
        this.callbacks['OnMessage'] = callback
    }

    Send = (data) =>
    {
        if (this.isOpen)
        {
            this.socket.send(JSON.stringify(data))
        }
    }
}

const Connect = (data) => {
    return new Connection(data)
}

global.exports('Connect', Connect)