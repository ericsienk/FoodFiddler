'use strict';
 // Declare app level module which depends on views, and components
(function (angular) {
    var appDependencies = [
        'ngMaterial',
        'ngRoute',
        'foodfiddler.directive.recipeView',
        'foodfiddler.home'
    ];
    var foodfiddler = angular.module('foodfiddler', appDependencies);

    foodfiddler.config(['$routeProvider', '$httpProvider', '$logProvider',
        function($routeProvider, $httpProvider, $logProvider) {
            $routeProvider.otherwise({redirectTo: '/home'});
            $httpProvider.defaults.headers.post = { "Content-Type" : "application/json"};
            $httpProvider.defaults.xhrFields = { withCredentials : true };
            $logProvider.debugEnabled = true;
        }
    ]);

    foodfiddler.controller('FoodFiddlerCtrl', ['$scope', '$rootScope',
        function($scope, $rootScope) {
            console.log("nav loaded");
        }]);
}(window.angular));