var ajaxLoop = (function($) {
	var self = this;

	var init = function() {
		_bind();
	};

	var _bind = function() {
		var posts_per_page = -1; // How many posts to show at once
		var page = 1; 			// Current page
		var loading = false;	// Is a request being made?
		var filter = null; 		// Filter posts by (default : null)
		var maxPages; 			// Amount of pages in archive
		var url; 				// URL to pass to ajax request
		var date; 				// Date of event cpt

		if (is_device) {
			posts_per_page = 3;
		}

		var load_posts = function(filter){
			if (loading === false) {
				loading = true;

				if (filter) {
					url = '/wp-json/posts?type='+post_type+'&filter[taxonomy]='+this_tax+'&filter[term]='+filter;
				} else {
					url = '/wp-json/posts?type='+post_type+'&filter[posts_per_page]='+posts_per_page+'&page='+page;
				}


				$.ajax( {
					type       : 'GET',
					url  	   : url,
					dataType   : 'json',

					beforeSend: function() {
						// Show loading gif
						$('.loading').show();
						$('.js-load-more').hide();
					},

					success: function ( data, textStatus, request ) {
						// Get amount of posts and divide by how many posts per page
						maxPages = request.getResponseHeader('X-WP-Total') / posts_per_page;

						// Hide loading gif
						$('.loading').hide();

						for (var i = 0; i < data.length; i++) {
							// Get first 20 words of content
							var excerpt = data[i].content.replace(/<\/?[^>]+>/gi, '');
								excerpt = excerpt.split(' ').slice(0,20).join(' ');

							// Format date
							if (data[i].acf.event_date) {
								date = moment(data[i].acf.event_date, "DD/MM/YYYY").format('MMMM Do YYYY');
							}

							$('.l-archive__row').append(
									'<div class="col-sm-4 l-archive__post l-archive__post--'+i+'">'+
										'<a href="'+ data[i].link +'">'+
											'<img src="'+ data[i].thumb_url +'" alt="" class="l-archive__post--thumb">'+
										'</a>'+
										'<div class="l-archive__post--container js-match-height">'+
											'<h3 class="l-archive__post--title"><a href="'+ data[i].link +'">'+ data[i].title +'</a></h3>'+
											(date ? '<p class="l-archive__post--date">'+ date +' at '+ data[i].acf.event_time+'</p>' : '') +
											'<p class="l-archive__post--excerpt">'+ excerpt +'</p>'+
											'<a href="'+ data[i].link +'" class="l-archive__post--link">Continue Reading</a>'+
										'</div>'+
									'</div>'
							);

							$('.l-archive__post--'+i).fadeIn(500);
						}

						$('.js-match-height').matchHeight();

						if(page === maxPages) {
							$('.js-load-more').hide();
						} else {
							$('.js-load-more').show();
						}

						page++;          // Increment page
						loading = false; // Request finished
					},

					error     : function(jqXHR, textStatus, errorThrown) {
						// Hide loading gif
						$('.loading').hide();

					},
				});
			}
		};

		$('[data-cat]').on('click', function(event) {
			event.preventDefault();
			var thisCat = $(this).data('cat');
			var filter;

			// If all, show all posts
			if (thisCat === 'all') {
				filter = '';
			} else {
				filter = thisCat;
			}

			$('.l-archive__row').empty();

			//Reset pagination
			page = 1;

			load_posts(filter);
		});

		$('.js-archive-filter').on('change.fs', function () {
		    var thisCat = this.value;
		    var filter;

		    // If all, show all posts
		    if (thisCat === 'all') {
		    	filter = '';
		    } else {
		    	filter = thisCat;
		    }

		    $('.l-archive__row').empty();

		    //Reset pagination
		    page = 1;

		    load_posts(filter);
		});

		$(window).scroll(function() {
			if(page <= maxPages && $(window).scrollTop() + $(window).height() == $(document).height() && is_device === null) {
				load_posts(filter);
			}
		});

		$('.js-load-more').on('click', function(event) {
			event.preventDefault();

			if(page <= maxPages) {
				load_posts(filter);
			}
		});


		load_posts(filter);
	};

	return {
		init: init
	};

})(jQuery);

