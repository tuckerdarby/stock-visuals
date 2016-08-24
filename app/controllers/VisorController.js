app.controller('VisorController', VisorController);

VisorController.$inject = [];

function VisorController() {
    var $ctrl = this;
    
    $ctrl.$onInit = function() {
        
    };

    $ctrl.openMenu = function($mdOpenMenu, $event) {
        $mdOpenMenu();
    };
}