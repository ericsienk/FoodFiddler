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
             * firebaseDelete
             * deletes an item from a location and removes it from cache inside hashIndexer
             * @param {*} location 
             * @param {*} hashIndexer 
             * @param {*} item 
             */
            function firebaseDelete(location, hashIndexer, item) {
                return firebaseCall(firebase.database().ref(location + item.id).remove()).then(function () {
                    hashIndexer.remove(item);
                    return { data: true };
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
                    hashIndexer.merge(item);
                    return { data: item };
                });
            }

            /**
             * firebaseUpdate
             * updates an item in a location and updates the cache inside hashIndexer
             * @param {*} location 
             * @param {*} hashIndexer 
             * @param {*} item 
             */
            function firebaseUpdate(location, hashIndexer, item) {
                var preparedItem = angular.copy(item);
                delete preparedItem['id'];
                return firebaseCall(firebase.database().ref(location + item.id).set(preparedItem)).then(function () {
                    hashIndexer.merge(item);
                    return { data: item };
                })
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
                    return firebaseCall(firebase.database().ref(location).once('value')).then(function(response) {
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
                        var response = { data: {} };
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
                deferred.resolve({ data: angular.copy(obj) });
                return deferred.promise;
            }

            return {
                mockPromise: mockPromise,
                firebaseGet: firebaseGet,
                firebaseGetById: firebaseGetById,
                firebaseCreate: firebaseCreate,
                firebaseUpdate: firebaseUpdate,
                firebaseDelete: firebaseDelete
            }
        }]);
}(angular));