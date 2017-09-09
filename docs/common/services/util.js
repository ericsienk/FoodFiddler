(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.util', [])
        .factory('util', [ function() {
            return {
                objectToArray : function(obj, keyName, indexerObj) {
                    var tmpArray = [], i = 0;
                    if(!indexerObj) { indexerObj = {}; }
                    angular.forEach(obj, function(value, key) {
                        var tmp = (typeof obj[key] == 'object') ? obj[key] :  {};
                        tmp[keyName] = key;
                        tmpArray.push(tmp);
                        indexerObj[key] = i;
                        i++;
                    });
                    return tmpArray;
                },
                decodeNewLines : function(s) {
                    return (s ? s.replace(/(\r\n|\n|\r)/gm, "<br />") : s);
                },
                encodeLineBreaks : function(s) {
                    return (s ? s.replace("<br />", "\r") : s);
                },
                validateForm : function(form) {
                    if (form.$invalid) {
                        angular.forEach(form.$error, function (field) {
                            angular.forEach(field, function(errorField){
                                if(errorField.$setTouched instanceof Function) {
                                    errorField.$setTouched();
                                }
                            })
                        });
                    }
                },
                hasErrorClass : function(name, form, optionalClass) {
                    if(form && form[name]) {
                        optionalClass = optionalClass ? optionalClass : 'has-error';
                        var css = {};
                        css[optionalClass] = (form[name].$touched && form[name].$invalid);
                        return css;
                    }
                }
            };
        }]);
} (angular));