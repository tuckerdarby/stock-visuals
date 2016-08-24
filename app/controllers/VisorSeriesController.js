app.controller('VisorSeriesController', VisorSeriesController);

VisorSeriesController.$inject = [];

function VisorSeriesController() {
    var $ctrl = this;

    $ctrl.$onInit = function() {
        $ctrl.info = {};
    };
    
    return $ctrl;
}
