app.controller('OptionController', OptionController);

OptionController.$inject = [];

function OptionController() {
    var $ctrl = this;
    
    $ctrl.$onInit = function() {
        console.log($ctrl.option);
        $ctrl.info = {
            
        };
    };
}