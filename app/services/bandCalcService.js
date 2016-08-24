app.service('bandCalcService', bandCalcService);

bandCalcService.$inject = [];

function bandCalcService() {
    var self = this;
    
    self.calculateData = function(data, bounds, skip) {
        return calcBolingerData(data, bounds, skip);
    };
    
    return self;

    function getAverage(data, d, range) {
        var total = 0;
        for (var i = 0; i < range; i++)
            total += data[d+i];
        return total/range;
    }

    function getStandardDeviation(data, d, range, avg) {
        var sum = 0;
        for (var i = 0; i < range; i++)
            if (i + d < data.length)
                sum += Math.pow((data[d+i] - avg), 2);
        return Math.sqrt(sum/range);
    }

    function calcBolingerData(general, bounds, skip) {
        var data = general,
            up = [],
            down = [],
            middle = [],
            width = [],
            max = 0,
            min = 99999;
        for (var d = bounds[0], n=bounds[1]; d + skip < n; d++) {
            var mean = getAverage(data, d, skip),
                std = getStandardDeviation(data, d, skip, mean),
                bandup = mean + 2 * std,
                banddown = mean - 2 * std;
            max = Math.max(bandup, max);
            min = Math.min(banddown, min);
            up.push(bandup);
            down.push(banddown);
            middle.push(mean);
            width.push(bandup-banddown)
        }
        return {
            datas: {
                'band-up': up,
                'band-down': down,
                'band-mid': middle,
                'band-width': width
            },
            info: {
                size: d,
                range: [min, max],
                domain: bounds
            }
        };
    }
}