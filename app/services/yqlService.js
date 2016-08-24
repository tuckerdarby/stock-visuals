app.service('yqlService', yqlService);

yqlService.$inject = ['$http'];

function yqlService($http) {
    var self = this,
        startLink = 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol = "',
        startDateLink = '" and startDate="',
        endDateLink = '" and endDate="',
        endLink = '"&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json';

    self.getData = function(ticker, start, end) {
        var url = makeUrl(ticker, start, end);
        return requestData(url);
    };

    return self;

    function makeUrl(ticker, start, end) {
        var startDate = getDate(start),
            endDate = getDate(end);
        return [startLink, ticker, startDateLink, startDate, endDateLink, endDate, endLink].join('');
    }
    
    function processData(data) {
        var processed = {
            'high': [],
            'low': [],
            'open': [],
            'close': [],
            'dates': []
        },
            quotes = data.query.results.quote,
            min = 9999,
            max = 0;
        quotes.forEach(function (d) {
            max = Math.max(max, d.High);
            min = Math.min(min, d.Low);
            processed.high.push(parseFloat(d.High));
            processed.low.push(parseFloat(d.Low));
            processed.open.push(parseFloat(d.Open));
            processed.close.push(parseFloat(d.Close));
            processed.dates.push(parseDate(d.Date));
        });
        return {
            datas: processed,
            info: {
                size: processed.dates.length,
                range: [min, max],
                domain: [processed.dates[0], processed.dates[processed.dates.length - 1]]
            }
        };
    }

    function requestData(url) {
        return $http.get(url).then(function (data) {
            if (data['data']['query']['results'] == null)
                return false;
            return processData(data['data']);
        }).catch(function(response) {
            //alert('error');
            return false;
        });
    }

    function getDate(date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        return [date.getFullYear(),'-', !mm[1] && '0', mm, '-', dd].join('');
    }

    function parseDate(date) {
        var dateParts = date.split('-');
        return new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
    }
}