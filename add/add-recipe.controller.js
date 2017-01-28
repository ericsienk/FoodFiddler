'use strict';

angular.module('foodfiddler.add', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/add', {
            templateUrl: 'add/add-recipe.html',
            controller: 'addCtrl',
            currentNavItem: 'add'
        }).when('/:recipeId/edit', {
            templateUrl: 'add/add-recipe.html',
            controller: 'addCtrl',
            currentNavItem: 'home'
        });

    }])
    .controller('addCtrl', ['$scope', '$rootScope','$location', 'ffRecipeService','$routeParams',
        function($scope, $rootScope, $location, ffRecipeService, $routeParams) {

        $scope.checkAdmin = function(){
            if(!$rootScope.authorized()) {
                $location.path('/home');
            }
        };

        if($routeParams.recipeId) {
            $scope.isEdit = true;
            ffRecipeService.getRecipeById($routeParams.recipeId).then(function(snapshot) {
                $scope.$apply(function() {
                    var tmp = snapshot.val();
                    if(tmp.instructions !== undefined) {
                        tmp.instructions = tmp.instructions.replace(/(\r\n|\n|\r)/gm, "<br />");
                    }
                    $scope.recipe = tmp;
                    $scope.recipe.id = $routeParams.recipeId;
                })
            });
        } else {
            $scope.isEdit = false;
            $scope.recipe = {};
        }
    }]);