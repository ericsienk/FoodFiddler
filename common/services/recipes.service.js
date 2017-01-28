(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffRecipeService', ['$log', '$http', function($log, $http) {
            var recipes;

            var getRecipes = function() {
                return firebase.database().ref('foodfiddler/recipes').once('value');
            };

            var setRecipes = function(r) {
                recipes = r;
            };

            var firebaseObjToArray = function(r) {
                var tmpRecipes = [];
                angular.forEach(r, function(value, key) {
                    var tmp = r[key];
                    tmp['id'] = key;
                    tmpRecipes.push(tmp);
                });
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

            return {
                getRecipes : getRecipes,
                getRecipeList : getRecipeList,
                setRecipes : setRecipes,
                getRecipeById : getRecipeById,
                addRecipe : addRecipe,
                updateRecipe : updateRecipe,
                firebaseObjToArray : firebaseObjToArray
            };
        }]);
} (angular));