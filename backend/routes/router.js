import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import express from 'express'
import ds18x20 from 'ds18x20'
const wsserver = require('ws').Server
const wss = new wsserver({ port: 3011 })
const gpio = require('onoff').Gpio
const sqlite3 = require('sqlite3').verbose()
const Raspi = require('raspi')
const I2C = require('raspi-i2c').I2C
const ADS1x15 = require('raspi-kit-ads1x15')
const sensor = ds18x20
const { spawn } = require('child_process')

const router = express.Router()

const relays = [
  new gpio(18, 'out'), // rele 1: aquecedor
  new gpio(24, 'out'), // rele 2: filtro de água
  new gpio(23, 'out'), // rele 3: fita de led
  new gpio(21, 'out'), // rele 4: cooler
]

const enumRelays = {
  AQUECEDOR: 0,
  AGUA: 1,
  LED: 2,
  COOLER: 3,
}

var phObj = { ph: 0 }

var modoManual = { temperatura: false, iluminacao: false }

var options = {
  MAX_TEMP: 0,
  MIN_TEMP: 0,
  IDEAL_TEMP: 0,
  ON_LUZ: 0,
  OFF_LUZ: 0,
  ALIMENTACAO: []
}
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
    logger.info(`GET /ph: ${JSON.stringify(phObj.ph.toString())}`)
  } catch (err) {
    logger.info(`Erro ao ler o ph: ${err}`)
    next(err)
  }
})

router.get('/statusReles', async (req, res, next) => {
  try {
    let status = statusReles()
    res.send(status)
    logger.info(`GET /statusReles: ${JSON.stringify(status)}`)
  } catch (err) {
    logger.info(`Erro ao ler status dos reles: ${err}`)
    next(err)
  }
})

router.get('/configTimer/:idsensor', async (req, res, next) => {
  let db = new sqlite3.Database('../../../aquaberry.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  })
  try {
    logger.info(`GET: /ConfigTimer`)
    db.all(`SELECT acao, hora FROM ConfigTimer WHERE idsensor = '${req.params.idsensor}'`, [], (err, rows) => {
      if(err) throw err
      res.send(JSON.stringify(rows));
    })
  } catch (error) {
    logger.info(`Erro na rota /ConfigTimer: ${error.message}`)
  }
  finally {
    db.close(() => {
      logger.info('Conexão com o banco fechada.')
    })
  }
})


router.get('/configTemp', async (req, res, next) => {
  let db = new sqlite3.Database('../../../aquaberry.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  })
  try {
    logger.info(`GET: /ConfigTemp`)
    db.all(`SELECT tempmin, tempideal, tempmax, idsensor FROM ConfigTemp'`, [], (err, rows) => {
      if(err) throw err
      res.send(JSON.stringify(rows));
    })
  } catch (error) {
    logger.info(`Erro na rota /ConfigTemp: ${error.message}`)
  }
  finally {
    db.close(() => {
      logger.info('Conexão com o banco fechada.')
    })
  }
})

router.post('/releOff', async (req, res, next) => {
  try {
    let rele = enumRelays[req.body.nome.toUpperCase()]
    desligarRele(rele)
    res.send('Rele desligado')
    logger.info(
      `POST /releOff: ${JSON.stringify(req.body.nome.toUpperCase())}`
    )
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
    logger.info(`POST /releOn: ${JSON.stringify(req.body.nome.toUpperCase())}`)
  } catch (err) {
    logger.info(`Erro ao ligar o relé: ${err}`)
    next(err)
  }
})

router.post('/tempManualOff', async (req, res, next) => {
  try {
    modoManual.temperatura = false
    res.send('Modo manual da temperatura desligado')
    logger.info(`POST: Modo manual da temperatura desligado`)
  } catch (err) {
    logger.info(`Erro ao desligar o modo manual: ${err}`)
    next(err)
  }
})

router.post('/tempManualOn', async (req, res, next) => {
  try {
    modoManual.temperatura = true
    res.send('Modo manual da temperatura ligado')
    logger.info(`POST: Modo manual da temperatura ligado`)
  } catch (err) {
    logger.info(`Erro ao ligar o modo manual: ${err}`)
    next(err)
  }
})

// Websocket
wss.on('connection', (ws) => {
  enviarInfo(ws)

  var timerTemp = setInterval(enviarInfo, 5000, ws)

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
const desligarRele = (rele) => {
  relays[rele].writeSync(1)
}

// Ligar relé especifico
const ligarRele = (rele) => {
  relays[rele].writeSync(0)
}

// Ligar Relé baseado na temperatura
const handleTemperatura = () => {
  if (modoManual.temperatura) {
  } else {
    let temp = sensor.get('28-3c01b5567b40')
    if (Number(temp) > options.MAX_TEMP) {
      if (relays[enumRelays.COOLER].readSync() == 1) {
        ligarRele(enumRelays.COOLER)
        logger.info('Ligando Cooler')
      }
    } else if (Number(temp) <= options.MAX_TEMP && Number(temp) >= options.MIN_TEMP) {
      if (
        relays[enumRelays.COOLER].readSync() == 0 ||
        relays[enumRelays.AQUECEDOR].readSync() == 0
      ) {
        logger.info(
          'Temperatura ideal atingida. Desligando aquecedor e/ou Cooler'
        )
        desligarRele(enumRelays.COOLER)
        desligarRele(enumRelays.AQUECEDOR)
      }
    } else if(Number(temp) < options.MIN_TEMP){ 
      desligarRele(enumRelays.COOLER)
      ligarRele(enumRelays.AQUECEDOR)
    } else if(Number(temp) >= options.MAX_TEMP){
      desligarRele(enumRelays.AQUECEDOR)
    }else {
      if (relays[enumRelays.AQUECEDOR].readSync() == 1) {
        ligarRele(enumRelays.AQUECEDOR)
        logger.info('Ligando aquecedor')
      }
    }
  }
}

//Status dos reles
const statusReles = () => {
  let status = {
    0: 'true',
    1: 'false',
  }
  let date = new Date()
  let hour = date.getHours()
  let minute = date.getMinutes().length === 1 ? `0${date.getMinutes()}` : date.getMinutes()
  let dateString = `${hour}:${minute}`
  let reles = {
    hora: dateString,
    aquecedor: status[relays[enumRelays.AQUECEDOR].readSync()],
    filtroagua: status[relays[enumRelays.AGUA].readSync()],
    cooler: status[relays[enumRelays.COOLER].readSync()],
    led: status[relays[enumRelays.LED].readSync()],
    manual: {
      temperatura: modoManual.temperatura,
      iluminacao: modoManual.iluminacao,
    }
  }
  return reles
}

//Ler infos do servidor
const enviarInfo = (socket) => {
  let status = {
    0: 'true',
    1: 'false',
  }
  let date = new Date()
  let hour = date.getHours()
  let minute = date.getMinutes().length === 1 ? `0${date.getMinutes()}` : date.getMinutes()
  let dateString = `${hour}:${minute}`
  let info = {
    hora: dateString,
    aquecedor: status[relays[enumRelays.AQUECEDOR].readSync()],
    filtroagua: status[relays[enumRelays.AGUA].readSync()],
    cooler: status[relays[enumRelays.COOLER].readSync()],
    led: status[relays[enumRelays.LED].readSync()],
    manual: {
      temperatura: modoManual.temperatura,
      iluminacao: modoManual.iluminacao,
    },
    temperatura: sensor.get('28-3c01b5567b40')
  }
  socket.send(JSON.stringify(info))
}

//ler ph do sensor
const lerPh = () => {
  try {
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
          console.log('Volts', volts)
          console.log('Value', value)
          phObj.ph = value
        }
      })
    })
  } catch (err) {
    console.error(`Falha ao tentar ler o pH: ${err}`)
  }
}

const handleIluminacao = () => {
  let date = new Date()
  let hour = Date.parse(`01/01/2011 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

  console.log(`Hora atual: ${hour}`)
  if (hour >= options.ON_LUZ && hour <= options.OFF_LUZ ) {
    ligarRele(enumRelays.LED)
    console.log(`Ligando LED`)
  } else {
    desligarRele(enumRelays.LED)
    console.log(`Desligando LED`)
  }
}

const handleAlimentacao = () => {
  let python = spawn('python', ['../servo.py'])
  python.stdout.on('data', function(data) { 
    console.log(data.toString()); 
  }) 
}

// ids dos sensores/atuadores: 
// Temperatura = 1
// Bomba = 2
// Aquecedor = 3
// Cooler = 4
// Led = 5
// Alimentador = 6 
// Modulo PH =  7

// 0 Liga e 1 desliga

// Função para setar as options
const setOptions = () => {
  let db = new sqlite3.Database('../../../aquaberry.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  })
  try {
   console.log(`Trazendo infos do banco`)
    db.all(`SELECT acao, hora, idsensor FROM ConfigTimer`, [], (err, rows) => {
     console.log(`Configurando timers`)
     console.log(rows)
      if(err) throw err
      rows.forEach(el => {
        if(el.idsensor === 5){
          if (el.acao === 0) {
            let hour = Date.parse(`01/01/2011 ${el.hora}`)
            options.ON_LUZ = hour
          } else {
            let hour = Date.parse(`01/01/2011 ${el.hora}`)
            options.OFF_LUZ = hour
          }
        }
        else if (el.idsensor === 6) {
          let hour = Date.parse(`01/01/2011 ${el.hora}`)
          options.ALIMENTACAO.push(hour)
        }
      });
    })
    db.all(`SELECT tempmin, tempideal, tempmax, idsensor FROM ConfigTemp`, [], (err, rows) => {
     console.log(`Configurando temperatura`)
     console.log(rows)
     console.log('idsensor: ', rows[0].idsensor)
      if(err) throw err
      if (rows[0].idsensor === 1) {
        options.MIN_TEMP = rows[0].tempmin
        options.IDEAL_TEMP = rows[0].tempideal
        options.MAX_TEMP = rows[0].tempmax
        console.log('Options')
        console.log(options)
      }
    })
  } catch (error) {
   console.log(`Erro no setOptions()`)
  }
  finally {
    db.close(() => {
      console.log('Conexão com o banco fechada.')
      console.log('handleIluminacao')
      handleIluminacao()
    })
  }
}

// Ligando todos os reles no start up.
allRelaysOn()

// Definindo o options 
setOptions()

// Desligando reles que deverão ser ligados programaticamente
desligarRele(enumRelays.AQUECEDOR)
desligarRele(enumRelays.LED)
desligarRele(enumRelays.COOLER)


// Verificar temperatura a cada 10 segundos e aquecer ou arrefecer caso seja necessário
setInterval(handleTemperatura, 10000)

// Verificar a cada meia hora o horário pra cuidar da iluminação do áquario 
setInterval(handleIluminacao, 1800000) 

// Verificar a cada meia hora o horário pra cuidar da alimentação do peixe 
setInterval(handleAlimentacao, 1800000) 

export default router
