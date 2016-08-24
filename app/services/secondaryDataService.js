app.service('secondaryDataService', secondaryDataService);

secondaryDataService.$inject = ['primaryDataService','indexService', 'archiveFactory'];

function secondaryDataService(primaryData, indexService, archiveFactory) {
    var self = this,
        maxStep = 500;

    self.createData = function (ticker, metrics, params, factors, inputFn) {
        return createChain(ticker, metrics, params, factors, inputFn);
    };

    self.getIdentity = function (ticker, params, factors) {
        var names = [ticker];
        factors.forEach(function (f) {
            names.push(f);
        });
        params.forEach(function (p) {
            names.push(p);
        });
        return names.join('-');
    };
    
    self.getFactorsList = function(factors) {
        var facts = [];
        factors.forEach(function (f) {
            facts.push(f.selectables[f.selected].name);
        });
        return facts;
    };

    return self;

    function createParamSwaft(index, indexSize, dayLength) {
        var swaft = [],
            current = index;
        while (current + dayLength < indexSize - 1) {
            var end = Math.min(current + maxStep + dayLength, indexSize - 1);
            swaft.push([current, end]);
            current = end - dayLength;
        }
        return {
            index: current,
            params: swaft
        };
    }

    function getInputs(dataMap, factors) {
        var inputDatas = [];
        factors.forEach(function (f) {
            inputDatas.push(dataMap.dataList[f]);
        });
        return inputDatas;
    }

    function chainBuildSwaft(updater, archive, primaryDataMap, factors, inputDataFn, inputParams) {
        var indexSize = indexService.getIndexSize(),
            paramSwaft = createParamSwaft(updater.index, indexSize, inputParams[0]),
            inputDatas = getInputs(primaryDataMap, factors);
        updater.index = paramSwaft.index;
        archive.addChainBuild(function (boundParam) {
            return inputDataFn(inputDatas, boundParam, inputParams);
        }, paramSwaft.params);
    }

    function createChain(ticker, metrics, inputParams, factors, inputDataFn) {
        var primaryArchive = primaryData.getData(ticker),
            primaryDataMap = primaryArchive.getDataMap(),
            indexSize = indexService.getIndexSize(),
            paramSwaft = createParamSwaft(0, indexSize, inputParams[0]),
            updater = {index: paramSwaft.index},
            inputDatas = getInputs(primaryDataMap, factors),
            chainArchive = archiveFactory.create(metrics, function (boundParam) {
                return inputDataFn(inputDatas, boundParam, inputParams);
            }, paramSwaft.params, indexSize);
        primaryArchive.addUpdateCall(function () {
            chainBuildSwaft(updater, chainArchive, primaryDataMap, factors, inputDataFn, inputParams);
        });
        return chainArchive;
    }
}
