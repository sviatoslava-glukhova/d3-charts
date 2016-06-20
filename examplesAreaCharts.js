(function () {

    var areaChartData = [
            { "value3": 2, "date": "20111212"},
            { "value3": 6, "date": "20111213"},
            { "value3": 7, "date": "20111214"},
            { "value3": 1, "date": "20111215"},
            { "value3": 6, "date": "20111216"},
            { "value3": 8, "date": "20111217"}
        ],
        simpleAreaChartOptions = {
            appendTo: '#timeAreaChartSimple',
            dimentions: {
                height: 200,
            },
            strokeColors: [
                "#11b4e4",
                "#66656B",
                "#00C4B3"
            ],
            colors: [
                "#d9f1f2"
            ],
            dateFormat: '%Y%m%d',
            strokeWidth: 0,
        },
        areaChartWithLegend = {
            appendTo: '#timeAreaChart',
            interpolate: 'cardinal',
            dimentions: {
                height: 200,
            },
            colors: [
                "rgba(17, 180, 228, 0.3)",
                "rgba(102, 101, 107, 0.3)",
                "rgba(0, 196, 179, 0.3)"
            ],
            dateFormat: '%Y%m%d',
            strokeWidth: 2,
            legend: {
                show: true,
                appendTo: '#timeAreaChartLegend',
                keysAliases: {
                    value1: 'Cats',
                    value2: 'Dogs',
                    value3: 'Pigs'
                }
            },
            xAxis: {
                showVerticalLines: true,
                showTicksText: false
            },
            yAxis: {
                ticksCount: 0
            }
        };

    Charts.generateAreaChart(simpleAreaChartOptions, getChartsData());
    Charts.generateAreaChart(areaChartWithLegend, getChartsData());


    function getChartsData() {
        var rtn = [],
            val;
        areaChartData.forEach(function (elem) {
            rtn.push($.extend({}, elem));

        });
        return rtn
    }

}());
