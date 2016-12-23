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

            var getRecipeById = function(id, recipe) {
                var userId = firebase.auth().currentUser.uid;
                return firebase.database().ref('/foodfiddler/recipes/' + id).once('value');
            };

            var addRecipe = function(recipe) {
                var newPostKey = firebase.database().ref().child('foodfiddler/recipes').push().key;
                var updates = {};
                updates['foodfiddler/recipes/' + newPostKey] = recipe;
                recipe.id = newPostKey;
                return firebase.database().ref().update(updates);
            };

            return {
                getRecipes : getRecipes,
                setRecipes : setRecipes,
                getRecipeById : getRecipeById,
                addRecipe : addRecipe
            };
        }]);
} (angular));