app.service('portfolioService', portfolioService);

portfolioService.$inject = ['marketService', 'yqlService', 'outlineService'];

function portfolioService(marketService, yqlService, outlineService) {
    var self = this,
        tickersList = [],
        stockList = [],
        indicatorTypes = outlineService.getFocusList();
    
    self.getStocks = function() {
        return stockList;
    };

    self.addStock = function(input) {
        var ticker = cleanTicker(input),
            valid = false;
        if (tickersList.indexOf(ticker) > -1) return true;
        valid = checkTicker(ticker);
        if (valid)
            createStock(ticker);
        return valid;
    };

    self.getIndicators = function() {
        return indicatorTypes;
    };
    
    self.addIndicator = function(input) {
        marketService.addFocus(input);
    };
    
    self.showStock = function(ticker) {
        //call to marketService
    };
    
    self.hideStock = function(ticker) {
        //call to marketService
    };

    return self;
    
    function cleanTicker(ticker) {
        return ticker.toUpperCase().trim();
    }
    
    function checkTicker(ticker) {
        return true;
    }
    
    function createStock (ticker) {
        stockList.push({
            ticker: ticker,
            selected: (tickersList.length == 0)
        });
        tickersList.push(ticker);
        marketService.addStock(ticker);
    }
}