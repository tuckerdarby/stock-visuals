app.factory('legendFactory', legendFactory);

legendFactory.$inject = [];

function legendFactory() {

    var Legend = function() {
        var self = this;

        return self;
    };

    return {
        create: function() {
            return new Legend();
        }
    };
}