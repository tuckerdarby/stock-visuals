app.factory('colorFactory', colorFactory);

colorFactory.$inject = [];

function colorFactory() {
    var colorList = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'],
        colorValues = {
        'red': 0,
        'orange': 30,
        'yellow': 60,
        'green': 120,
        'teal': 180,
        'blue': 230,
        'purple': 270,
        'pink': 300
    };
    
    var ColorManager = function() {
        var self = this,
            colors = colorList,
            colorMap = outlineMap(colors);
        
        self.register = function(series) {
            series.colorer = self;
            registerSeries(colorMap, series);
        };

        self.deregister = function(series) {
            deregisterSeries(colorMap, series);
        };
        
        return self;
    };
    
    return {
        create: function() {
            return new ColorManager();
        }
    };

    function deregisterSeries(colorMap, series) {
        var color = series.info.temp,
            index = colorMap[color].available.length - 1,
            specific = colorMap[color].available[index];
        colorMap[color].available.push(specific);
        colorMap[color].available.sort(function (b) {
            return b.light + b.value;
        });
    }
    
    function registerSeries(colorMap, series) {
        var color = series.info.temp,
            index = colorMap[color].available.length - 1,
            specific = colorMap[color].available[index],
            value = specific.value,
            light = specific.light,
            hs;
        hs = ['hsla(', value,', 100%,', light, '%, 1)'].join('');
        series.info.color = hs;
        series.info.bgColor = {'background-color': hs};
        series.addDestroyCallback(function() {
            deregisterSeries(colorMap, series);
        });
        colorMap[color].available.splice(index, 1);
    }

    function mapColorSlots(color) {
        var baseValue = colorValues[color],
            colorBin = {
                color: color,
                value: baseValue,
                available: []
            };
        for (var k=0; k<3; k++)
            for (var i = 0; i < 6; i++)
                colorBin.available.push({
                    light: (70-10*i),
                    value: (baseValue-k*10)
                });
        colorBin.available.sort(function (b) {
            return b.light + b.value;
        });
        return colorBin;
    }

    function outlineMap(colors) {
        var cMap = {};
        for (var i=0, n=colors.length; i<n; i++)
            cMap[colors[i]] = mapColorSlots(colors[i]);
        return cMap;
    }

}