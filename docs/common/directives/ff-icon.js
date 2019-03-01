(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.ffIcon', [])
        .directive('ffIcon', function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    icon: '=',
                    color: "=",
                    size: '@'
                },
                template: '<div class="displayInlineBlock icon icon-{{icon}} font-{{color}}"></div>',
                link: function (scope, element, attrs) {
                    $timeout(function() {
                        if(scope.size === 'large') {
                            element.addClass('info-icon');
                        } else if(scope.size === 'small') {
                            element.addClass('small-icon');
                        } else {
                            element.addClass('item-icon');
                        }
                    });
                }
            };
        });
}(angular));