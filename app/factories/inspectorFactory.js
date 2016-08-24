app.factory('inspectorFactory', inspectorFactory);

inspectorFactory.$inject = ['d3Service', 'indexService'];

function inspectorFactory(d3Service, indexService) {

    var d3 = d3Service.getD3(),
        xtra = 0,
        inspectors = [],
        bisectDate = d3.bisector(d3.descending).right;

    var Inspector = function() {
        var self = this,
            inspectionList = [],
            seriesMap = {},
            inspecting = false,
            canvasFrame,
            baseFrame,
            translate,
            canvas,
            axis,
            indexed = 0,
            indexDate = new Date(),
            xLocIndex = 0,
            dateInspector;
        
        self.registerGraph = function(chartGraph) {
            axis = chartGraph.getAxis();
            canvas = chartGraph.getCanvas();
            dateInspector = configureDates(chartGraph.getBaseSvg());
            canvasFrame = chartGraph.getCanvasFrame();
            baseFrame = chartGraph.getSvgFrame();
            translate = {
                left :chartGraph.getMargin().left,
                right: chartGraph.getMargin().right
            };
            chartGraph.getCover().overlay.on('mousemove', catchHover);
            inspecting = true;
        };
        
        self.registerSeries = function(series) {
            var inspection = configureInspection(series, canvas, axis);
            registerSeries(inspectionList, inspection, seriesMap, series);
        };
        
        self.deregisterSeries = function(series) {
            var inspection = seriesMap[series];
            inspectionList.splice(inspectionList.indexOf(inspection), 1);
            delete seriesMap[series];
        };

        self.setIndex = function(index, date, xPos) {
            indexed = index;
            indexDate = date;
            xLocIndex = xPos;
            updateInspections(axis, baseFrame, canvasFrame, dateInspector, inspectionList, indexed, indexDate, translate);
        };
        
        self.update = function() {
            if (inspecting) {
                //updateInspections(axis, canvasFrame, dateInspector, inspectionList, indexed, indexDate);
            }
        };
        
        return self;

        function catchHover() {
            var x0 = axis.xScale.invert(d3.mouse(this)[0]),
                date = new Date(x0),
                indexing = indexService.getIndex(),
                indexor = bisectDate(indexing, date);
            moveHover(date, indexor, x0);
        }
    };

    return {
        create: function() {
            var insp = new Inspector();
            inspectors.push(insp);
            return insp;
        }
    };

    function moveHover(xDate, index, x0) {
        inspectors.forEach(function(i) {
            i.setIndex(index, xDate, x0);
        });
    }
    
    function formatDate(date) {
        var mm = date.getMonth() + 1,
            dd = date.getDate(),
            yy = date.getFullYear();
        return [mm,dd,yy].join('-');
    }

    function updateLine(line, x1, x2, y1, y2) {
        line
            .attr('x1', x1).attr('y1', y1)
            .attr('x2', x2).attr('y2', y2);
    }

    function updateBox(box, x, y) {
        box.attr('x', x).attr('y', y);
    }

    function updateTag(tag, text) {
        tag.text(text);
    }

    function updateGroup(group, x, y) {
        group.attr('transform', ['translate(',x,',',y,')'].join(''));
    }
    
    function updateInspections(axis, baseFrame, canvasFrame, dateInsp, inspections, index, date, translate) {
        var width = canvasFrame.width,
            height = baseFrame.height,
            xLoc = axis.xScale(date) + translate.left;
        updateLine(dateInsp.line, xLoc, xLoc, 0, height);
        updateTag(dateInsp.tag, formatDate(date));
        updateGroup(dateInsp.group, (xLoc + translate.left < canvasFrame.width - translate.right ? xLoc: canvasFrame.width - translate.left - translate.right), 0);
        inspections.forEach(function(insp) {
            var data = insp.series.getDataMap(),
                value = (data.length > index ? data[index].toFixed(2) : 0),
                showing = insp.series.getSelected(),
                yLoc = (showing ? axis.yScale(value) : -100);
            insp.series.info.value = value;
            updateLine(insp.line, 0, width, yLoc, yLoc);
            updateGroup(insp.group, width, yLoc);
            //updateBox(insp.box, width+xtra, yLoc);
            updateTag(insp.tag, value);
        });
    }

    function registerSeries(inspectionList, inspection, seriesMap, series) {
        inspectionList.push(inspection);
        seriesMap[series] = inspection;
        series.addDestroyCallback(function() {
            destroyInspection(inspection);
            inspectionList.splice(inspectionList.indexOf(inspection));
            delete seriesMap[series];
        });
    }
    
    
    
    function configureDates(svg) {
        var dateLine,
            combo = makeGroup(svg, 'white');
        dateLine = makeLine(svg);
        combo.box.style('width', '10vh');
        return {
            line: dateLine,
            box: combo.box,
            tag: combo.tag,
            group: combo.group
        };
    }

    function destroyInspection(inspection) {
        inspection.series = null;
        inspection.line.remove();
        inspection.box.remove();
        inspection.tag.remove();
    }
    
    function configureInspection(series, canvas) {
        var priceLine,
            combo;
        priceLine = makeLine(canvas);
        combo = makeGroup(canvas, series.info.color);
        return {
            series: series,
            line: priceLine,
            box: combo.box,
            tag: combo.tag,
            group: combo.group
        }
    }

    function makeGroup(canvas, color) {
        var g = canvas.append('g'),
            box = g.append('rect')
                .attr('x', 0)
                .style('width', '4vh')
                .style('height', '2vh')
                .attr('fill', 'black')
                .attr('fill-opacity', 0.5)
                .attr('stroke', color)
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0.8),
            tag = g.append('text')
                .attr('font-size', '1.2em')
                .attr('transform', 'translate(2,15)')
                .style('fill', 'white');
        return {
            group: g,
            box: box,
            tag: tag
        };
    }
    
    function makeText(canvas) {
        var text = canvas.append('text')
            .attr('font-size', '1.2em')
            .style('fill', 'white');
        return text;
    }
    
    function makeBox(canvas, color) {
        var box = canvas.append('rect')
            .attr('x', -100)
            .style('width', '4vh')
            .style('height', '2vh')
            .attr('fill', 'black')
            .attr('fill-opacity', 0.5)
            .attr('stroke', color)
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.8);
        return box;
    }
    
    function makeLine(canvas) {
        var line = canvas.append('line')
            .attr('class', 'priceLine')
            .style('stroke', 'black')
            .style('stroke-dasharray', '3,3')
            .style('opacity', 1)
            .attr('x1', -100)
            .attr('x2', -100)
            .style('pointer-events', 'none');
        return line;
    }
}