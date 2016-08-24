app.service('aroonDataService', aroonDataService);

aroonDataService.$inject = ['secondaryDataService', 'aroonCalcService'];

function aroonDataService(secondaryService, aroonCalcService) {
    var self = this,
        added = [],
        metrics = ['aroon-up', 'aroon-down'],
        archives = {};

    self.getData = function(ticker, params, factors) {
        var factorsList = ['high', 'low'],
            identity = secondaryService.getIdentity(ticker, params, factorsList);
        /*if (added.indexOf(identity) == -1) {
            archives[identity] = createAroon(ticker, params, factorsList);
            added.push(identity);
        }*/
        return createAroon(ticker, params, factorsList);//archives[identity];
    };

    return self;

    function getAroonData(metricDatas, bounds, params) {
        return aroonCalcService.calculateData(metricDatas, bounds, params[0]);
    }
    
    function createAroon(ticker, params, factors) {
        return secondaryService.createData(ticker, metrics, params, factors, getAroonData);
    }
}