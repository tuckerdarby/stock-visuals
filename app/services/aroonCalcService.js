app.service('aroonCalcService', aroonCalcService);

aroonCalcService.$inject = [];

function aroonCalcService() {
    var self = this;

    self.calculateData = function(datas, bounds, skip) {
        console.log(datas);
        return calcAroonData(datas, bounds, skip);
    };

    return self;

    function findAroonRange(high, low, day, d) {
        var dMin = d,
            dMax = d;
        for (var i = 0; i < day; i++) {
            var dNew = d + i;
            if (dNew >= high.length)
                break;
            if (high[dNew] >= high[dMax])
                dMax = dNew;
            if (low[dNew] <= low[dMin])
                dMin = dNew;
        }
        return [dMin, dMax];
    }

    function calcAroonData(datas, bounds, skip) {
        var high = datas[0],
            low = datas[1],
            up = [],
            down = [],
            dr = findAroonRange(high, low, skip, bounds[0]),
            dMin = dr[0],
            dMax = dr[1];
        console.log('AROON');
        console.log(high);
        console.log(low);
        console.log(datas);
        for (var d = bounds[0], n=bounds[1]; d + skip < n; d++) {
            var aroonDown = Math.min(1,(skip - (dMin - d))/skip),
                aroonUp = Math.min(1,(skip - (dMax - d))/skip);
            up.push(aroonUp);
            down.push(aroonDown);
            var dNew = d+skip;
            if (dMax < d)
                dMax = findAroonRange(high, low, skip, d)[1];
            else if (high[dNew] >= high[dMax])
                dMax = dNew;
            if (dMin < d)
                dMin = findAroonRange(high, low, skip, d)[0];
            else if (low[dNew] <= low[dMin])
                dMin = dNew;
        }
        console.log(up);
        console.log(down);
        return {
            datas: {
                'aroon-up': up,
                'aroon-down': down
            },
            info: {
                size: d,
                range: [0, 1],
                domain: bounds
            }
        };
    }
}