# import GPIO and time
import RPi.GPIO as GPIO
import time

# set GPIO numbering mode and define output pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(20,GPIO.OUT)
GPIO.setup(26,GPIO.OUT)
GPIO.setup(21,GPIO.OUT)

# cycle those relays
try:
    while True:
        GPIO.output(21,True)
        time.sleep(1)
        GPIO.output(21,False)
        GPIO.output(20,True)
        time.sleep(1)
        GPIO.output(20,False)
        GPIO.output(26,True)
        time.sleep(1)
        GPIO.output(26,False)

finally:
# cleanup the GPIO before finishing :)
    GPIO.cleanup()
    
