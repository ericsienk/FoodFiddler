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
                templateUrl: 'common/directives/recipe-list/recipe-list.html'
            });
        }]);
}(angular));