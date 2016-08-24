app.factory('seriesFactory', seriesFactory);

seriesFactory.$inject = [];

function seriesFactory() {

    var Series = function(name, metricID) {
        var self = this,
            ticker = name,
            data = [],
            dataRange = [0, 0],
            tracker,
            selected = true,
            updateCalls = [],
            destroyCalls = [],
            drawable = false,
            metric = metricID;
        
        self.info = {
            liner: 'line',
            temp: '',
            color: '',
            value: 0,
            valueColor: '',
            bgColor: {},
            colorer: {}
        };
        
        self.getMetric = function() {
            return metric;
        };

        self.getDataMap = function() {
            return data;
        };
        
        self.getRange = function() {
            return dataRange;
        };
        
        self.getTicker = function() {
            return ticker;
        };
        
        self.getSelected = function() {
            return selected;
        };

        self.select = function () {
            selected = true;
            if (drawable)
                drawSeries(tracker)
        };

        self.deselect = function() {
            selected = false;
            if (drawable)
                removeSeries(tracker);
        };

        self.setTracker = function(track) {
            drawable = true;
            tracker = track;
            drawSeries(tracker);
        };

        self.addDestroyCallback = function(callback) {
            destroyCalls.push(callback);
        };

        self.addUpdateCallback = function(callback) {
            updateCalls.push(callback);
        };

        self.define = function(dataRow, rangeInfo) {
            data = dataRow;
            dataRange = rangeInfo;
            if (dataRow.length > 0) {
                if (drawable && selected)
                    redrawSeries(tracker);
                callUpdates(updateCalls);
            }
        };
        
        self.show = function() {
            if (selected && drawable)
                drawSeries(tracker);
        };
        
        self.hide = function() {
            if (drawable)
                removeSeries(tracker);
        };
        
        self.redraw = function() {
            if (selected && drawable)
                redrawSeries(tracker);
        };
        
        self.update = function() {
            callUpdates(updateCalls);
        };
        
        self.destroy = function() {
            callDestroys(destroyCalls);
        };
        
        return self;
    };
    
    function updateInfo(dataRange, newInfo) {
        dataRange[0] = Math.min(dataRange[0], newInfo.range[0]);
        dataRange[1] = Math.max(dataRange[1], newInfo.range[1]);
    }
    
    function callUpdates(updates) {
        angular.forEach(updates, function(callback) {
            callback();
        });
    }

    function callDestroys(destroys) {
        angular.forEach(destroys, function(callback) {
            callback();
        });
    }
    
    function drawSeries(tracker) {
        tracker.draw();
    }
    
    function removeSeries(tracker) {
        tracker.remove();
    }

    function redrawSeries(tracker) {
        tracker.redraw();
    }
    
    return {
        create: function(name, metricID) {
            return new Series(name, metricID);
        }
    };
}