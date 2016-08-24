app.controller('MarketController', MarketController);

MarketController.$inject = ['marketService'];

function MarketController(marketService) {
    var vm = this;
    
    vm.activate = function () {
        vm.info = {
            focusList: marketService.getMarketList()
        };
        marketService.registerRemoval(removeFocus);
    };
    
    function removeFocus(focus) {
        //var ind = vm.info.focusList.indexOf(focus);
        //vm.info.focusList.splice(ind);
    }
    
    vm.activate();
    
    return vm;
}