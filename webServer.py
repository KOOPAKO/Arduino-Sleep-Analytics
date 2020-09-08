import csv, pandas, json
from os import listdir
from os.path import isfile, join
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

def get_latest_log():
    path = './data'
    fileList = [f for f in listdir(path) if isfile(join(path, f))]
    latest = f"log{len(fileList) - 1}.csv"
    return latest

def get_file_list():
    path = './data/perMinute'
    files = [f for f in listdir(path) if isfile(join(path, f))]
    fileList = []
    for i in files:
        with open(f"./data/{i}", 'r') as f:
            reader = csv.reader(f)
            rows=list(reader)
            try:
                filedt = rows[1][2]
                fileList.append({"string":f"{filedt} ({i})", "file":i})
            except:
                continue
    return fileList

@app.route('/')
def index():
    recording = json.load(open('./capture.json'))
    fileList = get_file_list()
    return render_template('base.html', recording=recording, fileList=fileList)

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

@app.route('/_chart_data/', methods=["POST"])
def _chart_data():
    dataPosted = (request.form).to_dict(flat=False)
    if dataPosted["file"][0] == "latest":
        chartFile = f'./data/perMinute/{get_latest_log()}'
    else:
        chartFile = f'./data/perMinute/{dataPosted["file"][0]}'
    data = pandas.read_csv(chartFile)
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

@app.route('/_start_recording/')
def _start_recording():
    json.dump(1, open('./capture.json', 'w'))
    return "Success"

@app.route('/_stop_recording')
def _stop_recording():
    json.dump(0, open('./capture.json', 'w'))
    return "Success"
    



# leave at end of code \/
if __name__ == "__main__":
    app.run(debug='True', host='0.0.0.0', port=5000)
# leave at end of code /\
