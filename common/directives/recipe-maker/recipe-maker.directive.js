(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.recipeMaker', [])
        .directive('recipeMaker', ['$log', 'ffRecipeService','$location', '$mdDialog', function($log, ffRecipeService, $location, $mdDialog) {
            return ({
                restrict: 'AE',
                scope: {
                    recipe : '=',
                    isEdit : '='
                },
                replace: true,
                template: '<div ng-include="\'common/directives/recipe-maker/recipe-maker.html\'"></div>',
                link: function($scope, $element, $attrs) {
                    $scope.deleteText = 'Delete recipe';
                    $scope.radioFunction = 'move';
                    $scope.picker = {};

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
                        { name: 'banana', tag: 'BANANA'},
                        { name: 'flour', tag: 'FLOUR'},
                        { name: 'brown sugar', tag: 'BROWN_SUG'},
                        { name: 'cocoa', tag: 'COCOA'},
                        { name: 'butter', tag: 'BUTTER'},
                        { name: 'milk', tag: 'COW'},
                        { name: 'cream cheese', tag: 'CREAM_CH'},
                        { name: 'heavy cream', tag: 'COW_F'},
                        { name: 'eggs', tag: 'EGG'},
                        { name: 'egg whites', tag: 'EGG_W'},
                        { name: 'mini semi-sweet chocolates', tag: 'KISS'},
                        { name: 'margarine', tag: 'MARG'},
                        { name: 'peanut butter', tag: 'PEANUT'},
                        { name: 'pie shell', tag: 'PIE_SHELL'},
                        { name: 'powder sugar', tag: 'POW_SUGAR'},
                        { name: 'pretzels', tag: 'PRETZEL'},
                        { name: 'pudding', tag: 'PUDDING'},
                        { name: 'pumpkin', tag: 'PUMPKIN'},
                        { name: 'ribs', tag: 'RIBS'},
                        { name: 'sauce', tag: 'SAUCE'},
                        { name: 'sour cream', tag: 'SOUR_CRM'},
                        { name: 'shortening', tag: 'SHORT'},
                        { name: '', tag: 'SPOON'},
                        { name: 'vanilla extract', tag: 'VANILLA'},
                        { name: 'vegetable oil', tag: 'VEG_OIL'}
                    ];

                    $scope.addIngredient = function() {
                        if($scope.selectedIngredient !== undefined) {
                            if($scope.selectedIngredient.amount && $scope.selectedIngredient.name && $scope.selectedIngredient.tagIndex) {
                                $scope.recipe.ingredients.push({
                                    name: $scope.selectedIngredient.name,
                                    amount: $scope.selectedIngredient.amount,
                                    ingredientTag: $scope.ingredients[Number($scope.selectedIngredient.tagIndex)].tag
                                });
                            }
                        }
                    };

                    $scope.moveIngredientUp = function(index) {
                        if(index > 0) {
                            var tmpA = angular.copy($scope.recipe.ingredients[index - 1]);
                            var tmpB = angular.copy($scope.recipe.ingredients[index]);
                            $scope.recipe.ingredients[index - 1] = tmpB;
                            $scope.recipe.ingredients[index] = tmpA;
                        }
                    };

                    $scope.moveIngredientDown = function(index) {
                        if(index < $scope.recipe.ingredients.length - 1) {
                            var tmpA = angular.copy($scope.recipe.ingredients[index + 1]);
                            var tmpB = angular.copy($scope.recipe.ingredients[index]);
                            $scope.recipe.ingredients[index + 1] = tmpB;
                            $scope.recipe.ingredients[index] = tmpA;
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
                        if($scope.isEdit) {
                            ffRecipeService.updateRecipe($scope.recipe).then(function(snapshot) {
                                $scope.$apply(function() {
                                    ffRecipeService.updateCachedRecipe($scope.recipe);
                                    $location.path('/recipe/' + $scope.recipe.id);
                                })
                            });
                        } else {
                            ffRecipeService.addRecipe($scope.recipe).then(function(snapshot) {
                                $scope.$apply(function() {
                                    ffRecipeService.addCachedRecipe($scope.recipe);
                                    $location.path('/recipe/' + $scope.recipe.id);
                                })
                            });
                        }
                    };

                    $scope.showConfirm = function(ev) {
                        // Appending dialog to document.body to cover sidenav in docs app
                        var confirm = $mdDialog.confirm()
                            .title('Are you sure you want to DELETE this recipe?')
                            .textContent('I thought it was a good one.')
                            .targetEvent(ev)
                            .ok('Do it!')
                            .cancel("Don't do it...");

                        $mdDialog.show(confirm).then(function() {
                            ffRecipeService.deleteRecipe($scope.recipe).then(function(snapshot) {
                                $scope.$apply(function() {
                                    ffRecipeService.deleteCachedRecipe($scope.recipe);
                                    $location.path('/home');
                                })
                            }, function(error) {
                                $scope.deleteText = "I couldn't do it...";
                            });
                        }, function() {
                            $scope.deleteText = 'Close call';
                        });
                    };
                }
            });
        }]);
}(angular));