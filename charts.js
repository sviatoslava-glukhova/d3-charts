(function () {
    var charts = {
        generateLineChart: function (options, data) {
            var defaults = {
                    appendTo: 'body',
                    colors: [],
                    strokeWidth: 1,
                    interpolate: 'basis',
                    margins: {top: 0, right: 0, bottom: 0, left: 0},
                    dimentions: {
                        width: 500,
                        height: 200 //TODO fix null support
                    },
                    xAxis: {
                        showAxis: true,
                        ticksCount: 5,
                        dateFormat: '%Y%m%d',
                        datePropName: 'date',
                        showVerticalLines: true,
                        showTicksText: true
                    },
                    yAxis: {
                        showAxis: true,
                        ticksCount: 5,
                        showHorizontalLines: false,
                        showTicksText: true
                    },
                    showLineLabels: false,
                    legend: {
                        show: true,
                        appendTo: 'body',
                        keysAliases: null
                    }
                },
                props = $.extend(true, defaults, options);

            var parent = d3.select(props.appendTo),
                svgWidth = props.dimentions.width ? props.dimentions.width : $(parent[0][0]).width(),
                svgHeight = props.dimentions.height ? props.dimentions.height : $(parent[0][0]).height(),
                width = svgWidth - props.margins.left - props.margins.right,
                height = svgHeight - props.margins.top - props.margins.bottom,
                yAxis, xAxis;


            var parseDate = d3.time.format(props.xAxis.dateFormat).parse;

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.ordinal().range(props.colors);

            var xAxis = d3.svg.axis()
                .scale(x)
                .ticks(props.xAxis.ticksCount)
                .outerTickSize('0')
                .orient("bottom");

            if (props.xAxis.showVerticalLines) {
                xAxis.tickSize(-height);
            }

            var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(props.yAxis.ticksCount)
                .outerTickSize('0')
                .orient("left");

            if (props.yAxis.showHorizontalLines) {
                yAxis.tickSize(-width);
            }

            var line = d3.svg.line()
                .interpolate(props.interpolate)
                .x(function (d) {
                    return x(d[props.xAxis.datePropName]);
                })
                .y(function (d) {
                    return y(d.hours);
                });

            var keys = d3.keys(data[0]),
                xKeys = keys.filter(function (key) {
                    return key !== props.xAxis.datePropName;
                });

            console.log(props.appendTo);

            var svg = parent.append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", "translate(" + props.margins.left + "," + props.margins.top + ")");


            color.domain(xKeys);

            data.forEach(function (d) {
                d.date = parseDate(d[props.xAxis.datePropName]);
            });

            var charts = xKeys.map(function (name) {
                return {
                    name: name,
                    values: data.map(function (d) {
                        return {date: d[props.xAxis.datePropName], hours: +d[name]};
                    })
                };
            });

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));

            y.domain([
                d3.min(charts, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.hours;
                    });
                }),
                d3.max(charts, function (c) {
                    return d3.max(c.values, function (v) {
                        return v.hours;
                    });
                })
            ]);

            if (props.xAxis.showAxis) {
                xAxis = svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);


                if (!props.xAxis.showTicksText) {
                    xAxis.selectAll('.tick text').remove();
                }
            }

            if (props.yAxis.showAxis) {
                yAxis = svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end");


                if (!props.yAxis.showTicksText) {
                    yAxis.selectAll('.tick text').remove();
                    //  yAxis.select('.domain').remove();
                }
            }


            var chart = svg.selectAll(".chart")
                .data(charts)
                .enter().append("g")
                .attr("class", "chart");

            chart.append("path")
                .attr("class", "line")
                .style('opacity', 0)
                .attr("d", function (d) {
                    return line(d.values);
                })
                .style("stroke", function (d) {
                    return color(d.name);
                })
                .style('stroke-width', props.strokeWidth)
                .style('fill', 'none')
                .transition()
                .duration(300)
                .delay(function (d, i) {
                    return 200 * i
                })
                .style('opacity', 1);

            if (props.showLineLabels) {
                chart.append("text")
                    .datum(function (d) {
                        return {name: d.name, value: d.values[d.values.length - 1]};
                    })
                    .attr("transform", function (d) {
                        return "translate(" + x(d.value[props.xAxis.datePropName]) + "," + y(d.value.hours) + ")";
                    })
                    .attr("x", 3)
                    .attr("dy", ".35em")
                    .text(function (d) {
                        return d.name;
                    });
            }

            if (props.legend.show) {
                var template = '<div class="lineChartLegend"><table>',
                    container = d3.select(props.legend.appendTo).append('div').style('opacity', 0);


                xKeys.forEach(function (key) {
                    template += '<tr><td><div class="color-example" style="background-color:' + color(key) + '"></div></td><td>' + (props.legend.keysAliases ? props.legend.keysAliases[key] : key) + '</td></tr>'
                });

                template += '</table></div>';

                container.html([template])
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
            }
        }
    };

    window.Charts = charts;
}())