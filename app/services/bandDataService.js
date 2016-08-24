app.service('bandDataService', bandDataService);

bandDataService.$inject = ['secondaryDataService', 'bandCalcService'];

function bandDataService(secondaryService, bandCalcService) {
    var self = this,
        added = [],
        metrics = ['band-up', 'band-down', 'band-mid', 'band-width'],
        archives = {};

    self.getData = function(ticker, params, factors) {
        var factorsList = secondaryService.getFactorsList(factors),
            identity = secondaryService.getIdentity(ticker, params, factorsList);
        //if (added.indexOf(identity) == -1) {
        //    archives[identity] = createBand(ticker, params, factorsList);
         //   added.push(identity);
        //}
        return createBand(ticker, params, factorsList);//archives[identity];
    };

    return self;

    function getBandData(metricDatas, bounds, params) {
        return bandCalcService.calculateData(metricDatas[0], bounds, params[0]);
    }
    
    function createBand(ticker, params, factors) {
        return secondaryService.createData(ticker, metrics, params, factors, getBandData);
    }
}