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
                    port : 8080,
                    base : 'docs/'
                }
            }
        },
        watch: {
            options: {
                livereload: true,
                interval: 5007
            },
            everything: {
                files: ['docs/**/*']
            }
        }
    });
    grunt.registerTask('develop', ['connect:server', 'watch']);
};