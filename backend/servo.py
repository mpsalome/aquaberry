from gpiozero import Servo
from time import sleep
import RPi.GPIO as GPIO

myGPIO=25
GPIO.setmode(GPIO.BCM)
GPIO.setup(myGPIO, GPIO.OUT)


motor = GPIO.PWM(myGPIO, 50)
motor.start(2.5)

for i in range(0,5):
    motor.ChangeDutyCycle(5)
    sleep(0.5)
    motor.ChangeDutyCycle(7.5)
    sleep(0.5)
    motor.ChangeDutyCycle(10)
    sleep(0.5)
    motor.ChangeDutyCycle(12.5)
    sleep(0.5)
    motor.ChangeDutyCycle(10)
    sleep(0.5)
    motor.ChangeDutyCycle(7.5)
    sleep(0.5)
    motor.ChangeDutyCycle(5)
    sleep(0.5)
    motor.ChangeDutyCycle(2.5)
    sleep(0.5)
