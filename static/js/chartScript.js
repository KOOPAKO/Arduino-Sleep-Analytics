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
    continuous = 0;
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
        }
    })
    if(recording == 1 && continuous == 1){
        setTimeout(drawChart, 1000)
    }
}
