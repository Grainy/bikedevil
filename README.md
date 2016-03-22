
#Cube3 Wordpress Boilerplate

A standardized, organized, object-oriented foundation theme for building a high-quality WordPress Website.


# Features

* Fully Responsive/Mobile First Grid System
* Performance Orientated
* Critical Render Path Optimised
* Built on the underlying technology of Timber/Twig
* Advanced Custom Fields Integration
* Modular CSS via BEM/SMACSS
* Tried and tested javascript vendor plugins/libraries
* SEO Friendly



## CSS/SASS 

### Methodologies

* [SMACSS](Scalable and Modular Architecture for CSS) - a set of CSS guidelines which organizes your CSS rules into reusable modules.
* [BEM](Block, Element, Modifier) - a smart way of naming your CSS classes to give them more transparency and meaning to other developers.


### Helper Functions

* [BEM Mixins]
* Rem Units
* Input Placeholder styling
* Breakpoint Media Queries

### Grid System

The boilerplate utilizes a standalone version of the Bootstrap Grid System called [JUST GRID IT]


## Gulp Build System

* Minification and concatination of javascript files via [gulp-uglify] and [gulp-concat]
* SASS compilation and minification via [gulp-ruby-sass] and [gulp-minify-css]
* Auto vendor prefixing of CSS rules using values from caniuse.com via [gulp-autoprefixer]
* Image Optimisation via [gulp-image-optimization]
* Asset Revisioning via [gulp-rev]
* Automated testing via [DalekJS]
* LiveReload via [BrowserSync]
* Performance testing via [devperf] and [PageSpeed Insights]


## Javascript

### Design Patterns

* [Revealing Module Pattern]


### Included vendor libraries

* [jquery.lazyload.js] - Lazy Load is delays loading of images in long web pages. Images outside of viewport are not loaded until user scrolls to them. Using Lazy Load on long web pages will make the page load faster. In some cases it can also help to reduce server load. 
* [jquery.inview.js] - Event that is fired as soon as an element appears in the user’s viewport. Useful for animating elements upon scroll etc...
* [jquery.magnific-popup.js] - A responsive lightbox & dialog script with focus on performance and providing best experience for user with any device.
* [selectordie.js] -  Yet another jQuery plugin to style <select> elements. 
* [slick.js] - The last carousel you'll ever need

## Timber Framework

Although not a part of this repo, the boilerplate theme heavily utilises [Timber], a plugin/framework which helps you create fully-customized WordPress themes faster with more sustainable code. With Timber, you write your HTML using the [Twig Template Engine] separate from your PHP files.


## Installation

```sh
$ git clone [git-repo-url] 
$ cd cube3-wp-boiler
$ npm i -d
$ gulp
```

[SMACSS]: https://smacss.com
[BEM]:https://en.bem.info
[BEM Mixins]:https://medium.com/@marcmintel/pushing-bem-to-the-next-level-with-sass-3-4-5239d2371321
[jquery.lazyload.js]:http://www.appelsiini.net/projects/lazyload
[jquery.inview.js]:https://github.com/protonet/jquery.inview
[jquery.magnific-popup.js]:http://dimsemenov.com/plugins/magnific-popup
[selectordie.js]:http://vst.mn/selectordie/
[slick.js]:http://kenwheeler.github.io/slick/
[JUST GRID IT]:http://dysonsimmons.com/just-grid-it
[Timber]:http://upstatement.com/timber
[Twig Template Engine]:http://twig.sensiolabs.org/
[Gulp]:http://gulpjs.com
[DalekJS]:http://dalekjs.com
[gulp-rev]:https://www.npmjs.com/package/gulp-rev
[gulp-image-optimization]:https://github.com/firetix/gulp-image-optimization
[BrowserSync]:http://www.browsersync.io
[devperf]:https://github.com/gmetais/grunt-devperf
[PageSPeed Insights]:https://github.com/jrcryer/grunt-pagespeed
[gulp-autoprefixer]:https://www.npmjs.com/package/gulp-autoprefixer
[gulp-minify-css]:https://www.npmjs.com/package/gulp-minify-css
[gulp-ruby-sass]:https://www.npmjs.com/package/gulp-ruby-sass
[gulp-uglify]:https://www.npmjs.com/package/gulp-uglify
[gulp-concat]:https://www.npmjs.com/package/gulp-concat
[Revealing Module Pattern]: http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
[git-repo-url]:git@bitbucket.org:cube3digital/cube3-wp-boiler.git
