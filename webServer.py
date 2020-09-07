import csv
import pandas
from os import listdir
from os.path import isfile, join
from flask import Flask, render_template, jsonify

app = Flask(__name__)

def get_latest_log():
    path = './data'
    fileList = [f for f in listdir(path) if isfile(join(path, f))]
    latest = f"log{len(fileList) - 1}.csv"
    return latest


@app.route('/')
def hello_world():
    return render_template('base.html')

@app.route('/_refresh_data/')
def _refresh_data():
    with open(f'./data/{get_latest_log()}', 'r') as f:
        reader = csv.reader(f)
        rows=list(reader)
        lastLine = rows[(len(rows) - 1)]
        return jsonify({
            "millis"    :   lastLine[0],
            "stamp"     :   lastLine[1],
            "datetime"  :   lastLine[2],
            "motion"    :   lastLine[3],
            "temp"      :   lastLine[4],
            "hum"       :   lastLine[5]
        })

@app.route('/_chart_data/')
def _chart_data():
    data = pandas.read_csv(f'./data/perMinute/{get_latest_log()}')
    stamps = data['stamp'].tolist()
    motions = data['motion'].tolist()
    motions = [int(i) for i in motions]
    temps = data['temp'].tolist()
    temps = [float(i) for i in temps]
    hums = data['hum'].tolist()
    hums = [float(i) for i in hums]
    output = []
    
    for index, val in enumerate(stamps):
        output.append({"stamp": val, "motions": motions[index], "temp": temps[index], "hum": hums[index]})

    return jsonify(output)
    



# leave at end of code \/
if __name__ == "__main__":
    app.run(debug='True', host='0.0.0.0', port=100)
# leave at end of code /\