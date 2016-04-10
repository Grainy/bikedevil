var ajaxLoop = (function($) {
	var self = this;

	var init = function() {
		_bind();
	};

	var _bind = function() {
		var posts_per_page = 3; // How many posts to show at once
		var page = 1; 			// Current page
		var loading = false;	// Is a request being made?
		var filter = null; 		// Filter posts by (default : null)
		var category = 'Latest Posts';
		var maxPages; 			// Amount of pages in archive
		var url; 				// URL to pass to ajax request
		var date; 				// Date of creation
		var initialLoad = true;

		if (page == 1) {
			posts_per_page = 4;
		}

		var load_posts = function(filter, category){
			if (loading === false) {
				loading = true;

				if (filter) {
					url = '/wp-json/posts?type=post&filter[category_name]='+ filter +'&filter[posts_per_page]='+posts_per_page+'&page='+page;
				} else {
					url = '/wp-json/posts?type=post&filter[posts_per_page]='+posts_per_page+'&page='+page;
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

						var divideBy = posts_per_page - 1;

						if (initialLoad) {
							divideBy = posts_per_page - 1;	
						} else {
							divideBy = posts_per_page;
						}


						maxPages = request.getResponseHeader('X-WP-Total') / divideBy;

						// Hide loading gif
						$('.loading').hide();

						for (var i = 0; i < data.length; i++) {
							// Get first 20 words of content
							var excerpt = data[i].content.replace(/<\/?[^>]+>/gi, '');
								excerpt = excerpt.split(' ').slice(0,20).join(' ');

							// Format date
							date = moment(data[i].date).fromNow();

							console.log('Post: ' + initialLoad);

							if (i === 0 && initialLoad) {
								$('.l-archive__row').before('<h2 class="col-md-6 l-archive__title"><a href="#">'+ category +'</a></h2>'
								);

								$('.l-archive__row').prepend(
										
										'<div class="col-sm-12 l-archive__post l-archive__post--featured l-archive__post--'+i+'">'+
											'<a href="'+ data[i].link +'" class="l-archive__post--thumb-container">'+
												'<img src="'+ data[i].thumb_url +'" alt="" class="l-archive__post--thumb">'+
											'</a>'+
											'<div class="l-archive__post--container">'+
												'<h3 class="l-archive__post--title"><a href="'+ data[i].link +'">'+ data[i].title +'</a></h3>'+
												'<p class="l-archive__post--meta">from '+ data[i].author.name + " | " + date +'</p>'+
												'<p class="l-archive__post--excerpt">'+ excerpt +'</p>'+
												'<a href="'+ data[i].link +'" class="b-button">Read More</a>'+
											'</div>'+
										'</div>'
								);
							} else {
								if ($('.l-archive__post--featured').length < 1) {
									$('.l-archive__row').prepend('<div class="l-archive__post--featured"></div>');
								}

								$('.l-archive__post--featured').after(
										'<div class="col-sm-4 l-archive__post l-archive__post--'+i+'">'+
											'<a href="'+ data[i].link +'">'+
												'<img src="'+ data[i].thumb_url +'" alt="" class="l-archive__post--thumb">'+
											'</a>'+
											'<div class="l-archive__post--container js-match-height">'+
												'<h3 class="l-archive__post--title"><a href="'+ data[i].link +'">'+ data[i].title +'</a></h3>'+
												'<p class="l-archive__post--meta">from '+ data[i].author.name +
												'<p class="l-archive__post--date">'+ date +
											'</div>'+
										'</div>'
								);
							}



							$('.l-archive__post--'+i).fadeIn(500);
						}

						$('.js-match-height').matchHeight();

						if(page === maxPages) {
							$('.js-load-more').hide();
						} else {
							$('.js-load-more').show();
						}

						page++;          // Increment page
						initialLoad = false;
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
			var thisText = $(this).text();
			var filter;
			var category;

			// If all, show all posts
			if (thisCat === 'all') {
				filter = null;
				category = 'Latest News';
			} else {
				filter = thisCat;
				category = thisText;
			}

			$('.l-archive__title').remove();
			$('.l-archive__row').empty();

			//Reset pagination
			page = 1;
			initialLoad = true;
			load_posts(filter, category);
		});

		$('.js-archive-filter').on('change.fs', function () {
		    var thisCat = this.value;
		    var thisText = this.text();
		    var filter;
		    var caetgory;

		    // If all, show all posts
		    if (thisCat === 'all') {
		    	filter = null;
		    	category = 'Latest News';
		    } else {
		    	filter = thisCat;
		    	category = thisText;
		    }

		    $('.l-archive__title').remove();
		    $('.l-archive__row').empty();

		    //Reset pagination
		    page = 1;
		    initialLoad = true;
		    load_posts(filter, category);
		});

		if (is_archive && is_news === true) {
			$(window).scroll(function() {
				if(page <= maxPages && $(window).scrollTop() + $(window).height() == $(document).height() && is_device === null) {
					load_posts(filter);
				}
			});
		}

		$('.js-load-more').on('click', function(event) {
			event.preventDefault();

			if(page <= maxPages) {
				load_posts(filter);
			}
		});


		load_posts(filter, category);
	};

	return {
		init: init
	};

})(jQuery);

