app.factory('directorFactory', directorFactory);

directorFactory.$inject = [];

function directorFactory() {

    var Director = function() {
        var self = this,
            focus;

        self.setFocus = function(focal) {
            focus = focal;
        };

        self.getIndicators = function() {
            return focus.getIndicators();
        };
        
        self.getIndicatorBrands = function() {
            return focus.getIndicatorBrands();
        };

        self.addIndicator = function(name) {
            focus.addIndicator(name);
        };
        
        self.removeIndicator = function(indicator) {
            focus.removeIndicator(indicator);
        };

        return self;
    };

    return {
        create: function(focused) {
            return new Director(focused);
        }
    };
}