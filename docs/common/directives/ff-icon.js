(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.ffIcon', [])
        .directive('ffIcon', function() {
            return {
                restrict: 'E',
                replace: false,
                scope: {
                    icon: '=',
                    color: "="
                },
                template: '<div class="displayInlineBlock icon icon-{{icon}} font-{{color}}"></div>',
            };
        });
}(angular));