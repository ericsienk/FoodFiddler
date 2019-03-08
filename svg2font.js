const glob = require("glob");
const webfontsGenerator = require('webfonts-generator');
const fs = require('fs');
const INGREDIENT_JSON_PATH = "./docs/common/data/ingredients.json";
const ICON_BLACKLIST = {
    "CLOCK": true,
    "MIT": true,
    "SERVE": true,
    "UTIL": true
};

function filterSvgFiles(files) {
    var filteredFiles = [],
        tagMap = createTagMap(),
        mergedIngredients = [];

    files.forEach(function (file) {
        var contents = fs.readFileSync(file, 'utf8');
        if (contents.match(/width=".*" height=".*"/g)) {
            filteredFiles.push(file);
            var mergedIngredient = mergeIconFileNameToIngredientMap(file, tagMap);
            if(mergedIngredient) {
                mergedIngredients.push(mergedIngredient);
            }
        } else {
            console.warn('Unsupported svg file ' + file);
        }
    });

    removeUnusedIngredients(mergedIngredients, tagMap, true);
    saveTagMapToIngedientList(tagMap);

    return filteredFiles;
}

function removeUnusedIngredients(mergedIngredients, tagMap, onlyRemoveBlanks) {
    var usedTagsMap = {},
        tags = Object.keys(tagMap);

    mergedIngredients.forEach(function(ingredient) {
        usedTagsMap[ingredient.tag] = true;
    });

    tags.forEach(function(tag) {
        if(!usedTagsMap[tag]) {
            if(!onlyRemoveBlanks || (onlyRemoveBlanks && !tagMap[tag].name)) {
                console.log('Removing unused ingredient: ' + JSON.stringify(tagMap[tag]));
                delete tagMap[tag];
            }
        }
    });
}

function createTagMap() {
    var map = {};
    JSON.parse(fs.readFileSync(INGREDIENT_JSON_PATH)).forEach(function (ingredient) {
        if(!map[ingredient.tag]) {
            map[ingredient.tag] = ingredient;
        } else {
            console.warn('Duplicate ingredient tag ' + ingredient.tag);
        }
    });
    return map;
}

function saveTagMapToIngedientList(tagMap) {
    var ingredients = [],
        tags = Object.keys(tagMap);

    tags.forEach(function(tag) {
        ingredients.push(tagMap[tag]);
    });

    fs.writeFileSync(INGREDIENT_JSON_PATH, JSON.stringify(ingredients), 'utf8');
}

function mergeIconFileNameToIngredientMap(filePath, tagMap) {
    var tag = filePath.match(/(\w+)\.svg/)[1];
    if(!tagMap[tag] && !ICON_BLACKLIST[tag]) {
        tagMap[tag] = {name:"", tag: tag};
        console.log("Merged " + tag + " to ingredients.json");
        return tagMap[tag];
    }
    return null;
}

glob("./icons/*.svg", function (er, files) {
    webfontsGenerator({
        files: filterSvgFiles(files),
        dest: 'docs/common/data/fonts/generated/'
    }, function (error) {
        if (error) {
            console.log('Fail!', error);
        } else {
            console.log('Done!');
        }
    });
});



