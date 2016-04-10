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
