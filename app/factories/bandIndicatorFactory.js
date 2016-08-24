app.factory('bandIndicatorFactory', bandIndicatorFactory);

bandIndicatorFactory.$inject = ['bandDataService', 'guideService'];

function bandIndicatorFactory(bandService, guideService) {
    var dataService = bandService;

    var BandIndicator = function(seriesList, name, params, factorables) {
        var self = this,
            ticker = name,
            metrics = [],
            parameters = params,
            factors = factorables,
            seriesMap = guideService.mapSeries(seriesList, metrics),
            archive = fetchArchive(ticker, parameters, factors);

        guideService.updateIndicator(archive, seriesMap, metrics);
        
        self.update = function() {
            archive = fetchArchive(ticker, parameters, factors);
            guideService.updateIndicator(archive, seriesMap, metrics);
        };
        
        return self;
    };

    return {
        create: function(series, name, params, factors) {
            return new BandIndicator(series, name, params, factors);
        },
        get: function () {
            return BandIndicator;
        }
    };

    function fetchArchive(ticker, params, factors) {
        var paramList = guideService.getParamValues(params);
        return dataService.getData(ticker, paramList, factors);
    }
}