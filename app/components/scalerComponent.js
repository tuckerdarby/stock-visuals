app.component('scalerComponent', {
    restrict: 'E',
    scope: {},
    bindings: {
        param: '='
    },
    require: {
        operator: '^operatorComponent'
    },
    controller: ScalerController,
    controllerAs: '$ctrl',
    templateUrl: 'templates/scalerTemplate.html'
});

function ScalerController() {
    var $ctrl = this;


    $ctrl.$onInit = function() {
        
    };
    
    $ctrl.updateParameter = function() {
        $ctrl.operator.updateIndicator();
    };

    return $ctrl;
}