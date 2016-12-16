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
        console.log("home loaded");

        //$scope.recipe = {};
        //ffRecipeService.getRecipes().then(function(data){
        //    ffRecipeService.setRecipes(data.data);
        //    $scope.recipe = ffRecipeService.getRecipeById(1);
        //}, function(error) {
        //
        //});
        //
        //$scope.recipe = ffRecipeService.getRecipeById(1);
}]);