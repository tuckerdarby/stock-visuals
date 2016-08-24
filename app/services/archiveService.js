app.factory('archiveService', archiveService);

archiveService.$inject = ['$q'];

function archiveService($q) {
    var self = this;

    self.create = function(metricNames, promises) {
        return createStub(metricNames, promises);
    };

    return self;

    function createStub(metrics, promises) {
        var dataStub = {
            metrics: metrics,
            datas: {},
            pending: promises
        };
        for (var i=0, n=metrics.length; i<n; i++)
            dataStub.datas[metrics[i]] = [];
        watchStub(dataStub);
        return dataStub;
    }

    function watchStub(stub) {
        var pending = stub.pending,
            metrics = stub.metrics,
            datas = stub.datas;
        for (var i=0, n=pending.length; i<n; i++) {
            var promise = pending[i],
                index = i;
            $q.when(promise).then(function (result) {
                for (var k=0, m=metrics.length; k<m; k++) {
                    datas[metrics[k]] = datas[metrics[k]].concat(result.datas[metrics[k]]);
                }
                pending.splice(index, 1);
                return result;
            });
        }
    }


}