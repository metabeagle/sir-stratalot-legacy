module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'expanded',
        },
        files: {
          'private/css/app.css' : 'private/scss/app.scss'  
        },
      },
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')(),
        ],
      },
      dist: {
        src: 'private/css/app.css'
      },
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          'public/css/app.min.css' : 'private/css/app.css'
        },
      },
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: [{
          expand: true,
          cwd: 'private/js',
          src: '**/*.js',
          dest: 'public/js'
        }]
      }
    },
    watch: {
      css: {
        files: 'private/**/*.scss',
        tasks: ['sass', 'postcss', 'cssmin'],
      },
      js: {
        files: 'private/**/*.js',
        tasks: ['uglify'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  // grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
}