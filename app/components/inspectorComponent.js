app.component('inspectorComponent', {
    require: {
        chart: '^chartComponent'
    },
    replace: true,
    controller: InspectorController,
    controllerAs: '$ctrl'
});

InspectorController.$inject = ['inspectorFactory'];

function InspectorController(inspectorFactory) {
    var $ctrl = this,
        inspector = inspectorFactory.create();

    $ctrl.$onInit = function() {
        $ctrl.chart.registerComponent(inspector, 'inspector');
    };

    return $ctrl;
}