app.controller('NavOptionsController', NavOptionsController);

NavOptionsController.$inject = [];

function NavOptionsController() {
    var $ctrl = this;

    $ctrl.$onInit = function() {

    };

    $ctrl.openMenu = function($mdOpenMenu, $event) {
        $mdOpenMenu();
    };
}