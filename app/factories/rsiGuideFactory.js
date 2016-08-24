app.factory('rsiGuideFactory', rsiGuideFactory);

rsiGuideFactory.$inject = ['rsiDataService', 'guideService'];

function rsiGuideFactory(rsiService, guideService) {
    var dataService = rsiService;

    var RsiIndicator = function(seriesList, name, params, factorables) {
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
            return new RsiIndicator(series, name, params, factors);
        },
        get: function () {
            return RsiIndicator;
        }
    };

    function fetchArchive(ticker, params, factors) {
        var paramList = guideService.getParamValues(params);
        return dataService.getData(ticker, paramList, factors);
    }
}