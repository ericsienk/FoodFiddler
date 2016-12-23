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
                template: '<div ng-include="\'common/directives/recipe-view/recipe-view.html\'"></div>',
                link: function($scope, $element, $attrs) {
                    $scope.fab = true;

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