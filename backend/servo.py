from gpiozero import Servo
from time import sleep
 
myGPIO=25

servo = Servo(myGPIO)
print("Raspberry Pi Servo");
sleep(10)
for i in range(0,4):
    print("max")
    servo.max()
    sleep(2)
    print("min")
    servo.min()
    sleep(2)
print("Peixe alimentado");