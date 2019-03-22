(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipePreview', [])
        .directive('recipePreview', ['$location', function($location) {
            return ({
                restrict: 'AE',
                scope: {
                    recipe : '='
                },
                replace: true,
                templateUrl: 'common/directives/recipe-preview/recipe-preview.html',
                link: function($scope) {
                    $scope.viewRecipe = function(recipe) {
                        $location.path('recipe/' + recipe.id);
                    };
                }
            });
        }]);
}(angular));