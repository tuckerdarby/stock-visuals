app.component('focusComponent', {
    restrict: 'E',
    scope: {},
    controller: FocusController,
    controllerAs: '$ctrl',
    bindings: {focus: '='},
    replace: true,
    transclude: true,
    templateUrl: 'templates/focusTemplate.html'
});

FocusController.$inject = ['focusFactory'];

function FocusController(focusFactory) {
    var $ctrl = this,
        focus;

    $ctrl.$onInit = function() {
        focus = focusFactory.create($ctrl.focus.brand);
    };

    $ctrl.getTitle = function() {
        return $ctrl.focus.title;
    };

    $ctrl.getStocks = function() {
        return focus.getStocks();
    };

    $ctrl.getIndicators = function() {
        return focus.getIndicators();
    };

    $ctrl.registerChart = function(chart) {
        focus.registerChart(chart);
    };

    $ctrl.registerDirector = function(director) {
        director.setFocus(focus);
    };

    $ctrl.registerLegend = function(legend) {
        legend.setFocus(focus);
    };

    $ctrl.toggleChartFormat = function() {
        focus.toggleChartFormat();
    };

    $ctrl.toggleGridLines = function() {
        focus.toggleGridLines();
    };
    
    $ctrl.toggleInspect = function() {
        focus.toggleInspect();
    };
    
    $ctrl.toggleBrush = function() {
        focus.toggleBrush();
    };

    $ctrl.updateWindow = function() {
        focus.updateWindow();
    };

    $ctrl.removeFocus = function() {
        focus.destroy();
    };

    return $ctrl;
}