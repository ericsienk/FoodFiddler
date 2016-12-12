(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipeView', [])
        .directive('recipeView', ['$log', function($log) {
            return ({
                restrict: 'AE',
                scope: {
                    recipe : '='
                },
                replace: true,
                template: '<div ng-include="\'common/partials/recipe-view.html\'"></div>',
                link: function($scope, $element, $attrs) {
                    console.log("recipe view loaded");
                    $scope.fab = false;

                    $scope.toggleFAB = function() {
                        if($scope.fab === undefined) {
                            $scope.fab = false;
                        } else {
                            $scope.fab = !$scope.fab;
                        }

                        console.log("fab toggled" + $scope.fab);
                    }
                }
            });
    }]);
}(angular));