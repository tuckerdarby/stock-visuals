app.controller('BottomNavController', BottomNavController);

BottomNavController.$inject = ['$mdBottomSheet'];

function BottomNavController($mdBottomSheet) {
    var $ctrl = this;

    $ctrl.openBottomPage = function() {
        $mdBottomSheet.show({
            templateUrl: 'templates/bottomPageTemplate.html',
            controller: 'BottomPageController'
        })
    };

    return $ctrl;
}