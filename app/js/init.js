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
