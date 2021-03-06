'use strict';
// Declare app level module which depends on views, and components
(function (angular) {
    var appDependencies = [
        'ngRoute',
        'ngSanitize',
        'foodfiddler.ff-filters',
        'foodfiddler.service.recipes',
        'foodfiddler.directive.ingredientPicker',
        'foodfiddler.directive.recipeList',
        'foodfiddler.home',
        'foodfiddler.recipe',
        'foodfiddler.edit',
        'foodfiddler.directive.imgurLoader',
        'foodfiddler.directive.ffAutosuggest',
        'foodfiddler.directive.recipePreview',
        'foodfiddler.directive.ffIcon',
        'foodfiddler.directive.ingredientList',
        'foodfiddler.directive.settings',
        'foodfiddler.service.util',
        'foodfiddler.service.httpUtil',
        'foodfiddler.service.lazyLoaderService',
        'foodfiddler.service.auth',
        'foodfiddler.service.tags',
        'foodfiddler.directive.tags',
        'angularGrid'
    ];
    //DO NOT ALTER appDependencies.push('templates-dist');
    var foodfiddler = angular.module('foodfiddler', appDependencies);

    foodfiddler.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/settings/', {
            template: '<ff-settings></ff-settings>'
        }).otherwise({redirectTo: '/home'});
    }]).constant('HEX_COLORS', {
        green : '#CAE0C7',
        purple : '#CBC7DF',
        yellow : '#EDBC5E',
        pink : '#E2C7D2'
    });

    foodfiddler.controller('FoodFiddlerCtrl', ['$scope', '$rootScope', 'ffRecipeService', '$route', '$location',
        function ($scope, $rootScope, ffRecipeService, $route, $location) {
        var cachedUser = null;
        firebase.auth().onAuthStateChanged(function (user) {
            cachedUser = user;
            isLoggedIn(user);
        });

        $scope.isSelected = function (tabName) {
            return $route.current && $route.current.$$route && $route.current.$$route.tabName == tabName;
        };

        $rootScope.authorized = function () {
            return $scope.isAdmin();
        };

        $scope.isAdmin = function () {
            if ($rootScope.user && $rootScope.user.loggedIn) {
                if ($rootScope.user.admin === undefined) {
                    firebase.database().ref("/logger").set({date: new Date()}).then(function (snapshot) {
                        $scope.$apply(function () {
                            $rootScope.user.admin = true;
                        });
                    }, function (error) {
                        $scope.$apply(function () {
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

        var isLoggedIn = function (user, signout) {
            if (user || signout) {
                if (signout) {
                    $rootScope.user = {};
                    $rootScope.user.displayName = 'Account';
                    $rootScope.user.loggedIn = false;
                } else {
                    $rootScope.user.displayName = user.displayName;
                    $rootScope.user.loggedIn = true;
                }
            } else {
                try {
                    $rootScope.user = firebase.auth().currentUser || cachedUser;
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

        var login = function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
                firebase.auth().signInWithPopup(provider).then(function (result) {
                    $scope.$apply(function () {
                        var token = result.credential.accessToken;
                        var user = result.user;
                        isLoggedIn(user);
                    });
                    // ...
                }).catch(function (error) {
                });
            }).catch(function (error) {
            });
        };

        var signout = function () {
            firebase.auth().signOut().then(function () {
                $scope.$apply(function () {
                    var user = undefined;
                    isLoggedIn(undefined, true);
                });
            }, function (error) {
            });
        };

        $scope.decideAction = function () {
            $rootScope.user.loggedIn ? signout() : login();
        };

        $scope.search = function() {
            return ffRecipeService.getRecipes();
        };

        $scope.select = function(item) {
            $location.path('recipe/' + item.id);
        };
    }]);
}(window.angular));
