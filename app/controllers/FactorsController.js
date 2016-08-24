app.controller('FactorsController', FactorsController);

FactorsController.$inject = [];

function FactorsController() {
    var $ctrl = this;
    
    $ctrl.$onInit = function() {
        $ctrl.info = {
            factors: $ctrl.indicator.getParameters()
        };
    };
    
    $ctrl.updateParameter = function() {
        $ctrl.indicator.update();
    };
    
    return $ctrl;
}