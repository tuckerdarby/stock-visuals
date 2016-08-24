app.service('stockService', stockService);

stockService.$inject = ['$q', 'yqlService', 'archiveService'];

function stockService($q, yqlService, archiveService) {
    var self = this,
        market = {},
        step = 250,
        totalSteps = 1500;

    self.addStock = function(ticker) {
        var batch;
        if (market[ticker] == undefined) {
            market[ticker] = createArchive(ticker, totalSteps);
            batch = createPrimaryBatch(ticker);
            market[ticker].createIndicator('primary', batch);
        }
    };

    self.serveIndicator = function(indiID, ticker) {
        if (market[ticker].getStatus(indiID) == 0)
            batchIndicator(indiID, ticker);
    };

    self.serveSeries = function(indiID, metricID, ticker) {
        return market[ticker].getStub(indiID, metricID);
    };

    function batchIndicator(indicatorID) {

    }

    function createArchive(totalSteps) {

    }

    function createPrimaryBatch(ticker) {
        var steps = 0,
            batch = [];
        while (steps < totalSteps) {
            var partial = $q(yqlService.getDataMap(ticker, steps, step));
            batch.push(partial);
            steps += step;
        }
        return batch;
    }

    function createCalculatedBatch(indicatorName, parameters, references, ticker) {

    }


    return self;
}