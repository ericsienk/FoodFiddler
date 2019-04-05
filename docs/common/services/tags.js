(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.recipes', [])
        .factory('ffTagsService', ['httpUtil', 'util', function (httpUtil, util) {
            var tagIndexer = util.getHashIndexer(),
                BASE_TABLE = 'foodfiddler/tags';

            function delegateRecipeRel(tag, onSetRecipeRel) {
                return onSetRecipeRel(tag).then(function () {
                    return tag;
                });
            }

            return {
                formTag: function (name, recipes) {
                    return {
                        name: name,
                        recipes: recipes.map(function (r) {
                            var o = {};
                            if (r.id) {
                                o[r.id] = true;
                            }
                            return o;
                        })
                    }
                },
                getTags: function () {
                    return httpUtil.firebaseGet(BASE_TABLE, tagIndexer);
                },
                createTag: function (name, recipes, onSetRecipeRel) {
                    var tag = this.formTag(name, recipes);

                    return httpUtil.firebaseCreate(BASE_TABLE, tagIndexer, tag).then(function () {
                        return delegateRecipeRel(tag, onSetRecipeRel);
                    });
                },
                updateTag: function (tag, onSetRecipeRel) {
                    return httpUtil.firebaseUpdate(BASE_TABLE, tagIndexer, tag).then(function () {
                        return delegateRecipeRel(tag, onSetRecipeRel);
                    });
                },
                deleteTag: function (tag, onSetRecipeRel) {
                    return httpUtil.firebaseDelete(BASE_TABLE, tagIndexer, tag).then(function () {
                        return delegateRecipeRel(tag, onSetRecipeRel);
                    });
                }
            };
        }]);
}(angular));