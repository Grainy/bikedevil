jQuery(document).ready(function($) {
	// ==== FIRE THE APP ==== //
	boilerAPP.init();
	slider.init();
	solutionSelector.init();
	mobileNav.init();

	if ($('.b-secondary-nav__nav').length > 0) {
		secondaryNav.init();
	}

	if (is_archive === true) {
		ajaxLoop.init();
	}
});
