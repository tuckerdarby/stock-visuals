app.service('indicatorService', indicatorService);

indicatorService.$inject = ['primaryIndicatorFactory', 'bandIndicatorFactory', 'aroonGuideFactory', 'rsiGuideFactory'];

function indicatorService(primary, bolinger, aroon, rsi) {
    var self = this,
        indicators = {
            primary: primary,
            bands: bolinger,
            aroon: aroon,
            rsi: rsi
        };

    self.createIndicator = function(name, ticker, series, params, factors) {
        return indicators[name].create(series, ticker, params, factors);
    };
    
    return self;
}