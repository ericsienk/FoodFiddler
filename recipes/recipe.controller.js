'use strict';

angular.module('foodfiddler.recipe', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/recipe/:recipeId', {
            templateUrl: 'recipes/recipe.html',
            controller: 'recipeCtrl',
            currentNavItem: 'recipe'
        });

    }])
    .controller('recipeCtrl', ['$scope', 'ffRecipeService','$routeParams', function($scope,ffRecipeService, $routeParams) {
        this.currentNavItem = 'recipe';
        $scope.recipe = {};
        $scope.recipe = ffRecipeService.getRecipeById($routeParams.recipeId);

    }]);