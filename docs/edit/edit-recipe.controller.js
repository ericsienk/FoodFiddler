'use strict';

angular.module('foodfiddler.edit', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/add', {
            templateUrl: 'edit/edit-recipe.html',
            controller: 'editCtrl',
            tabName: 'add',
            editMode: true
        }).when('/:recipeId/edit', {
            templateUrl: 'edit/edit-recipe.html',
            controller: 'editCtrl',
            tabName: 'home',
            editMode: true
        });

    }])
    .controller('editCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'ffRecipeService', '$routeParams', 'HEX_COLORS', 'util', 'httpUtil',
        function ($scope, $rootScope, $location, $timeout, ffRecipeService, $routeParams, HEX_COLORS, util, httpUtil) {
            $scope.isEdit = false;
            $scope.recipe = {ingredients: [], color: 'green'};
            $scope.loaders = {page: true, sum: 0, max: 2};
            $scope.hexColors = HEX_COLORS;
            $scope.colors = util.objectToArray(HEX_COLORS, 'name');
            $scope.forms = {};
            $scope.radioFunction = 'move';
            $scope.picker = {};
            $scope.selectedIngredient = { ingredientTag : 'SPOON'};

            var ACTION;

            $scope.hasError = function(name, formName, optionalClass) {
                return util.hasErrorClass(name, $scope.forms[formName], optionalClass);
            };

            $scope.paste = function (ev) {
                //$scope.handlePastedData($event.originalEvent.clipboardData.getData('text/plain'));
                var clipboardData = ev.clipboardData || window.clipboardData || ev.originalEvent.clipboardData;
                var splitIngredientLines = clipboardData.getData('text').split("\n");
                parseLine(splitIngredientLines);
            }

            function parseLine(lines) {
                angular.forEach(lines, function (value, key) {
                   var ingredientLine=value.match(/^(\S+? \S+?) ([\s\S]+?)$/);
                        $scope.recipe.ingredients.push({amount : ingredientLine[1],
                            name : ingredientLine[2],
                            ingredientTag : ingredientLine[2]
                        });
                }
                );
                //var ingredientlines = lines.split("(\w+\s*\w+)\s");
               //$scope.recipe.ingredients.push({amount : ingredientlines[0],
                //    name : ingredientlines[1],
                //    ingredientTag : ingredientlines[1]
               // });
            }

            $scope.ingredientActions = {
                search:function(searchTerm) {
                    return httpUtil.mockPromise($scope.ingredients);
                },
                select : function (item) {
                    $scope.selectedIngredient.ingredientTag = item.tag;
                    $scope.selectedIngredient.name = item.name;
                },
                add: function () {
                    if ($scope.selectedIngredient && $scope.ingredientActions.isValid($scope.selectedIngredient)) {
                        $scope.recipe.ingredients.push({
                            amount : $scope.selectedIngredient.amount,
                            name : $scope.selectedIngredient.name,
                            ingredientTag : $scope.selectedIngredient.ingredientTag
                        });
                    }
                },
                isValid : function(ingredient) {
                    util.validateForm($scope.forms.ingredients);
                    return ingredient.amount && ingredient.name && ingredient.ingredientTag;
                },
                remove: function (ingredient) {
                    for (var i = 0; i < $scope.recipe.ingredients.length; i++) {
                        if (ingredient === $scope.recipe.ingredients[i]) {
                            $scope.recipe.ingredients.splice(i, 1);
                            break;
                        }
                    }
                },
                move: function (fromIndex, toIndex) {
                    if (toIndex >= 0 && toIndex < $scope.recipe.ingredients.length) {
                        var tmp = angular.copy($scope.recipe.ingredients[fromIndex]);
                        $scope.recipe.ingredients[fromIndex] = angular.copy($scope.recipe.ingredients[toIndex]);
                        $scope.recipe.ingredients[toIndex] = tmp;
                    }
                }
            };

            $scope.recipeActions = {
                submit: function () {
                    if($scope.recipeActions.isValid($scope.recipe)) {
                        if($rootScope.authorized()) {
                            if ($routeParams.recipeId) {
                                $scope.recipeActions.save();
                            } else {
                                $scope.recipeActions.create();
                            }
                        } else {
                            //TODO enhance feedback
                            alert('Log back in!')
                        }
                    }
                },
                isValid : function(recipe) {
                    //TODO enhance feedback
                    util.validateForm($scope.forms.recipe);

                    var r = recipe.title &&
                            recipe.method && recipe.prep && recipe.minutes && recipe.serves &&
                            recipe.ingredients instanceof  Array &&
                            recipe.instructions;
                    if(r) {
                        for(var i = 0; i < recipe.ingredients.length; i++) {
                            r = r && $scope.ingredientActions.isValid(recipe.ingredients[i]);
                        }
                        return r;
                    } else {
                        return r;
                    }
                },
                onResponse: function (data) {
                    ffRecipeService.evaluateCache($scope.recipe, ACTION);
                    var path = ACTION >= 0 ? ('/recipe/' + $scope.recipe.id) : '/home';
                    $location.path(path);
                },
                delete: function () {
                    ACTION = -1;
                    ffRecipeService.deleteRecipe($scope.recipe).then($scope.recipeActions.onResponse);
                },
                save: function () {
                    ACTION = 0;
                    ffRecipeService.saveRecipe($scope.recipe).then($scope.recipeActions.onResponse);
                },
                create: function () {
                    ACTION = 1;
                    ffRecipeService.createRecipe($scope.recipe).then($scope.recipeActions.onResponse);
                }
            };

            $scope.selectColor = function (colorName) {
                $scope.recipe.color = colorName;
            };

            $scope.showChickenMessage = function () {
                $timeout(function(){
                    $('#chickenModal').modal('show');
                });
            };

            //SETUP
            var manageLoader = function () {
                $scope.loaders.sum++;
                if ($scope.loaders.sum === $scope.loaders.max) {
                    $scope.loaders.page = false;
                    $scope.loaders.sum = 0;
                }
            };

            var getIngredients = function () {
                ffRecipeService.getIngredients().then(function (response) {
                    $scope.ingredients = response.data;
                    manageLoader();
                });
            };

            var getRecipe = function () {
                if ($routeParams.recipeId) {
                    $scope.isEdit = true;
                    ffRecipeService.getRecipeById($routeParams.recipeId).then(function (response) {
                        var recipe = response.data;
                        recipe.instructions = util.encodeLineBreaks(recipe.instructions);
                        if(!(recipe.ingredients instanceof Array)) {
                            recipe.ingredients = [];
                        }
                        $scope.recipe = recipe;
                        $scope.recipe.id = $routeParams.recipeId;
                        manageLoader();
                    });
                } else {
                    manageLoader();
                }
            };

            var initialize = function () {
                if (!$rootScope.authorized()) {
                    if($routeParams.recipeId) {
                        $location.path('/recipe/' + $routeParams.recipeId)
                    } else {
                        $location.path('/home');
                    }
                } else {
                    getRecipe();
                    getIngredients();
                }
            };

            initialize();
        }
    ]);