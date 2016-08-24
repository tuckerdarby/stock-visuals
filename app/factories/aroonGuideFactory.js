app.factory('aroonGuideFactory', aroonGuideFactory);

aroonGuideFactory.$inject = ['aroonDataService', 'guideService'];

function aroonGuideFactory(aroonService, guideService) {
    var dataService = aroonService;

    var AroonIndicator = function(seriesList, name, params, factorables) {
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
            return new AroonIndicator(series, name, params, factors);
        },
        get: function () {
            return AroonIndicator;
        }
    };

    function fetchArchive(ticker, params, factors) {
        var paramList = guideService.getParamValues(params);
        return dataService.getData(ticker, paramList, factors);
    }
}