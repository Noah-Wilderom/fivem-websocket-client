
## Exports

Connecting to a websocket server
```lua
    local conn = exports['websocket-client']:Connect({
        schema = "ws",
        ip = "localhost",
        port = "3000"
    })
```

Send a message

```lua
    conn:Send({
        data = {
            message = "hello"
        }
    })
```

Websocket events
```lua
    conn:OnOpen(function()
        print("websocket client connection is open")
    end)

    conn:OnClose(function()
        print('websocket client connection is closed')
    end)

    conn:OnError(function(error)
        print('websocket client connection has error', #error)
    end)

    conn:OnMessage(function(data)
        print("websocket client message received", data)
    end)
```


