# import GPIO and datetime
import RPi.GPIO as GPIO
import datetime

# set GPIO numbering mode and define output pins
GPIO.setmode(GPIO.BOARD)
GPIO.setup(37,GPIO.OUT)
GPIO.setup(38,GPIO.OUT)
GPIO.setup(40,GPIO.OUT)

# Turn lights on and off based on the time
try:
    while True:
        now = datetime.datetime.now().time()
        if now.hour == 21 and now.minute == 5:
            GPIO.output(40,True)
        elif now.hour == 21 and now.minute == 6:
            GPIO.output(38,True)
        elif now.hour == 21 and now.minute == 7:
            GPIO.output(40,False)
            GPIO.output(38,False)
        
finally:
# cleanup the GPIO before finishing :)
    GPIO.cleanup()
    