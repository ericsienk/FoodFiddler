(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.imgurLoader', [])
        .directive('imgurLoader', function($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    if(attrs.imgurLoader.indexOf("i.imgur.com") > -1) {
                        var url = attrs.imgurLoader;
                        var smallUrl = url.replace(/(.+)(\.\w{3}$)/, "$1s$2");
                        var largeUrl = attrs.max ? url : url.replace(/(.+)(\.\w{3}$)/, "$1l$2");

                        var tmpImg = angular.element(new Image());
                        tmpImg.attr('src', url);
                        tmpImg.on('load', function () {
                            element[0].style.transition = '.5s filter';
                            element[0].style.background = 'url("' + largeUrl + '") ' + (attrs.options ? attrs.options : 'no-repeat center top');
                            element[0].style.backgroundSize = 'cover';
                            element[0].style.filter = '';
                            element.removeAttr("imgur-loader");
                        }).on('error', function () {
                            element[0].style.filter = '';
                            element.removeAttr("imgur-loader");
                        });

                        if(!tmpImg[0].complete) {
                            element[0].style.filter = 'blur(22px)';
                            element[0].style.background = 'url("' + smallUrl + '") ' + (attrs.options ? attrs.options : 'no-repeat center top');
                            element[0].style.backgroundSize = 'cover';
                        }
                    }
                }
            };
        });
}(angular));