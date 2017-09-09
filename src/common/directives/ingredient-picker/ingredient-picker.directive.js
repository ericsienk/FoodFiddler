(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.ingredientPicker', [])
        .directive('ingredientPicker', ['$log', '$timeout', 'httpUtil', function($log, $timeout, httpUtil) {
            return ({
                restrict: 'AE',
                scope: {
                    controls : '=',
                    ingredients : '='
                },
                replace: true,
                templateUrl: 'common/directives/ingredient-picker/ingredient-picker.html',
                link: function($scope, $element, $attrs) {



                    $scope.controls.open = function(ingredient) {
                        $scope.selectedIngredient = ingredient;
                        $scope.currentIngredient = {};
                        $scope.currentIngredient.tag = $scope.selectedIngredient.ingredientTag;
                        $timeout(function(){
                            $('#ingredientPicker').modal('show');
                            $timeout(function() {
                                $element.find('input')[0].focus();
                            },600);
                        });
                    };

                    $scope.controls.cancel = function() {
                        $timeout(function(){
                            $('#ingredientPicker').modal('hide');
                        }, 100);
                    };

                    $scope.search = function(searchTerm) {
                        return httpUtil.mockPromise($scope.ingredients);
                    };

                    $scope.select = function(item) {
                        $scope.currentIngredient = angular.copy(item);
                    };

                    $scope.controls.choose = function() {
                        $scope.selectedIngredient.ingredientTag = $scope.currentIngredient.tag;
                        $scope.controls.cancel();
                    };
                }
            });
        }]);
}(angular));