'use strict';
 // Declare app level module which depends on views, and components
(function (angular) {
    var appDependencies = [
        'ngMaterial',
        'ngRoute',
        'ngSanitize',
        'foodfiddler.ff-filters',
        'foodfiddler.service.recipes',
        'foodfiddler.directive.ingredientPicker',
        'foodfiddler.directive.recipeView',
        'foodfiddler.directive.recipeMaker',
        'foodfiddler.directive.recipeList',
        'foodfiddler.home',
        'foodfiddler.recipe',
        'foodfiddler.add'
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

            var originatorEv;

            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

            $rootScope.authorized = function() {
                return $scope.isAdmin();
            };

            $scope.isAdmin = function() {
                if($rootScope.user && $rootScope.user.loggedIn) {
                    if($rootScope.user.admin === undefined) {
                        firebase.database().ref("/logger").set({date: new Date()}).then(function(snapshot) {
                            $scope.$apply(function() {
                                $rootScope.user.admin = true;
                            });
                        }, function(error) {
                            $scope.$apply(function() {
                                $rootScope.user.admin = false;
                            });
                        });
                    } else {
                        return $rootScope.user.admin;
                    }
                } else {
                    return false;
                }
            };

            var isLoggedIn = function(user, signout) {
                if(user !== undefined || signout) {
                    if(signout) {
                        $rootScope.user = {};
                        $rootScope.user.displayName = 'Account';
                        $rootScope.user.loggedIn = false;
                    } else {
                        $rootScope.user.displayName = user.displayName;
                        $rootScope.user.loggedIn = true;
                    }
                } else {
                    try {
                        $rootScope.user = firebase.auth().currentUser;
                        $rootScope.user.loggedIn = true;
                        return ($rootScope.user.displayName !== undefined);
                    } catch (e) {
                        $rootScope.user = {};
                        $rootScope.user.displayName = 'Account';
                        $rootScope.user.loggedIn = false;
                        return false
                    }
                }
            };

            isLoggedIn();

            ffRecipeService.getRecipes().then(function(data){
                ffRecipeService.setRecipes(data.data);
            }, function(error) {});

            var login = function() {
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider).then(function(result) {
                    $scope.$apply(function() {
                        var token = result.credential.accessToken;
                        var user = result.user;
                        isLoggedIn(user);
                    });
                    // ...
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;
                });
            };

            var signout = function() {
                firebase.auth().signOut().then(function() {
                    $scope.$apply( function(){
                        var user = undefined;
                        isLoggedIn(undefined, true);
                    });
                }, function(error) {});
            };

            $scope.decideAction = function() {
                $rootScope.user.loggedIn ? signout() : login();
            };

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
