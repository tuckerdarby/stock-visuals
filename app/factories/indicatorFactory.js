app.factory('indicatorFactory', indicatorFactory);

indicatorFactory.$inject = ['metricFactory', 'indicatorService', 'outlineService'];

function indicatorFactory(metricFactory, indicatorService, outlineService) {

    var Indicator = function(name) {
        var self = this,
            brand = name,
            identity = createIdentifier(name),
            metrics = createMetrics(brand, self),
            parameters = createParameters(brand),
            factors = createFactors(brand),
            dataMap = {},
            seriesList = [],
            tickers = [],
            selected = true;

        self.getTitle = function() {
            return identity.title;
        };
        
        self.getName = function() {
            return brand;
        };

        self.getMetrics = function() {
            return metrics;
        };
        
        self.getSelected = function() {
            return selected;
        };

        self.getParameters = function() {
            return parameters;
        };

        self.getFactors = function() {
            return factors;
        };

        self.addTicker = function(ticker) {
            var series = [];
            tickers.push(ticker);
            for (var i=0, n=metrics.length; i<n; i++) {
                var resultingSeries = metrics[i].addSeries(ticker);
                series = series.concat(resultingSeries);
            }
            seriesList = seriesList.concat(series);
            dataMap[ticker] = indicatorService.createIndicator(brand, ticker, series, parameters, factors);
            return series;
        };
        
        self.select = function() {
            selected = true;
            showMetrics(metrics);
        };
        
        self.deselect = function() {
            selected = false;  
            hideMetrics(metrics);
        };
        
        self.show = function() {
            if (selected)
                showMetrics(metrics);
        };
        
        self.hide = function() {
            hideMetrics(metrics);
        };

        self.toggle = function() {
            if (selected)
                hideMetrics(metrics);
            else
                showMetrics(metrics);
            selected = !selected;
        };
        
        self.update = function() {
            for (var i=0, n=tickers.length; i<n; i++)
                dataMap[tickers[i]].update();
        };
        
        self.destroy = function() {
            for (var i=0, n=metrics.length; i<n; i++)
                metrics[i].destroy();
        };
        
        return self;
    };

    return {
        create: function(name) {
            return new Indicator(name);
        }
    };
    
    function createIdentifier(name) {
        return outlineService.getIndicator(name);
    }
    
    function createParameters(name) {
        return outlineService.getParameters(name);
    }
    
    function createFactors(name) {
        return outlineService.getFactors(name);
    } 
    
    function createMetrics(name, indicator) {
        var inserts = outlineService.getMetrics(name),
            metrics = [];
        for (var i=0, n=inserts.length; i<n; i++) {
            var metric = metricFactory.create(indicator, inserts[i]);
            metrics.push(metric);
        }
        return metrics;
    }
    
    function showMetrics(metrics) {
        for (var i=0, n=metrics.length; i<n; i++) 
            metrics[i].show();
    }
    
    function hideMetrics(metrics) {
        for (var i=0, n=metrics.length; i<n; i++)
            metrics[i].hide();
    }

    
}