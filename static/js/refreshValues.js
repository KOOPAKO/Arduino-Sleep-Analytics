function refresh_values(){
    if(recording == 1){
        $.ajax({
            url: "/_refresh_data/",
            success: function(output){
                $("#millis").html(JSON.stringify(output["millis"]).split("\"").join(""));
                $("#stamp").html(JSON.stringify(output["stamp"]).split("\"").join(""));
                $("#datetime").html(JSON.stringify(output["datetime"]).split("\"").join(""));
                $("#motion").html(JSON.stringify(output["motion"]).split("\"").join(""));
                $('#temperature').html(JSON.stringify(output["temp"]).split("\"").join(""));
                $('#humidity').html(JSON.stringify(output["hum"]).split("\"").join(""));
                $('#lightlevel').html(JSON.stringify(output["lux"]).split("\"").join(""));
                $('#soundlevel').html(JSON.stringify(output["vol"]).split("\"").join(""));
            }
        })
    }
    setTimeout(refresh_values, 1000)
}
refresh_values()
