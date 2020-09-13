import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import express from "express"
import ds18x20 from "ds18x20";
const wsserver = require("ws").Server;
const wss = new wsserver({ port : 3011 });

const sensor = ds18x20

const router = express.Router()

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
        const data = sensor.get('28-3c01b5567b40');
        console.log(data)
        res.send(data.toString())
        logger.info(`GET /temperatura`)
    } catch (err) {
        next(err)
    }
})

// Websocket 
wss.on("connection", function(ws) {
    var timer = setInterval(enviarTemperatura, 1000, ws);  
    
    ws.on("message", function(message) {
        console.log(message);
    }); 
    
    ws.on("close", function(client) {
        clearInterval(timer);
    });
});

function enviarTemperatura(socket) {
    let temp = sensor.get('28-3c01b5567b40');
    socket.send(temp);
}


export default router
