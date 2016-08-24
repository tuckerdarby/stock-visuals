app.factory('metricFactory', metricFactory);

metricFactory.$inject = ['seriesFactory'];

function metricFactory(seriesFactory) {
    
    var Metric = function(indicator, insert) {
        var self = this,
            brand = insert.name,
            parent = indicator,
            seriesList = [],
            theme = insert.theme,
            selected = true;

        self.info = insert;

        self.getSeriesList = function() {
            return seriesList;
        };
        
        self.getName = function() {
            return brand;
        };

        self.getTitle = function() {
            return insert.title;
        };
        
        self.getTheme = function() {
            return theme;
        };
        //equivelent to addTicker
        self.addSeries = function(ticker) {
            var series = createSeries(seriesList, ticker, brand, theme, self.info.lining);
            if (selected && parent.getSelected())
                series.select();
            else
                series.deselect();
            return series;
        };
        
        self.removeSeries = function(row) {
            seriesList.splice(seriesList.indexOf(row), 1);
        };
        
        self.getSelected = function() {
            return selected;
        };
        
        self.select = function() {
            selected = true;
            if (parent.getSelected())
                selectSeries(seriesList);
        };

        self.deselect = function() {
            selected = false;
            deselectSeries(seriesList);
        };
        
        self.show = function() {
            if (selected)
                selectSeries(seriesList);
        };
        
        self.hide = function() {
            deselectSeries(seriesList);
        };

        self.toggle = function() {
            if (parent.getSelected())
                if (selected)
                    deselectSeries(seriesList);
                else
                    selectSeries(seriesList);
            selected = !selected;
        };

        self.setLining = function(name) {
            if (self.info.lining != name) {
                self.info.lining = name;
                seriesList.forEach(function (s) {
                    s.hide();
                    s.info.liner = name;
                    s.show();
                })
            }
        };
        
        self.setTheme = function(color) {
            if (theme != color) {
                self.info.theme = color;
                theme = color;
                seriesList.forEach(function (s) {
                    s.info.temp = theme;
                    s.colorer.deregister(s);
                    s.colorer.register(s);
                    s.redraw();
                })
            }
        };
        
        self.destroy = function() {
            for (var i=0, n=seriesList.length; i<n; i++)
                seriesList[i].destroy();
        };

        return self;
    };
    
    return {
        create: function(parent, insert) {
            return new Metric(parent, insert);
        }
    };
    
    function selectSeries(series) {
        for (var i=0, n=series.length; i<n; i++)
            series[i].select();
    }
    
    function deselectSeries(series) {
        for (var i=0, n=series.length; i<n; i++)
            series[i].deselect();
    }
    
    function createSeries(seriesList, ticker, metricID, theme, lining) {
        var series = seriesFactory.create(ticker, metricID);
        seriesList.push(series);
        series.info.temp = theme;
        series.info.liner = lining;
        series.addDestroyCallback(function () {
            destroySeries(seriesList, series);
            });
        return series;
    }

    function destroySeries(seriesList, series) {
        var index = seriesList.indexOf(series);
        seriesList.splice(index, 1);
    }
}