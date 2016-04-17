var ajaxLoop = (function($) {
	var self = this;

	var init = function() {
		_bind();
	};

	var _bind = function() {
		var posts_per_page = 3; // How many posts to show at once
		var page = 1; 			// Current page
		var loading = false;	// Is a request being made?
		var filter = null; 		// Filter posts by (default : null)
		var category = 'Latest Posts';
		var maxPages; 			// Amount of pages in archive
		var url; 				// URL to pass to ajax request
		var date; 				// Date of creation
		var initialLoad = true;

		var load_posts = function(filter, category){
			if (loading === false) {
				loading = true;

				if (page === 1) {
					posts_per_page = 4;
				} else {
					posts_per_page = 3;	
				}

				if (filter) {
					url = '/wp-json/posts?type=post&filter[category_name]='+ filter +'&filter[posts_per_page]='+posts_per_page+'&page='+page;
				} else {
					url = '/wp-json/posts?type=post&filter[posts_per_page]='+posts_per_page+'&page='+page;
				}

				$.ajax( {
					type       : 'GET',
					url  	   : url,
					dataType   : 'json',

					beforeSend: function() {
						// Show loading gif
						$('.loading').show();
					},

					success: function ( data, textStatus, request ) {
						// Get amount of posts and divide by how many posts per page
						if (initialLoad) {
							maxPages = request.getResponseHeader('X-WP-Total') / (posts_per_page-1);
						} else {
							maxPages = request.getResponseHeader('X-WP-Total') / posts_per_page;
						}


						// Hide loading gif
						$('.loading').hide();

						// Get amount of posts and divide by how many posts per page
						for (var i = 0; i < data.length; i++) {
							// Get first 20 words of content
							var excerpt = data[i].content.replace(/<\/?[^>]+>/gi, '');
								excerpt = excerpt.split(' ').slice(0,20).join(' ');

							// Format date
							date = moment(data[i].date).fromNow();

							var postThumb;
							var match = data[i].content.match(/<img[^>]+>/);

							if (data[i].thumb_url !== 'http://staging.bikedevil.net/wp/wp-includes/images/media/default.png') {
								postThumb = data[i].thumb_url;
							} else if (match !== null) {
							    var matchedText = match[0];
							    postThumb = $(match[0]).attr('src');
							} else {
								postThumb = data[i].thumb_url;
							}

							if (i === 0 && initialLoad) {
								$('.l-archive__row').before('<h2 class="col-md-6 l-archive__title"><a href="/news">'+ category +'</a></h2>'
								);

								$('.l-archive__row').prepend(										
									'<div class="col-sm-12 l-archive__post l-archive__post--featured l-archive__post--'+i+'">'+
										'<a href="'+ data[i].link +'" class="l-archive__post--thumb-container" style="background-image: url('+postThumb+')">'+
										'</a>'+
										'<div class="l-archive__post--container">'+
											'<h3 class="l-archive__post--title"><a href="'+ data[i].link +'">'+ data[i].title +'</a></h3>'+
											'<p class="l-archive__post--meta">from '+ data[i].author.name + " | " + date +'</p>'+
											'<p class="l-archive__post--excerpt">'+ excerpt +'</p>'+
											'<a href="'+ data[i].link +'" class="b-button">Read More</a>'+
										'</div>'+
									'</div>'
								);
							} else {
								$('.l-archive__row').append(
									'<div class="col-sm-4 l-archive__post l-archive__post--'+i+' js-match-height">'+
										'<a href="'+ data[i].link +'" class="l-archive__post--thumb-container" style="background-image: url('+postThumb+')">'+
										'</a>'+
										'<div class="l-archive__post--container">'+
											'<h3 class="l-archive__post--title"><a href="'+ data[i].link +'">'+ data[i].title +'</a></h3>'+
											'<p class="l-archive__post--meta">from '+ data[i].author.name +
											'<p class="l-archive__post--date">'+ date +
											'<p class="l-archive__post--excerpt">'+ excerpt +'</p>'+
										'</div>'+
									'</div>'
								);
							}

							$('.l-archive__post--'+i).fadeIn(500);
						}

						$('.js-match-height').matchHeight();
						var windowHeight = $(window).height();
						windowHeight = windowHeight - 100;

						initialLoad = false;
						page++;          // Increment page
						loading = false; // Request finished
					},

					error     : function(jqXHR, textStatus, errorThrown) {
						// Hide loading gif
						$('.loading').hide();

					},
				});
			}
		};

		$('.js-archive-filter').on('change.fs', function () {
		    var thisCat = this.value;
		    var thisText = $('.trigger').text();
		    var filter;
		    var category;

		    console.log(this.value);

		    // If all, show all posts
		    if (thisCat === 'all') {
		    	filter = null;
		    	category = 'Latest News';
		    } else {
		    	filter = thisCat;
		    	category = thisText;
		    }

		    $('.l-archive__title').remove();
		    $('.l-archive__row').empty();

		    //Reset pagination
		    page = 1;
		    initialLoad = true;
		    load_posts(filter, category);
		});

		if (is_archive && is_news === true) {
			$(window).scroll(function() {
				if(page <= maxPages && $(window).scrollTop() + $(window).height() == $(document).height() && is_device === null) {
					load_posts(filter);
				}
			});
		}

		$('.js-load-more').on('click', function(event) {
			event.preventDefault();

			if(page <= maxPages) {
				load_posts(filter);
			}
		});


		load_posts(filter, category);
	};

	return {
		init: init
	};

})(jQuery);


;(function($) {
	// Browser supports HTML5 multiple file?
	var multipleSupport = typeof $('<input/>')[0].multiple !== 'undefined',
		isIE = /msie/i.test( navigator.userAgent );

	$.fn.customFile = function() {
		return this.each(function() {

		var $file = $(this).addClass('custom-file-upload-hidden'), // the original file input
			$wrap = $('<div class="file-upload-wrapper">'),
			$input = $('<input type="text" class="file-upload-input" />'),
			// Button that will be used in non-IE browsers
			$button = $('<button type="button" class="file-upload-button">Choose File</button>'),
			// Hack for IE
			$label = $('<label class="file-upload-button" for="'+ $file[0].id +'">Choose File</label>');

			// Hide by shifting to the left so we
			// can still trigger events
			$file.css({
				position: 'absolute',
				left: '-9999px'
			});

			$wrap.insertAfter( $file ).append( $file, $input, ( isIE ? $label : $button ) );

			// Prevent focus
			$file.attr('tabIndex', -1);
			$button.attr('tabIndex', -1);

			$button.click(function () {
				$file.focus().click(); // Open dialog
			});

			$file.change(function() {
				var files = [], fileArr, filename;

				// If multiple is supported then extract
				// all filenames from the file array
		        if ( multipleSupport ) {
		        	fileArr = $file[0].files;

					for ( var i = 0, len = fileArr.length; i < len; i++ ) {
						files.push( fileArr[i].name );
					}

					filename = files.join(', ');

					// If not supported then just take the value
					// and remove the path to just show the filename
				} else {
					filename = $file.val().split('\\').pop();
				}

				$input.val( filename ) // Set the value
					.attr('title', filename) // Show filename in title tootlip
					.focus(); // Regain focus
			});

			$input.on({
				blur: function() { $file.trigger('blur'); },
				keydown: function( e ) {
					if ( e.which === 13 ) { // Enter
						if ( !isIE ) { $file.trigger('click'); }
					} else if ( e.which === 8 || e.which === 46 ) { // Backspace & Del
						// On some browsers the value is read-only
						// with this trick we remove the old input and add
						// a clean clone with all the original events attached
						$file.replaceWith( $file = $file.clone( true ) );
						$file.trigger('change');
						$input.val('');
					} else if ( e.which === 9 ){ // TAB
						return;
					} else { // All other keys
						return false;
					}
				}
			});
		});
	};

	// Old browser fallback
	if ( !multipleSupport ) {
		$( document ).on('change', 'input.customfile', function() {
			var $this = $(this);
				// Create a unique ID so we
				// can attach the label to the input
			var uniqId = 'customfile_'+ (new Date()).getTime();
			var $wrap = $this.parent();

			// Filter empty input
			var $inputs = $wrap.siblings().find('.file-upload-input').filter(function(){ return !this.value; });
			var $file = $('<input type="file" id="'+ uniqId +'" name="'+ $this.attr('name') +'"/>');

			// 1ms timeout so it runs after all other events
			// that modify the value have triggered
			setTimeout(function() {
				// Add a new input
				if ( $this.val() ) {
			    	// Check for empty fields to prevent
			    	// creating new inputs when changing files
					if ( !$inputs.length ) {
						$wrap.after( $file );
						$file.customFile();
					}
			        // Remove and reorganize inputs
				} else {
					$inputs.parent().remove();
					// Move the input so it's always last on the list
					$wrap.appendTo( $wrap.parent() );
					$wrap.find('input').focus();
				}
			}, 1);
		});
	}

}(jQuery));

jQuery('input[type=file]').customFile();

var gallery = (function($) {
 	var switched = false;

 	var init = function() {
 		_lightbox();
 	};

 	var _lightbox = function() {
 		$('.lightbox').magnificPopup({
 		  delegate: 'a',
 		  type: 'image',

 		  gallery: {
 		    enabled: true
 		  },
 		});

 		$('.popup-modal').magnificPopup({
 			type: 'inline',
 			preloader: false,
 			focus: '#username',
 			modal: true
 		});
 		$(document).on('click', '.popup-modal-dismiss', function (e) {
 			e.preventDefault();
 			$.magnificPopup.close();
 		});
 	};

	return {
		init: init
	};

})(jQuery);

gallery.init();

var mobileNav = (function($) {
	var self = this;

	var init = function() {
		_bind();
	};

	var _bind = function() {
		$('.burger-icon').on('click', function() {
			$('.burger-icon, .js-mobile-nav').toggleClass('menu-active');
			$('body').toggleClass('disabled');
		});
	};

	return {
		init: init
	};

})(jQuery);


var secondaryNav = (function($) {
	var self = this;
	var preliminaryTouch = false;

	var init = function() {

		_bindEvents();


		//if(!Modernizr.touch){
		if( !$('html').hasClass('prel-touch-device') ) {

			_hover();
		}

		_mobileClickHandler();
	};

	var _bindEvents = function(){
		$('html').addClass('no-touch-device');

		//Check the user agent string
	    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	        self.preliminaryTouch = true;
	    }

	    if( self.preliminaryTouch ) {
	        //Do something for touch devices and
	        //Add a preliminary touch class
	        $('html').addClass('prel-touch-device');
	    }
	    $(document).on('touchstart', function() {
   		 	//Now we can safely remove the the no-touch-device and prel-touch-device classes
	   	 	$('html').removeClass('no-touch-device prel-touch-device').addClass('touch-device');
		});

	};

	var _mobileClickHandler = function(){

		$("#secondary-nav").on('change.fs', _handleMobileUrlChange);

	};

	var _handleMobileUrlChange = function(e){

		$(this).trigger('change.$');

		$("#secondary-nav option:selected" ).each(function() {
	     	window.location = $( this ).val();
	    });

	};

	var _hover = function() {
		var origWidth;
		var origLeft;

		if ($('.b-secondary-nav__nav--link.current-menu-item').length > 0) {
			origWidth = $('.b-secondary-nav__nav .current-menu-item').width();
			origLeft = $('.b-secondary-nav__nav .current-menu-item').position().left;
		} else {
			origLeft = 0;
			origWidth = $('.b-secondary-nav__nav li').width();
		}

		var currentLeft;

		$('.b-secondary-nav__nav--slider').css({
			'left': origLeft,
			'width': origWidth
		});



			//alert("no touch");

			$('.b-secondary-nav__nav li').hover(function() {
				var thisLeft = $(this).position().left;
				var thisWidth = $(this).width();
				$('.b-secondary-nav__nav--slider').stop();
				$('.b-secondary-nav__nav--slider').animate({
					width: thisWidth,
					left: thisLeft
				}, {
					duration: 500,
					specialEasing: {
						width: "linear",
						height: "easeOutBounce"
					}
				}, function() {
					currentLeft = $('.b-secondary-nav__nav--slider').css('left');
				});
			}, function() {
				$('.b-secondary-nav__nav--slider').css('left', currentLeft);
			});








		$('.b-secondary-nav__nav').hover(function() {

		}, function() {


			$('.b-secondary-nav__nav--slider').stop();
			$('.b-secondary-nav__nav--slider').animate({
				left: origLeft,
				width: origWidth
			}, {
				duration: 500,
				specialEasing: {
					width: "linear",
					height: "easeOutBounce"
				}
			}, function() {
				currentLeft = $('.b-secondary-nav__nav--slider').css('left');
			});
		});

		$('[data-cat]').on('click', function(event) {
			event.preventDefault();

			origWidth = $(this).outerWidth();
			origLeft = $(this).position().left;
		});
	};

	return {
		init: init
	};

})(jQuery);



var sharing = (function($) {
    'use strict';

    function init() {
        $('.js-fb-share').on('click', function(event) {
            event.preventDefault();
            _share();
        });
    }

    var _share = function() {
        var url = window.location.href;

        FB.ui({
          method: 'feed',
          link: url,
        }, function(response){});
    };

    return {
        init:init
    };
}(jQuery));

jQuery(document).ready(function($) {
    sharing.init();
});

var slider = (function($) {
	var self = this;

	var init = function() {
		_slider();
	};

	var _slider = function() {
		var touch;

		if ($('.slide-content').length > 1) {
			touch = true;
		} else {
			touch = false;
		}

		$('.flexslider').flexslider({
			animation: "slide",
			touch: touch,
			controlNav: false,
			nextText: '',
			prevText: ''
		});
	};

	return {
		init: init
	};

})(jQuery);


var stickyWidget = (function($) {
	var self = this;
	var active;

	var init = function() {
		_bind();
	};

	var _bind = function() {
		var $el = $('.b-popular-posts');
		var elementOffset = $el.offset().top;
		var elementOffsetLeft = $el.offset().left;
		var elementWidth = $el.outerWidth();

		$(window).scroll(function() {
			var scrollTop = $(window).scrollTop();
			var distance = (elementOffset - scrollTop);

			if (scrollTop + 105 > elementOffset && distance <= 0) {
				if (!active) {
					active = true;
					$('.b-popular-posts').addClass('fixed');
					$('.b-popular-posts').css({
						left : elementOffsetLeft,
						width : elementWidth
					});
				}
			} else {
				if (active) {
					$('.b-popular-posts').removeClass('fixed');
					$('.b-popular-posts').css('left', 'auto');

					active = false;
				}
			}
		});
	};

	return {
		init: init
	};

})(jQuery);


var boilerAPP = (function($) {
	var self = this;

    this.resizeCooldown = true;

    this.settings = {
        screenWidth: 0,
        screenHeight: 0,
        videoCapabilities: true,
        screenSize: 'desk',
        homeExpanded: false,
        isAnimating: false,
        modalOpen: false,
        mousewheelSet: false,
        debug: false,
        isOpen: false,
        isCareersOpen: false,
        isSnapped: false
    };

    this.domElements = {
        body: $('body'),
        blogPost: $('.l-blog-detail'),
        vidModal: $("#vid-modal"),
        footer: $(".l-footer")
    };

	var init = function() {
		_bindEvents();
		_headroom();
		_ctas();
		_slider();

		$(window).resize(function() {
			_ctas();
		});
	};

	var _bindEvents = function() {
		$('.js-match-height').matchHeight();

		$('.js-back-button').on('click', function(event) {
			event.preventDefault();
			parent.history.back();
			return false;
		});

		$('select').fancySelect();
	};

	var _headroom = function() {
		$('header').headroom({
		  "offset": 90,
		  tolerance : {
		      up : 50,
		      down : 0
		  },
		  "classes": {
		    "initial": "animated",
		    "pinned": "slideDown",
		    "unpinned": "slideUp"
		  }
		});
	};

	var _ctas = function() {
		$('.b-call-to-action').each(function(index, val) {
			var width = $('.b-call-to-action').eq(index).width();

			$('.b-call-to-action').eq(index).css('height', width);		
		});
	};

	var _slider = function() {
		$('.l-gallery-strip').slick({
			slidesToShow: 6,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 2000,
			arrows: true,
			prevArrow: '<a class="slider-prev"></a>',
			nextArrow: '<a class="slider-next"></a>',

			responsive: [{
				breakpoint: 1200,
					settings: {
						slidesToShow: 6,
						centerPadding: '0px'
					}
				}, {

				breakpoint: 960,
					settings: {
						slidesToShow: 3,
						arrows: false,
						dots: true,
						centerPadding: '0px'
					}
				}, {

				breakpoint: 800,
					settings: {
						slidesToShow: 2,
						arrows: false,
						dots: true,
						centerPadding: '0px'
					}
				}, {

				breakpoint: 500,
					settings: {
						slidesToShow: 1,
						arrows: false,
						dots: true,
						centerPadding: '0px'
					}

			}]
		});
		$('.l-gallery-strip').slickLightbox();
	};

	// ==== SCRIPTS ==== //
	return {
		init: init
	};
})(jQuery);

jQuery(document).ready(function($) {
	// ==== FIRE THE APP ==== //
	boilerAPP.init();
	slider.init();
	mobileNav.init();
	ajaxLoop.init();

	if ($('.b-secondary-nav__nav').length > 0) {
		secondaryNav.init();
	}

	if ($('.b-popular-posts').length > 0 && $(window).width() >= 991) {
		stickyWidget.init();
	}
});
