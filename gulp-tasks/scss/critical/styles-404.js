


module.exports = function (gulp, plugins, onError, browserSync) {
    return function () {

    	return plugins.sass('app/scss/critical-404.scss', { sourcemap: true, require: ['breakpoint'] })

		//catch errors
		.pipe(plugins.plumber({
			errorHandler: onError
		}))
		//autoprefix css
		.pipe(plugins.autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'],
			cascade: false
		}))

		.pipe(gulp.dest('app/css'))
		//the final filename of our combined css file
		.pipe(plugins.concat('critical-404.css')).pipe(plugins.minifyCSS())
		//.pipe(plugins.buffer())
		//.pipe(plugins.rev())
		//log the size of the project
		.pipe(plugins.size({
			showFiles: true,
			title: 'CSS'
		}))
		.pipe(gulp.dest('app/css'))
		//.pipe(plugins.rev.manifest('build/rev-manifest.json', { merge: true}))
        //.pipe(gulp.dest(''))
		.pipe(browserSync.reload({stream:true}));

   };
};

