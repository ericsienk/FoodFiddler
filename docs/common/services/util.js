(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.util', [])
        .factory('util', [function () {
            return {
                objectToArray: function (obj, keyName, indexerObj) {
                    var tmpArray = [], i = 0;
                    if (!indexerObj) {
                        indexerObj = {};
                    }
                    angular.forEach(obj, function (value, key) {
                        var tmp = (typeof obj[key] == 'object') ? obj[key] : {};
                        tmp[keyName] = key;
                        tmpArray.push(tmp);
                        indexerObj[key] = i;
                        i++;
                    });
                    return tmpArray;
                },
                decodeNewLines: function (s) {
                    return (s ? s.replace(/(\r\n|\n|\r)/gm, "<br />") : s);
                },
                encodeLineBreaks: function (s) {
                    return (s ? s.replace("<br />", "\r") : s);
                },
                validateForm: function (form) {
                    if (form.$invalid) {
                        angular.forEach(form.$error, function (field) {
                            angular.forEach(field, function (errorField) {
                                if (errorField.$setTouched instanceof Function) {
                                    errorField.$setTouched();
                                }
                            })
                        });
                    }
                },
                hasErrorClass: function (name, form, optionalClass) {
                    if (form && form[name]) {
                        optionalClass = optionalClass ? optionalClass : 'has-error';
                        var css = {};
                        css[optionalClass] = (form[name].$touched && form[name].$invalid);
                        return css;
                    }
                },
                howFuzzyWasHe: function (a, b) {
                    if (a.length == 0) return b.length;
                    if (b.length == 0) return a.length;

                    var matrix = [];

                    // increment along the first column of each row
                    var i;
                    for (i = 0; i <= b.length; i++) {
                        matrix[i] = [i];
                    }

                    // increment each column in the first row
                    var j;
                    for (j = 0; j <= a.length; j++) {
                        matrix[0][j] = j;
                    }

                    // Fill in the rest of the matrix
                    for (i = 1; i <= b.length; i++) {
                        for (j = 1; j <= a.length; j++) {
                            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                                matrix[i][j] = matrix[i - 1][j - 1];
                            } else {
                                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                    Math.min(matrix[i][j - 1] + 1, // insertion
                                        matrix[i - 1][j] + 1)); // deletion
                            }
                        }
                    }

                    return matrix[b.length][a.length];
                },
                areYouInMyString: function (you, there) {
                    var chunks = you.toLowerCase().split(' '),
                        lowerThere = there.toLowerCase(),
                        confidence = 0;
                    for (var i = 0; i < chunks.length; i++) {
                        if (lowerThere.indexOf(chunks[i]) > -1) {
                            confidence += (100 / chunks.length);
                        }
                    }

                    return confidence;
                }
            };
        }]);
}(angular));