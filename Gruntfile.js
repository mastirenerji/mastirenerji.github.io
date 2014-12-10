module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: {
                    except: 'jQuery'
                }
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/js/app/<%= pkg.name %>.min.js'
            }
        },
    imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    src: 'images/*.{png,jpg,gif}',
                    dest: 'dist/'
                }]
            }
        },    
    htmlcompressor: {
    compile: {
      files: [
        {
          expand: true,     // Enable dynamic expansion.
          cwd: 'src/',      // Src matches are relative to this path.
          src: ['**/*.html'], // Actual pattern(s) to match.
          dest: 'build/',   // Destination path prefix.
        },
      ],
      options: {
        type: 'html',
        preserveServerScript: true
      }
    }
  },
    htmlmin: {                                     // Task
    dist: {                                      // Target
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: true
      },
      files: {                                   // Dictionary of files
        'dist/index.html': 'src/index.html',     // 'destination': 'source'
        'dist/contact.html': 'src/contact.html'
      }
    },
    dev: {                                       // Another target
      files: {
        'dist/index.html': 'src/index.html',
        'dist/contact.html': 'src/contact.html'
      }
    },
    multiple: {                                  // Target
      files: [{                                  // Dictionary of files
        expand: true,
        cwd: 'app/',                             // Project root
        src: '**/*.html',                        // Source
        dest: 'build/'                            // Destination
      }]
    }
  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.registerTask('default', ['htmlmin']);
};