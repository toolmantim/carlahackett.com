module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['sass/*.scss'],
      tasks: 'sass'
    },

    sass: {
      styles: {
        files: {
          'public/styles.css': [
            'components/normalize-css/normalize.css',
            'sass/styles.scss'
          ]
        }
      }
    },

    cssmin: {
      styles: {
        options: {
          keepSpecialComments: '0',
          report: 'gzip'
        },
        files: {
          'public/styles.css': 'sass/styles.css'
        }
      }
    }

  });

  grunt.registerTask('css', ['sass', 'cssmin']);
  grunt.registerTask('default', ['css']);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};