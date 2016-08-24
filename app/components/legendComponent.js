app.component('legendComponent', {
    require: {
        focus: '^focusComponent'
    },
    replace: true,
    controller: LegendController,
    controllerAs: '$ctrl',
    templateUrl: 'templates/legendTemplate.html'
});

function LegendController() {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        $ctrl.info = {
            visors: $ctrl.focus.getIndicators(),
            stocks: $ctrl.focus.getStocks()
        };
    };

    return $ctrl;
}