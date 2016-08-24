app.controller('VisorMetricController', VisorMetricController);

VisorMetricController.$inject = [];

function VisorMetricController() {
    var $ctrl = this;
    
    $ctrl.$onInit = function() {
    };
    
    $ctrl.openMenu = function($mdOpenMenu, $event) {
        $mdOpenMenu();
    };
    
    return $ctrl;
}