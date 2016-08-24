app.service('outlineService', outlineService);

outlineService.$inject = [];

function outlineService() {
    var self = this,
        metrics = configureMetrics(),
        parameters = configureParameters(),
        indicators = configureIndicators(),
        indicatorFactors = configureIndicatorFactors(),
        focusList = configureFocusList(),
        focusIndicators = configureFocusIndicators(),
        liner = {},
        liningBrands = configureLiningBrands(liner),
        baseColors = configureBaseColors();
    
    self.getMetrics = function(name) {
        return createMetrics(name);
    };
    
    self.getParameters = function(name) {
        return createParameters(name);
    };

    self.getIndicator = function(name) {
        return indicators[name];
    };
    
    self.getFactors = function(name) {
        return createFactors(name);
    };
    
    self.getFocusIndicators = function(name) {
        return focusIndicators[name];
    };

    self.getFocusList = function() {
        return focusList;
    };

    self.getLiningBrands = function() {
        return liningBrands;
    };

    self.getLiner = function(name) {
        return liner[name];
    };
    
    self.getBaseColors = function() {
        return baseColors;
    };
    
    return self;

    function createMetrics(brand) {
        var guideMetrics = [],
            outline = metrics[brand];
        for (var i=0, n=outline.length; i<n; i++) {
            var metric = {
                name: outline[i].name,
                title: outline[i].title,
                nick: outline[i].nick,
                theme: outline[i].theme,
                lining: outline[i].lining
            };
            guideMetrics.push(metric);
        }
        return guideMetrics;
    }

    function createFactors(name) {
        var factors = [],
            outline = indicatorFactors[name];
        outline.forEach(function (f) {
            factors.push({
                selected: f.selected,
                selectables: createMetrics(f.selectables)
            });
        });
        return factors;
    }

    function createParameters(name) {
        var params = [],
            outline = parameters[name];
        outline.forEach(function (n) {
            params.push({
                minVal: n.minVal,
                maxVal: n.maxVal,
                val: n.val
            });
        });
        return params;
    }
    
    function configureBaseColors() {
        return ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'];
    }

    function configureLiningBrands(blankLiner) {
        blankLiner['line'] = {name: 'line', title: 'Line', icon: 'broken_image'};
        blankLiner['area'] = {name: 'area', title: 'Area', icon: 'insert_photo'};
        blankLiner['bar'] = {name: 'bar', title: 'Bar', icon: 'assessment'};
        return [
            blankLiner['line'],
           blankLiner['area'],
           blankLiner['bar']
        ];
    }

    function configureFocus(name, title) {
        return {
            name: name,
            title: title
        };
    }

    function configureFocusList() {
        return [
            configureFocus('general', 'General'),
            configureFocus('aroon', 'Aroon'),
            configureFocus('rsi', 'RSI')
        ];
    }

    
    function configureFocusIndicators() {
        return {
            'general': ['primary', 'bands'],
            'aroon': ['aroon'],
            'rsi': ['rsi']
        };
    }

    function configureMetrics() {
        return {
            'primary': [
                    configureMetric('High', 'high', 'high', 'green', 'line'),
                    configureMetric('Low', 'low', 'low', 'red', 'line'),
                    configureMetric('Open', 'open', 'open', 'orange', 'line'),
                    configureMetric('Close', 'close', 'close', 'yellow', 'line')
                ],
            'bands': [
                configureMetric('Up', 'band-up', 'up', 'purple', 'line'),
                configureMetric('Down', 'band-down', 'down', 'purple', 'line'),
                configureMetric('Mean', 'band-mid', 'mean', 'pink', 'line'),
                configureMetric('Width', 'band-width', 'width', 'orange', 'area')
            ],
            'aroon': [
                configureMetric('Aroon up', 'aroon-up', 'up', 'green', 'line'),
                configureMetric('Aroon up', 'aroon-down', 'down', 'red', 'line')
            ],
            'rsi': [
                configureMetric('RSI', 'rsi', 'rsi', 'orange', 'area'),
                configureMetric('Avg. Gain', 'avg-gain', 'gain', 'green', 'line'),
                configureMetric('Avg. Loss', 'avg-loss', 'loss', 'red', 'line')
            ]
        };
    }

    function configureMetric(title, name, nick, theme, lining) {
        return {
            title: title,
            name: name,
            nick: nick,
            theme: theme,
            lining: lining
        }
    }

    function configureParameters() {
        return {
            'primary': [],
            'bands': [{minVal: 5, maxVal: 100, val: 5}],
            'aroon': [{minVal: 10, maxVal: 300, val: 14}],
            'rsi': [{minVal: 5, maxVal: 100, val: 14}]
        };
    }

    function createIndicator(name, title) {
        return {
            name: name,
            title: title
        };
    }

    function configureIndicators() {
        return {
            'primary': createIndicator('primary', 'Primary'),
            'bands': createIndicator('bands', 'Bands'),
            'aroon': createIndicator('aroon', 'Aroon'),
            'rsi': createIndicator('rsi', 'RSI')
        };
    }

    function configureFactor(brand) {
        return {
            selected: 0,
            selectables: brand
        };
    }

    function configureIndicatorFactors() {
        return {
            'primary': [],
            'bands': [configureFactor('primary')],
            'aroon': [],
            'rsi': [configureFactor('primary')]
        };
    }
}