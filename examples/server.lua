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
    local conn = exports['websocket-client']:Connect({
        schema = "ws",
        ip = "localhost",
        port = "3000"
    })

    conn.OnOpen(function() 
        print("websocket client connection is open")
    end)

    conn.OnClose(function()
        print('websocket client connection is closed')
    end)

    conn.OnError(function (err)
        print('websocket client error', err)
    end)

    conn.OnMessage(function(data)
        print('websocket client recv message', data)
    end)

    conn.Send({
        data = {
            message = "hello"
        }
    })

end

-- RegisterCommand("sendws", function(source, args, rawCommand)
--     exports['websocket-client']:Send(args[1], {
--         data = {
--             message = "hello"
--         }
--     })
-- end, false)

AddEventHandler('onResourceStart', function(resourceName)
    TestWebsockets()
end)
