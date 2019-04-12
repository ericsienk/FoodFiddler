'use strict';

angular.module('foodfiddler.home', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl',
            tabName: 'home'
        });
    }])
    .controller('homeCtrl', ['$scope', 'ffRecipeService', 'ffTagsService', function ($scope, ffRecipeService, ffTagsService) {
        function onRetrieveRecipes(recipes) {
            $scope.filteredRecipes = recipes;
            $scope.loaders.page = false;
        }

        $scope.getRecipes = function (tab) {
            $scope.loaders.page = false;
            $scope.selected = tab;
            $scope.filteredRecipes = [];

            if(tab === 'Recent') {
                ffRecipeService.getRecentRecipes().then(onRetrieveRecipes)
            } else  if(tab === 'Desserts') {
                ffRecipeService.getRecipesByTag(ffTagsService.CONSTANTS.DESSERT).then(onRetrieveRecipes);
            } else if(tab === 'Meals') {
                ffRecipeService.getRecipesByTag(ffTagsService.CONSTANTS.MEAL).then(onRetrieveRecipes);
            }
        };

        (function initialize() {
            $scope.loaders = { page: true };
            $scope.getRecipes('Recent');
        })();
    }]);