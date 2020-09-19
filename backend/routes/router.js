import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import ds18x20 from 'ds18x20'
const wsserver = require('ws').Server
const wss = new wsserver({ port: 3011 })
const gpio = require('onoff').Gpio

const Raspi = require('raspi')
const I2C = require('raspi-i2c').I2C
const ADS1x15 = require('raspi-kit-ads1x15')

const sensor = ds18x20

const router = express.Router()

const relays = [
  new gpio(18, 'out'), // rele 1: aquecedor 
  new gpio(23, 'out'), // rele 2: filtro de água
  new gpio(24, 'out'), // rele 3: fita de led
  new gpio(21, 'out'), // rele 4: cooler
]

const enumRelays = {
  AQUECEDOR: 0,
  AGUA: 1,
  COOLER: 2,
  LED: 3,
}


var phObj = { ph: 0 }

// Rotas
router.get('/temperatura', async (req, res, next) => {
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

router.get('/ph', async (req, res, next) => {
  try {
    lerPh()
    console.log(`Leitura de pH requisitada pela rota: ${phObj.ph}`)
    res.send(phObj.ph.toString())
    logger.info(`GET /ph: ${phObj.ph.toString()}`)
  } catch (err) {
    logger.info(`Erro ao ler o ph: ${err}`)
    next(err)
  }
})

router.post('/releOff', async (req, res, next) => {
  try {
    let rele = enumRelays[req.body.nome.toUpperCase()]
    desligarRele(rele)
    res.send('Rele desligado')
    logger.info(`POST /releOff: ${req.body.nome.toUpperCase()}`)
  } catch (err) {
    logger.info(`Erro ao desligar o relé: ${err}`)
    next(err)
  }
})

router.post('/releOn', async (req, res, next) => {
  try {
    let rele = enumRelays[req.body.nome.toUpperCase()]
    ligarRele(rele)
    res.send('Rele ligado')
    logger.info(`POST /releOn: ${req.body.nome.toUpperCase()}`)
  } catch (err) {
    logger.info(`Erro ao ligar o relé: ${err}`)
    next(err)
  }
})



// Websocket
wss.on('connection', (ws) => {
  var timerTemp = setInterval(lerTemperatura, 1000, ws)
  ws.on('message', (message) => {
    console.log(message)
  })

  ws.on('close', () => {
    clearInterval(timerTemp)
  })
})

// Funções

// 0 Liga e 1 desliga

// Função pra ligar todos os rele
const allRelaysOn = () => {
  console.log('Ligando todos os relés')
  relays.forEach((relay) => {
    relay.writeSync(0)
  })
}

// Função pra desligar todos os rele
const allRelaysOff = () => {
  console.log('Desligando todos os relés')
  relays.forEach((relay) => {
    relay.writeSync(1)
  })
}

// Desligar relé especifico
const desligarRele = rele => {
  relays[rele].writeSync(1)
}

// Ligar relé especifico
const ligarRele = rele => {
  relays[rele].writeSync(0)
}

// Ligar Relé baseado na temperatura
const handleTemperatura = () => {
  let temp = sensor.get('28-3c01b5567b40')
  if (Number(temp) > 24) {
    if (relays[enumRelays.COOLER].readSync() == 1) {
      ligarRele(enumRelays.COOLER)
      logger.info('Ligando Cooler')
    }
  } else if (Number(temp) < 24 && Number(temp) > 17) {
    if (relays[enumRelays.COOLER].readSync() == 0 || relays[enumRelays.AQUECEDOR].readSync() == 0) {
      logger.info(
        'Temperatura ideal atingida. Desligando aquecedor e/ou Cooler'
      )
      relays[enumRelays.COOLER].writeSync(1)
      relays[enumRelays.AQUECEDOR].writeSync(1)
    }
  } else {
    if (relays[enumRelays.AQUECEDOR].readSync() == 1) {
      ligarRele(enumRelays.AQUECEDOR)
      logger.info('Ligando aquecedor')
    }
  }
}

//Ler temperatura do sensor
const lerTemperatura = (socket) => {
  let temp = sensor.get('28-3c01b5567b40')
  socket.send(JSON.stringify({ tipo: 'temperatura', valor: temp }))
}

//ler ph do sensor
const lerPh = () => {
  try{ 
    Raspi.init(() => {
    const i2c = new I2C()

    const adc = new ADS1x15({
      i2c, // i2c interface
      chip: ADS1x15.chips.IC_ADS1015, // chip model
      address: ADS1x15.address.ADDRESS_0x48, // i2c address on the bus

      // Defaults for future readings
      pga: ADS1x15.pga.PGA_4_096V, // power-gain-amplifier range
      sps: ADS1x15.spsADS1015.SPS_250, // data rate (samples per second)
    })

      adc.readChannel(ADS1x15.channel.CHANNEL_0, (err, value, volts) => {
        phObj.ph = 1
        if (err) {
          console.error(`Falha ao tentar ler o pH: ${err}`)
          process.exit(1)
        } else {
            console.log("Volts", volts)
            console.log("Value", value)
            phObj.ph = value
        }
      })

  })
  } catch (err){
      console.error(`Falha ao tentar ler o pH: ${err}`)
  }

}

// Ligando todos os reles no start up.
allRelaysOn()

// Desligando todos os reles 1 por 1
desligarRele(enumRelays.AGUA)
desligarRele(enumRelays.AQUECEDOR)
desligarRele(enumRelays.LED)
desligarRele(enumRelays.COOLER)

// Verificar temperatura a cada 1 segundo e aquecer ou arrefecer caso seja necessário
// setInterval(handleTemperatura, 1000)

export default router
