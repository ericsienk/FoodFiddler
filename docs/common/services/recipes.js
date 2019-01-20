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
                    //,{ name: 'apple', tag: 'apple'},
                    //{ name: 'apple-1', tag: 'apple-1'},
                    //{ name: 'asparagus', tag: 'asparagus'},
                    //{ name: 'aubergine', tag: 'aubergine'},
                    //{ name: 'avocado', tag: 'avocado'},
                    //{ name: 'bacon', tag: 'bacon'},
                    //{ name: 'baguette', tag: 'baguette'},
                    //{ name: 'banana', tag: 'banana'},
                    //{ name: 'beans', tag: 'beans'},
                    //{ name: 'biscuit', tag: 'biscuit'},
                    //{ name: 'blueberries', tag: 'blueberries'},
                    //{ name: 'boiled', tag: 'boiled'},
                    //{ name: 'bowl', tag: 'bowl'},
                    //{ name: 'bowl-1', tag: 'bowl-1'},
                    //{ name: 'bread', tag: 'bread'},
                    //{ name: 'bread-1', tag: 'bread-1'},
                    //{ name: 'bread-2', tag: 'bread-2'},
                    //{ name: 'broccoli', tag: 'broccoli'},
                    //{ name: 'butcher', tag: 'butcher'},
                    //{ name: 'butter', tag: 'butter'},
                    //{ name: 'cabbage', tag: 'cabbage'},
                    //{ name: 'cake', tag: 'cake'},
                    //{ name: 'can', tag: 'can'},
                    //{ name: 'can-1', tag: 'can-1'},
                    //{ name: 'can-2', tag: 'can-2'},
                    //{ name: 'candy', tag: 'candy'},
                    //{ name: 'candy-1', tag: 'candy-1'},
                    //{ name: 'carrot', tag: 'carrot'},
                    //{ name: 'cauliflower', tag: 'cauliflower'},
                    //{ name: 'cereals', tag: 'cereals'},
                    //{ name: 'cheese', tag: 'cheese'},
                    //{ name: 'cheese-1', tag: 'cheese-1'},
                    //{ name: 'chef', tag: 'chef'},
                    //{ name: 'cherries', tag: 'cherries'},
                    //{ name: 'chili', tag: 'chili'},
                    //{ name: 'chips', tag: 'chips'},
                    //{ name: 'chives', tag: 'chives'},
                    //{ name: 'chocolate', tag: 'chocolate'},
                    //{ name: 'coconut', tag: 'coconut'},
                    //{ name: 'coffee', tag: 'coffee'},
                    //{ name: 'coffee-1', tag: 'coffee-1'},
                    //{ name: 'coffee-2', tag: 'coffee-2'},
                    //{ name: 'coffee-3', tag: 'coffee-3'},
                    //{ name: 'coffee-4', tag: 'coffee-4'},
                    //{ name: 'coffee-maker', tag: 'coffee-maker'},
                    //{ name: 'cookies', tag: 'cookies'},
                    //{ name: 'corckscrew', tag: 'corckscrew'},
                    //{ name: 'corn', tag: 'corn'},
                    //{ name: 'corndog', tag: 'corndog'},
                    //{ name: 'croissant', tag: 'croissant'},
                    //{ name: 'cucumber', tag: 'cucumber'},
                    //{ name: 'cup', tag: 'cup'},
                    //{ name: 'cupcake', tag: 'cupcake'},
                    //{ name: 'cupcake-1', tag: 'cupcake-1'},
                    //{ name: 'cupcake-2', tag: 'cupcake-2'},
                    //{ name: 'cutlery', tag: 'cutlery'},
                    //{ name: 'dairy', tag: 'dairy'},
                    //{ name: 'dish', tag: 'dish'},
                    //{ name: 'dishes', tag: 'dishes'},
                    //{ name: 'doughnut', tag: 'doughnut'},
                    //{ name: 'doughnut-1', tag: 'doughnut-1'},
                    //{ name: 'doughnut-2', tag: 'doughnut-2'},
                    //{ name: 'egg', tag: 'egg'},
                    //{ name: 'eggs', tag: 'eggs'},
                    //{ name: 'fig', tag: 'fig'},
                    //{ name: 'fish', tag: 'fish'},
                    //{ name: 'flour', tag: 'flour'},
                    //{ name: 'flour-1', tag: 'flour-1'},
                    //{ name: 'food', tag: 'food'},
                    //{ name: 'fork', tag: 'fork'},
                    //{ name: 'frappe', tag: 'frappe'},
                    //{ name: 'fries', tag: 'fries'},
                    //{ name: 'garlic', tag: 'garlic'},
                    //{ name: 'gingerbread', tag: 'gingerbread'},
                    //{ name: 'glass', tag: 'glass'},
                    //{ name: 'glass-1', tag: 'glass-1'},
                    //{ name: 'glass-2', tag: 'glass-2'},
                    //{ name: 'glass-3', tag: 'glass-3'},
                    //{ name: 'glass-4', tag: 'glass-4'},
                    //{ name: 'glass-5', tag: 'glass-5'},
                    //{ name: 'glass-6', tag: 'glass-6'},
                    //{ name: 'grain', tag: 'grain'},
                    //{ name: 'grapes', tag: 'grapes'},
                    //{ name: 'grater', tag: 'grater'},
                    //{ name: 'grinder', tag: 'grinder'},
                    //{ name: 'groceries', tag: 'groceries'},
                    //{ name: 'ham', tag: 'ham'},
                    //{ name: 'hamburguer', tag: 'hamburguer'},
                    //{ name: 'hamburguer-1', tag: 'hamburguer-1'},
                    //{ name: 'hazelnut', tag: 'hazelnut'},
                    //{ name: 'honey', tag: 'honey'},
                    //{ name: 'honey-1', tag: 'honey-1'},
                    //{ name: 'hot-dog', tag: 'hot-dog'},
                    //{ name: 'hot-dog-1', tag: 'hot-dog-1'},
                    //{ name: 'ice-cream', tag: 'ice-cream'},
                    //{ name: 'ice-cream-1', tag: 'ice-cream-1'},
                    //{ name: 'ice-cream-10', tag: 'ice-cream-10'},
                    //{ name: 'ice-cream-11', tag: 'ice-cream-11'},
                    //{ name: 'ice-cream-12', tag: 'ice-cream-12'},
                    //{ name: 'ice-cream-13', tag: 'ice-cream-13'},
                    //{ name: 'ice-cream-14', tag: 'ice-cream-14'},
                    //{ name: 'ice-cream-2', tag: 'ice-cream-2'},
                    //{ name: 'ice-cream-3', tag: 'ice-cream-3'},
                    //{ name: 'ice-cream-4', tag: 'ice-cream-4'},
                    //{ name: 'ice-cream-5', tag: 'ice-cream-5'},
                    //{ name: 'ice-cream-6', tag: 'ice-cream-6'},
                    //{ name: 'ice-cream-7', tag: 'ice-cream-7'},
                    //{ name: 'ice-cream-8', tag: 'ice-cream-8'},
                    //{ name: 'ice-cream-9', tag: 'ice-cream-9'},
                    //{ name: 'jam', tag: 'jam'},
                    //{ name: 'jam-1', tag: 'jam-1'},
                    //{ name: 'jawbreaker', tag: 'jawbreaker'},
                    //{ name: 'jelly', tag: 'jelly'},
                    //{ name: 'kebab', tag: 'kebab'},
                    //{ name: 'kebab-1', tag: 'kebab-1'},
                    //{ name: 'kebab-2', tag: 'kebab-2'},
                    //{ name: 'kitchen', tag: 'kitchen'},
                    //{ name: 'knife', tag: 'knife'},
                    //{ name: 'knife-1', tag: 'knife-1'},
                    //{ name: 'knife-2', tag: 'knife-2'},
                    //{ name: 'knife-3', tag: 'knife-3'},
                    //{ name: 'knives', tag: 'knives'},
                    //{ name: 'ladle', tag: 'ladle'},
                    //{ name: 'lemon', tag: 'lemon'},
                    //{ name: 'lemon-1', tag: 'lemon-1'},
                    //{ name: 'lime', tag: 'lime'},
                    //{ name: 'meat', tag: 'meat'},
                    //{ name: 'meat-1', tag: 'meat-1'},
                    //{ name: 'meat-2', tag: 'meat-2'},
                    //{ name: 'milk', tag: 'milk'},
                    //{ name: 'milk-1', tag: 'milk-1'},
                    //{ name: 'mixer', tag: 'mixer'},
                    //{ name: 'mug', tag: 'mug'},
                    //{ name: 'mushroom', tag: 'mushroom'},
                    //{ name: 'mushrooms', tag: 'mushrooms'},
                    //{ name: 'mustard', tag: 'mustard'},
                    //{ name: 'mustard-1', tag: 'mustard-1'},
                    //{ name: 'mustard-2', tag: 'mustard-2'},
                    //{ name: 'noodles', tag: 'noodles'},
                    //{ name: 'oat', tag: 'oat'},
                    //{ name: 'octopus', tag: 'octopus'},
                    //{ name: 'oil', tag: 'oil'},
                    //{ name: 'olives', tag: 'olives'},
                    //{ name: 'onion', tag: 'onion'},
                    //{ name: 'onion-1', tag: 'onion-1'},
                    //{ name: 'orange', tag: 'orange'},
                    //{ name: 'ornating', tag: 'ornating'},
                    //{ name: 'pan', tag: 'pan'},
                    //{ name: 'pancakes', tag: 'pancakes'},
                    //{ name: 'pancakes-1', tag: 'pancakes-1'},
                    //{ name: 'pasta', tag: 'pasta'},
                    //{ name: 'pasta-1', tag: 'pasta-1'},
                    //{ name: 'peach', tag: 'peach'},
                    //{ name: 'pear', tag: 'pear'},
                    //{ name: 'peas', tag: 'peas'},
                    //{ name: 'pepper', tag: 'pepper'},
                    //{ name: 'pepper-1', tag: 'pepper-1'},
                    //{ name: 'pickles', tag: 'pickles'},
                    //{ name: 'pie', tag: 'pie'},
                    //{ name: 'pie-1', tag: 'pie-1'},
                    //{ name: 'pie-2', tag: 'pie-2'},
                    //{ name: 'pineapple', tag: 'pineapple'},
                    //{ name: 'pint', tag: 'pint'},
                    //{ name: 'pistachio', tag: 'pistachio'},
                    //{ name: 'pizza', tag: 'pizza'},
                    //{ name: 'pizza-1', tag: 'pizza-1'},
                    //{ name: 'pizza-2', tag: 'pizza-2'},
                    //{ name: 'pizza-3', tag: 'pizza-3'},
                    //{ name: 'pizza-4', tag: 'pizza-4'},
                    //{ name: 'pizza-5', tag: 'pizza-5'},
                    //{ name: 'pomegranate', tag: 'pomegranate'},
                    //{ name: 'popsicle', tag: 'popsicle'},
                    //{ name: 'pot', tag: 'pot'},
                    //{ name: 'pot-1', tag: 'pot-1'},
                    //{ name: 'pot-2', tag: 'pot-2'},
                    //{ name: 'potatoes', tag: 'potatoes'},
                    //{ name: 'potatoes-1', tag: 'potatoes-1'},
                    //{ name: 'potatoes-2', tag: 'potatoes-2'},
                    //{ name: 'pretzel', tag: 'pretzel'},
                    //{ name: 'pudding', tag: 'pudding'},
                    //{ name: 'pumpkin', tag: 'pumpkin'},
                    //{ name: 'radish', tag: 'radish'},
                    //{ name: 'raspberry', tag: 'raspberry'},
                    //{ name: 'rice', tag: 'rice'},
                    //{ name: 'risotto', tag: 'risotto'},
                    //{ name: 'rolling-pin', tag: 'rolling-pin'},
                    //{ name: 'salad', tag: 'salad'},
                    //{ name: 'salad-1', tag: 'salad-1'},
                    //{ name: 'salami', tag: 'salami'},
                    //{ name: 'salmon', tag: 'salmon'},
                    //{ name: 'salt', tag: 'salt'},
                    //{ name: 'sandwich', tag: 'sandwich'},
                    //{ name: 'sandwich-1', tag: 'sandwich-1'},
                    //{ name: 'sausage', tag: 'sausage'},
                    //{ name: 'scale', tag: 'scale'},
                    //{ name: 'seeds', tag: 'seeds'},
                    //{ name: 'shrimp', tag: 'shrimp'},
                    //{ name: 'slotted-spoon', tag: 'slotted-spoon'},
                    //{ name: 'sorbet', tag: 'sorbet'},
                    //{ name: 'spaguetti', tag: 'spaguetti'},
                    //{ name: 'spatula', tag: 'spatula'},
                    //{ name: 'spatula-1', tag: 'spatula-1'},
                    //{ name: 'spices', tag: 'spices'},
                    //{ name: 'spoon', tag: 'spoon'},
                    //{ name: 'steak', tag: 'steak'},
                    //{ name: 'stew', tag: 'stew'},
                    //{ name: 'stew-1', tag: 'stew-1'},
                    //{ name: 'strainer', tag: 'strainer'},
                    //{ name: 'strawberry', tag: 'strawberry'},
                    //{ name: 'sushi', tag: 'sushi'},
                    //{ name: 'sushi-1', tag: 'sushi-1'},
                    //{ name: 'sushi-2', tag: 'sushi-2'},
                    //{ name: 'taco', tag: 'taco'},
                    //{ name: 'tea', tag: 'tea'},
                    //{ name: 'tea-1', tag: 'tea-1'},
                    //{ name: 'teapot', tag: 'teapot'},
                    //{ name: 'teapot-1', tag: 'teapot-1'},
                    //{ name: 'teaspoon', tag: 'teaspoon'},
                    //{ name: 'tenderizer', tag: 'tenderizer'},
                    //{ name: 'thermos', tag: 'thermos'},
                    //{ name: 'toast', tag: 'toast'},
                    //{ name: 'toaster', tag: 'toaster'},
                    //{ name: 'toffee', tag: 'toffee'},
                    //{ name: 'tomato', tag: 'tomato'},
                    //{ name: 'turkey', tag: 'turkey'},
                    //{ name: 'water', tag: 'water'},
                    //{ name: 'water-1', tag: 'water-1'},
                    //{ name: 'watermelon', tag: 'watermelon'},
                    //{ name: 'whisk', tag: 'whisk'},
                    //{ name: 'wrap', tag: 'wrap'}

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