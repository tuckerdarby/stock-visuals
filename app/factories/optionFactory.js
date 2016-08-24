app.factory('optionFactory', optionFactory);

optionFactory.$inject = [];

function optionFactory() {

    var Option = function(input) {
        var self = this,
            subject = input;
        
        return self;
    };

    return {
        create: function(input) {
            return new Option(input);
        }
    };
}