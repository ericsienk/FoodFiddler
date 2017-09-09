(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipeList', [])
        .directive('recipeList', ['$log', 'ffRecipeService','$location', '$filter', function($log, ffRecipeService, $location, $filter) {
            return ({
                restrict: 'AE',
                scope: {
                    recipes : '=',
                    searchText: '=',
                    authorizedFunction : '='
                },
                replace: true,
                template: '<div ng-include="\'common/directives/recipe-list/recipe-list.html\'"></div>',
                link: function($scope, $element, $attrs) {
                    $scope.filteredRecipes = $scope.recipes;

                    $scope.viewRecipe = function(recipe) {
                        $location.path('recipe/' + recipe.id);
                    };

                    $scope.editRecipe = function(recipe) {
                        $location.path(recipe.id + '/edit');
                    };

                    $scope.$watch('searchText', function(newVal, oldVal) {
                        if(newVal != oldVal) {
                            $scope.filteredRecipes = $filter('filter')($scope.recipes, newVal);
                        }
                    });
                }
            });
        }]);
}(angular));