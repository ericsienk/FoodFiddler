(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.auth', [])
        .factory('auth', ['$rootScope', '$location', function ($rootScope, $location) {
            var self = {
                onReject: function() {
                    $location.path('/home');
                }
            };

            return {
                authorizePage: function(onReject, onAccept) {
                    if (!$rootScope.authorized()) {
                        if(onReject instanceof Function) {
                            onReject();
                        } else {
                            self.onReject();
                        }
                        return false;
                    } else {
                        if(onAccept instanceof Function) {
                            onAccept();
                        }
                        return true;
                    }
                }
            };
        }]);
}(angular));