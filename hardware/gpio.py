#import GPIO and time and sys
#To use for example type: 'python gpio.py 1 1'
#The above command runs the gpio.py and turns on port 1 with the state of 1
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
        raise ValueError('Please Provide a port number: 1 or 2 or 3 as well as state number: 1 or 0 to turn on/off')

port_number_arg = sys.argv[1]
state_arg = sys.argv[2]
pin_number = 0
state = True


if(port_number_arg == '1'):
        pin_number = 21
        
elif(port_number_arg == '2'):
        pin_number = 20

elif(port_number_arg == '3'):
        pin_number = 26
else:
        raise ValueError("Invalid Port Number")

if(state_arg == '1'):
        state = True
elif(state_arg == '0'):
        state = False
else:
        raise ValueError("Invalid State Number")
        

GPIO.output(pin_number,state)

if(state_arg == '1'):
        print("Port " + port_number_arg + " is On")
        
elif(state_arg == '0'):
        print("Port " + port_number_arg + " is Off")

