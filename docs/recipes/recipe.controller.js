'use strict';

angular.module('foodfiddler.recipe', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/recipe/:recipeId', {
            templateUrl: 'recipes/recipe.html',
            controller: 'recipeCtrl',
            tabName: 'home'
        });

    }])
    .controller('recipeCtrl', ['$scope', 'ffRecipeService', '$routeParams', 'util', '$rootScope', '$location',
        function ($scope, ffRecipeService, $routeParams, util, $rootScope, $location) {

        this.currentNavItem = 'recipe';
        $scope.fab = true;
        $scope.toggleFAB = function () {
            if ($scope.fab === undefined) {
                $scope.fab = false;
            } else {
                $scope.fab = !$scope.fab;
            }
        };

        ffRecipeService.getRecipeById($routeParams.recipeId).then(function (response) {
            var tmp = response.data;
            tmp.instructions = util.decodeNewLines(tmp.instructions);
            $scope.recipe = tmp;
        });

        $scope.editRecipe = function () {
            $location.url('/' + $routeParams.recipeId + '/edit');
        };
    }]);