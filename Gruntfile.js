module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    manifest: grunt.file.readJSON('sources/manifest.json'),
    config: grunt.file.readJSON('config.json'),

    clean: ['dest'],

    copy: {
      dist: {
        expand: true,
        cwd: 'sources',
        src: '**',
        dest: 'dest/unpacked',
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'version',
              replacement: '<%= manifest.version %>'
            },
            {
              match: 'API_TOKEN',
              replacement: '<%= config.apiToken %>'
            }
          ]
        },
        files: [
          {expand: true, src: ['dest/**/*.js','dest/**/*.css','dest/**/*.html']}
        ]
      }
    },

    compress: {
      dist: {
        options: {
          archive: 'dest/packed/exodify-<%= manifest.version %>.zip'
        },
        files: [
          {expand: true, cwd: 'dest/unpacked', src: ['**'], dest: '/'}, // makes all src relative to cwd
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['clean','copy','replace','compress']);

};