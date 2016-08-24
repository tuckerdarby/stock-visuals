app.service('indexService', indexService);

indexService.$inject = [];

function indexService() {
    var self = this,
        index = [];
    
    self.setIndex = function(indexList) {
        index = indexList;
    };
    
    self.getIndex = function() {
        return index;
    };
    
    self.getIndexSize = function() {
        return index.length;
    };
    
    return self;
}