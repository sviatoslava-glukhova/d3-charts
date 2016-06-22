(function () {

    var chartData = [
            {
                name: 'name1',
                value: 10
            },
            {
                name: 'name2',
                value: 50
            },
            {
                name: 'name3',
                value: 50
            },
            {
                name: 'name4',
                value: 2
            },
            {
                name: 'name5',
                value: 13
            },
            {
                name: 'name6',
                value: 26
            },
            {
                name: 'name7',
                value: 13
            },
            {
                name: 'name8',
                value: 36
            },
            {
                name: 'name9',
                value: 45
            },
            {
                name: 'name10',
                value: 57
            },
            {
                name: 'name11',
                value: 68
            },
            {
                name: 'name12',
                value: 46
            },
            {
                name: 'name13',
                value: 78
            },
            {
                name: 'name14',
                value: 92
            },
            {
                name: 'name15',
                value: 81
            },
            {
                name: 'name16',
                value: 76
            },
            {
                name: 'name17',
                value: 23
            },
            {
                name: 'name18',
                value: 23
            }],
        chartOptions = {
            appendTo: '#simpleBarChart',
            dimentions: {
                height: 250,
            },
            colors: [
                "#48AEB4",
                "#3B6D8F"
            ],
            barSpacing: 1
        };

    Charts.generateSimpleBarChart(chartOptions, getChartsData());

    function getChartsData() {
        var rtn = [],
            val;
        chartData.forEach(function (elem) {
            rtn.push($.extend({}, elem));

        });
        return rtn
    }

}());
