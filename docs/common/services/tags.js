(function (angular) {
    'use strict';

    angular.module('foodfiddler.service.tags', [])
        .factory('ffTagsService', ['httpUtil', 'util', function (httpUtil, util) {
            var tagIndexer = util.getHashIndexer(),
                BASE_TABLE = 'foodfiddler/tags/';

            return {
                normalizeTag: function (tag) {
                    var map = {};
                    tag.recipes = (tag.recipes || map);
                    if(tag.recipes instanceof Array) {
                        tag.recipes.forEach(function (r) {
                            if (r.id) {
                                map[r.id] = true;
                            }
                        });
                    }

                    tag.recipes = map;

                    return tag;
                },
                getTags: function () {
                    return httpUtil.firebaseGet(BASE_TABLE, tagIndexer);
                },
                getRecipeTag: function(id) {
                    return httpUtil.firebaseGetById(BASE_TABLE, tagIndexer, id).then(function(response) {
                        delete response.data['recipes'];
                        return response;
                    });
                },
                getTagRecipesBatch: function (recipeId, tagIndexDiff) {
                    var batch = httpUtil.firebaseBatch();
                    
                    tagIndexDiff.updates.forEach(function(diff) {
                        batch.update(BASE_TABLE + diff.key + '/recipes/' + recipeId)
                        batch.onExecute(function () { tagIndexer.stale(diff.key); });
                    });

                    tagIndexDiff.deletes.forEach(function(diff) {
                        batch.delete(BASE_TABLE + diff.key + '/recipes/' + recipeId);
                        batch.onExecute(function () { tagIndexer.stale(diff.key); });
                    });

                    return batch;
                },
                createTag: function (tag) {
                    this.normalizeTag(tag);
                    return httpUtil.firebaseCreate(BASE_TABLE, tagIndexer, tag);
                },
                updateTag: function (tag) {
                    return httpUtil.firebaseUpdate(BASE_TABLE, tagIndexer, tag);
                },
                deleteTag: function (tag) {
                    return httpUtil.firebaseDelete(BASE_TABLE, tagIndexer, tag).then(function(){
                        var batch = httpUtil.firebaseBatch();
                        angular.forEach(tag.recipes, function(value, key) {
                            batch.delete('foodfiddler/recipes/' + key + '/tags/', null, tag.id);
                        });
                        return batch.execute();
                    });
                }
            };
        }]);
}(angular));
