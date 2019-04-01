(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.ingredientList', [])
        .directive('ingredientList', [function() {
            return ({
                restrict: 'E',
                scope: {
                    ingredients : '=',
                    color: '='
                },
                templateUrl: 'common/directives/ingredient-list/ingredient-list.html',
                link: function($scope) {
                    $scope.fab = true;
                    $scope.toggleFab = function() {
                        $scope.fab = !$scope.fab;
                    }
                }
            });
        }]);
}(angular));