/**
 * Using grunt in command line
 * 
 * check if you have grunt cli installed
 * grunt --version
 * 
 * if grunt-cli is not installed, install globally
 * npm install -g grunt-cli
 * 
 * run desired task (see registered tasks at bottom of this file)
 * grunt develop
 */
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
        run: {
            server: {
                args: ['./svg2font.js']
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        },
        html2js: {
            dist: {
                src: [ 'docs/**/*.html' ],
                dest: 'tmp/templates.js',
                options: {
                    rename: function(moduleName) {
                        return moduleName.replace('../docs/', '');
                    }
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                process: function(src, filepath) {
                    if(filepath === 'docs/foodfiddler.js') {
                        return src.replace(
                            "//DO NOT ALTER appDependencies.push('templates-dist');",
                            "appDependencies.push('templates-dist');"
                        );
                    } else {
                        return src;
                    }
                }
            },
            dist: {
                src: [ 'docs/**/*.js', 'tmp/*.js'],
                dest: 'dist/app.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/app.js': [ 'dist/app.js' ]
                },
                options: {
                    mangle: true
                }
            }
        },
        clean: {
            temp: {src: [ 'tmp' ]},
            dist: { src: ['dist']},
            ghp: {src: ['.grunt']}
        },
        copy: {
            index: {
                src: 'docs/index.html',
                dest: 'dist/index.html',
                options: {
                    process: function (content, srcpath) {
                        return content.replace(
                            /(<!-- replace with app\.js start -->)(\r\n|\r|\n|.)*(<!-- replace with app\.js end -->)/g,
                            '<script src="app.js"></script>'
                        );
                    }
                }
            },
            assests: {
                files: [{expand: true, cwd: 'docs/', src: ['common/data/**', 'foodfiddler.css'], dest: 'dist/'}]
            }
        },
        cachebreaker: {
            prod: {
                options: {
                    match: [
                        {'app.js': 'dist/app.js'},
                        {'common/data/ingredients.json': 'dist/common/data/ingredients.json'},
                        {'foodfiddler.css': 'dist/foodfiddler.css'},
                        {'common/data/fonts/generated/iconfont.css': 'dist/common/data/fonts/generated/iconfont.css'}
                    ],
                    replacement: 'md5',
                    position: 'append',
                    src: {
                        path: 'dist/app.js'
                    }
                },
                files: {
                    src: ['dist/index.html', 'dist/app.js']
                }
            }
        }
    });

    // runs web server and reloads browser as you code
    grunt.registerTask('develop', ['connect:server', 'watch']);
    // creates a css and font file based of svg in icons folder
    grunt.registerTask('create icons', ['run']);
    // compresses project files into dist (production distribution) folder
    grunt.registerTask('package', [
        'clean:dist',
        'html2js:dist',
        'concat:dist',
        'uglify:dist',
        'clean:temp',
        'copy:index',
        'copy:assests',
        'cachebreaker:prod'
    ]);
    // calls package task and then pushes the dist files to github pages
    grunt.registerTask('go live!', ['package', 'gh-pages', 'clean:ghp'])
};