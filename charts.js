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
                        width: null,
                        height: null
                    },
                    xAxis: {
                        showAxis: false,
                        ticksCount: 5,
                        dateFormat: '%Y%m%d',
                        datePropName: 'date',
                        showVerticalLines: false,
                        showTicksText: false
                    },
                    yAxis: {
                        showAxis: false,
                        ticksCount: 5,
                        showHorizontalLines: false,
                        showTicksText: false
                    },
                    showLineLabels: false,
                    legend: {
                        show: false,
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
                    return y(d.val);
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
                        return {date: d[props.xAxis.datePropName], val: +d[name]};
                    })
                };
            });

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));

            y.domain([
                d3.min(charts, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.val;
                    });
                }),
                d3.max(charts, function (c) {
                    return d3.max(c.values, function (v) {
                        return v.val;
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
                        return "translate(" + x(d.value[props.xAxis.datePropName]) + "," + y(d.value.val) + ")";
                    })
                    .attr("x", 3)
                    .attr("dy", ".35em")
                    .text(function (d) {
                        return d.name;
                    });
            }

            if (props.legend.show) {
                var template = '<div class="lineChartLegend"><table>',
                    container = d3.select(props.legend.appendTo).append('div').style('opacity', 0),
                    resultKey;


                xKeys.forEach(function (key) {
                    resultKey = props.legend.keysAliases ? props.legend.keysAliases[key] : key;
                    template += '<tr><td><div class="color-example" style="background-color:' + color(key) + '"></div></td><td>' + resultKey + '</td></tr>'
                });

                template += '</table></div>';

                container.html([template])
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
            }
        },
        generateAreaChart: function (options, data) {
            var defaults = {
                    appendTo: 'body',
                    colors: [],
                    strokeColors: [],
                    strokeWidth: 1,
                    interpolate: 'none',
                    margins: {top: 0, right: 0, bottom: 0, left: 0},
                    dimentions: {
                        width: null,
                        height: null
                    },
                    xAxis: {
                        showAxis: false,
                        ticksCount: 5,
                        dateFormat: '%Y%m%d',
                        datePropName: 'date',
                        showVerticalLines: false,
                        showTicksText: false
                    },
                    yAxis: {
                        showAxis: false,
                        ticksCount: 5,
                        showHorizontalLines: false,
                        showTicksText: false
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


            var color = d3.scale.ordinal().range(props.colors),
                strokeColor = d3.scale.ordinal().range(props.strokeColors);

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

            var area = d3.svg.area()
                .interpolate(props.interpolate)
                .x(function (d) {
                    return x(d[props.xAxis.datePropName]);
                })
                .y(function (d) {
                    return y(d.val);
                })
                .y0(function () {
                    return height;
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
                        return {date: d[props.xAxis.datePropName], val: +d[name]};
                    })
                };
            });

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));

            y.domain([
                d3.min(charts, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.val;
                    });
                }),
                d3.max(charts, function (c) {
                    return d3.max(c.values, function (v) {
                        return v.val;
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
                    return area(d.values);
                })
                .style("stroke", function (d) {
                    return strokeColor(d.name);
                })
                .style('stroke-width', props.strokeWidth)
                .style('fill', function (d) {
                    return color(d.name)
                })
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
                        return "translate(" + x(d.value[props.xAxis.datePropName]) + "," + y(d.value.val) + ")";
                    })
                    .attr("x", 3)
                    .attr("dy", ".35em")
                    .text(function (d) {
                        return d.name;
                    });
            }

            if (props.legend.show) {
                var template = '<div class="lineChartLegend"><table>',
                    container = d3.select(props.legend.appendTo).append('div').style('opacity', 0),
                    resultKey;


                xKeys.forEach(function (key) {
                    resultKey = props.legend.keysAliases ? props.legend.keysAliases[key] : key,
                        template += '<tr><td><div class="color-example" style="background-color:' + color(key) + '"></div></td><td>' + resultKey + '</td></tr>'
                });

                template += '</table></div>';

                container.html([template])
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
            }
        },
        generateGroupedBarChart: function (options, data) {
            var defaults = {
                    appendTo: 'body',
                    colors: [],
                    margins: {top: 0, right: 0, bottom: 0, left: 0},
                    dimentions: {
                        width: null,
                        height: null
                    },
                    xAxis: {
                        showAxis: true,
                        ticksCount: 5,
                        dateFormat: '%Y%m%d',
                        datePropName: 'date',
                        tickFormat: '%b',
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
                        keysAliases: null,
                        margins: {
                            top: 0,
                            right: 0
                        }
                    }
                },
                props = $.extend(true, defaults, options);

            var parent = d3.select(props.appendTo),
                svgWidth = props.dimentions.width ? props.dimentions.width : $(parent[0][0]).width(),
                svgHeight = props.dimentions.height ? props.dimentions.height : $(parent[0][0]).height(),
                width = svgWidth - props.margins.left - props.margins.right,
                height = svgHeight - props.margins.top - props.margins.bottom;


            var parseDate = d3.time.format(props.xAxis.dateFormat).parse;

            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], props.xAxis.barGroupesSpacing);

            var x1 = d3.scale.ordinal();

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.ordinal()
                .range(props.colors);

            var xAxis = d3.svg.axis()
                .scale(x0)
                .tickFormat(d3.time.format(props.xAxis.tickFormat))
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = parent.append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", "translate(" + props.margins.left + "," + props.margins.top + ")");

            var xKeys = d3.keys(data[0]).filter(function (key) {
                return key !== props.xAxis.datePropName;
            });

            data.forEach(function(value) {
                value.date = parseDate(value.date);
            });

            data.forEach(function (d) {
                d.values = xKeys.map(function (name) {
                    return {name: name, value: +d[name]};
                });
            });

            x0.domain(data.map(function (d) {
                return d.date;
            }));
            x1.domain(xKeys).rangeRoundBands([0, x0.rangeBand()]);
            y.domain([0, d3.max(data, function (d) {
                return d3.max(d.values, function (d) {
                    return d.value;
                });
            })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var state = svg.selectAll(".group")
                .data(data)
                .enter().append("g")
                .attr("class", "group")
                .attr("transform", function (d) {
                    return "translate(" + x0(d.date) + ",0)";
                });

            state.selectAll("rect")
                .data(function (d) {
                    return d.values;
                })
                .enter().append("rect")
                .attr("width", x1.rangeBand() - props.xAxis.groupedBarsSpacing)
                .attr("x", function (d) {
                    return x1(d.name);
                })
                .attr('height', 0)
                .attr('y', height)
                .style("fill", function (d) {
                    return color(d.name);
                })
                .transition()
                .duration(500)
                .ease('sin')
                .delay(function(d, i) {
                    return i* 400;
                })
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("height", function (d) {
                    return height - y(d.value);
                });


            if (props.legend.show) {
                var legendContainer = parent.select('svg').append('g')
                    .classed('legend-container', true)
                    .attr("transform", function () {
                        return "translate(-"+ props.legend.margins.right + "," + props.legend.margins.top + ")";
                    });

                var legend = legendContainer.selectAll(".legend")
                    .data(xKeys.slice().reverse())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                        return props.legend.keysAliases ? props.legend.keysAliases[d] : d;
                    });

            }

        }
    };

    window.Charts = charts;
}())