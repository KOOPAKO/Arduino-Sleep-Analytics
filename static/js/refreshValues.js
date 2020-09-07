function refresh_values(){
    $.ajax({
        url: "/_refresh_data/",
        success: function(output){
            $("#millis").html(JSON.stringify(output["millis"]).split("\"").join(""));
            $("#stamp").html(JSON.stringify(output["stamp"]).split("\"").join(""));
            $("#datetime").html(JSON.stringify(output["datetime"]).split("\"").join(""));
            $("#motion").html(JSON.stringify(output["motion"]).split("\"").join(""));
            $('#temperature').html(JSON.stringify(output["temp"]).split("\"").join(""));
            $('#humidity').html(JSON.stringify(output["hum"]).split("\"").join(""));
            
            setTimeout(refresh_values, 1000)
        }
    })
}
refresh_values()