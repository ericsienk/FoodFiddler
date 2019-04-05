(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffRecipeService', ['$http', 'util', 'httpUtil', function ($http, util, httpUtil) {
                var recipeIndexer = util.getHashIndexer(),
                    ingredients,
                    BASE_TABLE = 'foodfiddler/recipes/';

                function getRecipes() {
                    return httpUtil.firebaseGet(BASE_TABLE, recipeIndexer);
                }

                function getRecipeById(id) {
                    return httpUtil.firebaseGetById(BASE_TABLE, recipeIndexer, id);
                }

                function createRecipe(recipe) {
                    return httpUtil.firebaseCreate(BASE_TABLE, recipeIndexer, recipe);
                }

                function saveRecipe(recipe) {
                    return httpUtil.firebaseUpdate(BASE_TABLE, recipeIndexer,recipe);
                }

                function deleteRecipe(recipe) {
                    return httpUtil.firebaseDelete(BASE_TABLE, recipeIndexer,recipe);
                }

                function getIngredients() {
                    return $http.get('common/data/ingredients.json');
                }

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

                    if (!ingredients) {
                        return bestMatch.tag;
                    }

                    for (var i = 0; i < ingredients.length; i++) {
                        var rating = util.howFuzzyWasHe(choppyName, ingredients[i].name),
                            inThere = util.areYouInMyString(ingredients[i].name, choppyName),
                            totalRating = (rating + (-1 * (inThere / 30)));

                        if (totalRating < bestMatch.rating) {
                            bestMatch = { tag: ingredients[i].tag, rating: totalRating };
                        }
                    }
                    return bestMatch.tag;
                }

                return {
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