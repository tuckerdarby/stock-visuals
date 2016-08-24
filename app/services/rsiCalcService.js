app.service('rsiCalcService', rsiCalcService);

rsiCalcService.$inject = [];

function rsiCalcService() {
    var self = this;

    self.calculateData = function(data, bounds, skip) {
        return calcRSIData(data, bounds, skip);
    };
    
    return self;

    function findRSIRange(data, day, d) {
        var losses = 0,
            gains = 0;
        for (var i = 0; i < day; i++) {
            var diff = data[d + i+ day + 1] -  data[d + i+ day];
            if (diff > 0) gains += diff;
            else losses -= diff;
        }
        losses = losses / day;
        gains = gains / day;
        return [losses, gains];
    }

    function calcRSIData(data, bounds, skip) {
        var rsiData = [],
            gainData = [],
            lossData = [],
            dr = findRSIRange(data, skip, bounds[0]),
            avgLoss = dr[0],
            avgGain = dr[1];
        for (var d = bounds[0], n=bounds[1]; d + skip < n; d++) {
            var rsi = 1 - (1 / (1 + avgGain / avgLoss));
            rsiData.push(rsi);
            gainData.push(avgGain);
            lossData.push(avgLoss);
            var gain = 0,
                loss = 0,
                diff = data[d+1] - data[d];
            if (diff > 0) gain = diff;
            else loss = -diff;
            avgGain = (avgGain * (skip - 1) + gain)/skip;
            avgLoss = (avgLoss * (skip - 1) + loss)/skip;
        }
        return {
            datas: {
                'rsi': rsiData,
                'avg-gain': gainData,
                'avg-loss': lossData
            },
            info: {
                size: d,//bounds[1]-bounds[0],
                range: [0, 1],
                domain: bounds
            }
        };
    }

}