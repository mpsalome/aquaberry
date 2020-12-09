import sys
import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
canal = AnalogIn(ads, ADS.P0)
buf = list()

for i in range(10):
    buf.append(canal.voltage)
buf.sort()
buf = buf[2:-2]
avg = (sum(map(float, buf)) / 6)
ph = ((-5.79411) * avg) + 23.09733

print(round(ph, 2))
