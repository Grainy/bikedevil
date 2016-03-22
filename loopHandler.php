<?php

// Our include
define('WP_USE_THEMES', false);
require_once('../../../wp/wp-load.php');

// Our variables
$type = 'events';
$numPosts = (isset($_GET['numPosts'])) ? $_GET['numPosts'] : 0;
$page = (isset($_GET['pageNumber'])) ? $_GET['pageNumber'] : 0;

query_posts(array(
	'post_type'		 => $type,
	'posts_per_page' => $numPosts,
	'paged'          => $page
));

// our loop
if (have_posts()) {
	while (have_posts()){
		the_post();
		get_template_part( 'content', get_post_format() );
	}
}
wp_reset_query();
?>
