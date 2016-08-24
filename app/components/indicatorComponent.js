app.component('indicatorComponent', {
    restrict: 'E',
    scope: {},
    bindings: {
        indicator: '='
    },
    controller: IndicatorController
});

function IndicatorController() {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        alert($ctrl.indicator);
    };

    $ctrl.toggleIndicator = function() {
        if ($ctrl.indicator.getSelected())
            $ctrl.indicator.show();
        else 
            $ctrl.indicator.hide();
    };
    
    $ctrl.updateIndicator = function() {
        return $ctrl.indicator.update();
    };
    
    $ctrl.getParameters = function() {
        return $ctrl.indicator.getParameters();
    };
    
    $ctrl.getMetrics = function() {
        return $ctrl.indicator.getMetrics();
    };
    
    $ctrl.getFactors = function() {
        return $ctrl.indicator.getFactors();
    };
    
    return $ctrl;
}