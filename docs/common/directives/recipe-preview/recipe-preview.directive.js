(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipePreview', [])
        .directive('recipePreview', ['$location', function($location) {
            return ({
                restrict: 'E',
                scope: {
                    recipe : '='
                },
                templateUrl: 'common/directives/recipe-preview/recipe-preview.html',
                link: function($scope) {
                    $scope.viewRecipe = function(recipe) {
                        $location.path('recipe/' + recipe.id);
                    };
                }
            });
        }]);
}(angular));