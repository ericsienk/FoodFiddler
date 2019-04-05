(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.util', [])
        .factory('util', [function () {
            function accessProperty(obj, path) {
                return path.split('.').reduce(function(nestedObj, prop) {return nestedObj[prop]}, obj);
            }

            function formObject(arr, deepCopy) {
                var tmp;
                if(arr instanceof Array) {
                    // create map version if array
                    tmp = {};
                    arr.forEach(function(item) { tmp[item] = item});
                } else {
                    tmp = deepCopy ? angular.copy(arr) : arr;
                }

                return tmp;
            }

            return {
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
                },
                arrayFromMap: function (map, keyToPropertyName) {
                    return Object.keys(map).map(function (key) {
                        var o = map[key];
                        if (typeof(o) === 'object') {
                            o[keyToPropertyName] = key;
                        } 
    
                        return o;
                    });
                },
                getHashIndexer: function () {
                    return {
                        list: [],
                        indexer: {},
                        initialized: false,
                        initialize: function (firebaseObjectList) {
                            var self = this,
                                i = 0;
                            
                            this.list = [];
                            this.indexer = {};
                            angular.forEach(firebaseObjectList, function (value, key) {
                                var tmp = firebaseObjectList[key];
                                tmp.id = key;
                                self.list.push(tmp);
                                self.indexer[key] = i;
                                i++;
                            });

                            this.initialized = true;
                        },
                        exists: function (id) {
                            return angular.isDefined(this.indexer[id]) && (this.list.length > this.indexer[id]);
                        },
                        get: function (id) {
                            if (this.exists) {
                                return this.list[this.indexer[id]];
                            }
                        },
                        remove: function (item) {
                            if (this.exists(item.id)) {
                                this.list.splice(this.indexer[item.id], 1);
                                var tmpIndexer = {};
                                                          
                                this.list.forEach(function (item, index) {
                                    tmpIndexer[item.id] = index;
                                });

                                this.indexer = tmpIndexer;
                            }
                        },
                        merge: function (item) {
                            if (!this.exists(item.id)) {
                                this.list.push(angular.copy(item));
                                this.indexer[item.id] = this.list.length - 1;
                            } else {
                                this.list[this.indexer[item.id]] = angular.copy(item);
                            }
                        },
                        /**
                         * diff
                         * looks up item in cache and drills into properties by propertyPath
                         * returns an object of merges: [], deletes: []
                         * these lists contain {key: value} (key and value will be same for unique array items)
                         * @param itemToCompare
                         * @param propertyPath
                         * @param onGetItem
                         * @returns {{deletes: Array, merges: Array}}
                         */
                        diff: function(itemToCompare, propertyPath, onGetItem) {
                            var compare = accessProperty(itemToCompare, propertyPath),
                                updates = {
                                    deletes: [],
                                    merges: []
                                };

                            var tmpCompare = formObject(compare, true);

                            var item = this.get(itemToCompare.id);
                            if(item) {
                                if(onGetItem instanceof Function) {
                                    item = onGetItem(angular.copy(item));
                                }

                                angular.forEach(formObject(accessProperty(item, propertyPath)), function(value, key) {
                                    if(!angular.isDefined(tmpCompare[key])) {
                                        // deleted
                                        updates.deletes.push({
                                            key: key,
                                            value: value
                                        });
                                    } else {
                                        if(value != tmpCompare[key]) {
                                            // updated
                                            updates.merges.push({
                                                key: key,
                                                value: value
                                            });
                                        }
                                        delete tmpCompare[key]; //remove for later
                                    }
                                });
                            }

                            // all properties left are added differences
                            angular.forEach(tmpCompare, function(value, key) {
                                updates.merges.push({
                                    key: key,
                                    value: value
                                });
                            });

                            return updates;
                        }
                    }
                }
            };
        }]);
}(angular));