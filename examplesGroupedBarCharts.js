(function () {

    var lineChartData = [
            {"value1": 1, "value2": 4, "date": "012014"},
            {"value1": 2, "value2": 2, "date": "022014"},
            {"value1": 4, "value2": 9, "date": "032014"},
            {"value1": 5, "value2": 9, "date": "042014"},
            {"value1": 3, "value2": 5, "date": "052014"},
            {"value1": 5, "value2": 4, "date": "062014"},
            {"value1": 1, "value2": 4, "date": "072014"},
            {"value1": 7, "value2": 0, "date": "082014"},
            {"value1": 3, "value2": 4, "date": "092014"},
            {"value1": 8, "value2": 6, "date": "102014"},
            {"value1": 6, "value2": 3, "date": "112014"},
            {"value1": 2, "value2": 8, "date": "122014"}
        ],
        simpleLineChartOptions = {
            appendTo: '#groupedBarChart',
            dimentions: {
                height: 250,
            },
            colors: [
                "#48AEB4",
                "#3B6D8F"
            ],
            margins: {
                bottom: 30,
                top: 50
            },
            xAxis: {
                groupedBarsSpacing: 3,
                barGroupesSpacing: 0.3,
                dateFormat: '%m%Y',
                tickFormat: '%b'
            },
            legend: {
                show: true,
                keysAliases: {
                    value1: 'FACILITY',
                    value2: 'AVERAGE'
                },
                margins: {
                    top: 10,
                    right: 10
                }
            }
        };

    Charts.generateGroupedBarChart(simpleLineChartOptions, getChartsData());

    function getChartsData() {
        var rtn = [],
            val;
        lineChartData.forEach(function (elem) {
            rtn.push($.extend({}, elem));

        });
        return rtn
    }

}());
