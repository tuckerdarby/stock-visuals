app.factory('brushFactory', brushFactory);

brushFactory.$inject = ['d3Service'];

function brushFactory(d3Service) {

    var d3 = d3Service.getD3();

    var Brush = function(brushFn, domain) {
        var self = this,
            brushing = false,
            frame,
            canvas,
            axis,
            positions = [0,0],
            positionDates = [0,0],
            positionLocations = [0,0],
            brush,
            catcher,
            context = domain,
            grasp = {},
            brushed = brushFn;
        
        self.registerGraph = function(chartGraph) {
            axis = chartGraph.getAxis();
            canvas = chartGraph.getCanvas();
            frame = chartGraph.getSvgFrame();
            grasp = configureGrasp(canvas);
            brush = d3.svg.brush().x(axis.xScale).on("brush", function() {
                brushed(brush);
            });
            catcher = configureCatcher(chartGraph.getCover().overlay, brush);

        };

        self.getBrush = function() {
            return brush;
        };

        self.setBrush = function(dates, indexes) {
            brushing = true;
            positions = indexes;
            positionDates = dates;
            brush.extent(dates);
            d3.selectAll('.brush').call(brush);
            positionLocations = [axis.xScale(positionDates[0]), axis.xScale(positionDates[1])];
            updateGrasp(grasp, positionDates, positionLocations);
        };

        self.registerSeries = function() {};
        self.deregisterSeries = function() {};

        self.clearBrush = function() {
            brushing = false;

            brush.clear();
        };

        self.update = function() {

        };

        return self;
    };

    return {
        create: function() {
            var brush = new Brush();
            brushes.push(brush);
            return brush;
        },
        get: function() {
            return Brush;
        }
    };

    function configureCatcher(overlay, brush) {
        overlay
            .attr('class', 'x brush')
            .call(brush).selectAll('rect')
            .attr("y", 0)
            .style("height", '100%')
            .attr('stroke', 'white')
            .attr('fill', 'white')
            .attr('fill-opacity', 0.01);
    }

    function updateGrasp(grasp, dates, xLocs) {
        grasp.early.group.attr('transform', ['translate(',xLocs[0],',',0,')'].join(''));
        grasp.early.tag.text(formatDate(dates[0]));
        grasp.late.group.attr('transform', ['translate(',xLocs[1],',',0,')'].join(''));
        grasp.late.tag.text(formatDate(dates[1]));
        //update x and y of early and late
    }

    function configureGrasp(canvas) {
        var early = makeGroup(canvas, 'white'),
            late = makeGroup(canvas, 'white');
        return {
            early: early,
            late: late
        };
    }

    function formatDate(date) {
        var mm = date.getMonth() + 1,
            dd = date.getDate(),
            yy = date.getFullYear();
        return [mm,dd,yy].join('-');
    }

    function makeGroup(canvas, color) {
        var g = canvas.append('g'),
            box = g.append('rect')
                .attr('x', 0)
                .style('width', '8vh')
                .style('height', '2vh')
                .attr('fill', 'black')
                .attr('fill-opacity', 0.5)
                .attr('stroke', color)
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0.8),
            tag = g.append('text')
                .attr('font-size', '1.1em')
                .attr('transform', 'translate(2,15)')
                .style('fill', 'white');
        return {
            group: g,
            box: box,
            tag: tag
        };
    }
}