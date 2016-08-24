app.component('slabComponent', {
    restrict: 'E',
    scope: {},
    controller: SlabController,
    replace: true,
    transclude: {
        director: 'directorComponent',
        charter: 'chartComponent',
        legend: '?legendComponent'
    },
    require: {
        focuser: '^focusComponent'
    },
    templateUrl: 'templates/slabTemplate.html'
});

SlabController.$inject = ['$scope', '$element', '$mdComponentRegistry', '$timeout'];

function SlabController($scope, $element, $mdComponentRegistry, $timeout) {
    var $ctrl = this,
        sideNav,
        sideNavName = 'operatorNav',
        prevHeight = $element[0].getBoundingClientRect().height,
        prevWidth = $element[0].getBoundingClientRect().width,
        bounds,
        ready = true;

    $ctrl.$onInit = function() {
        bounds = $element[0].getBoundingClientRect();
        $ctrl.info = {
            showingLegend: true
        };
        $ctrl.sizing = [
            {'height': '15vh'},
            {'min-height': '15vh'},
            {'max-height': '100%'}
        ];
    };

    $scope.$watch(function() {
        if (ready) {
            bounds = $element[0].getBoundingClientRect();
            return (bounds.height == prevHeight && bounds.width == prevWidth ? 0 : 1);
        }
        return 0
    },
    function() {
        $ctrl.focuser.updateWindow();
        ready = false;
        prevWidth = bounds.width;
        prevHeight = bounds.height;
        $timeout(function() {ready = true;}, 300);
    }, true);

    $ctrl.openOperator = function () {
        sideNav.open();
    };

    $ctrl.isOpenOperator = function () {
        return false;
    };

    $ctrl.closeOperator = function () {
        sideNav.close();
    };

    $ctrl.toggleLegend = function() {
        $ctrl.info.showingLegend = !$ctrl.info.showingLegend;
    };

    $ctrl.toggleChartFormat = function() {
        $ctrl.focuser.toggleChartFormat();
    };

    $ctrl.toggleGridLines = function() {
        $ctrl.focuser.toggleGridLines();
    };

    $mdComponentRegistry.when(sideNavName).then(function (it) {
        if (sideNav == undefined) {
            var deregister = $mdComponentRegistry.register(it, sideNavName);
            sideNav = $mdComponentRegistry.get(it.$$mdHandle);
            //alert(sideNav.$$mdHandle);
            deregister();
            var name = "opNav" + 2;
            $mdComponentRegistry.register(sideNav, name);
        }
    });

    return $ctrl;
}