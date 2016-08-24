app.service('marketService', marketService);

marketService.$inject = ['d3Service'];

function marketService(d3Service) {
    var self = this,
        tickers = [],
        marketList = [],
        marketCount = 0,
        focusRemove,
        focusList = [];

    self.registerRemoval = function(fn) {
        focusRemove = fn;
    };
    
    self.getMarketList = function() {
        return marketList;
    };
    
    self.addStock = function(ticker) {
        tickers.push(ticker);
        if (marketCount == 0) {
            createFocus({name: 'general', title: 'General'});
        }
        else
           for (var i=0, n=focusList.length; i<n; i++)
             focusList[i].addStock(ticker);
    };

    self.addFocus = function(brand) {
        createFocus(brand);
    };

    self.removeFocus = function(focus) {
        focusRemove(focus);
    };

    self.registerContext = function(context) {
        for (var i=0, n=tickers.length; i<n; i++)
            context.addStock(tickers[i]);
    };

    self.registerFocus = function(focus) {
        focusList.push(focus);
        for (var i=0, n=tickers.length; i<n; i++)
            focus.addStock(tickers[i]);
    };
    
    self.removeStock = function(ticker) {
        
    };
    
    self.showStock = function(ticker) {
        
    };
    
    self.hideStock = function(ticker) {
        
    };

    self.setContext = function(dates) {
        focusList.forEach(function (focus) {
            focus.setContext(dates);
        });
    };
    
    self.setTimeFrame = function(years) {
        
    };

    return self;

    function createFocus(input) {
        marketList.push({
            brand: input.name,
            title: input.title,
            pk: marketCount
        });
        marketCount += 1;
    }
}