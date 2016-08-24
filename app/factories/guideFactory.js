app.factory('guideFactory', guideFactory);

guideFactory.$inject = [];

function guideFactory() {

    var Guide = function (stockName, metricNames, paramList, factorList, seriesList) {
        var self = this,
            ticker = stockName,
            metrics = metricNames,
            params = paramList,
            factors = factorList,
            seriesMap = mapSeries(seriesList, metricNames);

        self.update = function () {
            updateIndicator(archive, seriesMap, ticker, metrics, params, factors);
        };

        return self;
    };

    return {
        create: function () {
            return new Guide();
        },
        get: function () {
            return Guide;
        }
    };

    function mapSeries(seriesList, metrics) {
        var seriesMap = {};
        for (var i = 0, n = seriesList.length; i < n; i++) {
            var name = seriesList[i].getMetric();
            metrics.push(name);
            seriesMap[name] = seriesList[i];
        }
        return seriesMap;
    }

    function updateSeries(dataMap, seriesMap, metrics) {
        metrics.forEach(function (k) {
            seriesMap[k].define(dataMap.dataList[k], dataMap.dataRange);
        });
    }

    function getParamValues(params) {
        var vals = [];
        params.forEach(function (p) {
            vals.push(p.val);
        });
        return vals;
    }

    function updateGuide(seriesMap, ticker, metrics, params, factors) {
        var paramVals = getParamValues(params);
        
    }

    function updateIndicator(archive, seriesMap, ticker, metrics, params, factors) {
        var paramValues = getParamValues(params),
            archive = fetchArchive(ticker, paramValues, factors);
        archive.addUpdateCall(function () {
            updateSeries(archive.getDataMap(), seriesMap, metrics);
        });
    }
}