
	var homepage = 'http://revcareers.dev/',
		credentials = {
			userName: 'yourUsername',
			password: 'yourPassword'
		},
		search = {
			searchTerm: 'Micromata',
			companyName: 'Micromata GmbH'
		},
		breakpoints = {
			xLarge: 1280,
			large: 1024
		};

	module.exports = {


		'Masthead should load': function(test) {

			try {
			 	test
			 		.open(homepage)
					.assert.exists('.l-masthead', 'Masthead exists')
					.done();
			} catch(e) {
			    console.error(e);
			}

		},



		'Footer should load': function(test) {

			try {
				test
					.open(homepage)
					.assert.exists('.l-footer', 'Footer exists')
					.done();
			} catch(e) {
			    console.error(e);
			}
		},

		'Logo should link to home page': function(test) {
			try {
				test
					.open(homepage)
					.assert.exists('.l-masthead__logo', 'Masthead Logo exists')
					.click('.l-masthead__logo')
					.assert.url().is(homepage, 'We are on the homepage')
					.done();
			} catch(e) {
			    console.error(e);
			}
		},
		'Homepage jobs should be populated': function(test) {
			try {
				test
					.open(homepage)
					.assert.numberOfElements('.l-home-jobs-loop .b-job-snippet').is.gt(1, 'At least one job exists')
					.screenshot('report/grabs/home/jobs-loop.jpg')
			    	.done();
			} catch(e) {
			    console.error(e);
			}
		},
		'Clicking nav toggle should display offCanvas': function(test) {
			try {
				test
					.open(homepage)
					.click("#js-nav-toggle")
					.wait(1000)
		            .assert.attr('body', 'class').to.contain('show-menu')
		            .screenshot('report/grabs/click/in/:browser_:version/on/:os/menuActive.png')
		            //.assert.isVisible('#londonfff', 'The london tab is visible')
		            .done();
			} catch(e) {
			    console.error(e);
			}
		},
		'Clicking nav close toggle should hide offCanvas': function(test) {
			try {
				test
					.open(homepage)
					.click("#js-close-nav")
					.wait(1000)
		            .assert.attr('body', 'class').to.contain('hide-menu')
		            .screenshot('report/grabs/click/in/:browser_:version/on/:os/menuClosed.png')
		            //.assert.isVisible('#londonfff', 'The london tab is visible')
		            .done();
			} catch(e) {
			    console.error(e);
			}
		},
		'Clicking careers nav toggle should display Careers offCanvas': function(test) {
			try {
				test
					.open(homepage)
					.click("#js-careersnav-toggle")
					.wait(1000)
		            .assert.attr('body', 'class').to.contain('show-careers-menu')
		            .screenshot('report/grabs/click/:browser_:version/on/:os/careersMenuActive.png')
		            //.assert.isVisible('#londonfff', 'The london tab is visible')
		            .done();
			} catch(e) {
			    console.error(e);
			}
		},
		'Clicking careers nav close toggle should hide offCanvas': function(test) {
			try {
				test
					.open(homepage)
					.click("#js-close-careersnav")
					.wait(1000)
		            .assert.attr('body', 'class').to.contain('hide-careers-menu')
		            .screenshot('report/grabs/click/in/:browser_:version/on/:os/careersMenuClosed.png')
		            //.assert.isVisible('#londonfff', 'The london tab is visible')
		            .done();
			} catch(e) {
			    console.error(e);
			}
		},

		// 'Clicking select a career dropDown should reveal options': function(test) {
		// 	try {
		// 		test
		// 			.open(homepage)
		// 			.assert.numberOfElements('.l-home-jobs-loop .b-job-snippet').is.gt(1, 'At least one job exists')
		// 			.screenshot('report/grabs/home/jobs-loop.jpg')
		// 	    	.done();
		// 	} catch(e) {
		// 	    console.error(e);
		// 	}
		// }



};
