/**
 * # Grunt
 * A task manager for auto compiling and validating code
 *
 * ## Set up
 * Make sure the you have nodejs running on your machine (at time of writting v0.10.13)
 * Install Grunt with npm `npm install -g grunt-cli`
 * Install Grunt packages `npm install`
 *
 * ## Config
 * The configuration settings are found in `package.json`.
 *
 * ## Running
 * You can type `grunt <command>` to run any of rules in the `initConfig` function
 * e.g. `grunt compass` to compile the scss files to css
 *
 * You can also run a sub-task by adding `:<subtask>`
 * e.g. `grunt uglify:header` to compile to javaScript header file
 *
 * ## Helper Commands
 * There are a number of helper command at the end of the file
 * - default (`grunt`) will watch the folder and compile when files are saved
 * - compile (`grunt compile`) will manually compile all css and javaScript
 * - docs ('grunt docs`) will create the javaScript documentation
 */

/*globals module*/

module.exports = function (grunt) {
	'use strict';
    
    /**
     * Sets up the commands to run later
     */
    grunt.initConfig({
        /**
         * Loading in the package file to read source and destination directories
         */
        pkg: grunt.file.readJSON('package.json'),
        /*
         * Css
         */
        cssmin: {
            css: {
                options: {
                    banner: '/* all.min.css <%= grunt.template.today("dd-mm-yyyy") %> */'
                },
                files: {
                    '<%= pkg.dest.css %>/all.min.css': ['<%= pkg.src.css %>/**/*.css']
                }
            }
        },
        /*
         * Scss
         */
        compass: {
            scss: {
                options: {
                    sassDir: '<%= pkg.src.css %>',
                    cssDir: '<%= pkg.dest.css %>',
                    environment: 'production',
                    fontsDir: '<%= pkg.src.fonts %>'
                }
            }
        },
        /*
         * Html
         */
        htmlmin: {
            html: {
                options: {
                    //removeComments: true,
                    //collapseWhitespace: true
                },
                files: {
                    '<%= pkg.dest.html %>/index.html': '<%= pkg.src.html %>/index.html'
                    //'<%= pkg.dest.html %>': ['<%= pkg.src.html %>/**/*.html']
                }
            }
        },
        /**
         * Images
         */
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.src.img %>',
                        src: ['**/*.png'],
                        dest: '<%= pkg.dest.img %>',
                        ext: '.png'
                    }
                ]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.src.img %>',
                        src: ['**/*.jpg'],
                        dest: '<%= pkg.dest.img %>',
                        ext: '.jpg'
                    }
                ]
            }
        },
        /**
         * JavaScript
         */
        uglify: {
            options: {
                banner: '/* all.min.js <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap: '<%= pkg.dest.js %>/all.min.js.map',
                sourceMappingURL: 'all.min.js.map',
                sourceMapRoot: '../../',
                mangle: false
                /*mangle: {
                    except: ['jQuery']
                }*/
            },
            js: {
                src: [
                    '<%= pkg.src.js %>/**/*.js'
                ],
                dest: '<%= pkg.dest.js %>/all.min.js'
            }
        },
        /**
         * Documentation
         */
        jsduck: {
            options: {
                "title": "Documentation"
            },
            main: {
                src: [
                    '<%= pkg.src.js %>',
                    '<%= pkg.src.css %>'
                ],
                dest: '<%= pkg.dest.docs %>'
            }
        },
        /**
         * Looks for validation errors within the javaScript
         */
        jshint: {
            options: {
                strict: true,
                white: true
            },
            all: [
                '<%= pkg.src.js %>/**/*.js'
            ]
        },
        /**
         * Copies files
         */
        concat: {
            jQuery: {
                src: '<%= pkg.src.js %>/jquery.1.9.1.min.js',
                dest: '<%= pkg.dest.js %>/jquery.1.9.1.min.js'
            }
        },
        /**
         * Listens for changes to the scss and javaScript files
         */
        watch: {
            css: {
                files: ['<%= pkg.src.css %>/**/*.css'],
                tasks: ['cssmin']
            },
            scss: {
                files: ['<%= pkg.src.css %>/**/*.scss'],
                tasks: ['compass']
            },
            html: {
                files: ['<%= pkg.src.html %>/**/*.html'],
                tasks: ['htmlmin']
            },
            img: {
                files: ['<%= pkg.src.js %>/**/*.*'],
                tasks: ['imagemin']
            },
            js: {
                files: ['<%= pkg.src.js %>/**/*.js'],
                tasks: ['uglify']
            }
        },
        dalek: {
            options: {
                // invoke phantomjs, chrome & chrome canary
                // 'phantomjs', 'chrome', 'chrome:canary', 'firefox', 'ios', 'IE'
                browser: ['phantomjs', 'chrome', 'chrome:canary', 'firefox'],
                // generate an html & an jUnit report
                reporter: ['html', 'junit']
            },
            dist: {
                src: ['test/test.js']
            }
        }
    });
    
    /**
     * Load in the modules that run the tasks
     */
    grunt.loadNpmTasks('grunt-contrib-cssmin');     // css minify
    grunt.loadNpmTasks('grunt-contrib-compass');	// compiles scss files to css
    grunt.loadNpmTasks('grunt-contrib-htmlmin');  // minifies html files
    grunt.loadNpmTasks('grunt-contrib-imagemin');   // compresses images
    grunt.loadNpmTasks('grunt-contrib-uglify');		// javaScript minification
    grunt.loadNpmTasks('grunt-jsduck');				// creates documentation
    grunt.loadNpmTasks('grunt-contrib-watch');		// listens for changes
    grunt.loadNpmTasks('grunt-dalek');
//  grunt.loadNpmTasks('grunt-contrib-concat');		// copies files
//  grunt.loadNpmTasks('grunt-contrib-jshint');		// checks javaScript for errors
//  grunt.loadNpmTasks('grunt-notify');				// notifications
    
    /**
     * Tasks available
     */
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('compile', ['cssmin', 'compass', 'htmlmin', 'imagemin', 'uglify']);
    grunt.registerTask('docs', ['jsduck']);
    grunt.registerTask('test', ['dalek']);
};
