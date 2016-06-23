(function () {

    var chartData = [
            {
                label: '2014',
                values: [17000000, 10000000, 5000000]
            },
            {
                label: '2015',
                values: [9000000, 12000000, 3000000]
            }],
        chartOptions = {
            appendTo: '#groupedHorizontalBarChart',
            dimentions: {
                height: 250,
            },
            colors: [
                "#48AEB4",
                "#3B6D8F"
            ],
            margins: {
                left: 100,
                right: 200
            },
            legend:{
                show: true
            },
            formatTickFunction: function (d) {
                return '$' + d / 1000000 + 'm';
            },
            barHeight: 30,
            labels: ['OVERHEAD', 'SUPPLIES', 'CLINICAL']
        };

    Charts.generateGroupedBarChartHorizontal(chartOptions, getChartsData());

    function getChartsData() {
        var rtn = [],
            val;
        chartData.forEach(function (elem) {
            rtn.push($.extend({}, elem));

        });
        return rtn
    }

}());
