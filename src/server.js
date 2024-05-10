const { v4: uuidv4 } = require("uuid")
const { WebSocket } = require("ws")

class Connection
{

    #id 
    #url
    #socket
    #isOpen = false
    #callbacks = []

    constructor(data)
    {
        this.#id = uuidv4()
        this.#url = `${data.schema}://${data.ip}:${data.port}` 
        this.#socket = new WebSocket(this.#url)
        this.#registerSocket()
    }

    #registerSocket()
    {
        this.#socket.addEventListener('open', (event) => {
            if (this.#callbacks['OnOpen'])
            {
                this.#isOpen = true
                this.#callbacks['OnOpen']()
            }
        })

        this.#socket.addEventListener('message', (event) => {
            if (this.#callbacks['OnMessage'])
            {
                this.#callbacks['OnMessage'](event.data)
            }
        })

        this.#socket.addEventListener('close', (event) => {
            if (this.#callbacks['OnClose'])
            {
                this.#isOpen = false
                this.#callbacks['OnClose']()
            }
        })

        this.#socket.addEventListener('error', (error) => {
            if (this.#callbacks['OnError'])
            {
                this.#callbacks['OnError'](error)
            }
        })
    }

    IsOpen()
    {
        return this.#isOpen
    }

    Id()
    {
        return this.#id
    }

    OnOpen(callback)
    {
        this.#callbacks['OnOpen'] = callback
    }

    OnClose(callback)
    {
        this.#callbacks['OnClose'] = callback
    }

    OnError(callback)
    {
        this.#callbacks['OnError'] = callback
    }

    OnMessage(callback)
    {
        this.#callbacks['OnMessage'] = callback
    }

    Send(data)
    {
        this.#socket.send(JSON.stringify(data))
    }
}

const Connect = (data) => {
    return new Connection(data)
}

global.exports('Connect', Connect)