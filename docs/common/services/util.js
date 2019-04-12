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
                        var o;
                        if (keyToPropertyName) {
                            o = {};
                            o[keyToPropertyName] = key;
                        } else {
                            o = map[key];
                        }
    
                        return o;
                    });
                },
                getHashIndexer: function () {
                    return {
                        indexer: {},
                        staleIndexer: {},
                        initialized: false,
                        /**
                         * initialize
                         * caches firebase list and sets each object key to id property
                         * {123: {...}} => [{id:123}, ...]
                         * @param {*} firebaseObjectList 
                         */                        
                        initialize: function (firebaseObjectList) {
                            var self = this;

                            this.indexer = {};
                            this.staleIndexer = {};
                            angular.forEach(firebaseObjectList, function (value, key) {
                                var tmp = angular.copy(value);
                                tmp.id = key;
                                self.indexer[key] = tmp;
                            });

                            this.initialized = true;
                        },
                        // checks if id is cached and not stale
                        exists: function (id) {
                            return angular.isDefined(this.indexer[id]);
                        },
                        // removes object from cache and sets as stale if exists
                        stale: function (id) {
                            if (this.exists(id)) {
                                // save deep copy
                                this.staleIndexer[id] = angular.copy(this.indexer[id]);
                                // delete from main indexer
                                delete this.indexer[id];
                            }
                        },
                        // returns object from cache if exists
                        get: function (id) {
                            if (this.exists(id)) {
                                return angular.copy(this.indexer[id]);
                            }
                        },
                        /**
                         * getList
                         * returns a list of items from cache
                         * @param {*} onStaleItem function (
                         *      staleItem: object {id},
                         *      list: reference to list that was returned,
                         *      index: index where stale item exits at the time of execution
                         * )
                         * @returns [{*}] list of cached items
                         */
                        getList: function (onStaleItem) {
                            var list = angular.copy(Object.values(this.indexer));

                            if (onStaleItem instanceof Function) {
                                Object.keys(this.staleIndexer).forEach(function (item) {
                                    var staleItem = { id: item.id };
                                    list.push({ id: item.id });
                                    // provide callback to dynamically set reference
                                    onStaleItem(staleItem, list, list.length - 1);
                                });
                            }

                            return list;
                        },
                        // removes item from cache if exists
                        remove: function (item) {
                            if (this.exists(item.id)) {
                                delete this.indexer[item.id];
                            } else if (angular.isDefined(this.staleIndexer[item.id])) {
                                delete this.indexer[item.id];
                            }
                        },
                        // adds or updates cache based on item.id is defined
                        merge: function (item) {
                            if (this.staleIndexer[item.id]) {
                                delete this.staleIndexer[item.id];
                            }

                            this.indexer[item.id] = angular.copy(item);
                        },
                        /**
                         * diff
                         * looks up item in cache and drills into properties by propertyPath
                         * returns an object of merges: [], deletes: []
                         * these lists contain {key: value} (key and value will be same for unique array items)
                         * @param itemToCompare
                         * @param id
                         * @param propertyPath
                         * @returns {{deletes: Array, upates: Array, creates: Array}}
                         */
                        diff: function(itemToCompare, id, propertyPath) {
                            var compare = accessProperty(itemToCompare, propertyPath),
                                changes = {
                                    deletes: [],
                                    updates: []
                                },
                                tmpCompare = formObject(compare, true),
                                item = this.get(id);
                            
                            if(item) {
                                angular.forEach(formObject(accessProperty(item, propertyPath)), function(value, key) {
                                    if(!angular.isDefined(tmpCompare[key])) {
                                        // deleted
                                        changes.deletes.push({
                                            key: key,
                                            value: value
                                        });
                                    } else {
                                        if(value != tmpCompare[key]) {
                                            // updated
                                            changes.updates.push({
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
                                changes.updates.push({
                                    key: key,
                                    value: value
                                });
                            });

                            return changes;
                        }
                    }
                }
            };
        }]);
}(angular));