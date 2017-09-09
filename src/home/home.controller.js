'use strict';

angular.module('foodfiddler.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl',
            tabName: 'home'
        });

    }])
    .controller('homeCtrl', ['$scope', '$rootScope', 'ffRecipeService','$http', function($scope, $rootScope, ffRecipeService, $http) {
        $scope.loaders = { page : true };
        ffRecipeService.getRecipes().then(function (response) {
            $scope.recipes = response.data;
            $scope.loaders.page = false;
        });
}]);