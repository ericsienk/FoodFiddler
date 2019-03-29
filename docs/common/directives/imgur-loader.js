(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.imgurLoader', [])
        .directive('imgurLoader', ['$timeout', 'lazyLoaderService', function($timeout, lazyLoaderService) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var WATCH_URL = false,
                        LOADING_IMG = false;

                    function configureImgUrl(url) {
                        if(attrs.imgurLoader.indexOf("i.imgur.com") > -1) {
                            return attrs.max ? url : url.replace(/(.+)(\.\w{3}$)/, "$1l$2");
                        } else {
                            return url;
                        }
                    }

                    var tmpImg;
                    function loadImg(url) {
                        url = configureImgUrl(url);
                        tmpImg = angular.element(new Image());
                        tmpImg.attr('src', url);

                        tmpImg.on('load', function () {
                            if(!WATCH_URL) {
                                element[0].style.transition = '.5s filter';
                            }

                            element[0].style.background = 'url("' + url + '") ' + (attrs.options ? attrs.options : 'no-repeat center');
                            element[0].style.backgroundSize = 'cover';
                            element[0].style.filter = '';
                            if(!WATCH_URL) {
                                element.removeAttr("imgur-loader");
                            }
                        }).on('error', function () {
                            element[0].style.filter = '';
                            if(!WATCH_URL) {
                                element.removeAttr("imgur-loader");
                            } else {
                                element[0].style.background = '';
                            }
                        });

                        if (!tmpImg[0].complete) {
                            element[0].style.filter = 'blur(22px)';
                        }
                    }

                    function lazyLoadImg() {
                        if(LOADING_IMG) {
                            lazyLoaderService.unsubscribe(element[0], 'imgurLoader');
                        } else {
                            LOADING_IMG = true;
                        }

                        lazyLoaderService.subscribe(element[0], 'imgurLoader', function(data) {
                            lazyLoaderService.unsubscribe(element[0], 'imgurLoader');
                            loadImg(attrs.imgurLoader);
                        });
                    }

                    scope.$on('$destroy', function() {
                        lazyLoaderService.unsubscribe(element[0], 'imgurLoader');
                    });

                    if(attrs.autoWatch === 'true') {
                        WATCH_URL = true;
                        scope.$watch(function() { return attrs.imgurLoader }, lazyLoadImg);
                    } else {
                        lazyLoadImg();
                    }
                }
            };
        }]);
}(angular));