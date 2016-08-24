app.component('factorComponent', {
    restrict: 'E',
    scope: {},
    bindings: {
        factor: '='
    },
    controller: 'FactorController',
    require: {
        indicator: '^indicatorComponent'
    },
    templateUrl: 'templates/factorTemplate.html'
});