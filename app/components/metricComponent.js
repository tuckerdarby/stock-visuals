app.component('metricComponent', {
    restrict: 'E',
    scope: {},
    bindings: {
        metric: '='
    },
    controller: 'MetricController',
    templateUrl: 'templates/metricTemplate.html'
});