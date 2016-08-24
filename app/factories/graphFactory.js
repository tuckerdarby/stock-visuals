app.factory('graphFactory', graphFactory);

graphFactory.$inject = ['d3Service'];

function graphFactory(d3Service) {
    
    var d3 = d3Service.getD3();
    
    var Graph = function(baseElement) {
        var self = this,
            base = baseElement,
            svgFrame = configureBaseFrame(base),
            svg = configureSvg(base, svgFrame), //used for overall svg uses
            margins = configureMargins(svgFrame), //margin between graph svg and overall svg
            usingMargin = 0,
            canvasMargin = margins[0],
            canvasFrame = configureCanvasFrame(svgFrame, canvasMargin), // graph height/width settings etc.
            canvas = configureCanvas(svg, canvasFrame, canvasMargin), //
            axis = configureAxis(canvas, canvasFrame),
            gridSize = 1,
            cover = configureCover(svg, canvasFrame, canvasMargin);

        self.getBaseSvg = function() {
            return svg;
        };
        
        self.getMargin = function() {
            return canvasMargin;
        };

        self.getCanvas = function() {
            return canvas;
        };

        self.getSvgFrame = function() {
            return svgFrame;
        };

        self.getCanvasFrame = function() {
            return canvasFrame;
        };
        
        self.getAxis = function() {
            return axis;
        };
        
        self.getCover = function() {
            return cover;
        };

        self.toggleGridLines = function() {
            if (gridSize == 0)
                gridSize = 1;
            else
                gridSize = 0;
            updateAxis(axis, canvas, canvasFrame, gridSize);

        };

        self.toggleFormat = function() {
            usingMargin += 1;
            if (usingMargin == margins.length)
                usingMargin = 0;
            canvasMargin = margins[usingMargin];
            updateCanvasFrame(canvasFrame, svgFrame, canvasMargin);
            updateCanvas(canvas, canvasFrame, canvasMargin);
            updateAxis(axis, canvas, canvasFrame, gridSize);
            updateCover(cover, canvasFrame, canvasMargin);
        };
        
        self.updateFraming = function() {
            updateBaseFrame(svgFrame, base);
            updateSvg(svg, svgFrame);
            //canvasMargin = configureMargin(svgFrame); //only needed if margin becomes dynamic
            updateCanvasFrame(canvasFrame, svgFrame, canvasMargin);
            updateCanvas(canvas, canvasFrame, canvasMargin);
            updateAxis(axis, canvas, canvasFrame, gridSize);
            updateCover(cover, canvasFrame, canvasMargin);
        };
        
        self.updateAxisData = function(domain, range) {
            axis.domain = domain;
            axis.range = range;
            updateAxis(axis, canvas, canvasFrame, gridSize);
        };

        return self;
    };

    function updateAxis(axis, canvas, canvasFrame, axisSize) {
        axis.xScale = d3.time.scale().range([0, canvasFrame.width]).domain(axis.domain);
        axis.yScale =  d3.scale.linear().range([canvasFrame.height, 0]).domain(axis.range);
        axis.xAxis = d3.svg.axis().scale(axis.xScale).orient('bottom')
            .innerTickSize(-canvasFrame.height*axisSize).outerTickSize(0);
        axis.yAxis = d3.svg.axis().scale(axis.yScale).orient('left')
            .innerTickSize(-canvasFrame.width*axisSize).outerTickSize(0);
        axis.xSvg
            .attr('transform', 'translate(0,'+canvasFrame.height+')')
            .call(axis.xAxis);
        axis.ySvg.call(axis.yAxis);
    }

    function updateCover(cover, frame, margin) {
        //cover.capture
        //    .attr('width', frame.width).attr('height', frame.height)
        //    .attr('transform', 'translate('+margin.left+','+margin.right+')');
        cover.overlay
            .attr('width', frame.width).attr('height', frame.height);
           // .attr('transform', 'translate('+margin.left+','+margin.top+')');
    }

    function updateCanvasFrame(frame, baseFrame, margin) {
        frame.width = baseFrame.width - margin.left - margin.right;
        frame.height = baseFrame.height - margin.top - margin.bottom;
    }

    function updateCanvas(canvas, canvasFrame, canvasMargin) {
        canvas.attr('transform', 'translate(' + canvasMargin.left + ',' + canvasMargin.top + ')');
       //     .style('pointer-events', 'none');
    }

    function updateBaseFrame(frame, base) {
        var bounds = base.getBoundingClientRect();
        frame.height = bounds.height;//d3.select(base)[0][0].offsetHeight;
        frame.width = bounds.width;//d3.select(base)[0][0].offsetWidth;
    }

    function updateSvg(svg, svgFrame) {
        svg.attr('width', svgFrame.width).attr('height', svgFrame.height);
        svg.attr("viewBox", [0,0,svgFrame.width, svgFrame.height].join(' '));
    }
    
    function configureCover(svg, frame, margin) {
        var capture = svg.append('rect')
                .attr('transform', 'translate('+margin.left+','+0+')')
                .style('width', '100%').style('height', '100%')
                .style('fill', 'none')
                .style('pointer-events', 'all'),
            overlay = svg.append('g')
                .style('fill', 'none')
                .attr('class', 'x overlay')
                .attr('transform', 'translate(' + margin.left+','+0+')');
        return {
            capture: capture,
            overlay: overlay
        };
    }

    function configureAxis(canvas, canvasFrame) {
        var domain = [0, 100],
            range = [0, 1],
            xScale = d3.time.scale().range([0, canvasFrame.width]).domain(domain),
            yScale =  d3.scale.linear().range([canvasFrame.height, 0]).domain(range),
            xAxis = d3.svg.axis().scale(xScale).orient('bottom')
                .innerTickSize(-canvasFrame.height).outerTickSize(0),
            yAxis = d3.svg.axis().scale(yScale).orient('left')
                .innerTickSize(-canvasFrame.width).outerTickSize(0),
            xSvg = canvas.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,'+canvasFrame.height+')')
                .style('pointer-events', 'none')
                .call(xAxis),
            ySvg = canvas.append('g')
                .attr('class', 'y axis')
                .style('pointer-events', 'none')
                .call(yAxis);
        return {
            domain: domain,
            range: range,
            xScale: xScale,
            yScale: yScale,
            xSvg: xSvg,
            ySvg: ySvg
        };
    }

    function configureCanvas(svg, canvasFrame, canvasMargin) {
        var canvas = svg.append('g').attr('class', 'focusGraph')
            .style('width', '100%').style('height', '100%')
            //.attr('height', canvasFrame.height).attr('width', canvasFrame.width)
            .attr('transform', 'translate(' + canvasMargin.left + ',' + canvasMargin.top + ')');
        return canvas;
    }

    function configureMargins() {
        return [
            {
                top: 30,
                right: 30,
                bottom: 20,
                left: 20,
                header: 5
            },
            {
                top: 0,
                right: 30,
                bottom: 20,
                left: 20,
                header: 5
            },
            {
                top: 0,
                right: 30,
                bottom: 0,
                left: 20,
                header: 5
            },
            {
                top: 30,
                right: 30,
                bottom: 0,
                left: 20,
                header: 5
            }
        ]
    }
    
    function configureCanvasFrame(baseFrame, margin) {
        var width = baseFrame.width - margin.left - margin.right,
            height = baseFrame.height - margin.top - margin.bottom;
        return {
            height: height,
            width: width
        };
    }
    
    function configureBaseFrame(base) {
        var bounds = base.getBoundingClientRect();
        return {
            height: bounds.height,
            width: bounds.width
        };
    }

    function configureSvg(base, svgFrame) {
        var div = d3.select(base).append('div')
            .style('margin', '0')
            .style('padding', '0')
            .style('height', '100%')
            .style('width', '100%'),
            svg = div.append('svg')
                .attr('width', svgFrame.width)
                .attr('height', svgFrame.height)
                .attr("viewBox", [0, 0, svgFrame.width, svgFrame.height].join(' '));
        svg.append('defs')
            .append('clipPath').attr('id', 'clip')
            .append('rect').style('width', '100%').style('height', '100%');
        //svg.attr("viewBox", [0,0,svgFrame.width, svgFrame.height].join(' '));
        return svg;
    }

    return {
        create: function(ele) {
            return new Graph(ele);
        }
    };
}