local function printTable(table, indent)
    indent = indent or 0

    if type(table) ~= "table" then
        print(tostring(table))
        return
    end

    for key, value in pairs(table) do
        local formatting = string.rep("  ", indent) .. key .. ": "

        if type(value) == "table" then
            print(formatting)
            printTable(value, indent + 1)
        else
            print(formatting .. tostring(value))
        end
    end
end

function TestWebsockets()
    local id = exports['websocket-client']:Connect({
        schema = "ws",
        ip = "localhost",
        port = "3000"
    })

    print(id)

    exports['websocket-client']:OnOpen(id, function()
        print("websocket client connection is open")
    end)

    exports['websocket-client']:OnClose(id, function()
        print('websocket client connection is closed')
    end)

    exports['websocket-client']:OnError(id, function(error)
        print('websocket client connection has error', #error)
        printTable(error)
    end)

    exports['websocket-client']:OnMessage(id, function(data)
        print("websocket client message received", data)
        printTable(data)
    end)
end

RegisterCommand("sendws", function(source, args, rawCommand)
    exports['websocket-client']:Send(args[1], {
        data = {
            message = "hello"
        }
    })
end, false)

AddEventHandler('onResourceStart', function(resourceName)
    TestWebsockets()
end)
