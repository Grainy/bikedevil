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


