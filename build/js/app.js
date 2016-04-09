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
		var maxPages; 			// Amount of pages in archive
		var url; 				// URL to pass to ajax request
		var date; 				// Date of creation
		var initialLoad = true;

		if (page == 1) {
			posts_per_page = 4;
		}

		var load_posts = function(filter){
			if (loading === false) {
				loading = true;

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
						$('.js-load-more').hide();
					},

					success: function ( data, textStatus, request ) {
						// Get amount of posts and divide by how many posts per page

						var divideBy = posts_per_page - 1;

						if (initialLoad) {
							divideBy = posts_per_page - 1;	
						} else {
							divideBy = posts_per_page;
						}


						maxPages = request.getResponseHeader('X-WP-Total') / divideBy;

						// Hide loading gif
						$('.loading').hide();

						for (var i = 0; i < data.length; i++) {
							// Get first 20 words of content
							var excerpt = data[i].content.replace(/<\/?[^>]+>/gi, '');
								excerpt = excerpt.split(' ').slice(0,20).join(' ');

							// Format date
							date = moment(data[i].date).fromNow();

							console.log('Post: ' + initialLoad);

							if (i === 0 && initialLoad) {
								console.log($('.l-archive__row').length);
								$('.l-archive__row').prepend(
										'<h2 class="col-md-6 l-archive__title"><a href="#">Latest News</a></h2>'+
										'<div class="col-sm-12 l-archive__post l-archive__post--featured l-archive__post--'+i+'">'+
											'<a href="'+ data[i].link +'" class="l-archive__post--thumb-container">'+
												'<img src="'+ data[i].thumb_url +'" alt="" class="l-archive__post--thumb">'+
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
								if ($('.l-archive__post--featured').length < 1) {
									$('.l-archive__row').prepend('<div class="l-archive__post--featured"></div>');
								}

								$('.l-archive__post--featured').after(
										'<div class="col-sm-4 l-archive__post l-archive__post--'+i+'">'+
											'<a href="'+ data[i].link +'">'+
												'<img src="'+ data[i].thumb_url +'" alt="" class="l-archive__post--thumb">'+
											'</a>'+
											'<div class="l-archive__post--container js-match-height">'+
												'<h3 class="l-archive__post--title"><a href="'+ data[i].link +'">'+ data[i].title +'</a></h3>'+
												'<p class="l-archive__post--meta">from '+ data[i].author.name +
												'<p class="l-archive__post--date">'+ date +
											'</div>'+
										'</div>'
								);
							}



							$('.l-archive__post--'+i).fadeIn(500);
						}

						$('.js-match-height').matchHeight();

						if(page === maxPages) {
							$('.js-load-more').hide();
						} else {
							$('.js-load-more').show();
						}

						page++;          // Increment page
						initialLoad = false;
						loading = false; // Request finished
					},

					error     : function(jqXHR, textStatus, errorThrown) {
						// Hide loading gif
						$('.loading').hide();

					},
				});
			}
		};

		$('[data-cat]').on('click', function(event) {
			event.preventDefault();
			var thisCat = $(this).data('cat');
			var filter;

			// If all, show all posts
			if (thisCat === 'all') {
				filter = null;
			} else {
				filter = thisCat;
			}

			$('.l-archive__row').empty();

			//Reset pagination
			page = 1;
			initialLoad = true;
			load_posts(filter);
		});

		$('.js-archive-filter').on('change.fs', function () {
		    var thisCat = this.value;
		    var filter;

		    // If all, show all posts
		    if (thisCat === 'all') {
		    	filter = null;
		    } else {
		    	filter = thisCat;
		    }

		    $('.l-archive__row').empty();

		    //Reset pagination
		    page = 1;
		    initialLoad = true;
		    load_posts(filter);
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


		load_posts(filter);
	};

	return {
		init: init
	};

})(jQuery);


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
	};

	var _bindEvents = function() {
		$('.js-match-height').matchHeight();

		$('.js-back-button').on('click', function(event) {
			event.preventDefault();
			parent.history.back();
			return false;
		});
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

	if ($('.b-secondary-nav__nav').length > 0) {
		secondaryNav.init();
	}

	ajaxLoop.init();
});
