
## Exports

Connecting to a websocket server
```lua
    local id = exports['websocket-client']:Connect({
        schema = "ws",
        ip = "localhost",
        port = "3000"
    })
```

Send a message

```lua
    exports['websocket-client']:Send(connectionId, {
        data = {
            message = "hello"
        }
    })
```

Websocket events
```lua
    exports['websocket-client']:OnOpen(connectionId, function()
        print("websocket client connection is open")
    end)

    exports['websocket-client']:OnClose(connectionId, function()
        print('websocket client connection is closed')
    end)

    exports['websocket-client']:OnError(connectionId, function(error)
        print('websocket client connection has error', #error)
    end)

    exports['websocket-client']:OnMessage(connectionId, function(data)
        print("websocket client message received", data)
    end)
```


