app.controller('PortfolioController', PortfolioController);

PortfolioController.$inject = ['portfolioService'];

function PortfolioController(portfolioService) {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        $ctrl.info = {
            selected: '',
            stocks: portfolioService.getStocks()
        };
    };

    $ctrl.openPortfolio = function($mdOpenMenu, $event) {
        $mdOpenMenu($event);
    };

    $ctrl.addStock = function() {
        var ticker = $ctrl.info.selected;
        portfolioService.addStock(ticker);
    };

    $ctrl.toggleStock = function(stock) {
        if (stock.selected)
            portfolioService.hideStock(stock);
        else 
            portfolioService.showStock(stock);
    };

    $ctrl.clearPortfolio = function() {

    };

    return $ctrl;
}