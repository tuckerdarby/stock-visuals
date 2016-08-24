app.controller('StockToastController', stockToastController);

stockToastController.$inject = ['$scope', '$mdToast'];

function stockToastController($scope, $mdToast) {
    var vm = this;
    
    vm.info = {
        loading: stockDataService.getLoading()
    };

}