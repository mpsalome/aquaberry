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
    new gpio(15, 'out'), // rele 1
    new gpio(14, 'out'), // rele 2
    new gpio(18, 'out')  // rele 3
  ]



// Carregando o sensor de temperatura 
try {
    sensor.loadDriver()
    console.log('Driver carregado com sucesso!')
    logger.info(`Driver carregado com sucesso!`)
} catch (err) {
    console.log('Erro ao carregar o driver:', err)
    logger.info(`Erro ao carregar o driver: ${err}`)
}

// Rotas
router.get("/temperatura", async (req, res, next) => {
    try {
        let data = sensor.get('28-3c01b5567b40')
        console.log(`Leitura de temperatura requisitada pela rota: ${data}`)
        res.send(data.toString())
        logger.info(`GET /temperatura: ${data.toString()}`)
    } catch (err) {
        logger.info(`Erro ao pegar a temperatura: ${err}`)
        next(err)
    }
})

// Websocket 
wss.on("connection", ws => {
    var timer = setInterval(lerTemperatura, 1000, ws)  
    
    ws.on("message", message => {
        console.log(message)
    }) 
    
    ws.on("close", () => {
        clearInterval(timer)
    })
})

// Funções

// Função pra desligart todos os rele 
const allRelaysOff = () => {
    relays.forEach((relay, index) => {
        console.log(`Status do rele ${index+1}`)
        console.log(`Desligando o rele ${index+1}`)
        relay.writeSync(1)
    })
 }

// Ligar Relé baseado na temperatura
const handleTemperatura = temp => {
    if (Number(temp) > 24) {
        if (relays[0].readSync() == 1) {
            relays[0].writeSync(0)
            logger.info("Ligando Cooler")
        } 
    } else if (Number(temp) < 24 && Number(temp) > 17) {
        if (relays[0].readSync() == 0 || relays[1].readSync() == 0 ) {
            logger.info("Temperatura ideal atingida. Desligando aquecedor e/ou Cooler")
            relays[0].writeSync(1)
            relays[1].writeSync(1)
        }
    } else {
        if (relays[1].readSync() == 1) {
            relays[0].writeSync(0)
            logger.info("Ligando aquecedor")
        } 
    }
}

//Ler temperatura do sensor
const lerTemperatura = socket => {
    let temp = sensor.get('28-3c01b5567b40')
    socket.send(temp)
    handleTemperatura(temp)
}

// Desligando todos os reles no start up.
allRelaysOff()

export default router
