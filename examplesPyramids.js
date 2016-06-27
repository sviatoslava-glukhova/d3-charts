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
        simpleAreaChartOptions = {
            appendTo: '#pyramids',
            dimentions: {
                height: 300,
            },
            colors: [
                "rgba(6, 224, 244, 0.5)",
                "rgba(255,255,255, 0.5)"
            ],
            margins: {bottom: 30},
            pyramidBaseWidth: [150, 70],
            labels: ['OVERHEAD', 'SUPPLIES', 'CLINICAL']
        };

    Charts.generatePyramids(simpleAreaChartOptions, getChartsData());


    function getChartsData() {
        var rtn = [],
            val;
        chartData.forEach(function (elem) {
            rtn.push($.extend({}, elem));

        });
        return rtn
    }

}());
