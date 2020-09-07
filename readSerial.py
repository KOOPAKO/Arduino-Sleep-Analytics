import serial, time, csv, os, os.path
from datetime import datetime

serComPort = 'COM3' # '/dev/ttyACM0' on Raspberry Pi
serComBaud = 9600

cmdSerial = serial.Serial(serComPort, serComBaud)
time.sleep(2) # wait 2 seconds for COM port connection to open

headers = ['millis', 'stamp', 'datetime', 'motion', 'temp', 'hum']
perMinuteHeaders = ['stamp', 'motion', 'temp', 'hum']

DIR = "./data"
logNumber = len([name for name in os.listdir(DIR) if os.path.isfile(os.path.join(DIR, name))])

# initialise log files
with open(f"./data/log{logNumber}.csv", "a", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(headers)

with open(f"./data/perMinute/log{logNumber}.csv", "a", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(perMinuteHeaders)

# validation functions
def is_integer(num):
    try:
        int(num)
    except ValueError:
        return False
    return True

def is_decimal(dec):
    try:
        float(dec)
    except ValueError:
        return False
    return True

def is_time(val):
    try:
        datetime.strptime(val, '%Y/%m/%d %H:%M:%S')
    except ValueError:
        return False
    return True

def is_unique(row):
    with open(f"./data/log{logNumber}.csv", "r") as f:
        rows = list(csv.reader(f))
        lastLine = rows[(len(rows) - 1)]
        if row[0] != lastLine[0]:
            return True
        else:
            return False

def is_motion(val):
    if val == "Active" or val == "Inactive":
        return True
    else:
        return False

def validate_row(row):
    if len(row) == 6: # ensure all fields are present
        if is_integer(row[0]) and is_integer(row[1]): # ensure millis and stamp are integers
            if is_decimal(row[4]) and is_decimal(row[5]): # ensure temp and hum are decimals
                if is_time(row[2]): # ensure datetime in correct format
                    if is_motion(row[3]): #ensure motion is in correct format
                        if is_unique(row): # ensure that it is not a duplicate entry
                            return True
    return False

def is_end_of_minute(val):
    testList = val.split(':')
    if testList[2] == '0':
        return True
    else:
        return False

def generate_minute_row():
    with open(f'./data/log{logNumber}.csv', 'r') as f:
        reader = csv.reader(f)
        rows=list(reader)
        lastLine = rows[(len(rows) - 1)]
    stamp = lastLine[1]

    total = 0
    for item in tempList:
        total += float(item) 
    avgTemp = round(total / len(tempList), 2)

    total = 0
    for item in humList:
        total += float(item)
    avgHum = round(total / len(humList), 2)
    minuteRow = [stamp, countMotion, avgTemp, avgHum]
    return minuteRow

countMotion = 0
tempList = []
humList = []

while True:
    line = cmdSerial.readline().decode("utf-8").replace('\r\n', '')
    if line.count(', ') == 5: # ensure line is a complete list of data (sometimes this is not the case and would lead to invalid rows)
        myList = line.split(", ")
        if validate_row(myList): # ensure data is valid before appending
            if is_end_of_minute(myList[2]):
                minuteList = generate_minute_row()
                with open(f"./data/perMinute/log{logNumber}.csv", "a", newline="") as f:
                    writer = csv.writer(f)
                    writer.writerow(minuteList)
                    # reset vars
                    countMotion = 0
                    tempList = []
                    humList = []
            if myList[3] == 'Active':
                countMotion += 1
            tempList.append(myList[4])
            humList.append(myList[5])

            with open(f"./data/log{logNumber}.csv", "a", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(myList)


