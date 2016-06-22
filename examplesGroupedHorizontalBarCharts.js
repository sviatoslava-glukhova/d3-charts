(function () {

    var chartData = [
            {
                label: '2014',
                values: [17, 10, 5]
            },
            {
                label: '2015',
                values: [9, 12, 3]
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
