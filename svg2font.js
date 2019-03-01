const glob = require("glob");
const webfontsGenerator = require('webfonts-generator');
const fs = require('fs');

function filterSvgFiles(files) {
    var filteredFiles = [];

    files.forEach(function(file) {
        var contents = fs.readFileSync(file, 'utf8');
        if(contents.match(/width=".*" height=".*"/g)) {
            filteredFiles.push(file);
        } else {
            console.warn('Unsupported svg file ' + file);
        }
    });

    return filteredFiles;
}

glob("./icons/*.svg", function (er, files) {
    webfontsGenerator({
        files: filterSvgFiles(files),
        dest: 'docs/common/data/fonts/generated/'
    }, function(error) {
        if (error) {
            console.log('Fail!', error);
        } else {
            console.log('Done!');
        }
    });
});



