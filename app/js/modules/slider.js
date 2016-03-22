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

