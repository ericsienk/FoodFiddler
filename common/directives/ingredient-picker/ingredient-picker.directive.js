(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.ingredientPicker', [])
        .directive('ingredientPicker', ['$log', '$timeout', function($log, $timeout) {
            return ({
                restrict: 'AE',
                scope: {
                    controls : '=',
                    ingredients : '='
                },
                replace: true,
                template: '<div ng-include="\'common/directives/ingredient-picker/ingredient-picker.html\'"></div>',
                link: function($scope, $element, $attrs) {

                    $scope.controls.open = function(ingredient) {
                        $scope.selectedIngredient = ingredient;
                        $scope.currentIngredient = angular.copy($scope.selectedIngredient);

                        $timeout(function(){
                            $('#ingredientPicker').modal('show');
                        }, 100);
                    };

                    $scope.controls.cancel = function() {
                        $timeout(function(){
                            $('#ingredientPicker').modal('hide');
                        }, 100);
                    };

                    $scope.controls.choose = function() {
                        $scope.selectedIngredient.ingredientTag = $scope.currentIngredient.ingredientTag;
                        $scope.controls.cancel();
                    };

                    $scope.selectIngredient = function(i) {
                        $scope.currentIngredient.ingredientTag = i.tag;
                    };

                    $scope.isSelected = function(i) {
                        if($scope.currentIngredient) {
                            return i.tag === $scope.currentIngredient.ingredientTag;
                        }
                    };
                }
            });
        }]);
}(angular));