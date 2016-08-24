app.factory('composerFactory', composerFactory);

composerFactory.$inject = ['d3Service', 'trackerFactory', 'indexService'];

function composerFactory(d3Service, trackerFactory, indexService) {
    
    var d3 = d3Service.getD3(),
        linerFab = {
            'line': drawLine,
            'area': drawArea,
            'bar': drawBar
        },
        linerDump = {
            'line': removePath,
            'area': removePath,
            'bar': removeBar
        };
    
    var Composer = function(graph) {
        var self = this,
            canvas = graph.getCanvas(),
            frame = graph.getCanvasFrame(),
            axis = graph.getAxis(),
            linings = {
                'line': configureLine(axis),
                'area': configureArea(axis, frame),
                'bar': configureBar(axis, frame)
            },
            seriesList = [],
            dataInfo = {
                bars: []
            };

        //series functions
        self.registerSeries = function(series) {
            configureSeries(series, seriesList, self);
            seriesList.push(series);
        };
        
        self.deregisterSeries = function(series) {
            removeSeries(series, seriesList);
        };

        self.redrawAll = function() {
            for(var i=0, n=seriesList.length; i<n; i++)
                seriesList[i].redraw();
        };
        //chart-graph functions
        self.draw = function(data, color, liner) {
            return drawTracker(canvas, data, color, linings[liner], liner, dataInfo);
        };

        self.erase = function(path, liner) {
            eraseTracker(path, liner, dataInfo);
        };

        return self;
    };

    return {
        create: function(graph) {
            return new Composer(graph);
        }
    };

    function removePath(path) {
        path.remove();
    }
    
    function removeBar(bar, dataInfo) {
        console.log('REMOVING BAR');
        console.log(bar);
        console.log(dataInfo);
        bar.paths.forEach(function (path) {
            path.remove();
        });
        //data leak occurs here
        // if (dataInfo.bars.indexOf(bar) > -1)
        //     dataInfo.bars.splice(dataInfo.bars.indexOf(bar));
    }

    function destroyFromGraph(path) {
        if (path != false)
            path.remove();
        path = null;
    }

    function removeSeries(series, seriesList) {
        seriesList.splice(seriesList.indexOf(series), 1);
    }
    
    function configureSeries(series, seriesList, drawer) {
        var tracker = trackerFactory.create(series, drawer);
        series.setTracker(tracker);
        series.addDestroyCallback(function() {
            removeSeries(series, seriesList);
            tracker.remove();
        });
    }

    function drawTracker(canvas, data, color, lining, liner, dataInfo) {
        var doodle = linerFab[liner](canvas, data, color, lining, dataInfo);
        return doodle;
    }

    function eraseTracker(path, liner, dataInfo) {
        linerDump[liner](path, dataInfo);
    }
    
    function drawBar(canvas, data, color, lining, dataInfo) {
        var index = indexService.getIndex(),
            height = lining.height(),
            width = lining.bandWidth(),
            bar = {data: data, color: color, paths:{}},
            paths;
        dataInfo.bars.push(bar);
        paths = canvas.selectAll(".barseries")
            .data(dataInfo.bars)
            .enter().append('g')
            .attr('class', 'barseries')
            .attr('fill', function (d) {return d.color})
            .attr('fill-opacity', 0.4)
            .selectAll('rect')
            .data(function(d) {return d.data;})
            .enter().append('rect')
            .attr('x', function(d, i) {return lining.xScale(index[i])})
            .attr('y', function(d, i) {return lining.yScale(d)})
            .attr('height', function(d) {return height - lining.yScale(d)})
            .attr('width', width);
        bar.paths = paths[0];
        return bar;
    }

    function drawLine(canvas, data, color, lining) {
        var indexes = indexService.getIndex();
        if (data.length > 0 && indexes.length > 0) {
            var path = canvas.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', lining(indexes, data))
                .style('stroke', color);
            return path;
        }
        return false;
    }

    function drawArea(canvas, data, color, lining) {
        var indexes = indexService.getIndex();
        if (data.length > 0 && indexes.length > 0) {
            var path = canvas.append('path')
                .datum(data)
                .attr('class', 'area')
                .attr('d', lining(indexes, data))
                .attr('stroke', color)
                .style('fill', color)
                .style('fill-opacity', 0.2);
            return path;
        }
        return false;
    }

    function configureBar(axis, frame) {
        return {
            xScale: function(value) {return axis.xScale(value)},
            yScale: function(value) {return axis.yScale(value)},
            height: function() {return frame.height},
            bandWidth: function () {
                var x = d3.scale.ordinal().rangeRoundBands([0, frame.width]);
                x.domain(indexService.getIndex());
                return x.rangeBand();
            }
        };
    }

    function configureArea(axis, frame) {
        var areaing = function(x, y) {
            return d3.svg.area()
                .x(function(d, i) {
                    return axis.xScale(x[i]);
                })
                .y0(function() {return frame.height;})
                .y1(function(d, i) {
                    return axis.yScale(y[i]);
                });
        };
        return areaing;
    }

    function configureLine(axis) {
        var lining = function(x, y) {
            return d3.svg.line()
                .x(function(d, i) {
                    return axis.xScale(x[i]);
                })
                .y(function(d, i) {
                    return axis.yScale(y[i]);
                });
        };
        return lining;
    }
}