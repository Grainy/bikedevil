var solutionSelector = (function($) {
	var self = this;

	var init = function() {

		_bindEvents();
		_selector();
		_selectorMobile();
	};

	var _selector = function() {

		var sectorSelect = $('select[name="sector"]'),
			roleSelect = $('select[name="role"]');

		$('select').fancySelect().on('change.fs', function() {

			$(this).siblings('.trigger').removeClass('error');
		});

		$('.b-solution-selector form').submit(function(event) {

			event.preventDefault();

			var sectorField = $('select[name="sector"]', this),
				roleField = $('select[name="role"]', this),
				chosenSector = sectorField.val(),
				chosenRole = roleField.val();

			//validate before submit
			if(chosenSector === null){

				chosenSector === null ? sectorField.siblings('.trigger').addClass('error') : sectorField.siblings('.trigger').removeClass('error');

			} else if (chosenRole === null) {
				window.location = '/sectors/'+chosenSector;
			} else {
				window.location = '/sectors/'+chosenSector+'/'+chosenRole;
			}

		});
	};

	var _selectorWidth = function() {
		var maxWidth = $('.trigger').width();
		var widestSpan = null;
		var $element;

		$('.options li').each(function(){
			$element = $(this);
			if($element.outerWidth() > maxWidth){
				maxWidth = $element.outerWidth();
				widestSpan = $element;
			}

			$('.trigger, .options').css('width', maxWidth+'px');
		});
	};

	var _resetSelectorWidth = function(){
			$('.trigger, .options').css('width', 'auto');
	};

	var _selectorMobile = function() {
		$('.js-solution-toggle').on('click', function(event) {
			event.preventDefault();
			$(this).hide();
			$('.js-solution-container').removeClass('dont-show-me-on-phones');
		});
	};

	var _bindEvents = function(){

		 // ==== DOM READY EVENTS ==== //
        $(document).ready(function(jQuery) {



		    $(window).on('resize', function() {

				if($(window).width() > 767){
					setTimeout(function() {
						_selectorWidth();
					}, 100);
				} else {
					_resetSelectorWidth();
				}

            }).trigger('resize'); // Trigger resize handlers.
        });
        // end DOM READY

	};

	return {
		init: init
	};

})(jQuery);

