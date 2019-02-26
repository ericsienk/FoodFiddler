(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.ffIcon', [])
        .directive('ffIcon', function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    icon: '=',
                    size: '@'
                },
                template: '<span class="ff-icon icon-{{icon}}"></span>',
                link: function (scope, element, attrs) {
                    $timeout(function() {
                        if(scope.size === 'large') {
                            element.addClass('info-icon');
                        } else {
                            element.addClass('item-icon');
                        }
                    });
                }
            };
        });
}(angular));