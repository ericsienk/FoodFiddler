(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipeView', [])
        .directive('recipeView', ['$log', function($log) {
            return ({
                restrict: 'AE',
                scope: {

                },
                replace: true,
                template: '<div ng-include="\'common/partials/recipe-view.html\'"></div>',
                link: function($scope, $element, $attrs) {
                    console.log("recipe view loaded");
                }
            });
    }]);
}(angular));