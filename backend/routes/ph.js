"use strict";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const Raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
const ADS1x15 = require('raspi-kit-ads1x15');


import express from "express"

const wsserver = require("ws").Server;
const wss = new wsserver({ port : 3013 });

const router = express.Router()


// Init Raspi
Raspi.init(() => {
    
    // Init Raspi-I2c
    const i2c = new I2C();
    
    // Init the ADC
    const adc = new ADS1x15({
        i2c,                                    // i2c interface
        chip: ADS1x15.chips.IC_ADS1015,         // chip model
        address: ADS1x15.address.ADDRESS_0x48,  // i2c address on the bus
        
        // Defaults for future readings
        pga: ADS1x15.pga.PGA_4_096V,            // power-gain-amplifier range
        sps: ADS1x15.spsADS1015.SPS_250         // data rate (samples per second)
    });
    
    // Get a single-ended reading from channel-0 and display the results
    adc.readChannel(ADS1x15.channel.CHANNEL_0, (err, value, volts) => {
        if (err) {
            console.error('Failed to fetch value from ADC', err);
            process.exit(1);
        } else {
            console.log('Channel 0');
            console.log(' * Value:', value);    // will be a 11 or 15 bit integer depending on chip
            console.log(' * Volts:', volts);    // voltage reading factoring in the PGA
            process.exit(0);
        }
    });
    
});


// Websocket 
wss.on("connection", function(ws) {
    ws.on("message", function(message) {
        console.log(message);
    }); 
    
    ws.on("close", function(client) {
        console.log("fechando conexão ph")
    });
});




export default router




