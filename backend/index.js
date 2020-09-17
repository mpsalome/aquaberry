import express from "express"
import winston from "winston"
import phRouter from "./routes/ph.js"
import router from "./routes/router.js"
import cors from "cors"


// Definindo logger
const { combine, timestamp, label, printf } = winston.format
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`
})
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console),
        new (winston.transports.File)({ filename: "aquaberry-server.log" }),

    ],
    format: combine(
        label({ label: "aquaberry-server" }),
        timestamp(),
        myFormat
    )
})

// Configurando Server 
const app = express()
app.use(express.json())
app.use(cors())
app.use("/ph", phRouter)
app.use("/", router)

app.listen(3010, async () => {
    try {
        logger.info("Servidor Iniciado")
    } catch (error) {
        logger.error(err);
    }
})