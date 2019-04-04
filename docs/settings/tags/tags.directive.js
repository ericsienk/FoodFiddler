(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.tags', [])
        .directive('ffTags', [function() {
            return ({
                restrict: 'E',
                templateUrl: '/settings/tags/tags.html',
                controller: ['$scope', function ($scope) {


                }]
            });
        }]);
}(angular));