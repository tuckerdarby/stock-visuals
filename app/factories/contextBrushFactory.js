app.factory('contextBrushFactory', contextBrushFactory);

contextBrushFactory.$inject = ['d3Service', 'brushFactory', 'marketService', 'indexService'];

function contextBrushFactory(d3Service, brushFactory, marketService, indexService) {
    
    var Brush = brushFactory.get(),
        d3 = d3Service.getD3(),
        bisectDate = d3.bisector(d3.descending).right,
        indexed = false,
        context;
    
    var ContextBrush = function() {
        var self = this,
            contextual;
        if (indexed != false)
            contextual = {indexes: indexed, dates: context};
        Brush.apply(self, [brushed, contextual]);
        return self;
    };
    
    ContextBrush.prototype = new Brush();

    return {
        create: function() {
            return new ContextBrush();
        }
    };
    
    function brushed(brush) {
        var indexSpan = indexService.getIndex(),
            indexes = [0,0],
            indexDates = [0,1],
            dates = brush.extent();
        if (brush.empty()) {
            indexes = [indexSpan.length - 1, 0];
            context = [indexSpan[indexes[0]], indexSpan[indexes[1]]];
        }
        else {
            indexes[0] = bisectDate(indexSpan, dates[0]);
            indexes[1] = bisectDate(indexSpan, dates[1]);
            indexDates[0] = indexSpan[indexes[0]];
            indexDates[1] = indexSpan[indexes[1]];
            context = indexDates;
        }
        indexed = indexes;
        marketService.setContext(context);
    }
}