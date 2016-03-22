<?php
/**
 * The template for displaying Archive pages.
 *
 * Used to display archive-type pages if nothing more specific matches a query.
 * For example, puts together date-based pages if no date.php file exists.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.2
 */

$templates = array( 'archive.twig', 'index.twig' );
$data = Timber::get_context();
$data['title'] = 'Archive';
if ( is_day() ) {
	$data['title'] = 'Archive: '.get_the_date( 'D M Y' );
} else if ( is_month() ) {
	$data['title'] = 'Archive: '.get_the_date( 'M Y' );
} else if ( is_year() ) {
	$data['title'] = 'Archive: '.get_the_date( 'Y' );
} else if ( is_tag() ) {
	$data['title'] = single_tag_title( '', false );
} else if ( is_author() ) {

	$author = get_userdata( get_query_var('author'));
	//print_r($author);
	//$data['authorMeta'] = $author;
	$data['authorImage'] = get_avatar($author->ID, 46);

} else if ( is_category() ) {
	$data['title'] = single_cat_title( '', false );
	$cat = get_category( get_query_var( 'cat' ) );
	$cat_id = $cat->cat_ID;
	$cat_name = $cat->name;
	$data['cat_slug'] = $cat->slug;
	$data['pagination'] = Timber::get_pagination();
	array_unshift( $templates, 'archive-' . get_query_var( 'cat' ) . '.twig' );
} else if ( is_post_type_archive() ) {
	$data['title'] = post_type_archive_title( '', false );
	//$data['archive_intro_text'] = get_field( get_post_type() . '_intro_text', 'option');
	array_unshift( $templates, 'archive-' . get_post_type() . '.twig' );
}

$data['posts'] = Timber::get_posts();

Timber::render( $templates, $data );
