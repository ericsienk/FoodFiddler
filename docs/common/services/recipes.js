(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffRecipeService', ['$log', '$http', '$q', 'util', 'httpUtil',
            function($log, $http, $q, util, httpUtil) {

            var recipes,
                recipeHashIndexer;

            var getRecipes = function() {
                var deferred = $q.defer();
                if(recipes) {
                    deferred.resolve(httpUtil.packData(recipes));
                } else {
                    httpUtil.firebaseTo$qResolve(firebase.database().ref('foodfiddler/recipes').once('value'), function(response) {
                        recipeHashIndexer = {};
                        recipes = util.objectToArray(response.data, 'id', recipeHashIndexer);
                        deferred.resolve(httpUtil.packData(recipes));
                    });
                }
                return deferred.promise;
            };

            var getRecipeById = function(id) {
                var deferred = $q.defer();

                if(recipeHashIndexer && recipeHashIndexer[id] && recipes && (recipes.length > recipeHashIndexer[id])) {
                    deferred.resolve(httpUtil.packData(recipes[recipeHashIndexer[id]]));
                } else {
                    httpUtil.firebaseTo$qResolve(firebase.database().ref('/foodfiddler/recipes/' + id).once('value'), deferred.resolve);
                }

                return deferred.promise;
            };

            var createRecipe = function(recipe) {
                var newPostKey = firebase.database().ref().child('foodfiddler/recipes').push().key;
                var updates = {};
                updates['foodfiddler/recipes/' + newPostKey] = recipe;
                recipe.id = newPostKey;
                return httpUtil.firebaseTo$qPromise(firebase.database().ref().update(updates));
            };

            var saveRecipe = function(recipe) {
                return httpUtil.firebaseTo$qPromise(firebase.database().ref('foodfiddler/recipes/' + recipe.id).set(recipe));
            };


            var deleteRecipe = function(recipe) {
                return httpUtil.firebaseTo$qPromise(firebase.database().ref('foodfiddler/recipes/' + recipe.id).remove());
            };

            var getIngredients = function() {
                //TODO replace with firebase call
                return httpUtil.mockPromise([
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
                ]);
            };

            var evaluateCache = function(recipe, ACTION) {
                if(cacheBuster[ACTION] instanceof Function) {
                    cacheBuster[ACTION](recipe);
                }
            };

            var cacheBuster = {
                //DELETE
                '-1' : function(recipe) {
                    cacheBuster.check(function() {
                        recipes.splice(recipeHashIndexer[recipe.id], 1);
                        var tmpHash = {};
                        angular.forEach(recipes, function (value, key) {
                            tmpHash[key] = i;
                            i++;
                        });
                        recipeHashIndexer = tmpHash;
                    });
                },
                //UPDATE
                '0' : function(recipe) {
                    cacheBuster.check(function() {
                        recipes[recipeHashIndexer[recipe.id]] = angular.copy(recipe);
                    });
                },
                //ADD
                '1' : function(recipe) {
                    cacheBuster.check(function() {
                        recipes.push(recipe);
                        recipeHashIndexer[recipe.id] = recipes.length - 1;
                    });
                },
                check : function(callback) {
                    if(recipeHashIndexer && recipes && recipeHashIndexer[recipes.length - 1]) {
                        callback();
                    } else {
                        recipes = undefined;
                    }
                }
            };

            return {
                evaluateCache : evaluateCache,
                getRecipes : getRecipes,
                getRecipeById : getRecipeById,
                createRecipe : createRecipe,
                saveRecipe : saveRecipe,
                deleteRecipe : deleteRecipe,
                getIngredients : getIngredients
            };
        }]);
} (angular));