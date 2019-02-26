module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    open: true,
                    hostname: 'localhost',
                    port : 9080,
                    base : 'docs/',
                    livereload : true
                }
            }
        },
        watch: {
            options: {
                livereload: true,
                interval: 5007
            },
            files: ['docs/**/*']
        },
        webfont: {
            icons: {
                src: 'icons/*.svg',
                dest: 'docs/common/data/fonts',
                options: {
                    fontFilename:'ff-icons',
                    templateOptions: {
                        baseClass: 'ff-icon',
                        classPrefix: 'icon-'
                    }
                }
            }
        }
    });
    grunt.registerTask('develop', ['connect:server', 'watch']);
};