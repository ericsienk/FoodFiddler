(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffRecipeService', ['$log', '$http', '$q', 'util', 'httpUtil',
            function ($log, $http, $q, util, httpUtil) {

                var recipes,
                    recipeHashIndexer,
                    ingredients;

                var getRecipes = function () {
                    var deferred = $q.defer();
                    if (recipes) {
                        deferred.resolve(httpUtil.packData(recipes));
                    } else {
                        httpUtil.firebaseTo$qResolve(firebase.database().ref('foodfiddler/recipes').once('value'), function (response) {
                            recipeHashIndexer = {};
                            recipes = util.objectToArray(response.data, 'id', recipeHashIndexer);
                            deferred.resolve(httpUtil.packData(recipes));
                        });
                    }
                    return deferred.promise;
                };

                var getRecipeById = function (id) {
                    var deferred = $q.defer();

                    if (recipeHashIndexer && recipeHashIndexer[id] && recipes && (recipes.length > recipeHashIndexer[id])) {
                        deferred.resolve(httpUtil.packData(recipes[recipeHashIndexer[id]]));
                    } else {
                        httpUtil.firebaseTo$qResolve(firebase.database().ref('/foodfiddler/recipes/' + id).once('value'), deferred.resolve);
                    }

                    return deferred.promise;
                };

                var createRecipe = function (recipe) {
                    var newPostKey = firebase.database().ref().child('foodfiddler/recipes').push().key;
                    var updates = {};
                    updates['foodfiddler/recipes/' + newPostKey] = recipe;
                    recipe.id = newPostKey;
                    return httpUtil.firebaseTo$qPromise(firebase.database().ref().update(updates));
                };

                var saveRecipe = function (recipe) {
                    return httpUtil.firebaseTo$qPromise(firebase.database().ref('foodfiddler/recipes/' + recipe.id).set(recipe));
                };


                var deleteRecipe = function (recipe) {
                    return httpUtil.firebaseTo$qPromise(firebase.database().ref('foodfiddler/recipes/' + recipe.id).remove());
                };

                var getIngredients = function () {
                    return $http.get('common/data/ingredients.json');
                };

                /**
                 * guessIngredientIconTag
                 * attempts to guess a suitable ingredient tag from the ingredient name
                 *
                 * @param ingredientName
                 * @returns {string}
                 */
                function guessIngredientIconTag(ingredientName) {
                    var choppyName = ingredientName.replace(
                        /\scups?|tbsp|\slbs?|tsp|gallons?|\d+\/?\d?|,|\(|\)|inch|inches|medium|large|small|\sof\s|\sin\s|\sif\s|\sor\s/g,
                        ''
                        ), rando = ['SPOON', 'SOUR_CRM', 'SHORT', 'POW_SUGAR'],
                        bestMatch = {
                            tag: rando[Math.floor(Math.random() * rando.length)],
                            rating: choppyName.length / 2,
                            inThere: false
                        };

                    if(!ingredients) {
                        return bestMatch.tag;
                    }

                    for (var i = 0; i < ingredients.length; i++) {
                        var rating = util.howFuzzyWasHe(choppyName, ingredients[i].name),
                            inThere = util.areYouInMyString(ingredients[i].name, choppyName),
                            totalRating = (rating + (-1 * (inThere / 30)));

                        if (totalRating < bestMatch.rating) {
                            bestMatch = {tag: ingredients[i].tag, rating: totalRating};
                        }
                    }
                    return bestMatch.tag;
                }

                var evaluateCache = function (recipe, ACTION) {
                    if (cacheBuster[ACTION] instanceof Function) {
                        cacheBuster[ACTION](recipe);
                    }
                };

                var cacheBuster = {
                    //DELETE
                    '-1': function (recipe) {
                        cacheBuster.check(function () {
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
                    '0': function (recipe) {
                        cacheBuster.check(function () {
                            recipes[recipeHashIndexer[recipe.id]] = angular.copy(recipe);
                        });
                    },
                    //ADD
                    '1': function (recipe) {
                        cacheBuster.check(function () {
                            recipes.push(recipe);
                            recipeHashIndexer[recipe.id] = recipes.length - 1;
                        });
                    },
                    check: function (callback) {
                        if (recipeHashIndexer && recipes && recipeHashIndexer[recipes.length - 1]) {
                            callback();
                        } else {
                            recipes = undefined;
                        }
                    }
                };

                return {
                    evaluateCache: evaluateCache,
                    getRecipes: getRecipes,
                    getRecipeById: getRecipeById,
                    createRecipe: createRecipe,
                    saveRecipe: saveRecipe,
                    deleteRecipe: deleteRecipe,
                    getIngredients: getIngredients,
                    guessIngredientIconTag: guessIngredientIconTag
                };
            }]);
}(angular));