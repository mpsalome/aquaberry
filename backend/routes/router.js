import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from "express"
import ds18x20 from "ds18x20"
const wsserver = require("ws").Server
const wss = new wsserver({ port : 3011 })
const gpio = require('onoff').Gpio

const sensor = ds18x20

const router = express.Router()

const relays = [
    new gpio(14, 'out'), // rele 2
    new gpio(15, 'out'), // rele 1
    new gpio(18, 'out')  // rele 3
  ]

// Função pra desligart todos os rele 
const allRelaysOff = () => {
    console.log("desligando reles")
    relays.forEach(relay => {
        relay.readSync()
        console.log("desligando esse rele")
        relay.writeSync(1)
        relay.readSync()
    })
 }

// Carregando o sensor
try {
    sensor.loadDriver()
    console.log('driver is loaded')
} catch (err) {
    console.log('something went wrong loading the driver:', err)
}


// Checando se o sensor está conectado 
var isLoaded = sensor.isDriverLoaded()
console.log('isLoaded')
console.log(isLoaded)

// Lista de Sensores conectados
var listOfDeviceIds = sensor.list()
console.log('listOfDeviceIds')
console.log(listOfDeviceIds)


// Rotas
router.get("/", async (req, res, next) => {
    try {
        const data = sensor.get('28-3c01b5567b40')
        console.log(data)
        res.send(data.toString())
        logger.info(`GET /temperatura`)
    } catch (err) {
        next(err)
    }
})

// Websocket 
wss.on("connection", function(ws) {
    var timer = setInterval(lerTemperatura, 1000, ws)  
    
    ws.on("message", function(message) {
        console.log(message)
    }) 
    
    ws.on("close", function(client) {
        clearInterval(timer)
    })
})

const lerTemperatura = socket => {
    let temp = sensor.get('28-3c01b5567b40')
    socket.send(temp)
    handleTemperatura(temp)
}

// Ligar Relé baseado na temperatura
const handleTemperatura = temp => {
    if (Number(temp) > 24) {
        if (relays[0].readSync() == 1) {
            relays[0].writeSync(0)
            logger.info("ligando Cooler")
        } 
    } else if (Number(temp) < 24 && Number(temp) < 24) {
        if (relays[0].readSync() == 0 || relays[1].readSync() == 0 ) {
            relays[0].writeSync(1)
            relays[1].writeSync(1)
        }
    } else {
        if (relays[1].readSync() == 1) {
            relays[0].writeSync(0)
            logger.info("ligando aquecedor")
        } 
    }
}

// Desligando todos os reles no start up.
allRelaysOff()

export default router
