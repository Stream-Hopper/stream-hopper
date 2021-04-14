# import GPIO and time
#!/usr/bin/python
import RPi.GPIO as GPIO
import time
import sys
#set GPIO numbering mode and define output pins
#Pin 21 is Port 1
#Pin 20 is Port 2
#Pin 26 is Port 3

GPIO.setmode(GPIO.BCM)
GPIO.setup(21,GPIO.OUT) 
GPIO.setup(20,GPIO.OUT) 
GPIO.setup(26,GPIO.OUT)

if len(sys.argv) != 3:
        raise ValueError('Please Provide a pin number to turn on/off')

port_number_arg = sys.argv[1]
state_arg = sys.argv[2]
pin_number = 0


if(port_number_arg == '1'):
        pin_number = 21
        
elif(port_number_arg == '2'):
        pin_number = 20

elif(port_number_arg == '3'):
        pin_number = 26

print(pin_number)
GPIO.output(pin_number,True if state_arg == '1'  else False)

#print(str(self.port_number))

