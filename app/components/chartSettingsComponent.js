app.component('chartSettingsComponent', {
    controller: ChartSettingsController,
    controllerAs: '$ctrl',
    require: {
        slab: '^slabComponent',
        focus: '^focusComponent'
    },
    templateUrl: 'templates/chartSettingsTemplate.html'
});

ChartSettingsController.$inject = [];

function ChartSettingsController () {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        $ctrl.info = {
            legend: false,
            inspecting: true,
            brushing: true
        };
    };

    $ctrl.toggleLegend = function() {
        $ctrl.slab.toggleLegend();
    };

    $ctrl.toggleInspect = function() {
        $ctrl.focus.toggleInspect();
    };

    $ctrl.toggleBrush = function() {
        $ctrl.focus.toggleBrush();
    };
    
    $ctrl.removeFocus = function() {
        $ctrl.focus.removeFocus();
    };

    $ctrl.openSettings = function($mdOpenMenu, $event) {
        $mdOpenMenu();
    };
}