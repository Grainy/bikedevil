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

