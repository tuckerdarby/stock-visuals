app.service('chainService', chainService);

chainService.$inject = ['$q'];

function chainService($q) {
    var self = this;

    self.chainFunction = function(inputFn, paramList, resolveFn) {
        return chainPromise(inputFn, paramList, 0, resolveFn);
    };

    return self;
    
    function chainPromise(inputFn, paramList, index, resolveFn) {
        if (index < paramList.length) //backup
            return $q.when(inputFn(paramList[index])).then(function(result) {
                resolveFn(result);
                if (index + 1 < paramList.length && result != false)
                    chainPromise(inputFn, paramList, index + 1, resolveFn);
                return result;
            });
    }
}