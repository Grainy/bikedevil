<?php
/**
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */
$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;
$context['wp_title'] .= ' - ' . $post->title();
$context['author_image_url'] = get_avatar($post->post_author, 46);
$context['comment_form'] = TimberHelper::get_comment_form();

$context['args'] = array (
	'container'       => 'nav',
	'before'          => '',
	'after'           => '',
	'show_on_front'   => true,
	'network'         => false,
	'show_title'      => true,
	'show_browse'     => false,
	'echo'            => true
);

$relatedArgs = array(
	'post_type' => 'events',
	'category__in' => wp_get_post_categories($post->ID),
	'numberposts' => 3,
	'post__not_in' => array($post->ID)
);

$popularArgs = array(
	'posts_per_page' => 5, 
	'meta_key' => 'wpb_post_views_count', 
	'orderby' => 'meta_value_num', 
	'order' => 'DESC'
);

$context['popularPosts'] = Timber::get_posts($popularArgs);
$context['relatedPosts'] = Timber::get_posts($relatedArgs);

$context['postType'] = get_post_type();

Timber::render( array( 'post/single-' . $post->ID . '.twig', 'post/single-' . $post->post_type . '.twig', 'post/single.twig' ), $context );
