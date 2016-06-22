(function () {

    var lineChartData = [
            {
                label: '2014',
                values: [17, 10, 5]
            },
            {
                label: '2015',
                values: [9, 12, 3]
            }],
        simpleLineChartOptions = {
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
            }, /*
             xAxis: {
             groupedBarsSpacing: 3,
             barGroupesSpacing: 0.3,
             dateFormat: '%m%Y',
             tickFormat: '%b'
             },
             legend: {
             show: false,
             keysAliases: {
             value1: 'FACILITY',
             value2: 'AVERAGE'
             },
             margins: {
             top: 10,
             right: 10
             }
             }*/
            legend:{
                show: true
            },
            barHeight: 30,
            labels: ['OVERHEAD', 'SUPPLIES', 'CLINICAL']
        };

    Charts.generateGroupedBarChartHorizontal(simpleLineChartOptions, getChartsData());

    function getChartsData() {
        var rtn = [],
            val;
        lineChartData.forEach(function (elem) {
            rtn.push($.extend({}, elem));

        });
        return rtn
    }

}());
