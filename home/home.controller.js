'use strict';

angular.module('foodfiddler.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl'
        });

    }])

    .controller('homeCtrl', ['$scope', function($scope) {
        console.log("home loaded");
}]);