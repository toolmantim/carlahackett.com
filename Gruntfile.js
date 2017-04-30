module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    sass: {
      dist: {
        options: {
          includePaths: [require('node-normalize-scss').includePaths],
          outputStyle: 'expanded'
        },
        files: {
          'public/styles.css': 'sass/*.scss'
        }
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer'),
          require('cssnano')
        ]
      },
      dist: {
        src: 'public/*.css'
      }
    },

    watch: {
      scripts: {
        files: ['sass/*'],
        tasks: ['css'],
        options: {
          spawn: false
        },
      },
    },

  });

  grunt.registerTask('css', ['sass', 'postcss']);

  grunt.registerTask('default', ['css']);

};