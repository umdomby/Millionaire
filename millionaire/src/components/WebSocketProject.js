import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {Button} from "react-bootstrap";

const WebSocketProject = () => {

    const {device} = useContext(Context)
    const [messages, setMessages] = useState('');
    const [messagesMongo, setMessagesMongo] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [hideConnect, setHideConnect] = useState(false);
    const [renderUsername, setRenderUsername] = useState('');


    const connect = () => {
        wsConnect(device.username)
        device.setClose(false)
        device.setConnected(true)
        setHideConnect(true)
        setInterval(() => socketTest(), 5000)
    }

    const close = () => {
        try {
            device.webSocket.send(JSON.stringify({
                method: 'close',
                id: '1',
                username: device.username,
            }))
            device.webSocket.close()
            device.setConnected(false)
            console.log('WebSocket close')
            setHideConnect(false)
            device.setClose(true)
        }catch (e) {
            console.log('close: ' + e)
        }
    }

    const wsConnect = (username) => {
        try {
            //Can make useRef, use in this project: MOBX
            device.setWebSocket(new WebSocket(process.env.REACT_APP_API_URL_WS))
            device.webSocket.onopen = () => {
                device.webSocket.send(JSON.stringify({
                    id: '1',
                    username: username,
                    method: "connection"
                }))
            }
            device.webSocket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                if(device.webSocket.readyState !== device.webSocket.CLOSED && device.webSocket.readyState !== device.webSocket.CLOSING) {
                    switch (msg.method) {
                        case "connection":
                            console.log(`пользователь ${msg.username} присоединился`)
                            break
                        case "online":
                            setOnlineUsers(msg.clientsNoRepeatUsers)
                            break
                        case "messages":
                            console.log(msg.messages)
                            setMessagesMongo(msg.messages)
                            // for (var i in msg.clientsNoRepeatUsers){
                            //     console.log(msg.clientsNoRepeatUsers[i])
                            // }
                            break
                        default:
                            console.log(msg)
                    }
                }
            }
        }catch (e) {
            console.log('WebSocket Error ' + e)
        }
    }

    const socketTest = () => {
        if (device.webSocket.readyState === device.webSocket.CLOSED || device.webSocket.readyState === device.webSocket.CLOSING) {
            if(device.username !== '' && device.connected === true) {
                wsConnect(device.username)
                console.log('WebSocket reconnected ' + device.username)
            }else{
                //console.log('WebSocket no connected')
            }
        } else {
            //console.log('WebSocket connected')
        }
    }

    const sendMessage = () => {
        device.webSocket.send(JSON.stringify({
            method: 'messages',
            id: '1',
            date: Date.now(),
            username: device.username,
            messages: messages,
        }))
        setMessages('')
    }

    return (
        <div>
            <div className='m-2'>
                <input type="text"
                   disabled={hideConnect}
                   style={{backgroundColor: 'transparent', textAlign: 'left', borderWidth: 1, width: 350,fontSize: 24}}
                   onChange={(e) => {
                       device.setUsername(e.target.value)
                       setRenderUsername(e.target.value)
                   }}
                   onKeyPress={event => {
                       if (event.key === "Enter") {
                           return connect()
                       }
                   }}
                />
                <Button disabled={hideConnect || renderUsername.length < 3} onClick={connect}>Connected</Button>
                <Button onClick={close} disabled={device.close}>Close</Button>
            </div>

            <input type="text" className="mb-5"
                style={{backgroundColor: 'transparent', textAlign: 'left', borderWidth: 1, width: 350,fontSize: 24}}
                value={messages}
                onChange={(event) => setMessages(event.target.value)}
                onKeyPress={event => {
                    if (event.key === "Enter") {
                       return sendMessage()
                    }
                }}
            />
            <Button onClick={sendMessage}>Отправить</Button>
            {device.connected ?
                <div>
                    <div>
                        {onlineUsers.map((online, index) =>
                            <div key={index}>
                                {'online user: ' + online}
                            </div>
                        )}
                        {'online pc: ' + onlineUsers.length}
                    </div>
                    <div>
                        {Object.keys(messagesMongo).map((item, index) => (
                            <div key={index}>
                                {'user: ' + messagesMongo[item].user + ' - ' + messagesMongo[item].messages}
                            </div>
                        ))}
                    </div>
                </div>
                :
                ''
            }
        </div>
    )
}

export default WebSocketProject
