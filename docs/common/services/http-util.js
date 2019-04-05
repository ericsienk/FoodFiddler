(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.httpUtil', [])
        .factory('httpUtil', ['$timeout', '$q', function ($timeout, $q) {

            /**
             * getNewFirebaseKey
             * generates a new unqiue item key from a given table location
             * @param {*} location
             */
            function getNewFirebaseKey(location) {
                return firebase.database().ref().child(location).push().key;
            }

            /**
             * firebaseBatchMerge
             * allows chaining multiple create or updates
             * @returns {{callStack: {}, itemStack: Array, merge: httpUtil.merge, execute: httpUtil.execute}}
             */
            function firebaseBatchMerge() {
                return {
                    callStack: {},
                    mergeStack: [],
                    deleteStack: [],
                    merge: function (location, hashIndexer, item) {
                        var preparedItem = true,
                            id;

                        if (typeof(item) !== 'string') {
                            if (!item.id) {
                                item.id = getNewFirebaseKey(location);
                            }

                            preparedItem = angular.copy(item);
                            id = item.id;
                            delete preparedItem['id'];
                        } else {
                            id = item;
                        }

                        this.callStack[location + id] = preparedItem;
                        this.mergeStack.push({indexer: hashIndexer, item: item});
                        return this;
                    },
                    delete: function (location, hashIndexer, item) {
                        var id = typeof(item) === 'string' ? item : item.id;
                        this.callStack[location + id] = null;
                        this.deleteStack.push({indexer: hashIndexer, item: item});
                        return this;
                    },
                    execute: function () {
                        var self = this;
                        return firebaseCall(firebase.database().ref().update(self.callStack)).then(function () {
                            var items = [];
                            self.mergeStack.forEach(function (i) {
                                if (i.indexer) {
                                    i.indexer.merge(i.item);
                                }
                                items.push(i.item);
                            });
                            return {data: items};
                        })

                    }
                }
            }

            /**
             * firebaseDelete
             * deletes an item from a location and removes it from cache inside hashIndexer
             * @param {*} location
             * @param {*} hashIndexer
             * @param {*} item
             */
            function firebaseDelete(location, hashIndexer, item) {
                return firebaseCall(firebase.database().ref(location + item.id).remove()).then(function () {
                    if (hashIndexer) {
                        hashIndexer.remove(item);
                    }
                    return {data: true};
                });
            }

            /**
             * firebaseCreate
             * creates an item in a location and adds it to cache inside hashIndexer
             * @param {*} location
             * @param {*} hashIndexer
             * @param {*} item
             */
            function firebaseCreate(location, hashIndexer, item) {
                var id = getNewFirebaseKey(location),
                    updates = {};

                updates[location + id] = item;
                item.id = id;

                return firebaseCall(firebase.database().ref().update(updates)).then(function () {
                    if (hashIndexer) {
                        hashIndexer.merge(item);
                    }
                    return {data: item};
                });
            }

            /**
             * firebaseUpdate
             * updates an item in a location and updates the cache inside hashIndexer
             * @param {*} location
             * @param {*} hashIndexer
             * @param {*} item
             * @param {*} batchUpdate
             */
            function firebaseUpdate(location, hashIndexer, item, batchUpdate) {
                var preparedItem = angular.copy(item);
                delete preparedItem['id'];
                var updates = {};
                updates[location + item.id] = preparedItem;
                if(batchUpdate) {
                    // merge any batch updates
                    angular.extend(updates, batchUpdate);
                }

                return firebaseCall(firebase.database().ref().update(updates)).then(function () {
                    if (hashIndexer) {
                        hashIndexer.merge(item);
                    }
                    return {data: item};
                })
            }

            /**
             * optimisticGet
             * transforms a get promise and sets response data into object
             * @param get
             * @param injectInto
             * @param withPropertyName
             */
            function optimisticGet(get, injectInto, withPropertyName) {
                get.then(function (response) {
                    injectInto[withPropertyName] = response.data;
                    return response;
                });
            }

            /**
             * firebaseGet
             * returns a requested list from location and sets or gets cache inside hashIndexer
             * @param {*} location
             * @param {*} hashIndexer
             */
            function firebaseGet(location, hashIndexer) {
                if (hashIndexer.initialized) {
                    return mockPromise(hashIndexer.list);
                } else {
                    return firebaseCall(firebase.database().ref(location).once('value')).then(function (response) {
                        hashIndexer.initialize(response.data);
                        return mockPromise(hashIndexer.list);
                    });
                }
            }

            /**
             * firebaseGetById
             * return a requested item by id from location and sets or gets cache inside hashIndexer
             * @param {*} location
             * @param {*} hashIndexer
             * @param {*} id
             */
            function firebaseGetById(location, hashIndexer, id) {
                var item = hashIndexer.get(id);

                if (angular.isDefined(item)) {
                    return mockPromise(item);
                } else {
                    return firebaseCall(firebase.database().ref(location + id).once('value')).then(function (response) {
                        response.data.id = id;
                        hashIndexer.merge(response.data);
                        return {data: response.data};
                    });
                }
            }

            function firebaseCall(firebasePromise) {
                var deferred = $q.defer();

                firebasePromise.then(function (snapshot) {
                    $timeout(function () {
                        var response = {data: {}};
                        if (snapshot && (snapshot.val instanceof Function)) {
                            response.data = snapshot.val();
                        }

                        deferred.resolve(response);
                    });
                });

                return deferred.promise;
            }

            function mockPromise(obj) {
                var deferred = $q.defer();
                deferred.resolve({data: angular.copy(obj)});
                return deferred.promise;
            }

            return {
                mockPromise: mockPromise,
                firebaseBatchMerge: firebaseBatchMerge,
                firebaseGet: firebaseGet,
                optimisticGet: optimisticGet,
                firebaseGetById: firebaseGetById,
                firebaseCreate: firebaseCreate,
                firebaseUpdate: firebaseUpdate,
                firebaseDelete: firebaseDelete
            }
        }]);
}(angular));