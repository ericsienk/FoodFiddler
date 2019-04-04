(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.settings', [])
        .directive('ffSettings', [function() {
            return ({
                restrict: 'E',
                templateUrl: '/settings/settings.html',
                controller: ['$scope', 'auth', function ($scope, auth) {

                    var controls = {
                        selectedTab: 'tags'
                    };

                    $scope.select = function(tab) {
                        controls.selectedTab = tab;
                    };

                    $scope.isSelected = function(tab) {
                        return controls.selectedTab === tab;
                    };

                    (function initialize() {
                        auth.authorizePage();
                    })();
                }]
            });
        }]);
}(angular));