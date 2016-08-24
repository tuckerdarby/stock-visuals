app.directive('contextDirective', contextDirective);

contextDirective.$inject = ['$window', 'd3Factory', 'contextService'];

function contextDirective($window, d3Factory , contextService) {
    return {
        restrict: 'E',
        scope: {},
        link: contextLink
    };

    function contextLink(scope, ele, attr) {
        d3Factory.d3().then( function(d3) {contextChart(d3)});
        function contextChart(d3) {
            var chart = {}, tickers = [], contextGraph, stage = 0,
                svg = d3.select(ele[0]).append('svg').style('width', '100%').style('height', '100%');
            var margin = {top: 25, right: 25, bottom: 25, left: 25, header: 5},
                width = d3.select(ele[0])[0][0].offsetWidth - margin.left - margin.right,
                height = d3.select(ele[0])[0][0].offsetHeight,
                graphHeight,
                graphWidth;
            var x, y,
                xAxis, yAxis,
                svgX, svgY, dateTag, dateLine, dateBox, highlightBox,
                brush,
                brushBox0, brushTag0, brushBox1, brushTag1,
                graphManifest = { formatted: false, domain: [0, 100], range: [999, 0], series: []},
                bisectDate = d3.bisector(function (d) {return d['date']}).right,
                formatDate = d3.time.format("%b-%d-%Y");
            
            scope.activate = function() {
                //d3.select(ele[0]).zIndex = -100;
                outfitChart();
                contextService.initChart(chart);
                createGraph();
            };
            
            scope.activate();

            scope.$watch(
                function () {
                    return (angular.element($window)[0].innerWidth 
                    + angular.element($window)[0].innerHeight);
                },
                function () {
                    createGraph();
                });
            
            function createGraph() {
                if (contextGraph != undefined) contextGraph.remove();
                width = d3.select(ele[0])[0][0].offsetWidth - margin.left - margin.right;
                height = d3.select(ele[0])[0][0].offsetHeight;
                graphHeight = height - margin.top - margin.bottom;
                graphWidth = width;
                if (svg != undefined) svg.remove();
                svg = d3.select(ele[0]).append('svg').style('width', '100%').style('height', '100%');
                x = d3.time.scale().range([0, graphWidth]);
                y = d3.scale.linear().range([graphHeight, 0]);
                graphManifest.domain = contextService.getContext();
                x.domain(graphManifest.domain);
                y.domain(graphManifest.range);
                xAxis = d3.svg.axis().scale(x).orient("bottom");
                yAxis = d3.svg.axis().scale(y).orient("left");
                svg.append("defs").append("clipPath").attr("id", "clip")
                    .append("rect").attr("width", width).attr("height", height - 25);
                updateGraphAxis();
                if (highlightBox != undefined) highlightBox.remove();
                svg.append("rect")
                    .attr("width", width).attr("height", height)
                    .style("fill", "none").style("pointer-events", "all");

                    //.on("mouseover", showHover).on("mouseout", hideHover).on("mousemove", moveHover);
                highlightBox = svg.append("g")
                    .attr("class", "x brush")
                    .attr("width", width).attr("height", graphHeight)
                    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
                    .style("pointer-events", "all")
                    .call(brush).selectAll("rect")
                    .attr("y", margin.top)
                    .attr("height", graphHeight)
                    .on("mousemove", moveHover);
            }

            function updateGraphAxis() {
                if (svgX != undefined) svgX.remove();
                if (svgY != undefined) svgY.remove();
                if (dateTag != undefined) dateTag.remove();
                if (dateLine != undefined) dateLine.remove();
                if (dateBox != undefined) dateBox.remove();
                if (brushBox0 != undefined) brushBox0.remove();
                if (brushBox1 != undefined) brushBox1.remove();
                if (brushTag0 != undefined) brushTag0.remove();
                if (brushTag1 != undefined) brushTag1.remove();
                //if (highlightBox != undefined) highlightBox.remove();
                graphManifest.domain = contextService.getContext();
                x.domain(graphManifest.domain);
                y.domain(graphManifest.range);
                xAxis = d3.svg.axis().scale(x).orient("bottom")
                    .innerTickSize(-graphHeight).outerTickSize(0);
                yAxis = d3.svg.axis().scale(y).orient("left")
                    .innerTickSize(-graphWidth).outerTickSize(0);
                brush = d3.svg.brush().x(x).on("brush", brushed);
                contextGraph = svg.append("g").attr("class", "contextGraph")
                    .attr('height', graphHeight).attr('width', graphWidth)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .style("pointer-events", "none");
                svgX = contextGraph.append("g")
                    .attr("class", "x axis").attr("transform", "translate(0," + graphHeight + ")")
                    .style("pointer-events", "none")
                    .call(xAxis);
                svgY = contextGraph.append("g")
                    .attr("class", "y axis")
                    .style("pointer-events", "none")
                    .call(yAxis);
                dateLine = svg.append("line")
                    .attr("id", "xFocusLine")
                    .style("stroke", "black")
                    .style("stroke-dasharray", "3,3")
                    .style("opacity", 1)
                    .attr("x1", width)
                    .attr("x2", width)
                    .style("pointer-events", "none");
                dateBox = svg.append("rect")
                    .attr("width", 60).attr("height", 12)
                    .attr("stroke", "black").attr("stroke-width", 1).attr("stroke-opacity", 0.7)
                    .attr("fill", "black").attr("x", -100).attr("fill-opacity", 0.5);
                dateTag = svg.append("text")
                    .attr("dy", "0.35em")
                    .attr("fill", "white");
                brushBox0 = svg.append("rect")
                    .attr("width", 60).attr("height", 12)
                    .attr("stroke", "black").attr("stroke-width", 1).attr("stroke-opacity", 0.7)
                    .attr("fill", "black").attr("x", -100).attr("fill-opacity", 0.5);
                brushTag0 = svg.append("text")
                    .attr("dy", "0.35em")
                    .attr("fill", "white");
                brushBox1 = svg.append("rect")
                    .attr("width", 60).attr("height", 12)
                    .attr("stroke", "black").attr("stroke-width", 1).attr("stroke-opacity", 0.7)
                    .attr("fill", "black").attr("x", -100).attr("fill-opacity", 0.5);
                brushTag1 = svg.append("text")
                    .attr("dy", "0.35em")
                    .attr("fill", "white");
                updateSeries();
            }

            function updateSeries() {
                var updates = [];
                for (var i = 0; i < graphManifest.series.length; i++) {
                    var series = graphManifest.series[i];
                    updates.push(series);
                }
                for (var k = 0; k < updates.length; k++) {
                    var update = updates[k];
                    deleteSeries(update);
                    defineSeries(update);
                }
            }

            function deleteSeries(series) {
                series.route.gLine.remove();
                var index = graphManifest.series.indexOf(series);
                graphManifest.series.splice(index, 1);
            }

            function resetChart() {
                createGraph();
                //for (var i = 0; i < graphManifest.series.length; i++)
                  //  deleteSeries(graphManifest.series[i]);
            }

            function defineSeries(series) {
                var data = series.data,
                    update = false,
                    name = series.name;
                if ( data.quoteInfo.range[1] > graphManifest.range[1] ||
                    data.quoteInfo.range[0] < graphManifest.range[0]) {
                    graphManifest.range = data.quoteInfo.range;
                    graphManifest.range[1] = graphManifest.range[1];
                    graphManifest.range[0] = graphManifest.range[0];
                    update = true;
                }
                if (update) updateGraphAxis();
                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.date);
                    })
                    .y(function (d) {
                        return y(d[name])
                    });
                var path = contextGraph.append("path")
                    .datum(data['quotes'])
                    .attr("class", "line")
                    .attr("d", line)
                    .style("stroke", series.styling.line)
                    .style("pointer-events", "none");
                series.route = {
                    gLine: path,
                    dLine: line
                };
                graphManifest.series.push(series);
                //counter += 1;
                //alert(counter);
            }

            function setRange(range) {
                graphManifest.range = range;
                updateGraphAxis();
            }

            function setTimeframe(time) {
                graphManifest.domain = time;
                updateGraphAxis();
            }

            function setTickers(stocks) {
                tickers = stocks;
            }
            
            function outfitChart() {
                chart.pk = 0;
                chart.director = {
                    setContext: setTimeframe,
                    setRange: setRange,
                    setTickers: setTickers, //for legend listing
                    defineSeries: defineSeries,
                    deleteSeries: deleteSeries,
                    resetChart: resetChart, 
                    setBrush: setBrush,
                    stopBrushing: stopBrushing
                }
            }

           function moveHover() {
                //var x0 = x.invert(d3.mouse(this)[0]);
                //updateInspection(x0);
            }

            function brushed() {
                if (brush.empty())
                    stopBrushing();
                else
                    setBrush(brush.extent());
                contextService.setContext(brush.extent());
            }

            function stopBrushing() {
                for (var k = 0; k < graphManifest.series.length; k++)
                    graphManifest.series[k].styling.highlight = '';
                brushBox0.attr('x', -100);
                brushBox1.attr('x', -100);
                brushTag0.text('');
                brushTag1.text('');
            }

            function setBrush(dates) {
                var xPos = x(dates[0]) - 31;
                var xtra = (xPos < 30 ? 62 : 0);
                var h = height;
                brushBox0.attr('x', xPos + xtra).attr('y', h-15);
                brushTag0.text(formatDate(dates[0])).attr('x', xPos + xtra).attr('y', h-10);
                xPos = x(dates[1]) + 31;
                xtra  = (width - xPos < 30 ? -62 : 0);
                brushBox1.attr('x', xPos + xtra).attr('y', h-15);
                brushTag1.text(formatDate(dates[1]))
                    .attr('x', xPos+xtra).attr('y', h-10);
            }
        }
    }
}