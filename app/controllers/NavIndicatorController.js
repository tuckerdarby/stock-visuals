app.controller('NavIndicatorController', NavIndicatorController);

NavIndicatorController.$inject = ['portfolioService'];

function NavIndicatorController( portfolioService) {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        $ctrl.info = {
            indicatorTypes: portfolioService.getIndicators()
        };
    };

    $ctrl.openIndicators = function($mdOpenMenu, $event) {
        $mdOpenMenu($event);
    };

    $ctrl.addIndicator = function(indicator, $event) {
        portfolioService.addIndicator(indicator)
    };
}