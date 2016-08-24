app.directive('chartDirective', chartDirective);

chartDirective.$inject = [];

function chartDirective() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        require: {
            charter: '^chartComponent'
        },
        link: chartDirectiveLink,
        template: '<div style="min-width: 100%; min-height: 100%; height: 100%; max-height: 100%; margin: 0; padding: 0;"></div>'
    };

    function chartDirectiveLink(scope, ele, attr, $ctrl) {
        var createChart = function(elem) {
            $ctrl.charter.registerElement(elem);
        };
        
        createChart(ele[0]);
    }
}