app.controller('MetricController', MetricController);

MetricController.$inject = ['outlineService'];

function MetricController(outlineService) {
    var $ctrl = this;

    $ctrl.$onInit = function() {

        $ctrl.info = {
            name: $ctrl.metric.getTitle(),
            selected: $ctrl.metric.getSelected(),
            liner: $ctrl.metric.info.lining,
            linings: outlineService.getLiningBrands(),
            liningIcon: '',
            color: $ctrl.metric.getTheme(),
            colors: outlineService.getBaseColors(),
            background: {'background-color': $ctrl.metric.getTheme()}
        };
        $ctrl.info.liningIcon = outlineService.getLiner($ctrl.info.liner).icon;
    };

    $ctrl.toggleMetric = function() {
        $ctrl.metric.toggle();
    };
    
    $ctrl.openMenu = function($mdOpenMenu, $event) {
        $mdOpenMenu();
    };

    $ctrl.setLining = function(lining) {
        $ctrl.metric.setLining(lining.name);
        $ctrl.info.liningIcon = lining.icon;
    };

    $ctrl.setTheme = function(color) {
        $ctrl.metric.setTheme(color);
        $ctrl.info.color = color;
    };
    
    return $ctrl;
}