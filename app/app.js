'use strict';

var app = angular.module('maroonApp', [
    'ui.router',
    'ngMaterial'
]);

//config
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider.state('home', homeState)});

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey', {
            'default': '900',
            'hue-1': '900',
            'hue-2': '800',
            'hue-3': '700'
        })
        .accentPalette('lime').dark();
    $mdThemingProvider.theme('chart')
        .primaryPalette('blue-grey', {
            'default': '600',
            'hue-1': '900',
            'hue-2': '900',
            'hue-3': '700'
        }).accentPalette('lime').dark();
    $mdThemingProvider.theme('director')
        .primaryPalette('blue-grey', {
            'default': '800',
            'hue-1': '500',
            'hue-2': '500',
            'hue-3': '500'
        }).accentPalette('lime').dark();
    $mdThemingProvider.theme('operator')
        .primaryPalette('grey', {
            'default': '900',
            'hue-1': '500',
            'hue-2': '500',
            'hue-3': '500'
        }).accentPalette('green').dark();
});

//run
app.run(['$state', function($state) {
    $state.transitionTo('home');
}]);

//states
var bottomView = {
    url: '/navbottom',
    templateUrl: 'templates/bottomNavTemplate.html',
    controller: 'BottomNavController',
    controllerAs: 'vm'
};

var navbarView = {
    url: '/navbar',
    templateUrl: 'templates/navbarTemplate.html',
    controller: 'NavbarController',
    controllerAs: 'vm'
};

var marketView = {
    url: '/market',
    templateUrl: 'templates/marketTemplate.html',
    controller: 'MarketController',
    controllerAs: 'vm'
};

var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: 'index.html',
    views: {
        '@': {templateUrl:'templates/siteTemplate.html'},
        'navbar@home' : navbarView,
        'market@home' : marketView,
        'navbottom@home': bottomView
    }
};