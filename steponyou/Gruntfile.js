// Generated on 2015-02-02 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
	
	wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['views/index.html'],
        exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
      }
    }
  });
  
  // register the nodemon task when we run grunt
  grunt.registerTask('default', ['wiredep', 'nodemon']);  

};
