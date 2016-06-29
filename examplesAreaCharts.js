(function () {

    var areaChartData = [
            {"value3": 2.98, "value1": 3.07, "date": "20111212"},
            {"value3": 6, "value1": 8, "date": "20111213"},
            {"value3": 7, "value1": 1, "date": "20111214"},
            {"value3": 1, "value1": 3, "date": "20111215"},
            {"value3": 6, "value1": 5, "date": "20111216"},
            {"value3": 8, "value1": 10, "date": "20111217"}
        ],
        areaChartData2 = [
            {"value1": 7, "value3": 2, "date": "20111212"},
            {"value1": 6, "value3": 6, "date": "20111213"},
            {"value1": 5, "value3": 7, "date": "20111214"},
            {"value1": 1, "value3": 1, "date": "20111215"},
            {"value1": 2, "value3": 6, "date": "20111216"},
            {"value1": 1, "value3": 8, "date": "20111217"}
        ],
        simpleAreaChartOptions = {
            appendTo: '#timeAreaChartSimple',
            dimentions: {
                height: 400
            },
            chartBottomPadding: 0,
            colors: [
                "rgba(17, 180, 228, 0.3)",
                "rgba(102, 101, 107, 0.8)"
            ],
            xAxis: {
                showAxis: true,
                ticksCount: 12,
                dateFormat: '%Y%m%d',
                datePropName: 'date',
                showTicksText: true,
                tickFormat: '%B',
                showVerticalLines: true
            },
            margins: {bottom: 40, top: 55},
            yAxis: {
                showAxis: true,
                ticksCount: 10,
                showTicksInside: true,
                ticksLeftPadding: 10,
                showTicksText: true,
                showHorizontalLines: true,
                tickTopPadding: 7,
                ticksLeftPadding: 10,
                tickFormat: function (d) {
                    return d / 1000 + 'k';
                }
            },
            onHover: {
                showPoints: true,
                showTooltip: true,
                hoverLineWidth: 40,
                pointDiameter: 7,
                pointBorder: 2,
                pointMovementDuration: 100,
                tooltipTransitionsDuration: 500,
                labels: {
                    value3: "Administrative services",
                    value1: "Sirgical Supplies"
                },
                tooltipWidth: 200,
                tooltipDateFormat: '%d %b',
                borderWidth: 2,
                showHoveredLine: true,
                growthFormat: function (d) {
                    return d.toFixed(2);
                },
                valueFormat: function (d) {
                    return d.toFixed(2);
                }

            }
        },
        areaChartWithLegend = {
            appendTo: '#timeAreaChart',
            interpolate: 'cardinal',
            dimentions: {
                height: 200
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
    Charts.generateAreaChart(areaChartWithLegend, areaChartData2);


    function getChartsData() {
        var rtn = [],
            val;
        areaChartData.forEach(function (elem) {
            rtn.push($.extend({}, elem));

        });
        return rtn
    }

}());
