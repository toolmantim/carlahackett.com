module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['sass/*.scss'],
      tasks: 'sass'
    },

    sass: {
      styles: {
        options: {
          require: './sass/sass_css_importer',
          loadPath: 'components',
          sourcemap: true,
          style: 'compressed'
        },
        files: {
          'public/styles.css': 'sass/styles.scss'
        }
      }
    }

  });

  grunt.registerTask('default', ['sass', 'watch']);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
