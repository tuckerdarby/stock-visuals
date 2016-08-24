app.component('brushComponent', {
    restrict: 'E',
    scope: {},
    replace: true,
    bindings: {
        brand: '='
    },
    require: {
        chart: '^chartComponent'
    },
    controller: BrushController
});

BrushController.$inject = ['brushService'];

function BrushController(brushService) {
    var $ctrl = this,
        brush;// = brushService.getBrush();

    $ctrl.$onInit = function() {
        brush = brushService.getBrush($ctrl.brand);
        $ctrl.chart.registerComponent(brush, 'brush');
    };

    return $ctrl;
}