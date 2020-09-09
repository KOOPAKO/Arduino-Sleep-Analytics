$('.dropdown-trigger').dropdown();
$('.sidenav').sidenav();

$(document).on('change', '#chartToggle', function(){
    drawChart(activeChart, activeName)
});

function start_recording() {
    $.ajax({
        url: '/_start_recording',
        success: function(){
            drawChart();
            recording = 1;
            continuous = 1;    
            activeChart = "latest";
            activeName = "latest";
            $('.recording').css('display', 'block');
            $('.notRecording').css('display', 'none');
        }
    })
}

function stop_recording() {
    $.ajax({
        url: '/_stop_recording',
        success: function(){
            recording = 0;
            continuous = 0;   
            $('.recording').css('display', 'none');
            $('.notRecording').css('display', 'block');
        }
    })
}
