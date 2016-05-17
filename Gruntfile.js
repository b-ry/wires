

module.exports = function (grunt) {
    'use strict';
    var sassLib = ['bower_components'];

    var jsFileList = [
      'js/plugins/_*.js',
      'js/plugins/*.js',
      'js/_*.js',
      'js/*.js'
    ];

    // Show elapsed time after tasks run to visualize performance
    require('time-grunt')(grunt);
    // Load all Grunt tasks that are listed in package.json automagically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
          options: {
            jshintrc: '.jshintrc'
          },
          all: [
            'Gruntfile.js',
            'js/_*.js'
          ]
        },
        concat: {
          options: {
            separator: ';',
          },
          dist: {
            src: jsFileList,
            dest: 'js/dist/scripts.js',
          },
        },

        // shell commands for use in Grunt tasks
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            },
            jekyllServe: {
                command: 'jekyll serve'
            }
        },

        //copying bootstrap sass to _scss folder
        copy: {
            bootstrap: {
                files: [
                    {expand: true, cwd: 'bower_components/bootstrap/scss', src: ['**'], dest: '_sass/bootstrap'}
                ]
            }
        },

        // watch for files to change and run tasks when they do
        watch: {
            sass: {
                files: ['_sass/**/*.{scss,sass}'],
                tasks: ['sass','jshint','concat']
            },
            concat: {
                files: [jsFileList],
                tasks: ['jshint','concat']
            }
        },

        // sass (libsass) config
        sass: {
            options: {
                sourceMap: true,
                relativeAssets: false,
                outputStyle: 'expanded',
                sassDir: '_sass',
                cssDir: '_site/css'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '_sass/',
                    src: ['**/*.{scss,sass}'],
                    dest: '_site/css',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                map: {
                    inline: false
                },
                processors: [
                    require('pixrem')(), //adds fallbacks for rem
                    require('autoprefixer-core')({browsers: ['last 2 versions', 'ie9']}) // add vendor prefixes
                ]
            },
            build: {
                processors: [
                    require('pixrem')(),
                    require('autoprefixer-core')({browsers: ['last 2 versions', 'ie9']}) // add vendor prefixes
                ]
            }
        },

        // run tasks in parallel
        concurrent: {
            serve: [
                'sass',
                'jshint',
                'concat',
                'watch',
                'shell:jekyllServe'
            ],
            options: {
                logConcurrentOutput: true
            }
        },

    });

    // Register the grunt serve task
    grunt.registerTask('serve', [
        'concurrent:serve'
    ]);

    // Register the grunt build task
    grunt.registerTask('build', [
        'shell:jekyllBuild',
        'sass',
        'concat'
    ]);

    // Register build as the default task fallback
    grunt.registerTask('default', 'build');

};
