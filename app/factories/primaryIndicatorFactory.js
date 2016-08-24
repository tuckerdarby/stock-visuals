app.factory('primaryIndicatorFactory', primaryIndicatorFactory);

primaryIndicatorFactory.$inject = ['primaryDataService', 'guideService'];

function primaryIndicatorFactory(primaryService, guideService) {
    var dataService = primaryService;

    var PrimaryIndicator = function(seriesList, name) {
        var self = this,
            ticker = name,
            metrics = [],
            seriesMap = guideService.mapSeries(seriesList, metrics),
            archive = fetchArchive(ticker);
        
        guideService.updateIndicator(archive, seriesMap, metrics);
        
        self.update = function() {
            archive = fetchArchive(ticker);
            guideService.updateIndicator(archive, seriesMap, metrics);
        };
        
        return self;
    };

    return {
        create: function(series, name) {
            return new PrimaryIndicator(series, name);
        },
        get: function () {
            return PrimaryIndicator;
        }
    };
    
    function fetchArchive(ticker) {
        return dataService.getData(ticker);
    }
}