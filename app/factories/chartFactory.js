app.factory('chartFactory', chartFactory);

chartFactory.$inject = ['graphFactory', 'composerFactory'];

function chartFactory(graphFactory, composerFactory) {

    var Chart = function (ele) {
        var self = this,
            graph = graphFactory.create(ele),
            composer = composerFactory.create(graph),
            dataInfo = {
                domain: [new Date((new Date()).setFullYear((new Date().getFullYear()) - 3)), new Date()],
                range: [999, 1]
            },
            seriesList = [],
            components = [],
            componentMap = {};

        graph.updateAxisData(dataInfo.domain, dataInfo.range);
        
        self.setContext = function(dates) {
            dataInfo.domain = dates;
            graph.updateAxisData(dataInfo.domain, dataInfo.range);
            composer.redrawAll();
            componentsUpdate(components);
        };

        self.registerSeries = function (series) {
            var changed = updateChartRange(self, dataInfo.range, series.getRange());
            if (changed) self.updateChart();
            composer.registerSeries(series);
            seriesList.push(series);
            for (var i=0, n=components.length; i<n; i++)
                components[i].registerSeries(series);
            addUpdateCall(self, series, dataInfo);
        };
        
        self.registerComponent = function(component, name) {
            components.push(component);
            componentMap[name] = component;
            component.registerGraph(graph);
            for (var i=0, n=seriesList.length; i<n; i++)
                component.registerSeries(seriesList[i]);
        };
        
        self.updateComponents = function() {
            componentsUpdate(components);
        };

        self.updateWindow = function() {
            graph.updateFraming();
            composer.redrawAll();
        };

        self.updateChart = function () {
            graph.updateAxisData(dataInfo.domain, dataInfo.range);
            composer.redrawAll();
            componentsUpdate(components);
        };

        self.toggleFormat = function() {
            graph.toggleFormat();
            composer.redrawAll();
            componentsUpdate(components);
        };
        
        self.toggleGridLines = function() {
            graph.toggleGridLines();
        };

        self.destroy = function() {

        };
        
        return self;
    };

    return {
        create: function (ele) {
            return new Chart(ele);
        }
    };

    function addUpdateCall(chart, series, dataInfo) {
        series.addUpdateCallback(function() {
            updateChartRange(chart, dataInfo.range, series.getRange());
        });
    }

    function updateChartRange(chart, chartRange, seriesRange) {
        var before = [chartRange[0], chartRange[1]];
        chartRange[0] = Math.min(chartRange[0], seriesRange[0]);
        chartRange[1] = Math.max(chartRange[1], seriesRange[1]);
        if (chartRange[0] != before[0] || chartRange[1] != before[1]) {
            chart.updateChart();
            return true;
        }
        return false;
    }
    
    function componentsUpdate(components) {
        for (var i=0, n=components.length; i<n; i++)
            components[i].update();
    }

}