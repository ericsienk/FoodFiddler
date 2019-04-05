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
                updateTagRecipes: function(recipe, tagIndexDiff) {
                    var batch = httpUtil.firebaseBatchMerge(),
                        affectedTags = [];
                    tagIndexDiff.merges.forEach(function(diff) {
                        affectedTags.push(diff.value);
                        batch.merge(BASE_TABLE + diff.value + '/recipes/', null, recipe.id);
                    });

                    tagIndexDiff.deletes.forEach(function(diff) {
                        affectedTags.push(diff.value);
                        batch.delete(BASE_TABLE + diff.value + '/recipes/', null, recipe.id);
                    });

                    return batch.execute().then(function(response) {
                        affectedTags.forEach(function(tag) {
                            tagIndexer.remove({id: tag});
                        });

                        return response;
                    });
                },
                createTag: function (tag, onSetRecipeRel) {
                    this.normalizeTag(tag);
                    return httpUtil.firebaseCreate(BASE_TABLE, tagIndexer, tag);
                },
                updateTag: function (tag) {
                    return httpUtil.firebaseUpdate(BASE_TABLE, tagIndexer, tag);
                },
                deleteTag: function (tag) {
                    return httpUtil.firebaseDelete(BASE_TABLE, tagIndexer, tag);
                }
            };
        }]);
}(angular));

/**


 GIVEN

 tags

 123: { recipes: { xxx: true, zzz: true } }
 456: { recipes: {xxx: true, yyyy: true } }
 789: { recipes: {}}

 recipes

 xxx: {name:banana, tags: {123: true, 456: true}
 tag: {name: dessert, id:123}


 WHEN

 update recipe and remove tag & add tag
  xxx: {name:orange, tags: [123, 789]


THEN

update recipe
    update reference to tags
update tag

 */