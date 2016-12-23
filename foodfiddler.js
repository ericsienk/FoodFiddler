'use strict';
 // Declare app level module which depends on views, and components
(function (angular) {
    var appDependencies = [
        'ngMaterial',
        'ngRoute',
        'ngSanitize',
        'foodfiddler.ff-filters',
        'foodfiddler.service.recipes',
        'foodfiddler.directive.recipeView',
        'foodfiddler.directive.recipeMaker',
        'foodfiddler.home',
        'foodfiddler.recipe'
    ];
    var foodfiddler = angular.module('foodfiddler', appDependencies);

    foodfiddler.config(['$routeProvider', '$httpProvider', '$logProvider',
        function($routeProvider, $httpProvider, $logProvider) {
            $routeProvider.otherwise({redirectTo: '/home'});
            $httpProvider.defaults.headers.post = { "Content-Type" : "application/json"};
            $httpProvider.defaults.xhrFields = { withCredentials : true };
            $logProvider.debugEnabled = true;
        }
    ]);

    foodfiddler.controller('FoodFiddlerCtrl', ['$scope', '$rootScope','ffRecipeService', '$route',
        function($scope, $rootScope,ffRecipeService, $route) {
            console.log("nav loaded");
            ffRecipeService.getRecipes().then(function(data){
                ffRecipeService.setRecipes(data.data);
            }, function(error) {});

            var destroyWatch = $scope.$watch(function() {
                return $route.current;
            },function(newValue,oldValue) {
                if($route.current){
                    $scope.currentNavItem = $route.current.$$route.currentNavItem;
                    destroyWatch();
                }
            });

        }]);
}(window.angular));
