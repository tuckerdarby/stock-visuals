app.service('guideService', guideService);

guideService.$inject = [];

function guideService() {
    var self = this;
    
    self.mapSeries = function(seriesList, metrics) {
        var seriesMap = {};
        for (var i=0, n=seriesList.length; i<n; i++) {
            var name = seriesList[i].getMetric();
            metrics.push(name);
            seriesMap[name] = seriesList[i];
        }
        return seriesMap;
    };
    
    self.getParamValues = function(params) {
        var vals = [];
        params.forEach(function(p) {
            vals.push(p.val);
        });
        return vals;
    };

    self.updateIndicator = function(archive, seriesMap, metrics) {
        archive.addUpdateCall(function () {
            updateSeries(archive.getDataMap(), seriesMap, metrics);
        });
    };

    self.getFactorList = function (factors) {
        var facts = [];
        factors.forEach(function (f) {
            facts.push(f.selectables[f.selected].name);
        });
        return facts;
    };
    
    return self;
    
    function updateSeries(dataMap, seriesMap, metrics) {
        metrics.forEach(function (k) {
            seriesMap[k].define(dataMap.dataList[k], dataMap.dataRange);
        });
    }
}