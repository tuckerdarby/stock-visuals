app.factory('operatorFactory', operatorFactory);

operatorFactory.$inject = ['optionFactory'];

function operatorFactory(optionFactory) {

    var Operator = function() {
        var self = this;

        return self;
    };

    return {
        create: function() {
            return new Operator();
        }
    };
}