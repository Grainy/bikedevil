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

if ( is_post_type_archive() ) {
	$data['title'] = post_type_archive_title( '', false );
	$data['archive_intro_text'] = get_field( 'events_intro_text', 'option');
	array_unshift( $templates, 'archive-' . get_post_type() . '.twig' );
}

$args = array(
    'post_type' => 'events',
    'posts_per_page' => 3
);

$data['postType']   = 'events';
$data['categories'] = Timber::get_terms('events_category');
$data['posts']      = Timber::get_posts($args);


Timber::render( $templates, $data );
