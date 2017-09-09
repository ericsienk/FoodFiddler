(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.httpUtil', [])
        .factory('httpUtil', ['$timeout', '$q', function ($timeout, $q) {
            var packData = function (obj) {
                    return {data: angular.copy(obj)}
                },
                firebaseTo$qResolve = function (firebasePromise, onResponse) {
                    firebasePromise.then(function (snapshot) {
                        $timeout(function () {
                            var response = { data : {}};
                            if(snapshot && (snapshot.val instanceof Function)) {
                                response.data = snapshot.val();
                            }
                            onResponse(response);
                        });
                    });
                },
                firebaseTo$qPromise = function (firebasePromise) {
                    var deferred = $q.defer();
                    this.firebaseTo$qResolve(firebasePromise, deferred.resolve);
                    return deferred.promise;
                },
                mockPromise = function (obj) {
                    var deferred = $q.defer();
                    deferred.resolve({data: obj});
                    return deferred.promise;
                };
            return {
                packData : packData,
                firebaseTo$qResolve : firebaseTo$qResolve,
                firebaseTo$qPromise : firebaseTo$qPromise,
                mockPromise : mockPromise
            }
        }]);
}(angular));