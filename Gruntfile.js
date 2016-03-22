var ngrok = require('ngrok');


module.exports = function(grunt) {
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		devperf: {
				options: {
						urls: [
								'http://blackops.dev'
								//'http://accross.teamcube.co.uk',
								//'http://www.blackburn.ac.uk'
						],
						numberOfRuns: 3,
						timeout: 120,
						openResults: true
				}
		},
		pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    }



	});

	 // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 9292;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });


	//grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-pagespeed');
	grunt.loadNpmTasks('grunt-devperf');



	//watch task for local dev
	//grunt.registerTask('default', ['copy', 'concat', 'uglify', 'watch']);

	// devperf - to check performance
	grunt.registerTask('perf', ['devperf', 'psi-ngrok']);



}
