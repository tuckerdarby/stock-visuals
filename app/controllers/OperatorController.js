app.controller('OperatorController', OperatorController);

OperatorController.$inject = [];

function OperatorController() {
    var $ctrl = this;
    
    $ctrl.$onInit = function() {
        $ctrl.info = {
            title: $ctrl.indicator.getTitle(),
            selected: $ctrl.indicator.getSelected(),
            parameters: $ctrl.indicator.getParameters(),
            factors: $ctrl.indicator.getFactors()
        };
        $ctrl.showing = {
            metrics: false,
            parameters: false,
            parents: false
        };
    };

    $ctrl.removeIndicator = function() {
        $ctrl.director.removeIndicator($ctrl.indicator);
    };

    $ctrl.toggleIndicator = function() {
        $ctrl.indicator.toggle();
    };

    $ctrl.updateIndicator = function() {
        $ctrl.indicator.update();
    };

    $ctrl.toggleMetrics = function() {
        $ctrl.showing.metrics = !$ctrl.showing.metrics;
        $ctrl.showing.parameters = false;
        $ctrl.showing.parents = false;
    };

    $ctrl.toggleParameters = function() {
        $ctrl.showing.metrics = false;
        $ctrl.showing.parameters = !$ctrl.showing.parameters;
        $ctrl.showing.parents = false;
    };

    $ctrl.toggleParents = function() {
        $ctrl.showing.metrics = false;
        $ctrl.showing.parameters = false;
        $ctrl.showing.parents = !$ctrl.showing.parents;
    };

    return $ctrl;
    
}