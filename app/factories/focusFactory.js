app.factory('focusFactory', focusFactory);

focusFactory.$inject = ['managerFactory', 'marketService'];

function focusFactory(managerFactory, marketService) {

    var Focus = function(name) {
        var self = this,
            brand = name,
            manager = createManager(brand),
            seriesList = manager.getSeries(),
            tickers = [],
            chart = false;

        self.getName = function() {
            return brand;
        };

        self.registerChart = function(inputChart) {
            chart = inputChart;
            linkChart(chart, seriesList);
        };
        
        self.addStock = function(ticker) {
            var series = manager.addTicker(ticker);
            if (chart != false)
                addSeries(series, chart);
            tickers.push(ticker);
        };

        self.getStocks = function() {
            return tickers;
        };
        
        self.addIndicator = function(name) {
            var series = manager.addIndicator(name);
            if (chart != false)
                addSeries(series, chart);
        };
        
        self.removeIndicator = function(indicator) {
            manager.removeIndicator(indicator);
        };
        
        self.getIndicators = function() {
            return manager.getIndicators();
        };
        
        self.getIndicatorBrands = function() {
            return manager.getIndicatorBrands();
        };
        
        self.toggleChartFormat = function() {
            chart.toggleFormat();
        };

        self.toggleGridLines = function() {
            chart.toggleGridLines();
        };

        self.updateWindow = function() {
            if (chart != false)
                chart.updateWindow();
        };
        
        self.setContext = function(dates) {
            chart.setContext(dates);
        };
        
        self.destroy = function() {
            if (chart != false)
                chart.destroy();
            manager.destroy();
            marketService.removeFocus(self);
        };

        return self;
    };

    function addSeries(series, chart) {
        if (chart != undefined)
            for (var i = 0, n = series.length; i<n; i++)
                chart.registerSeries(series[i]);
    }
    
    function createManager(name) {
        return managerFactory.create(name);
    }

    function linkChart(chart, series) {
        for (var i=0, n=series.length; i<n; i++)
            chart.registerSeries(series[i]);
    }

    return {
        create: function(name) {
            var focus;
            if (name == 'context') {
                focus = new Focus('general');
                marketService.registerContext(focus);
            }
            else {
                focus = new Focus(name);
                marketService.registerFocus(focus);
            }
            return focus;
        }
    };
}