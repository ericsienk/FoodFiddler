(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.imgurLoader', [])
        .directive('imgurLoader', function($timeout, lazyLoaderService) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    scope.$on('$destroy', function() {
                        lazyLoaderService.unsubscribe(element[0], 'imgurLoader');
                    });

                    lazyLoaderService.subscribe(element[0], 'imgurLoader', function(data) {
                        lazyLoaderService.unsubscribe(element[0], 'imgurLoader');

                        var url = attrs.imgurLoader;

                        function loadImg(url) {
                            var tmpImg = angular.element(new Image());
                            tmpImg.attr('src', url);

                            tmpImg.on('load', function () {
                                element[0].style.transition = '.5s filter';
                                element[0].style.background = 'url("' + url + '") ' + (attrs.options ? attrs.options : 'no-repeat center top');
                                element[0].style.backgroundSize = 'cover';
                                element[0].style.filter = '';
                                element.removeAttr("imgur-loader");
                                scope.$destroy();
                            }).on('error', function () {
                                element[0].style.filter = '';
                                element.removeAttr("imgur-loader");
                                scope.$destroy();
                            });

                            if(!tmpImg[0].complete) {
                                element[0].style.filter = 'blur(22px)';
                            }
                        }

                        if(attrs.imgurLoader.indexOf("i.imgur.com") > -1) {
                            loadImg(attrs.max ? url : url.replace(/(.+)(\.\w{3}$)/, "$1l$2"));
                        } else {
                            loadImg(url);
                        }
                    });
                }
            };
        });
}(angular));