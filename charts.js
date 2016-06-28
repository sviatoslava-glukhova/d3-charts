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
                    paddingFillColor: '',
                    strokeWidth: 1,
                    interpolate: 'none',
                    margins: {top: 0, right: 0, bottom: 0, left: 0},
                    chartBottomPadding: 0,
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
                        showTicksText: false,
                        tickFormat: '%d'
                    },
                    yAxis: {
                        showAxis: false,
                        ticksCount: 5,
                        showHorizontalLines: false,
                        showTicksText: false,
                        showTicksInside: false,
                        ticksLeftPadding: 10,
                        tickFormat: null
                    },
                    showLineLabels: false,
                    legend: {
                        show: false,
                        appendTo: 'body',
                        keysAliases: null
                    },
                    onHover: {
                        show: false,
                        hoverLineWidth: 5,
                        hoverLineColor: null,
                        pointDiameter: 5,
                        pointBorder: 1
                    }
                },
                props = $.extend(true, defaults, options);

            var parent = d3.select(props.appendTo),
                svgWidth = props.dimentions.width ? props.dimentions.width : $(parent[0][0]).width(),
                svgHeight = props.dimentions.height ? props.dimentions.height : $(parent[0][0]).height(),
                width = svgWidth - props.margins.left - props.margins.right,
                height = svgHeight - props.margins.top - props.margins.bottom,
                animationDuration = 700,
                dataMin, dataMax;

            var parseDate = d3.time.format(props.xAxis.dateFormat).parse;

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height - props.chartBottomPadding, 0]);

            var color = d3.scale.ordinal().range(props.colors),
                strokeColor = d3.scale.ordinal().range(props.strokeColors);

            var xAxis = d3.svg.axis()
                .scale(x)
                .ticks(props.xAxis.ticksCount)
                .tickFormat(d3.time.format(props.xAxis.tickFormat))
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

            if (props.yAxis.tickFormat) {
                yAxis.tickFormat(props.yAxis.tickFormat);
            }

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

            dataMin = d3.min(charts, function (c) {
                return d3.min(c.values, function (v) {
                    return v.val;
                });
            });
            dataMax = d3.max(charts, function (c) {
                return d3.max(c.values, function (v) {
                    return v.val;
                });
            });

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));

            y.domain([dataMin, dataMax]);


            var chart = svg.selectAll(".chart")
                .data(charts)
                .enter().append("g")
                .attr("class", "chart");

            chart.append("path")
                .attr("class", "line")
                .attr("d", "M0,0")
                .style("stroke", function (d) {
                    return strokeColor(d.name);
                })
                .style('stroke-width', props.strokeWidth)
                .style('fill', function (d) {
                    return color(d.name)
                })
                .transition()
                .duration(animationDuration)
                .attrTween("d", tween);

            if (props.onHover.showPoints || props.onHover.showTooltip) {
                var hoverCharts = svg.selectAll(".hoverChart")
                    .data(charts)
                    .enter().append("g")
                    .attr("class", "chart");

                var hoverLine = d3.svg.line()
                    .interpolate(props.interpolate)
                    .x(function (d) {
                        return x(d[props.xAxis.datePropName]);
                    })
                    .y(function (d) {
                        return y(d.val);
                    });

                var bisectDate = d3.bisector(function (d) {
                        return d.date;
                    }).left,
                    tooltipPadding = 80,
                    hoverPoint, tooltip, initPointX, initPointY,
                    tooltipContainer, tooltip, border, dateFormat = d3.time.format(props.onHover.tooltipDateFormat);

                hoverCharts.append("path")
                    .attr("class", "hoverLine")
                    .attr("d", function (d) {
                        return hoverLine(d.values);
                    })
                    .style("stroke", function () {
                        return props.onHover.hoverLineColor ? props.onHover.hoverLineColor : 'rgba(0,0,0,0)';
                    })
                    .style('stroke-width', props.onHover.hoverLineWidth)
                    .style('fill', 'none')
                    .on('mousemove', function (d, i) {
                        var x0 = x.invert(d3.mouse(this)[0]),
                            i = bisectDate(d.values, x0),
                            d0 = d.values[i - 1],
                            d1 = d.values[i],
                            cursorOnLeft = x0 - d0.date > d1.date - x0,
                            pointData = cursorOnLeft ? d1 : d0,
                            pointi = cursorOnLeft ? i : i - 1,
                            pointX = x(pointData.date),
                            pointY = y(pointData.val);

                        if (initPointX !== pointX || initPointY !== pointY) {
                            initPointX = pointX;
                            initPointY = pointY;

                            if (props.onHover.showTooltip) {
                                var tooltipWidth = props.onHover.tooltipWidth;

                                if (!tooltip) {
                                    border = svg.append('rect')
                                        .attr({
                                            fill: 'none',
                                            stroke: 'white',
                                            'stroke-width': props.onHover.borderWidth,
                                            width: tooltipPadding * 2
                                        });

                                    tooltipContainer = svg.append('foreignObject')
                                        .attr({
                                            'width': tooltipWidth
                                        })

                                    tooltip = tooltipContainer.append('xhtml:div')
                                        .append('div')
                                        .attr({
                                            'class': 'chartTooltip'
                                        });
                                }

                                border.attr({
                                    x: pointX - tooltipPadding
                                });

                                //  .style('opacity', 0);

                                var growth = pointData.val - d.values[pointi - 1].val,
                                    growthString = growth > 0 ? '<span class="growUp">+' + growth + '</span>' : '<span class="growDown">' + growth + '</span>';

                                tooltip.html('<div class="tooltipTitle">' + (props.onHover.labels ? props.onHover.labels[d.name] : d.name) + '</div>'
                                    + '<div class="description">Labor had the greatest PC in this period</div>'
                                    + '<div class="date">' + dateFormat(pointData.date) + '</div>'
                                    + '<div class="value">' + growthString + ' (' + pointData.val + ')</div>'
                                );

                                var h = $(tooltip.node()).outerHeight();

                                tooltipContainer.attr({
                                    'x': cursorOnLeft ? pointX + tooltipPadding : pointX - tooltipWidth - tooltipPadding,
                                    'y': pointY - (h / 2)
                                })

                                border.attr({'height': h - props.onHover.borderWidth, 'y': pointY - h / 2 + props.onHover.borderWidth})

                                tooltip//.attr('transform', 'translate(' + (cursorOnLeft ? pointX + 50 : pointX - tooltipWidth - 50) + ',' + (pointY - (tooltipHeight / 2)) + ')')
                                    // .style('opacity', 0)
                                    .transition()
                                    .duration(props.onHover.tooltipTransitionsDuration)
                                    .delay(props.onHover.pointMovementDuration)
                                    .style('opacity', 1)

                            }

                            if (!hoverPoint || !hoverPoint.length) {
                                hoverPoint = svg.append('circle')
                                    .classed('hoverPoint', true)
                                    .attr('r', props.onHover.pointDiameter)
                                    .attr('fill', 'white')
                                    .attr('stroke-width', props.onHover.pointBorder)
                                    .attr('stroke', 'red')
                                    .attr('cx', pointX)
                                    .attr('cy', pointY)
                                    .style('opacity', 1);
                            }

                            hoverPoint.transition()
                                .duration(props.onHover.pointMovementDuration)
                                .style('opacity', 1)
                                .attr('cx', pointX)
                                .attr('cy', pointY);

                            //  focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
                            // focus.select("text").text(formatCurrency(d.close));
                        }

                    })
                    .on('mouseleave', function () {
                        /*   hoverPoint.transition()
                         .duration(props.onHover.transitionLength)
                         .style('opacity', 0);

                         tooltip.transition()
                         .duration(props.onHover.transitionLength)
                         .style('opacity', 0);*/
                    });
            }

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
                    .call(yAxis);

                if (props.yAxis.showTicksInside) {
                    yAxis.selectAll('.tick text')
                        .style('text-anchor', 'start')
                        .attr('x', props.yAxis.ticksLeftPadding)
                }

                if (!props.yAxis.showTicksText) {
                    yAxis.selectAll('.tick text').remove();
                }
            }

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
                    .duration(300)
                    .style('opacity', 1);
            }

            function tween(d, i, a) {
                var scale = d3.scale.linear()
                    .domain([dataMin, dataMax]);

                return function (t) {
                    var data = [],
                        max = dataMax * t > dataMin ? dataMax * t : dataMin; //TODO fix the ugly fix
                    scale.range([dataMin, max]);

                    d.values.forEach(function (value) {
                        data.push({val: scale(value.val), date: value.date}); //TODO REMOVE
                    });

                    return area(data);
                }
            }
        },
        generatePercentIndicator: function (options, data) {
            var defaults = {
                    appendTo: 'body',
                    defaultColor: "#cacaca",
                    primaryColor: '#d3f2e1',
                    dimentions: {
                        height: 40,
                        width: null
                    }
                },
                props = $.extend(true, defaults, options);

            var parent = d3.select(props.appendTo),
                svgWidth = props.dimentions.width ? props.dimentions.width : $(parent[0][0]).width(),
                svgHeight = props.dimentions.height ? props.dimentions.height : $(parent[0][0]).height(),
                center = svgWidth / 2,
                paddingBottom = 20,
                barHeight = svgHeight - paddingBottom;


            var x = d3.scale.identity()
                .domain([-100, 100]);

            var svg = parent.append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .datum(data)
                .append('g');

            svg.append('rect')
                .attr('width', svgWidth)
                .attr('height', barHeight)
                .attr('fill', props.defaultColor)
                .classed('percent-indicator', true)

            svg.append('rect')
                .attr('fill', props.primaryColor)
                .attr('height', barHeight)
                .attr('width', 0)
                .attr('x', center)
                .transition()
                .duration(700)
                .attr('width', function (d) {
                    return center * 0.01 * Math.abs(d);
                })
                .attr('x', function (d) {
                    return d > 0 ? center : center * ( 1 - 0.01 * Math.abs(d));
                });


            svg.append('text')
                .text('0')
                .style('text-anchor', 'middle')
                .attr('x', center)
                .attr('y', svgHeight - 5)
                .classed('tick', true)
                .attr('fill', '#8e8e8e');

            svg.append('line')
                .attr('x1', center)
                .attr('x2', center)
                .attr('y1', 0)
                .attr('y2', barHeight)
                .attr('stroke-width', 2)
                .attr('stroke', 'white')


        },
        generateSimpleBarChart: function (options, data) {
            var defaults = {
                    appendTo: 'body',
                    colors: [],
                    margins: {top: 0, right: 0, bottom: 0, left: 0},
                    dimentions: {
                        width: null,
                        height: null
                    },
                    xAxis: {
                        showAxis: false,
                        /*              showAxis: true,
                         ticksCount: 5,
                         dateFormat: '%Y%m%d',
                         datePropName: 'date',
                         tickFormat: '%b',
                         showVerticalLines: true,
                         showTicksText: true*/
                        propName: 'name'
                    },
                    yAxis: {
                        showAxis: false,
                        minValueAsZero: false,
                        /*
                         ticksCount: 5,
                         showHorizontalLines: false,
                         showTicksText: true*/
                        propName: 'value',
                        barSpacing: 0.5
                    },
                    showLineLabels: false,
                    legend: {
                        show: false,
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

            var x = d3.scale.ordinal().rangeRoundBands([0, width], props.yAxis.barSpacing);

            var y = d3.scale.linear().range([height, 0]);

            var color = d3.scale.ordinal()
                .range(props.colors);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                //.tickFormat(d3.time.format("%Y-%m"));
                .ticks(0)

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);

            var svg = parent.append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform",
                "translate(" + props.margins.left + "," + props.margins.top + ")");

            var datamax = d3.max(data, function (d) {
                    return d[props.yAxis.propName];
                }),
                datamin = d3.min(data, function (d) {
                    return d[props.yAxis.propName];
                });

            x.domain(data.map(function (d) {
                return d[props.xAxis.propName];
            }));

            y.domain([props.minValueAsZero ? datamin - (datamax - datamin) * 0.1 : 0, datamax]);

            if (props.xAxis.showAxis) {
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");
            }

            if (props.yAxis.showAxis) {
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
            }


            svg.selectAll("bar")
                .data(data)
                .enter().append("rect")
                .style("fill", function (d, i) {
                    return color(i);
                })
                .attr("x", function (d) {
                    return x(d[props.xAxis.propName]);
                })
                .attr("width", x.rangeBand())
                .attr("y", height)
                .attr("height", 0)
                .transition()
                .duration(300)
                .delay(function (d, i) {
                    return i * 100
                })
                .attr("y", function (d) {
                    return y(d[props.yAxis.propName]);
                })
                .attr("height", function (d) {
                    return height - y(d[props.yAxis.propName]);
                });

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
                        show: false,
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

            data.forEach(function (value) {
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
                .delay(function (d, i) {
                    return i * 400;
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
                        return "translate(-" + props.legend.margins.right + "," + props.legend.margins.top + ")";
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

        },
        generateGroupedBarChartHorizontal: function (options, data) {  //TODO yeah I know it's super ugly, do normal horizontal chart
            var defaults = {
                    appendTo: 'body',
                    colors: [],
                    margins: {top: 0, right: 0, bottom: 0, left: 0},
                    dimentions: {
                        width: null,
                        height: null
                    },
                    /* xAxis: {
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
                     }*/
                    formatTickFunction: null,
                    labels: [],
                    barHeight: 10
                },
                props = $.extend(true, defaults, options);

            var parent = d3.select(props.appendTo),
                svgWidth = props.dimentions.width ? props.dimentions.width : $(parent[0][0]).width(),
                svgHeight = props.dimentions.height ? props.dimentions.height : $(parent[0][0]).height(),
                width = svgWidth - props.margins.left - props.margins.right,
                height = svgHeight - props.margins.top - props.margins.bottom;

            var groupHeight = props.barHeight * data.length,
                gapBetweenGroups = 10;

            var zippedData = [];
            for (var i = 0; i < props.labels.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    zippedData.push(data[j].values[i]);
                }
            }

            var color = d3.scale.ordinal()
                .range(props.colors);
            var chartHeight = props.barHeight * zippedData.length + gapBetweenGroups * props.labels.length;

            var x = d3.scale.linear()
                .domain([0, d3.max(zippedData)])
                .range([0, width]);

            var y = d3.scale.linear()
                .range([chartHeight + gapBetweenGroups, 0]);

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickFormat('')
                .tickSize(0)
                .orient("left");

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            if (props.formatTickFunction) {
                xAxis.tickFormat(props.formatTickFunction)
            }


            var chart = parent.append('svg').classed("chart", true)
                .attr("width", svgWidth)
                .attr("height", svgHeight);

            var bar = chart.selectAll("g")
                .data(zippedData)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + props.margins.left + "," + (i * props.barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.length))) + ")";
                });

            bar.append("rect")
                .attr("fill", function (d, i) {
                    return color(i % data.length);
                })
                .attr("class", "bar")
                .attr("width", 0)
                .attr("height", props.barHeight - 1)
                .transition()
                .duration(500)
                .delay(function (d, i) {
                    return i * 200
                })
                .attr("width", x);

            bar.append("text")
                .attr("class", "label")
                .attr("x", function (d) {
                    return -10;
                })
                .attr("y", groupHeight / 2)
                .attr("dy", ".35em")
                .style('text-anchor', 'end')
                .text(function (d, i) {
                    if (i % data.length === 0)
                        return props.labels[Math.floor(i / data.length)];
                    else
                        return ""
                });

            chart.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + props.margins.left + ", " + -gapBetweenGroups / 2 + ")")
                .call(yAxis);


            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + props.margins.left + ", " + (height - 30) + ")")
                .call(xAxis);

            var legendRectSize = 18,
                legendSpacing = 4;

            var legend = chart.selectAll('.legend')
                .data(data)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = -gapBetweenGroups / 2;
                    var horz = props.margins.left + width + 70 - legendRectSize;
                    var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', function (d, i) {
                    return color(i);
                })
                .style('stroke', function (d, i) {
                    return color(i);
                });

            legend.append('text')
                .attr('class', 'legend')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function (d) {
                    return d.label;
                });

        },
        generatePyramids: function (options, data) {
            var defaults = {
                    appendTo: 'body',
                    colors: [],
                    margins: {top: 0, right: 0, bottom: 0, left: 0},
                    dimentions: {
                        width: null,
                        height: null
                    },
                    yAxis: {
                        showAxis: false,
                        ticksCount: 5,
                        showHorizontalLines: false,
                        showTicksText: false,
                        showTicksInside: false,
                        ticksLeftPadding: 10,
                        tickFormat: null
                    },
                    labels: [],
                    pyramidBaseWidth: [50]
                },
                props = $.extend(true, defaults, options);

            var parent = d3.select(props.appendTo),
                svgWidth = props.dimentions.width ? props.dimentions.width : $(parent[0][0]).width(),
                svgHeight = props.dimentions.height ? props.dimentions.height : $(parent[0][0]).height(),
                width = svgWidth - props.margins.left - props.margins.right,
                height = svgHeight - props.margins.top - props.margins.bottom;

            var x = d3.scale.linear();

            var y = d3.scale.linear()
                .range([height, 0]);

            var labels = d3.map(data, function (value) {
                return value.label;
            });

            var color = d3.scale.ordinal().range(props.colors)
                .domain(labels);

            var pyramidBase = d3.scale.ordinal().range(props.pyramidBaseWidth)
                .domain(labels);

            var xAxis = d3.svg.axis()
                .scale(x)
                .ticks(data.length)
                .tickFormat(function (d, i) {
                    return props.labels[i];
                })
                .outerTickSize('0')
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(props.yAxis.ticksCount)
                .outerTickSize('0')
                .orient("left");

            if (props.yAxis.tickFormat) {
                yAxis.tickFormat(props.yAxis.tickFormat);
            }

            function pyramid(data, i, base) {
                var offset = base !== undefined ? base : pyramidBase(data.label),
                    pointX = x(i),
                    pointY = y(data.value);

                return pointX - offset + ' ' + height + ', ' + pointX + ' ' + pointY + ', ' + (pointX + offset) + ' ' + height;
            }

            var svg = parent.append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", "translate(" + props.margins.left + "," + props.margins.top + ")");

            var dataPoints = [],
                seriesCount = data[0].values.length,
                length = data.length;

            for (var i = 0; i < seriesCount; i++) {
                for (var j = 0; j < length; j++) {
                    dataPoints.push({
                        series: props.labels[i], //not sure will need
                        label: data[j].label,
                        value: data[j].values[i]
                    });
                }
            }

            x.range([pyramidBase(dataPoints[0].label), width - pyramidBase(dataPoints[dataPoints.length - 1].label)])
                .domain([0, dataPoints.length - 1]);

            y.domain([
                0, d3.max(dataPoints, function (d) {
                    return d.value
                })]);


            xAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            xAxis.selectAll("text")
                .style("text-anchor", "start");

            if (props.yAxis.showAxis) {
                yAxis = svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                if (props.yAxis.showTicksInside) {
                    yAxis.selectAll('.tick text')
                        .style('text-anchor', 'start')
                        .attr('x', props.yAxis.ticksLeftPadding)
                }

                if (!props.yAxis.showTicksText) {
                    yAxis.selectAll('.tick text').remove();
                }
            }

            var chart = svg.selectAll(".pyramid")
                .data(dataPoints)
                .enter().append("g")
                .attr("class", "pyramid");

            chart.append("polygon")
                //  .attr("class", "line")
                //  .style('opacity', 0)
                .attr('points', function (d, i) {
                    var data = $.extend({}, d);
                    data.value = 0;
                    //   console.log(pyramid(data, i));
                    return pyramid(data, i, 0);
                })
                .style('fill', function (d) {
                    return color(d.label);
                })
                .transition()
                .duration(500)
                .delay(function (d, i) {
                    return i * 100;
                })
                .attr("points", function (d, i) {
                    return pyramid(d, i);
                });

        }
    };

    function debounceD3Event(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
            var evt = d3.event;

            var later = function () {
                timeout = null;
                if (!immediate) {
                    var tmpEvent = d3.event;
                    d3.event = evt;
                    func.apply(context, args);
                    d3.event = tmpEvent;
                }
            };

            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                var tmpEvent = d3.event;
                d3.event = evt;
                func.apply(context, args);
                d3.event = tmpEvent;
            }

        };
    }

    window.Charts = charts;
}())