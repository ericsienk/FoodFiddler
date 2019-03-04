(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.lazyLoaderService', [])
        .factory('lazyLoaderService', [function () {

            var observerMap = {};

            function getObserverInfo(element, onVisible) {
                return {
                    element: element,
                    observer: new IntersectionObserver(function (entries) {
                        if(entries[0].isIntersecting) {
                            onVisible(entries[0]);
                        }
                    })
                };
            }

            return {
                subscribe: function (element, groupName, onVisible) {
                    var observers = observerMap[groupName];
                    if (observers) {
                        observers.push(getObserverInfo(element, onVisible));
                    } else {
                        observers = [getObserverInfo(element, onVisible)];
                        observerMap[groupName] = observers;
                    }

                    observers[observers.length - 1].observer.observe(element);
                },
                unsubscribe: function (element, groupName) {
                    var observers = observerMap[groupName];
                    if (observers) {
                        observerMap[groupName] = observers.filter(function (observerInfo) {
                            observerInfo.observer.unobserve(element);
                            return observerInfo.element !== element;
                        });
                    }
                }
            };
        }]);
}(angular));