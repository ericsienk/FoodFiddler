'use strict';

angular.module('foodfiddler.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl',
            currentNavItem: 'home'
        });

    }])
    .controller('homeCtrl', ['$scope', 'ffRecipeService', function($scope,ffRecipeService) {
        $scope.recipe = {};
}]);