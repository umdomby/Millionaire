require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss()
const wsLobby = require('./webSocket/lobby')
wsLobby.intervalLobby(aWss)


const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json({ extended: true }))


const start = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
            .then(() => console.log("Successfully connect to MongoDB."))
            .catch(err => console.error("Connection error", err));

        app.ws('/ws/lobby', (ws, req) => {
            ws.on('message', (msg) => {
                msg = JSON.parse(msg)
                wsLobby.webSocketFunction(msg, aWss, ws)
            })
        })

        app.listen(PORT,  () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e + " index")
    }
}
start()
