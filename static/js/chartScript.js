var activeChart = "latest";
var activeName = "latest"

google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);

function changeTimezone(date) {

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: 'EST'
    }));
  
    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime() - 90000000;
  
    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() + diff);
  
  }
function initiate_old(file, string){
    if(file == "latest"){
        activeChart = "latest";
        activeName = "latest"
        if(recording == 1){
            continuous = 1;
        } else {
            continuous = 0;
        }

    } else {
        continuous = 0;
        activeChart = file;
        activeName = string;
    }    
    drawChart(file, string);
}

function drawChart(file="latest", string="latest") {
    $('#chart-heading').html(string)
    $.ajax({
        url: '/_chart_data/',
        data: {"file": file},
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function(output){
            console.log(output)
            // Movements over time line chart
            var data = new google.visualization.DataTable();
            data.addColumn('datetime', 'Date/Time')
            data.addColumn('number', 'Motions')

            output.forEach(function (item, index) {
               var dateVar = changeTimezone(new Date(parseInt(item["stamp"]) * 1000));
                data.addRow([
                    dateVar, item["motions"]
                ])
            });
            var options = {
                'title': 'Figure 1: Recorded Movements Per Minute',
                hAxis: {
                    title: 'Time'
                  },
                  vAxis: {
                    title: 'Number of Movements'
                  }
            };
            var motionTimeChart = new google.visualization.LineChart(document.getElementById('motionTimeChart'));
            motionTimeChart.draw(data, options);
            if (!($('#chartToggle').prop('checked'))){
                // Motion vs Room Temperature Scatter chart
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'temps')
                data.addColumn('number', 'motions')
                output.forEach(function (item, index) {
                    data.addRow([
                        item["temp"], item["motions"]
                    ])
                });
                var options = {
                    'title': 'Figure 2: Relationship between Motion and Room Temperature',
                    hAxis: {
                        title: 'Temp ℃'
                    },
                    vAxis: {
                        title: 'Number of Movements'
                    }
                };
                var motionTempChart = new google.visualization.ScatterChart(document.getElementById('motionTempChart'));
                motionTempChart.draw(data, options);
                // Motion vs Room Humidity Chart
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'hums')
                data.addColumn('number', 'motions')
                output.forEach(function (item, index) {
                    data.addRow([
                        item["hum"], item["motions"]
                    ])
                });
                var options = {
                    'title': 'Figure 3: Relationship between Motion and Room Humidity',
                    hAxis: {
                        title: 'Humidity %'
                    },
                    vAxis: {
                        title: 'Number of Movements'
                    }
                };
                var motionHumChart = new google.visualization.ScatterChart(document.getElementById('motionHumChart'));
                motionHumChart.draw(data, options);
                // Motion vs Lux Chart
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'hums')
                data.addColumn('number', 'lux')
                output.forEach(function (item, index) {
                    data.addRow([
                        item["lux"], item["motions"]
                    ])
                });
                var options = {
                    'title': 'Figure 4: Relationship between Motion and Lux',
                    hAxis: {
                        title: 'Lux lx'
                    },
                    vAxis: {
                        title: 'Number of Movements'
                    }
                };
                var motionHumChart = new google.visualization.ScatterChart(document.getElementById('motionLuxChart'));
                motionHumChart.draw(data, options);
                // Motion vs Vol Chart
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'hums')
                data.addColumn('number', 'vol')
                output.forEach(function (item, index) {
                    data.addRow([
                        item["vol"], item["motions"]
                    ])
                });
                var options = {
                    'title': 'Figure 5: Relationship between Motion and Sound Level',
                    hAxis: {
                        title: 'Sound Level'
                    },
                    vAxis: {
                        title: 'Number of Movements'
                    }
                };
                var motionHumChart = new google.visualization.ScatterChart(document.getElementById('motionVolChart'));
                motionHumChart.draw(data, options);
            } else if($('#chartToggle').prop('checked')){
                // Room temp over time chart
                var data = new google.visualization.DataTable();
                data.addColumn('datetime', 'Date/Time')
                data.addColumn('number', 'temps')
                output.forEach(function (item, index) {
                    var dateVar = changeTimezone(new Date(parseInt(item["stamp"]) * 1000));
                    data.addRow([
                        dateVar, item["temp"]
                    ])
                });
                var options = {
                    'title': 'Figure 2: Temperature over Time',
                    hAxis: {
                        title: 'Time'
                    },
                    vAxis: {
                        title: 'Temp ℃'
                    }
                };
                var motionTempChart = new google.visualization.LineChart(document.getElementById('motionTempChart'));
                motionTempChart.draw(data, options);
                // Hum over time chart
                var data = new google.visualization.DataTable();
                data.addColumn('datetime', 'Date/Time')
                data.addColumn('number', 'hums')
                output.forEach(function (item, index) {
                    var dateVar = changeTimezone(new Date(parseInt(item["stamp"]) * 1000));
                    data.addRow([
                        dateVar, item["hum"]
                    ])
                });
                var options = {
                    'title': 'Figure 3: Humidity over Time',
                    hAxis: {
                        title: 'Time'
                    },
                    vAxis: {
                        title: 'Humidity %'
                    }
                };
                var motionHumChart = new google.visualization.LineChart(document.getElementById('motionHumChart'));
                motionHumChart.draw(data, options);
                // Lux over time chart
                var data = new google.visualization.DataTable();
                data.addColumn('datetime', 'Date/Time')
                data.addColumn('number', 'lux')
                output.forEach(function (item, index) {
                    var dateVar = changeTimezone(new Date(parseInt(item["stamp"]) * 1000));
                    data.addRow([
                        dateVar, item["lux"]
                    ])
                });
                var options = {
                    'title': 'Figure 4: Lux over Time',
                    hAxis: {
                        title: 'Time'
                    },
                    vAxis: {
                        title: 'Lux lx'
                    }
                };
                var motionHumChart = new google.visualization.LineChart(document.getElementById('motionLuxChart'));
                motionHumChart.draw(data, options);
                // Vol over time chart
                var data = new google.visualization.DataTable();
                data.addColumn('datetime', 'Date/Time')
                data.addColumn('number', 'vol')
                output.forEach(function (item, index) {
                    var dateVar = changeTimezone(new Date(parseInt(item["stamp"]) * 1000));
                    data.addRow([
                        dateVar, item["vol"]
                    ])
                });
                var options = {
                    'title': 'Figure 5: Sound Level over Time',
                    hAxis: {
                        title: 'Time'
                    },
                    vAxis: {
                        title: 'Sound Level'
                    }
                };
                var motionHumChart = new google.visualization.LineChart(document.getElementById('motionVolChart'));
                motionHumChart.draw(data, options);
                
            }
        }
    })
    if(recording == 1 && continuous == 1){
        setTimeout(drawChart, 1000)
    }
}
