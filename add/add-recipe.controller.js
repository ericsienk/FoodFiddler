'use strict';

angular.module('foodfiddler.add', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/add', {
            templateUrl: 'add/add-recipe.html',
            controller: 'addCtrl',
            currentNavItem: 'add'
        });

    }])
    .controller('addCtrl', ['$scope', 'ffRecipeService', function($scope,ffRecipeService) {
        $scope.recipe = {};
    }]);