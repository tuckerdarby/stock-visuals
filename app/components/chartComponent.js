app.component('chartComponent', {
    restrict: 'E',
    scope: {},
    require: {
        focus: '^focusComponent'
    },
    transclude: true,
    replace: true,
    controller: ChartController,
    controllerAs: '$ctrl',
    templateUrl: 'templates/chartTemplate.html'//: '<div style="min-width: 100%; min-height: 100%;" ng-transclude></div>'

});

ChartController.$inject = ['chartFactory'];

function ChartController(chartFactory) {
    var $ctrl = this,
        chart,
        comps = [],
        elem,
        activated = false;

    $ctrl.registerElement = function(element) {
        elem = element;
        activated = true;
        chart = chartFactory.create(element);
        comps.forEach(function(c) {
            chart.registerComponent(c.comp, c.name);
        });
        $ctrl.focus.registerChart(chart);
    };

    $ctrl.registerComponent = function(comp, name) {
        if (activated)
            chart.registerComponent(comp, name);
        else
            comps.push({comp: comp, name: name});
    };

    return $ctrl;
}