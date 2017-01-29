(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipeList', [])
        .directive('recipeList', ['$log', 'ffRecipeService','$location', function($log, ffRecipeService, $location) {
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
                    $scope.viewRecipe = function(recipe) {
                        $location.path('recipe/' + recipe.id);
                    };

                    $scope.editRecipe = function(recipe) {
                        $location.path(recipe.id + '/edit');
                    };
                }
            });
        }]);
}(angular));