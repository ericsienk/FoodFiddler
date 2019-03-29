(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipePreview', [])
        .directive('recipePreview', [function() {
            return ({
                restrict: 'AE',
                scope: {
                    recipe : '='
                },
                templateUrl: 'common/directives/recipe-preview/recipe-preview.html',
            });
        }]);
}(angular));