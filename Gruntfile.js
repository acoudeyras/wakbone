'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.loadNpmTasks('grunt-docco2');

    function _toJs(fileName) {
        return fileName.replace(/\.coffee$/, '.js');
    }

    var _wakbrowserCoffeeSrc = 'app/wakbrowser/**/*.coffee';
    var _coffeeSrc = 'app/scripts/**/*.coffee';
    var _coffeeTest = 'test/spec/**/*.coffee';
    var _coffeeAll = [_coffeeSrc, _coffeeTest, _wakbrowserCoffeeSrc];
    var _jsSrc = _toJs(_coffeeSrc);
    var _jsTest = _toJs(_coffeeTest);
    var _jsAll = _coffeeAll.map(_toJs);
    var _jsPure = ['Gruntfile.js', 'test/test-main.js', 'karma-conf.js', 'karma-grunt.conf.js'];

    grunt.initConfig({
        // configurable paths
        yeoman: {
            app: 'app',
            dist: 'dist'
        },
        docco: {
            docs: {
                src: _coffeeSrc,
                options: {
                  output: 'docs/annotated-source'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma-grunt.conf.js',
                background: true,
                reporters: ['progress', 'osx'],
                singleRun: false
            },
            once: {
                configFile: 'karma-grunt.conf.js',
                reporters: ['progress', 'coverage', 'osx'],
                singleRun: true
            }
        },
        coffee: {
            compile: {
                files: grunt.file.expandMapping([_coffeeAll],'./', {
                    rename: function(destBase,destPath) {
                        return _toJs(destBase + destPath);
                    }
                })
            }
        },
        coffeelint: {
            app: _coffeeAll,
            options: {
                'no_trailing_whitespace': {
                    'level': 'error'
                },
                'max_line_length': {
                    'level': 'ignore'
                }
            }
        },
        watch: {
            
            //styles: {
            //    files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
            //    tasks: ['copy:styles', 'autoprefixer']
            //},
            //livereload: {
              //  options: {
             //       livereload: '<%= connect.options.livereload %>'
             //   },
             //   files: [
              //      '<%= yeoman.app %>/*.html',
             //       '.tmp/styles/{,*/}*.css',
             //       '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
             //       '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
             //   ]
           // },
    
            coffee: {
                files: _coffeeAll,
                tasks: ['coffee']
            },
            karma: {
                files: _jsAll,
                tasks: ['karma:unit:run']
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        './docs/**',
                        './coverage/**',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jsonlint: {
            all: {
                src: ['bower.json', 'package.json']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                _jsSrc,
                _jsTest
            ],
            purejs: _jsPure
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        requirejs: {
            wakbone: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: '<%= yeoman.app %>/scripts',
                    optimize: 'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    name: 'wakbone',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    paths: {
                        jquery: 'empty:',
                        underscore: 'empty:',
                        backbone: 'empty:',
                        'underscore.string': 'empty:',
                        moment: 'empty:'
                    },
                    mainConfigFile: '<%= yeoman.app %>/scripts/wakbone.js',
                    out: 'dist/wakbone.js'
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        uglify: {
            wakbone: {
              files: {
                '<%= yeoman.dist %>/wakbone.min.js': ['<%= yeoman.dist %>/wakbone.js']
              }
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        modernizr: {
            devFile: '<%= yeoman.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/bower_components/modernizr/modernizr.js',
            files: [
                '<%= yeoman.dist %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css',
                '!<%= yeoman.dist %>/scripts/vendor/*'
            ],
            uglify: false
        },
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr']
            },
            all: {
                rjsConfig: '<%= yeoman.app %>/scripts/main.js'
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma:once'
    ]);



    grunt.registerTask('build', [
        'coffeelint',
        'coffee',
        'jshint:purejs',
        'jsonlint',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'requirejs',
        'cssmin',
        'uglify:wakbone',
        'docco',
        //'modernizr',
        //'copy:dist',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'clean:dist',
        'test',
        'build'
    ]);
};
