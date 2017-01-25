'use strict';

angular.module('foodfiddler.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl',
            currentNavItem: 'home'
        });

    }])
    .controller('homeCtrl', ['$scope', 'ffRecipeService','$http', function($scope,ffRecipeService, $http) {
        if(!ffRecipeService.getRecipeList()) {
            ffRecipeService.getRecipes().then(function (data) {
                $scope.$apply(function () {
                    ffRecipeService.setRecipes(ffRecipeService.firebaseObjToArray(data.val()));
                    $scope.recipes = ffRecipeService.getRecipeList();
                });
            });
        } else {
            $scope.recipes = ffRecipeService.getRecipeList();
        }
}]);