app.factory('trackerFactory', trackerFactory);

trackerFactory.$inject = [];

function trackerFactory() {

    var Tracker = function(series, drawer) {
        var self = this,
            tracking = series,
            composer = drawer,
            path = false;

        self.draw = function() {
            if (path == false) {
                path = drawSeries(tracking, composer);
            }
        };
        
        self.remove = function() {
            if (path != false) {
                eraseSeries(tracking, composer, path);
                path = false;
            }
        };
        
        self.redraw = function() {
            if (path != false)
                eraseSeries(tracking, composer, path);
            path = drawSeries(tracking, composer);
        };
        
        self.setLining = function(name) {
            if (path != false)
                eraseSeries(tracking, composer, path);
            path = drawSeries(tracking, composer);
        };
        
        series.addDestroyCallback(function() {
            if (path != false)
                eraseSeries(tracking, composer, path);
            destroyTracker(self);
        });
        
        return self;
    };

    return {
        create: function(series, line, svg) {
            return new Tracker(series, line, svg);
        }
    };

    function drawSeries(series, composer) {
        var datum = series.getDataMap(),
            color = series.info.color,
            lining = series.info.liner,
            path;
        path = composer.draw(datum, color, lining);
        return path;
    }

    function eraseSeries(series, composer, path) {
        var lining = series.info.liner;
        composer.erase(path, lining);
    }

    function destroyTracker(tracker) {
        //idk what to do here
    }
    
}