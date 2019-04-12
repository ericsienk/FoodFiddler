(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffRecipeService', ['$http', '$q', 'util', 'httpUtil', 'ffTagsService', function ($http, $q, util, httpUtil, ffTagsService) {
            var recipeIndexer = util.getHashIndexer(),
                ingredients,
                BASE_TABLE = 'foodfiddler/recipes/';

            function getRecipes() {
                return httpUtil.firebaseGet(BASE_TABLE, recipeIndexer);
            }

            function getRecipeById(id) {
                return httpUtil.firebaseGetById(BASE_TABLE, recipeIndexer, id).then(function (response) {
                    // transform list of tag id's to full tag objects
                    response.data.tags = response.data.tags || {};
                    angular.forEach(response.data.tags, function (value, key) {
                        if (typeof (value) !== 'object') {
                            response.data.tags[key] = { id: value };
                            // async replace
                            httpUtil.optimisticGet(
                                ffTagsService.getRecipeTag(key),
                                response.data.tags,
                                key
                            );
                        }
                    });

                    return response;
                });
            }

            function normalizeRecipe(recipe) {
                var tmp = angular.copy(recipe),
                    tmpTags = {};

                tmp.tags = tmp.tags || {};
                angular.forEach(tmp.tags, function (value, key) {
                    if (typeof (value) === 'object') {
                        tmpTags[key] = true;
                    } else {
                        tmpTags[key] = value;
                    }
                });

                tmp.tags = tmpTags;
                return tmp;
            }

            function createRecipe(recipe) {
                var prepped = normalizeRecipe(recipe),
                    recipeTagDiffIndexer = recipeIndexer.diff(prepped, recipe.id, 'tags');
                
                return httpUtil.firebaseBatch()
                    .create(BASE_TABLE, prepped)
                    .mergeBatch(ffTagsService.getTagRecipesBatch(prepped.id, recipeTagDiffIndexer))
                    .execute().then(function () {
                        // *firebaseBatch adds id to reference
                        recipeIndexer.merge(prepped);
                        return prepped;
                    });
            }

            function saveRecipe(recipe) {
                var prepped = normalizeRecipe(recipe),
                    recipeTagDiffIndexer = recipeIndexer.diff(prepped, recipe.id, 'tags');

                return httpUtil.firebaseBatch()
                    .update(BASE_TABLE + recipe.id, prepped)
                    .mergeBatch(ffTagsService.getTagRecipesBatch(recipe.id, recipeTagDiffIndexer))
                    .execute().then(function () {
                        recipeIndexer.merge(recipe);
                        return recipe;
                    });
            }

            function deleteRecipe(recipe) {
                var prepped = normalizeRecipe(recipe);
                prepped.tags = {}; // remove tag relations

                var recipeTagDiffIndexer = recipeIndexer.diff(prepped, recipe.id, 'tags');

                return httpUtil.firebaseBatch()
                    .delete(BASE_TABLE + recipe.id, prepped)
                    .mergeBatch(ffTagsService.getTagRecipesBatch(recipe.id, recipeTagDiffIndexer))
                    .execute().then(function () {
                        recipeIndexer.remove(recipe);
                        return recipe;
                    });
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

            function getRecipesByTag(tag) {
                return ffTagsService.getTagById(tag).then(function(response) {
                    return $q.all(
                        Object.keys(response.data.recipes).map(function(recipeId) {
                            return getRecipeById(recipeId);
                        })
                    ).then(function(responses) {
                        return responses.map(function(response) {
                            return response.data;
                        })
                    });
                });
            }

            function getRecentRecipes() {
                // TODO store timestamps and order by most recent
                return getRecipes().then(function(response) {
                    return response.data.reverse();
                });
            }

            return {
                getRecipes: getRecipes,
                getRecipeById: getRecipeById,
                createRecipe: createRecipe,
                saveRecipe: saveRecipe,
                deleteRecipe: deleteRecipe,
                getIngredients: getIngredients,
                guessIngredientIconTag: guessIngredientIconTag,
                getRecipesByTag: getRecipesByTag,
                getRecentRecipes: getRecentRecipes
            };
        }]);
}(angular));