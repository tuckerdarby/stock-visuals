app.factory('managerFactory', managerFactory);

managerFactory.$inject = ['indicatorFactory', 'colorFactory', 'outlineService'];

function managerFactory(indicatorFactory, colorFactory, outlineService) {

    var Manager = function(name) {
        var self = this,
            brand = name,
            colorManager = colorFactory.create(),
            brands = configureBrands(brand),
            indicators = configureIndicators(brands),
            seriesList = [],
            tickers = [],
            tickerMap = {};

        self.getName = function() {
            return brand;
        };

        self.getIndicators = function() {
            return indicators;
        };
        
        self.getIndicatorBrands = function() {
            return brands;
        };

        self.getTickerSeries = function(ticker) {
            if (tickers.indexOf(ticker) == -1) return [];
            return tickerMap[ticker];
        };

        self.addIndicator = function(name) {
            var indicator = indicatorFactory.create(name),
                series = [];
            for (var i=0, n=tickers.length; i<n; i++)
                series = series.concat(indicator.addTicker(tickers[i]));
            colorSeries(colorManager, series);
            indicators.push(indicator);
            return series;
        };
        
        self.addTicker = function(ticker) {
            var series = [];
            for (var i=0, n=indicators.length; i<n; i++)
                series = series.concat(indicators[i].addTicker(ticker));
            tickerMap[ticker] = series;
            tickers.push(ticker);
            colorSeries(colorManager, series);
            mergeSeries(seriesList, series);
            return series;
        };

        self.removeIndicator = function(indicator) {
            var index = indicators.indexOf(indicator);
            indicators[index].destroy();
            indicators.splice(index, 1);
        };

        self.getSeries = function() {
            return seriesList;
        };

        self.destroy = function() {
            var indis = [];
            indicators.forEach(function(indi) {
                indi.destroy();
                indis.push(indi);
            });
            indis.forEach(function(indi) {
                indicators.splice(indicators.indexOf(indi), 1);
            });
        };

        return self;
    };

    return {
        create: function(name) {
            return new Manager(name);
        }
    };

    function colorSeries(colorManager, seriesArr) {
        for (var i=0, n=seriesArr.length; i<n; i++)
            colorManager.register(seriesArr[i]);
    }

    function mergeSeries(seriesList, seriesArr) {
        for (var i=0, n=seriesArr.length; i<n; i++)
            seriesList.push(seriesArr[i]);
    }

    function configureIndicators(brands) {
        var indicators = [];
        for (var i=0, n=brands.length; i<n; i++) {
            var indicator = indicatorFactory.create(brands[i]);
            indicators.push(indicator);
        }
        return indicators;
    }

    function configureBrands(brand) {
        return outlineService.getFocusIndicators(brand)
    }
}
