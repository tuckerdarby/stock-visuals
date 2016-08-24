app.service('primaryDataService', primaryDataService);

primaryDataService.$inject = ['yqlService', 'archiveFactory', 'indexService'];

function primaryDataService(yqlService, archiveFactory, indexService) {
    var self = this,
        added = [],
        metrics = ['high', 'low', 'open', 'close', 'dates'], //replace with outline service?
        archives = {},
        index = [],
        totalYears = 3,
        step = 6,
        bounds = configureDateBounds();
    
    self.getData = function(ticker) {
        if (added.indexOf(ticker) == -1)
            createIndicator(ticker);
        return archives[ticker];
    };

    self.getIndex = function() {
        return index;
    };
    
    return self;

    function getPrimaryData(ticker, dates) {
        return yqlService.getData(ticker, dates[0], dates[1]);
    }

    function updateIndex(ticker) {
        index = archives[ticker].getDataMap().dataList['dates'];
        indexService.setIndex(index);
    }
    
    function createIndicator(ticker) {
        archives[ticker] = archiveFactory.create(metrics, 
            function(dates) {return getPrimaryData(ticker, dates)}, bounds, 0);
        archives[ticker].addUpdateCall(function() {
            updateIndex(ticker);
        });
        added.push(ticker);
    }

    function getStartDate() {
        var start = new Date();
        start = new Date(start.setMonth((new Date()).getMonth() - 6));
        start = new Date(start.setHours(start.getHours() + 25));
        return start;
    }

    function configureDateBounds() {
        var start = getStartDate(),
            end = new Date(),
            bounds = [];
        for (var i=0, n = totalYears*2; i<n; i++) {
            bounds.push([new Date(start), new Date(end)]);
            start = new Date(start.setMonth(start.getMonth() - step));
            end = new Date(end.setMonth(end.getMonth() - step));
        }
        return bounds;
    }
}