(function (angular) {
    'use strict';
    angular.module('foodfiddler.directive.tags', [])
        .directive('ffTags', [function() {
            return ({
                restrict: 'E',
                templateUrl: 'settings/tags/tags.html',
                controller: ['$scope', 'ffTagsService', '$timeout', function ($scope, ffTagsService,$timeout) {
                    $scope.controls = {};
                    $scope.createTag = function(tag) {
                        ffTagsService.createTag(tag).then(initialize);
                    };

                    $scope.deleteTag = function(tag){
                        if (confirm('Delete tag: '+ tag.name + '?')) {
                            ffTagsService.deleteTag(tag).then(initialize);
                        }
                    };

                    $scope.updateTag = function(tag) {
                        ffTagsService.updateTag(tag).then(initialize);
                    };

                    function yay() {
                        $scope.controls.alertType = 'success';
                        $scope.controls.alertText = 'Success!';
                        $timeout(function() {
                            $scope.controls.alertType = 'light';
                            $scope.controls.alertText = ' ';
                        }, 1000);
                    }

                    function initialize(response){
                        $scope.controls.newTag = {};
                        if(response && response.data) {
                            yay();
                        }

                        ffTagsService.getTags().then(function(response) {
                            $scope.tags = response.data;
                        });
                    }

                    initialize();
                }]
            });
        }]);
}(angular));