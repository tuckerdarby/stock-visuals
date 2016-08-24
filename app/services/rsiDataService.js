app.service('rsiDataService', rsiDataService);

rsiDataService.$inject = ['secondaryDataService', 'rsiCalcService'];

function rsiDataService(secondaryService, rsiCalcService) {
    var self = this,
        added = [],
        metrics = ['rsi', 'avg-gain', 'avg-loss'],
        archives = {};

    self.getData = function(ticker, params, factors) {
        var factorsList = secondaryService.getFactorsList(factors),
            identity = secondaryService.getIdentity(ticker, params, factorsList);
        //if (added.indexOf(identity) == -1) {
        //    archives[identity] = createRsi(ticker, params, factorsList);
        //    added.push(identity);
        //}
        return createRsi(ticker, params, factorsList);//archives[identity];
    };

    return self;

    function getRSIData(metricDatas, bounds, params) {
        return rsiCalcService.calculateData(metricDatas[0], bounds, params[0]);
    }
    
    function createRsi(ticker, params, factors) {
        return secondaryService.createData(ticker, metrics, params, factors, getRSIData);
    }
}