module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {   
            js: {
                src: ['src/js/*.js'],
                dest: 'dist/pinpoint.js'
            }
            
        },
        
        uglify: {
            build: {
                src: 'dist/pinpoint.js',
                dest: 'dist/pinpoint.min.js'
            }
        },
        
        sass: {
            dist: {
                files: {
                    'dist/pinpoint.css': 'src/scss/main.scss'
                }
            },
            dist_min: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'dist/pinpoint.min.css': 'src/scss/main.scss'
                }
            }
        },
        
        qunit: {
            files: ['test/**/*.html']
        },
        
        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['src/js/*'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['src/scss/*'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-qunit');
	

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['compile','test']);
    grunt.registerTask('compile', ['concat','uglify','sass']);
    grunt.registerTask('test', ['qunit']);

};
