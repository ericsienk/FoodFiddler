(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffRecipeService', ['$log', '$http', function($log, $http) {
            var recipes,
                recipeHashIndexer;

            var getRecipes = function() {
                return firebase.database().ref('foodfiddler/recipes').once('value');
            };

            var setRecipes = function(r) {
                recipes = r;
            };

            var setRecipesFromObjList = function(r) {
                recipes = firebaseObjToArray(r);
            };

            var firebaseObjToArray = function(r) {
                var tmpRecipes = [],
                    tmpHash = {},
                    i = 0;
                angular.forEach(r, function(value, key) {
                    var tmp = r[key];
                    tmp['id'] = key;
                    tmpRecipes.push(tmp);
                    tmpHash[key] = i;
                    i++;
                });
                recipeHashIndexer = tmpHash;
                return tmpRecipes;
            };

            var getRecipeById = function(id, recipe) {
                return firebase.database().ref('/foodfiddler/recipes/' + id).once('value');
            };

            var getRecipeList = function() {
                return recipes;
            };

            var addRecipe = function(recipe) {
                var newPostKey = firebase.database().ref().child('foodfiddler/recipes').push().key;
                var updates = {};
                updates['foodfiddler/recipes/' + newPostKey] = recipe;
                recipe.id = newPostKey;
                return firebase.database().ref().update(updates);
            };

            var updateRecipe = function(recipe) {
                return firebase.database().ref('foodfiddler/recipes/' + recipe.id).set(recipe);
            };

            var updateCachedRecipe = function(recipe) {
                if(recipes && recipes.length) {
                    if(recipeHashIndexer) {
                        recipes[recipeHashIndexer[recipe.id]] = angular.copy(recipe);
                    } else {
                        for(var i = 0; i < recipes.length; i++) {
                            if(recipes[i].id === recipe.id) {
                                recipes[i] = angular.copy(recipe);
                                break;
                            }
                        }
                    }
                }
            };

            var addCachedRecipe = function(recipe) {
                if(recipe && recipes.length) {
                    recipes.push(recipe);
                    if(recipeHashIndexer) {
                        recipeHashIndexer[recipe.id] = recipes.length - 1;
                    }
                }
            };

            var deleteCachedRecipe = function(recipe) {
                if(recipe && recipe.length) {
                    if (recipeHashIndexer) {
                        recipes.splice(recipeHashIndexer[recipe.id], 1);
                        var tmpHash = {};
                        angular.forEach(recipes, function (value, key) {
                            tmpHash[key] = i;
                            i++;
                        });
                        recipeHashIndexer = tmpHash;
                    } else {
                        for(var i = 0; i < recipes.length; i++) {
                            if(recipes[i].id === recipe.id) {
                                recipes.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            };

            var deleteRecipe = function(recipe) {
                return firebase.database().ref('foodfiddler/recipes/' + recipe.id).remove();
            };

            return {
                getRecipes : getRecipes,
                getRecipeList : getRecipeList,
                setRecipes : setRecipes,
                getRecipeById : getRecipeById,
                addRecipe : addRecipe,
                updateRecipe : updateRecipe,
                deleteRecipe : deleteRecipe,
                setRecipesFromObjList : setRecipesFromObjList,
                updateCachedRecipe : updateCachedRecipe,
                addCachedRecipe : addCachedRecipe,
                deleteCachedRecipe : deleteCachedRecipe
            };
        }]);
} (angular));