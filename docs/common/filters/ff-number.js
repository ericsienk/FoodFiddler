(function() {
    'use strict';
    angular.module('ff-number.filter', [])
        .filter('ffNumber', ['$filter', function($filter) {
            return function(num, calc) {
                if(num !== undefined && !isNaN(num)) {
                    return $filter('number')(num, 2);
                } else {
                    return calc === undefined || !calc ? '-' : '0.00';
                }
            }
        }]);
}());