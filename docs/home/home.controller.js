'use strict';

angular.module('foodfiddler.home', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl',
            tabName: 'home'
        });

    }])
    .controller('homeCtrl', ['$scope', '$filter', '$rootScope', 'ffRecipeService', '$http', function ($scope, $filter, $rootScope, ffRecipeService, $http) {
        $scope.loaders = {page: true};
        ffRecipeService.getRecipes().then(function (response) {
            $scope.recipes = response.data;
            $scope.getRecipes('Meals');

            $scope.loaders.page = false;
        });
        $scope.getRecipes = function (tab) {
            $scope.selected = tab;
            $scope.filteredRecipes = $scope.recipes.filter(function (recipe) {
                if (tab == "Desserts") {
                    return recipe.ingredients.find(function (ingredient) {
                        return ingredient.name == "sugar";
                    });
                }
                else if (tab == "Meals") {
                    return recipe.ingredients.find(function (ingredient) {
                        return ingredient.name != "sugar";
                    });
                }


            });
            console.log($scope.filteredRecipes);
        };
    }]);