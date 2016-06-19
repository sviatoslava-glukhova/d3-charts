(function () {

    var lineChartData = [
            {"value1": 1, "value2": 4, "date": "JAN"},
            {"value1": 2, "value2": 2, "date": "FEB"},
            {"value1": 4, "value2": 9, "date": "MAR"},
            {"value1": 5, "value2": 9, "date": "APR"},
            {"value1": 3, "value2": 5, "date": "MAY"},
            {"value1": 5, "value2": 4, "date": "JUN"},
            {"value1": 1, "value2": 4, "date": "AUG"},
            {"value1": 7, "value2": 0, "date": "SEPT"},
            {"value1": 3, "value2": 4, "date": "OCT"},
            {"value1": 8, "value2": 6, "date": "NOV"},
            {"value1": 2, "value2": 8, "date": "DEC"}
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
                bottom: 20,
                top: 40
            },
            dateFormat: '%Y%m%d', //TODO make it work
            xAxis: {
                groupedBarsSpacing: 3
            },
            legend: {
                show: true,
                keysAliases: {
                    value1: 'FACILITY',
                    value2: 'AVERAGE'
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
