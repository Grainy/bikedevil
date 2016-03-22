<?php

/* 
 * Template Name: Docs
*/

if (!class_exists('Timber')){
	echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
	return;
}

$context = Timber::get_context();
$post = new TimberPost();

$context['post'] = $post;
// $args = 'post_type=post&numberposts=2';
// $context['posts'] = Timber::get_posts($args);


// $latestInisghtArgs = 'post_type=post&numberposts=1';
// $context['latestInsightPost'] = Timber::get_posts($latestInisghtArgs);

// $caseStudiesArgs = 'post_type=casestudy&numberposts=3&orderby=menu_order&order=ASC';
// $context['caseStudies'] = Timber::get_posts($caseStudiesArgs);

$templates = array('page-templates/docs.twig');
Timber::render($templates, $context);
