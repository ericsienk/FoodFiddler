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
        ffRecipeService.getRecipeById($routeParams.recipeId).then(function(snapshot) {
            $scope.$apply(function() {
                var tmp = snapshot.val();
                if(tmp.instructions !== undefined) {
                    tmp.instructions = tmp.instructions.replace(/(\r\n|\n|\r)/gm, "<br />");
                }
                $scope.recipe = tmp;
            })
        });

    }]);