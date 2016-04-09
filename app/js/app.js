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
