module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['sass/*.scss'],
      tasks: 'css'
    },

    sass: {
      styles: {
        options: {
          require: './sass/sass_css_importer',
          loadPath: 'components',
          style: 'expanded'
        },
        files: {
          'public/styles.css': 'sass/styles.scss'
        }
      }
    },

    autoprefixer: {
      styles: {
        options: {
          browsers: ['last 2 versions']
        },
        files: {
          'public/styles.css': 'public/styles.css'
        }
      }
    },

  });

  grunt.registerTask('css', ['sass', 'autoprefixer']);

  grunt.registerTask('default', ['css', 'watch']);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
