app.component('directorComponent', {
    bindings: {focus: '='},
    controller: DirectorController,
    controllerAs: '$ctrl',
    replace: true,
    require: {
        focus: '^focusComponent'
    },
    templateUrl: 'templates/directorTemplate.html'
});

DirectorController.$inject = ['directorFactory'];

function DirectorController(directorFactory) {
    var $ctrl = this,
        director;

    $ctrl.$onInit = function() {
        director = configureDirector();
        $ctrl.focus.registerDirector(director);
        $ctrl.info = {
            indicators: director.getIndicators(),
            title: $ctrl.focus.getTitle()
        };
    };

    $ctrl.getIndicatorBrands = function(name) {
        return director.getIndicatorBrands();
    };

    $ctrl.addIndicator = function(name) {
        director.addIndicator(name);
    };

    $ctrl.removeIndicator = function(indicator) {
        director.removeIndicator(indicator);
    };

    return $ctrl;

    function configureDirector() {
        return directorFactory.create();
    }
}