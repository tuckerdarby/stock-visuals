app.component('optionComponent', {
    require: {operator: '^^operatorComponent'},
    bindings: {option: '='},
    controller: 'OptionController',
    templateUrl: 'templates/optionTemplate.html'
});