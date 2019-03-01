(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.ffIcon', [])
        .directive('ffIcon', function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    icon: '=',
                    color: "="
                },
                template: '<div class="displayInlineBlock icon icon-{{icon}} font-{{color}}"></div>',
            };
        });
}(angular));