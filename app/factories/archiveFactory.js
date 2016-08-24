app.factory('archiveFactory', archiveFactory);

archiveFactory.$inject = ['chainService'];

function archiveFactory(chainService) {
    
    var Archive = function(keys, inputFn, params, size) {
        var self = this,
            dataSize = ( size == undefined ? 0 : size),
            dataMap = configureDataMap(keys, params, dataSize),
            updateCalls = [],
            promise = initializePromise(dataMap, inputFn, updateCalls, dataSize);
        
        self.getDataMap = function() {
            return dataMap;
        };

        self.addUpdateCall = function(call) {
            updateCalls.push(call);
        };

        self.addChainBuild = function(buildFn, buildParams) {
            chainBuildArchive(dataMap, buildFn, updateCalls, buildParams);
        };

      return self;
    };

    return {
        create: function(keys, inputFn, params) {
            return new Archive(keys, inputFn, params);
        },
        setIndex: function(size) {

        }
    };

    function initializePromise(dataMap, inputFn, updateList, size) {
        if (dataMap.paramList.length > 0) {
            if (size == 0)
                return chainBuildArchive(dataMap, inputFn, updateList, dataMap.paramList);
            return chainArchive(dataMap, inputFn, updateList);
        }
        return false;
    }

    function callUpdates(updateList) {
        angular.forEach(updateList, function(updateCall) {
            updateCall();
        });
    }

    function updateArchive(result, dataMap, updateList) { //chain resolve function
        var keys = dataMap.dataKeys;
        if (result == false) return;
        mapArchive(dataMap, result);
        for (var i=0, n=result.info.size; i<n; i++) {
            keys.forEach(function (k) {
                dataMap.dataList[k][dataMap.paramIndex] = result.datas[k][i];
            });
            dataMap.paramIndex += 1;
        }
        callUpdates(updateList);
    }

    function buildArchive(result, dataMap, updateList) {
        var keys = dataMap.dataKeys;
        if (result == false) return;
        mapArchive(dataMap, result);
        keys.forEach(function (k) {
            dataMap.dataList[k] = dataMap.dataList[k].concat(result.datas[k]);
        });
        callUpdates(updateList);
    }

    function mapArchive(dataMap, result) {
        var max = Math.max(dataMap.dataRange[1], result.info.range[1]),
            min = Math.min(dataMap.dataRange[0], result.info.range[0]);
        dataMap.dataRange = [min, max];
    }

    function chainBuildArchive(dataMap, inputFn, updateList, paramList) {
        return chainService.chainFunction(inputFn, paramList, function(result) {
            buildArchive(result, dataMap, updateList);
        });
    }

    function chainArchive(dataMap, inputFn, updateList) {
        return chainService.chainFunction(inputFn, dataMap.paramList, function(result) {
            updateArchive(result, dataMap, updateList)
        });
    }

    function configureDataMap(keys, params, size) {
        var dataMap = {
            paramIndex: 0,
            paramList: params,
            dataKeys: keys,
            dataList: {},
            dataRange: [9999, 0]
        };
        keys.forEach(function(k) {
            dataMap.dataList[k] = Array.apply(null, new Array(size))
                .map(Number.prototype.valueOf,0);
        });
        return dataMap;
    }
}