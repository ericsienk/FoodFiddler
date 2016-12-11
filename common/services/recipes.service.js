(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffRecipeService', ['$log', '$http', function($log, $http) {
            var recipes;

            var getRecipes = function() {
                return $http.get('common/data/recipes.json');
            };

            var setRecipes = function(r) {
                recipes = r;
            };

            var getRecipeById = function(id) {
                if(recipes !== undefined && id !== undefined && (id > 0) && (id  <= recipes.length)) {
                    return recipes[id - 1];
                } else {
                    return undefined;
                }
            };

            return {
                getRecipes : getRecipes,
                setRecipes : setRecipes,
                getRecipeById : getRecipeById
            };
        }]);
} (angular));