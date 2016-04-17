var gallery = (function($) {
 	var switched = false;

 	var init = function() {
 		_lightbox();
 	};

 	var _lightbox = function() {
 		$('.lightbox').magnificPopup({
 		  delegate: 'a',
 		  type: 'image',

 		  gallery: {
 		    enabled: true
 		  },
 		});

 		$('.popup-modal').magnificPopup({
 			type: 'inline',
 			preloader: false,
 			focus: '#username',
 			modal: true
 		});
 		$(document).on('click', '.popup-modal-dismiss', function (e) {
 			e.preventDefault();
 			$.magnificPopup.close();
 		});
 	};

	return {
		init: init
	};

})(jQuery);

gallery.init();
