<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @package
 */

$templates = array( 'views/page-templates/404.twig' );
$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
Timber::render( $templates, $context );
