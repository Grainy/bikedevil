// lazyload all of our dependencies
var gulp = require('gulp');

//enables the use of grunt tasks
require('gulp-grunt')(gulp);

var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var runSequence = require('run-sequence');
var del = require('del');
var psi = require('psi');
//var revOutdated = require('gulp-rev-outdated');
var path = require('path');
var through = require('through2');
var site = 'http://boilerplate.dev';
var key = '';

var plugins = gulpLoadPlugins({
	rename: {
		'gulp-ruby-sass': 'sass',
		'gulp-util' : 'gutil',
		'gulp-minify-css' : 'minifyCSS',
		'gulp-svg-sprite' : 'svgSprite',
		'gulp-image-optimization' : 'imageop'
	}
});

// Basic configuration example
var svgSpriteConfig                  = {
    mode                : {
        css             : {
            render      : {
                css     : true
            },
            dimensions : true,
            example     : true
        }
    }
};

var onError = function (err) {
	plugins.gutil.beep();
	console.log(err);
};

// Sets assets folders.
var dirs = {
	src: 'app',
	build: 'build',
	js: 'app/js',
	css: 'app/css',
	sass: 'app/scss',
	images: 'app/img',
	fonts: 'assets/fonts',
	php: '*.php',
	twig: 'views'
};


function cleaner() {
    return through.obj(function(file, enc, cb){
        rimraf( path.resolve( (file.cwd || process.cwd()), file.path), function (err) {
            if (err) {
                this.emit('error', new gutil.PluginError('Cleanup old files', err));
            }
            this.push(file);
            cb();
        }.bind(this));
    });
}


// ==== SCRIPTS ==== //

// Scripts; broken out into different tasks to create specific bundles which are then compressed in place
gulp.task('scripts', ['scripts-lint', 'scripts-core', 'scripts-app'], function() {
	return gulp.src([dirs.build + '/js/**/*.js', '!' + dirs.build +
		'/js/**/*.min.js'
		]) // Avoid recursive min.min.min.js
	.pipe(plugins.rename({
		suffix: '.min'
	})).pipe(plugins.uglify()).pipe(gulp.dest(dirs.build + '/js/'));
});

// Lint scripts for errors and sub-optimal formatting
gulp.task('scripts-lint', function() {
	return gulp.src(dirs.js + '/*.js')
	.pipe(plugins.jshint())
	.pipe(plugins.jshint.reporter('jshint-stylish'));
});

// These are the core custom scripts loaded on every page; pass an array to bundle several scripts in order
gulp.task('scripts-core', function() {

	return gulp.src([
		//dirs.src + '/js/util/Mediator.js',
		dirs.src + '/js/vendor/modernizr.custom.3189.js',
		dirs.src + '/js/util/helpers.js',
		dirs.src + '/js/vendor/viewport-units-buggyfill-latest.js',
		dirs.src + '/js/vendor/jquery.lazyload.js',
		dirs.src + '/js/vendor/fancySelect.js',
		dirs.src + '/js/vendor/jquery.matchheight.js',
		dirs.src + '/js/vendor/moment.min.js',
		dirs.src + '/js/vendor/jquery.flexslider-min.js',
		dirs.src + '/js/vendor/headroom.min.js',
		dirs.src + '/js/vendor/slick.min.js',
		dirs.src + '/js/vendor/jquery.magnific-popup.js',
	   ]).pipe(plugins.concat('core.js')).pipe(gulp.dest(dirs.build + '/js/'));

});

// main app scripts
gulp.task('scripts-app', function() {
	return gulp.src([
		//dirs.src + '/js/module/viewport.js',
		dirs.src + '/js/svgicons-config.js',
		dirs.src + '/js/vendor/pointer_events_polyfill.js',
		dirs.src + '/js/modules/*.js',
		dirs.src + '/js/app.js',
		dirs.src + '/js/init.js'
		]).pipe(plugins.concat('app.js')).pipe(gulp.dest(dirs.build + '/js/'));
});


// ==== STYLES==== //

// ASYNC
gulp.task('styles-async-404', require('./gulp-tasks/scss/async/styles-404')(gulp, plugins, onError, browserSync));
gulp.task('styles-async-archive', require('./gulp-tasks/scss/async/styles-archive')(gulp, plugins, onError, browserSync));
gulp.task('styles-async-contact', require('./gulp-tasks/scss/async/styles-contact')(gulp, plugins, onError, browserSync));
gulp.task('styles-async-home', require('./gulp-tasks/scss/async/styles-home')(gulp, plugins, onError, browserSync));
gulp.task('styles-async-single-post', require('./gulp-tasks/scss/async/styles-single-post')(gulp, plugins, onError, browserSync));
gulp.task('styles-async-docs', require('./gulp-tasks/scss/async/styles-docs')(gulp, plugins, onError, browserSync));
gulp.task('styles-async-page-builder', require('./gulp-tasks/scss/async/styles-page-builder')(gulp, plugins, onError, browserSync));


// critical
gulp.task('styles-critical-404', require('./gulp-tasks/scss/critical/styles-404')(gulp, plugins, onError, browserSync));
gulp.task('styles-critical-archive', require('./gulp-tasks/scss/critical/styles-archive')(gulp, plugins, onError, browserSync));
gulp.task('styles-critical-contact', require('./gulp-tasks/scss/critical/styles-contact')(gulp, plugins, onError, browserSync));
gulp.task('styles-critical-home', require('./gulp-tasks/scss/critical/styles-home')(gulp, plugins, onError, browserSync));
gulp.task('styles-critical-single-post', require('./gulp-tasks/scss/critical/styles-single-post')(gulp, plugins, onError, browserSync));
gulp.task('styles-critical-docs', require('./gulp-tasks/scss/critical/styles-docs')(gulp, plugins, onError, browserSync));
gulp.task('styles-critical-page-builder', require('./gulp-tasks/scss/critical/styles-page-builder')(gulp, plugins, onError, browserSync));


gulp.task('styles-async', function(callback) {
  	runSequence(
	  	'styles-async-404',
	  	'styles-async-archive',
	  	'styles-async-contact',
	  	'styles-async-home',
	  	'styles-async-single-post',
	  	'styles-async-page-builder',
  	callback);
});


gulp.task('styles-critical', function(callback) {
  	runSequence(
	  	['styles-critical-404',
	  	'styles-critical-archive',
	  	'styles-critical-contact',
	  	'styles-critical-home',
	  	'styles-critical-single-post',
	  	'styles-critical-page-builder'],
  	callback);
});



// ==== IMAGES ==== //

gulp.task('images', function(cb) {
	gulp.src(['app/img/**/*.png', 'app/img/**/*.jpg',
		'app/img/**/*.gif', 'app/img/**/*.jpeg'
		]).pipe(plugins.imageop({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		})).pipe(gulp.dest('app/img')).on('end', cb).on('error', cb);
	});


// ==== SVG SPRITING ==== //

gulp.task('svg-sprite', function() {
	return gulp.src('app/img/**/*.svg')
    .pipe(plugins.plumber())
    .pipe(plugins.svgSprite(svgSpriteConfig))
        .on('error', function(error){
            /* Do some awesome error handling ... */
        })
    .pipe(gulp.dest('app/svg'));
});


// ==== TESTING VIA DALEK ==== //

gulp.task('test', function() {
  return gulp.src(['tests/functional/**/*.js'])
    .pipe(plugins.dalek({
      browser: ['chrome'],
      reporter: ['console', 'html']
    }));
});


// ==== CLEANUP ==== //

//cleans our dist directory in case things got deleted
// gulp.task('clean', function(cb) {
// 	// return gulp.src(['dist/*'], {
// 	//     read: false
// 	// }).pipe(plugins.clean());
// del([
// 	'dist/*'
// 	], cb);
// });

gulp.task('clean', function() {
    gulp.src( ['app/css/async*.css'], {read: false})
        .pipe(revOutdated(1) ) // leave 1 latest asset file
        .pipe( cleaner() );

    // gulp.src( ['dist/js/bundle*.js'], {read: false})
    //     .pipe( plugins.revOutdated(3) ) // leave 3 recent assets
    //     .pipe( cleaner() );

    // gulp.src( ['dist/css/*.css'], {read: false})
    //     .pipe( plugins.revOutdated() ) // leave 2 recent assets (default value)
    //     .pipe( cleaner() );

    return;
});


// Static Server + watching scss/html files
gulp.task('serve', function() {

	browserSync.init({
        proxy: site,
        ghostMode: false
    });

	gulp.watch(dirs.sass + '/**', ['styles-async', 'styles-critical']);
	gulp.watch(dirs.js + '/**/*.js', ['scripts']).on('change', browserSync.reload);
	gulp.watch(dirs.twig + '/**').on('change', browserSync.reload);

});


// ====  DEVPERF CHECKS ==== //

gulp.task('mobile-perf', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

gulp.task('desktop-perf', function () {
    return psi(site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

gulp.task('devperf', function(){
	gulp.run('grunt-perf');
	gulp.run('desktop-perf');
	gulp.run('mobile-perf');

});


// ==== WATCH/DEFAULT TASKS ==== //

gulp.task('default', ['serve']);
//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', function() {
	gulp.start('images');
});
