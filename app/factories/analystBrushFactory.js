app.factory('analystBrushFactory', analystBrushFactory);

analystBrushFactory.$inject = ['brushFactory', 'd3Service', 'indexService'];

function analystBrushFactory(brushFactory, d3Service, indexService) {
    var Brush = brushFactory.get(),
        d3 = d3Service.getD3(),
        analysts = [],
        bisectDate = d3.bisector(d3.descending).right,
        indexed = false,
        context;

    var AnalystBrush = function() {
        var self = this,
            seriesList = [],
            contextual;
        if (indexed != false)
            contextual = {indexes: indexed, dates: context};
        Brush.apply(self, [brushed, contextual]);

        self.registerSeries = function(series) {
            registerSeries(seriesList, series);
        };

        self.deregisterSeries = function(series) {
            deregisterSeries(seriesList, series);
        };
        
        return self;
    };

    AnalystBrush.prototype = new Brush();

    return {
        create: function() {
            var analyst = new AnalystBrush();
            analysts.push(analyst);
            return analyst;
        }
    };

    function brushed(brush) {
        if (brush.empty()) {
            d3.selectAll('.brush').call(brush.clear());
            clearAllBrushes();
        }
        else {
            brushAll(brush.extent());
        }
    }
    
    function clearAllBrushes() {
        analysts.forEach(function (b) {
            b.clearBrush();
        });
    }

    function registerSeries(seriesList, series) {
        seriesList.push(series);
        series.addDestroyCallback(function() {
            deregisterSeries(seriesList, series);
        });
    }

    function deregisterSeries(seriesList, series) {
        seriesList.splice(seriesList.indexOf(series), 1);
    }

    function brushAll(dates) {
        var indexSpan = indexService.getIndex(),
            indexes = [0,0],
            indexDates = [0,1];
        indexes[0] = bisectDate(indexSpan, dates[0]);
        indexes[1] = bisectDate(indexSpan, dates[1]);
        indexDates[0] = indexSpan[indexes[0]];
        indexDates[1] = indexSpan[indexes[1]];
        indexed = indexes;
        context = indexDates;
        analysts.forEach(function (b) {
            b.setBrush(indexDates, indexes);
        });
    }
}