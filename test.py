import csv
from datetime import datetime

filepath = './data/log4.csv'

def get_minute(timeValue):
    d = datetime.strptime(timeValue, '%Y/%m/%d %H:%M:%S')
    return d.strftime('%Y/%m/%d %H:%M')

with open(filepath, 'r') as f:
    rows = list(csv.reader(f))
    rows.pop(0)
    for row in rows:
        minute = get_minute(row[2])
        print(minute)
