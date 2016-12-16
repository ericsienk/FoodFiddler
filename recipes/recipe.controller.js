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
        console.log("recipe loaded");
        this.currentNavItem = 'recipe';
        $scope.recipe = {};
        //ffRecipeService.getRecipes().then(function(data){
        //    ffRecipeService.setRecipes(data.data);
        //    $scope.recipe = ffRecipeService.getRecipeById($routeParams.recipeId);
        //}, function(error) {
        //
        //});
        $scope.recipe = ffRecipeService.getRecipeById($routeParams.recipeId);

    }]);