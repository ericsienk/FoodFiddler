(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.tiler', [])
        .directive('tiler', function($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var minWidth = 275;

                    var containerWidth = 1100;


                }
            };
        });
}(angular));