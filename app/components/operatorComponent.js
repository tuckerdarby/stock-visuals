app.component('operatorComponent', {
    restrict: 'E',
    transclude: {
        'scales': '?operatorScales',
        'categories': '?operatorCategories',
        'determiner': '?operatorDeterminers'
    },
    scope: {},
    bindings: {
        indicator: '='
    },
    require: {
        director: '^directorComponent'
    },
    controller: 'OperatorController',
    templateUrl: 'templates/operatorTemplate.html'
});

