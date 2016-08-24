app.controller('ToolsController', ToolsController);

ToolsController.$inject = [];

function ToolsController() {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        $ctrl.info = {
            toolGroup: 0,
            toolTypes: [{
                title: 'Difference',
                tip: 'Find the change in values between time periods.',
                value: 0
            },
            {
                title: 'Average',
                tip: 'Find the average in values between time periods.',
                value: 1
            }]
        };
    };

    $ctrl.openToolsMenu = function($mdOpenMenu, $event) {
        $mdOpenMenu();
    };

    $ctrl.setHighlightTool = function(identifier) {
        
    };
}