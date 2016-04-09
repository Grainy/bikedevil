<?php
	/*
	Template Name: Builder
	*/

	if (!class_exists('Timber')){
		echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
		return;
	}

	$tweets = get_twitter_feed('BikeDevil');

	$context = Timber::get_context();
	$post = new TimberPost();

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

	$context['tweets'] = $tweets;
	$context['post'] = $post;

	$templates = array('page-templates/page-builder.twig');
	Timber::render($templates, $context);