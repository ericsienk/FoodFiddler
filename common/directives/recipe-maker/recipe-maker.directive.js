(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipeMaker', [])
        .directive('recipeMaker', ['$log', 'ffRecipeService','$location', function($log, ffRecipeService, $location) {
            return ({
                restrict: 'AE',
                scope: {
                    recipe : '=',
                    isEdit : '='
                },
                replace: true,
                template: '<div ng-include="\'common/directives/recipe-maker/recipe-maker.html\'"></div>',
                link: function($scope, $element, $attrs) {
                    console.log("recipe view loaded");

                    $scope.colors = {
                        green : true,
                        purple : false,
                        yellow : false,
                        pink : false
                    };
                    $scope.colorHex = {
                        green : '#CAE0C7',
                        purple : '#CBC7DF',
                        yellow : '#EDBC5E',
                        pink : '#E2C7D2'
                    };
                    if(!$scope.recipe || !$scope.recipe.id) {
                        $scope.recipe = {ingredients : [], color: 'green'};
                    } else if(!$scope.recipe.ingredients) {
                        $scope.recipe.ingredients = [];
                    }
                    $scope.selectedIngredient = {};
                    $scope.ingredients = [
                        { name: 'sugar', tag: 'SUGAR'},
                        { name: 'brown sugar', tag: 'BROWN_SUG'},
                        { name: 'butter', tag: 'BUTTER'},
                        { name: 'milk', tag: 'COW'},
                        { name: 'heavy cream', tag: 'COW_F'},
                        { name: 'egg(s)', tag: 'EGG'},
                        { name: 'egg white(s)', tag: 'EGG_W'},
                        { name: 'mini semi-sweet chocolates', tag: 'KISS'},
                        { name: 'margarine', tag: 'MARG'},
                        { name: 'peanut butter', tag: 'PEANUT'},
                        { name: 'pie shell', tag: 'PIE_SHELL'},
                        { name: 'powder sugar', tag: 'POW_SUGAR'},
                        { name: 'pretzels', tag: 'PRETZEL'},
                        { name: 'pudding', tag: 'PUDDING'},
                        { name: 'pumpkin', tag: 'PUMPKIN'},
                        { name: 'shortening', tag: 'SHORT'},
                        { name: '', tag: 'SPOON'},
                        { name: 'vanilla extract', tag: 'VANILLA'},
                        { name: 'vegetable oil', tag: 'VEG_OIL'}
                    ];

                    $scope.addIngredient = function() {
                        if($scope.selectedIngredient !== undefined) {
                            $scope.recipe.ingredients.push({
                                    name: $scope.selectedIngredient.name,
                                    amount: $scope.selectedIngredient.amount,
                                    ingredientTag: $scope.ingredients[Number($scope.selectedIngredient.tagIndex)].tag
                                });
                        }
                    };

                    $scope.updateIngredientName = function() {
                        $scope.selectedIngredient.name = $scope.ingredients[Number($scope.selectedIngredient.tagIndex)].name;
                    };

                    $scope.deleteIngredient = function(ingredient) {
                        for(var i = 0; i < $scope.recipe.ingredients.length; i++) {
                            if(ingredient === $scope.recipe.ingredients[i]) {
                                $scope.recipe.ingredients.splice(i, 1);
                                break;
                            }
                        }
                    };

                    $scope.getPrimaryColor = function(isRequired) {
                        if(isRequired){
                            if($scope.selectedIngredient.tagIndex !== undefined && $scope.selectedIngredient.amount !== undefined) {
                                return $scope.colorHex[$scope.recipe.color];
                            } else {
                                return 'inherit;'
                            }
                        } else {
                            return $scope.colorHex[$scope.recipe.color];
                        }

                    };

                    $scope.selectColor = function(colorName) {
                        $scope.recipe.color = colorName;
                        angular.forEach($scope.colors, function(value, key) { $scope.colors[key] = (colorName === key); });
                    };

                    $scope.submitRecipe = function() {
                        console.log($scope.recipe);
                        if($scope.isEdit) {
                            ffRecipeService.updateRecipe($scope.recipe).then(function(snapshot) {
                                $scope.$apply(function() {
                                    $location.path('/recipe/' + $scope.recipe.id);
                                })
                            });
                        } else {
                            ffRecipeService.addRecipe($scope.recipe).then(function(snapshot) {
                                $scope.$apply(function() {
                                    $location.path('/recipe/' + $scope.recipe.id);
                                })
                            });
                        }
                    };
                }
            });
        }]);
}(angular));