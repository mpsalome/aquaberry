from gpiozero import Servo
from time import sleep
 
myGPIO=25

servo = Servo(myGPIO)
print("Rassberry Pi Servo"); 
while True:
    print("max")
    servo.max()
    sleep(5)
    print("min")
    servo.min()
   
    sleep(5)