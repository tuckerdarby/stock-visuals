app.service('focusService', focusService);

focusService.$inject = [];

function focusService() {
    var self = this,
        focusList = [],
        context;

    self.registerFocus = function(focus) {
        focusList.push(focus);
    };
    
    self.setContext = function(dates) {
        context = dates;
    };
    
    

    return self;
}