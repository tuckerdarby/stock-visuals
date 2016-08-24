app.component('addIndicatorComponent', {
    restrict: 'E',
    scope: {},
    require: {
        director: '^directorComponent'
    },
    controller: AddIndicatorController,
    controllerAs: '$ctrl',
    templateUrl: 'templates/addIndicatorTemplate.html'
});

AddIndicatorController.$inject = [];

function AddIndicatorController(outlineService) {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        $ctrl.info = {
            indicators: $ctrl.director.getIndicatorBrands()
        }
    };

    $ctrl.addIndicator = function(name) {
        $ctrl.director.addIndicator(name);
    };

    $ctrl.openMenu = function($mdOpenMenu, $event) {
        $mdOpenMenu();
    };

    return $ctrl;
}