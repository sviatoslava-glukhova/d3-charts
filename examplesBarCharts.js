(function () {

    var barChartData = [
            {"value1": 1, "value2": 4, "value3": 2, "date": "20111212"},
            {"value1": 2, "value2": 2, "value3": 6, "date": "20111213"},
            {"value1": 4, "value2": 9, "value3": 7, "date": "20111214"},
            {"value1": 5, "value2": 0, "value3": 1, "date": "20111215"},
            {"value1": 3, "value2": 5, "value3": 6, "date": "20111216"},
            {"value1": 1, "value2": 4, "value3": 8, "date": "20111217"}
        ],
        barChartOptions = {
            appendTo: '#aa',
            colors: [
                "#11b4e4",
                "#66656B",
                "#00C4B3"
            ],
            dateFormat: '%Y%m%d',
            margins: {top: 20, right: 80, bottom: 30, left: 50},
            strokeWidth: 2,
            legend: {
                show: false
            },
            xAxis: {
                showVerticalLines: true,
                showTicksText: false
            },
            yAxis: {
                ticksCount: 0
            }
        };

    Charts.generateSimpleBarChart(barChartOptions, barChartData);

}());
