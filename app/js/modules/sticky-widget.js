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

