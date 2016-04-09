<?php
/**
 *  functions and definitions
 *
 * @package
 */

error_reporting(1);

use Snilius\Twig\SortByFieldExtension;

function current_url() {
  // Protocol
  $url = ( 'on' == $_SERVER['HTTPS'] ) ? 'https://' : 'http://';
  $url .= $_SERVER['SERVER_NAME'];

  // Port
  $url .= ( '80' == $_SERVER['SERVER_PORT'] ) ? '' : ':' . $_SERVER['SERVER_PORT'];
  $url .= $_SERVER['REQUEST_URI'];

  return trailingslashit( $url );
}

if( function_exists('acf_add_options_page') ) {
	acf_add_options_page('Archives');
	acf_add_options_page('Tracking Scripts');
	acf_add_options_page('Global Modules');
}

require_once dirname( __FILE__ ) . '/inc/class-tgm-plugin-activation.php';

add_action('init', 'add_rewrite_rules');


add_action( 'tgmpa_register', 'my_theme_register_required_plugins' );
/**
 * Register the required plugins for this theme.
 *
 * In this example, we register two plugins - one included with the TGMPA library
 * and one from the .org repo.
 *
 * The variable passed to tgmpa_register_plugins() should be an array of plugin
 * arrays.
 *
 * This function is hooked into tgmpa_init, which is fired within the
 * TGM_Plugin_Activation class constructor.
 */
function my_theme_register_required_plugins() {

    /**
     * Array of plugin arrays. Required keys are name and slug.
     * If the source is NOT from the .org repo, then source is also required.
     */
    $plugins = array(

        // This is an example of how to include a plugin pre-packaged with a theme.
        array(
            'name'               => 'Gravity Forms', // The plugin name.
            'slug'               => 'gravity-forms', // The plugin slug (typically the folder name).
            'source'             => get_stylesheet_directory() . '/inc/plugins/gravityforms_1.9.9.8.zip', // The plugin source.
            'required'           => true, // If false, the plugin is only 'recommended' instead of required.
            'version'            => '1.9.9.8', // E.g. 1.0.0. If set, the active plugin must be this version or higher.
            'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch.
            'force_deactivation' => false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins.
            'external_url'       => '', // If set, overrides default API URL and points to an external URL.
        ),

        // This is an example of how to include a plugin from a private repo in your theme.
        // array(
        //     'name'               => 'TGM New Media Plugin', // The plugin name.
        //     'slug'               => 'tgm-new-media-plugin', // The plugin slug (typically the folder name).
        //     'source'             => 'https://s3.amazonaws.com/tgm/tgm-new-media-plugin.zip', // The plugin source.
        //     'required'           => true, // If false, the plugin is only 'recommended' instead of required.
        //     'external_url'       => 'https://github.com/thomasgriffin/New-Media-Image-Uploader', // If set, overrides default API URL and points to an external URL.
        // ),

        // This is an example of how to include a plugin from the WordPress Plugin Repository.
        array(
            'name'               => 'Advanced Custom Fields Pro', // The plugin name.
            'slug'               => 'advanced-custom-fields', // The plugin slug (typically the folder name).
            'source'             => get_stylesheet_directory() . '/inc/plugins/advanced-custom-fields-pro.zip', // The plugin source.
            'required'           => true, // If false, the plugin is only 'recommended' instead of required.
            'version'            => '', // E.g. 1.0.0. If set, the active plugin must be this version or higher.
            'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch.
            'force_deactivation' => false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins.
            'external_url'       => '', // If set, overrides default API URL and points to an external URL.
        ),
        array(
            'name'      => 'Mobile Detect',
            'slug'      => 'wp-mobile-detect',
            'required'  => true,
        ),
        array(
            'name'      => 'Yoast SEO',
            'slug'      => 'wordpress-seo',
            'required'  => false,
        ),
        array(
            'name'      => 'W3 Total Cache',
            'slug'      => 'w3-total-cache',
            'required'  => false,
        ),
        array(
            'name'      => 'Simple History',
            'slug'      => 'simple-history',
            'required'  => false,
        ),
        array(
            'name'      => 'WP Security',
            'slug'      => 'better-wp-security',
            'required'  => false,
        )


    );

    /**
     * Array of configuration settings. Amend each line as needed.
     * If you want the default strings to be available under your own theme domain,
     * leave the strings uncommented.
     * Some of the strings are added into a sprintf, so see the comments at the
     * end of each line for what each argument will be.
     */
    $config = array(
        'default_path' => '',                      // Default absolute path to pre-packaged plugins.
        'menu'         => 'tgmpa-install-plugins', // Menu slug.
        'has_notices'  => true,                    // Show admin notices or not.
        'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
        'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
        'is_automatic' => false,                   // Automatically activate plugins after installation or not.
        'message'      => '',                      // Message to output right before the plugins table.
        'strings'      => array(
            'page_title'                      => __( 'Install Required Plugins', 'tgmpa' ),
            'menu_title'                      => __( 'Install Plugins', 'tgmpa' ),
            'installing'                      => __( 'Installing Plugin: %s', 'tgmpa' ), // %s = plugin name.
            'oops'                            => __( 'Something went wrong with the plugin API.', 'tgmpa' ),
            'notice_can_install_required'     => _n_noop( 'This theme requires the following plugin: %1$s.', 'This theme requires the following plugins: %1$s.' ), // %1$s = plugin name(s).
            'notice_can_install_recommended'  => _n_noop( 'This theme recommends the following plugin: %1$s.', 'This theme recommends the following plugins: %1$s.' ), // %1$s = plugin name(s).
            'notice_cannot_install'           => _n_noop( 'Sorry, but you do not have the correct permissions to install the %s plugin. Contact the administrator of this site for help on getting the plugin installed.', 'Sorry, but you do not have the correct permissions to install the %s plugins. Contact the administrator of this site for help on getting the plugins installed.' ), // %1$s = plugin name(s).
            'notice_can_activate_required'    => _n_noop( 'The following required plugin is currently inactive: %1$s.', 'The following required plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
            'notice_can_activate_recommended' => _n_noop( 'The following recommended plugin is currently inactive: %1$s.', 'The following recommended plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
            'notice_cannot_activate'          => _n_noop( 'Sorry, but you do not have the correct permissions to activate the %s plugin. Contact the administrator of this site for help on getting the plugin activated.', 'Sorry, but you do not have the correct permissions to activate the %s plugins. Contact the administrator of this site for help on getting the plugins activated.' ), // %1$s = plugin name(s).
            'notice_ask_to_update'            => _n_noop( 'The following plugin needs to be updated to its latest version to ensure maximum compatibility with this theme: %1$s.', 'The following plugins need to be updated to their latest version to ensure maximum compatibility with this theme: %1$s.' ), // %1$s = plugin name(s).
            'notice_cannot_update'            => _n_noop( 'Sorry, but you do not have the correct permissions to update the %s plugin. Contact the administrator of this site for help on getting the plugin updated.', 'Sorry, but you do not have the correct permissions to update the %s plugins. Contact the administrator of this site for help on getting the plugins updated.' ), // %1$s = plugin name(s).
            'install_link'                    => _n_noop( 'Begin installing plugin', 'Begin installing plugins' ),
            'activate_link'                   => _n_noop( 'Begin activating plugin', 'Begin activating plugins' ),
            'return'                          => __( 'Return to Required Plugins Installer', 'tgmpa' ),
            'plugin_activated'                => __( 'Plugin activated successfully.', 'tgmpa' ),
            'complete'                        => __( 'All plugins installed and activated successfully. %s', 'tgmpa' ), // %s = dashboard link.
            'nag_type'                        => 'updated' // Determines admin notice type - can only be 'updated', 'update-nag' or 'error'.
        )
    );

    tgmpa( $plugins, $config );

}



function asset_path($filename) {

    $manifest_path = get_template_directory() . '/build/rev-manifest.json';

    //echo $manifest_path;

    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), TRUE);
       //echo "found";
    } else {
        $manifest = [];
        //echo " not found";
    }

    if (array_key_exists($filename, $manifest)) {
        return $manifest[$filename];
    } else {
    	return $filename;
    }

}

function getAssetRevID($string){

	$parts = explode("-", $string);
	$res = $parts[count($parts) -1];
	return explode('.', $res)[0];

}

function injectCSS($slug){

	$revvedFile     = get_template_directory() . "/app/css/". asset_path($slug . ".css");
	$nonRevvedFile  = get_template_directory_uri() . "/app/css/". $slug . ".css";
	$assetRevID     = getAssetRevID(asset_path($slug . ".css"));

	if(file_exists(  $revvedFile )){

		$cssFilePath = get_template_directory_uri() . "/app/css/". asset_path($slug . ".css");

	} else {

		$cssFilePath = $nonRevvedFile;

	}

	if(isset($_COOKIE["css_" . $assetRevID]) && $_COOKIE["css_" . $assetRevID] === 'true' ){

		echo "<link rel='stylesheet' href='" . $cssFilePath . "'>";

	} else {

		echo "<script>
			var stylesheet = loadCSS('". $cssFilePath . "');
			onloadCSS( stylesheet, function() {
	            var expires = new Date(+new Date + (7 * 24 * 60 * 60 * 1000)).toUTCString();
	            document.cookie = 'css_" . $assetRevID . "=true; expires=' + expires;
	        });
        </script>";
	}

}



if (!class_exists('Timber')){
	add_action( 'admin_notices', function(){
		echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . admin_url('plugins.php#timber') . '">' . admin_url('plugins.php') . '</a></p></div>';
	});
	return;
}
class StarterSite extends TimberSite {
	function __construct(){
		add_theme_support('post-formats');
		add_theme_support('post-thumbnails');
		add_theme_support('menus');
		add_filter('timber_context', array($this, 'add_to_context'));
		add_filter('get_twig', array($this, 'add_to_twig'));
		parent::__construct();
	}
	function register_post_types(){
		//this is where you can register custom post types
	}
	function register_taxonomies(){
		//this is where you can register custom taxonomies
	}
	function add_to_context($context){
		$context['foo'] = 'bar';
		$context['stuff'] = 'I am a value set in your functions.php file';
		$context['notes'] = 'These values are available everytime you call Timber::get_context();';
		$context['primaryNav'] = new TimberMenu('primary');
		$context['footerNav'] = new TimberMenu('footer');
		$context['netsuiteNav'] = new TimberMenu('netsuite');
		$context['DummyJobsData'] = array  (
								array("title" => "Bar Manager", "location" => "Liverpool", "type" => "Full Time", "desc" => "Duis eu pulvinar orci. Sed laoreet diam vitae sapien finibus vehicula. Nunc porta tempor condimentum", "jobID" => "877627"),
								array("title" => "Head Chef", "location" => "Liverpool", "type" => "Full Time", "desc" => "Duis eu pulvinar orci. Sed laoreet diam vitae sapien finibus vehicula. Nunc porta tempor condimentum", "jobID" => "877628"),
								array("title" => "Sales Manager", "location" => "Liverpool", "type" => "Full Time", "desc" => "Duis eu pulvinar orci. Sed laoreet diam vitae sapien finibus vehicula. Nunc porta tempor condimentum", "jobID" => "877629")
							);

		$context['site'] = $this;
		$context['options'] = get_fields('options');
		$context['currentUrl'] = current_url();
		return $context;
	}

	function add_to_twig($twig){
		/* this is where you can add your own fuctions to twig */
		$twig->addExtension(new SortByFieldExtension());
		return $twig;
	}
}
new StarterSite();
// function myfoo($text){
// 	$text .= ' bar!';
// 	return $text;
// }



/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 640; /* pixels */
}

if ( ! function_exists( '_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function _setup() {

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on , use a find and replace
	 * to change '' to the name of your theme in all the template files
	 */
	load_theme_textdomain( '', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	//add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(

		'primary' => __( 'Primary Menu', '' ),
		'footer' => __( 'Footer Menu', '' ),
		'netsuite' => __( 'NetSuite Menu', '' )

	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 * See http://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside', 'image', 'video', 'quote', 'link',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( '_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif; // _setup
add_action( 'after_setup_theme', '_setup' );

/**
 * Register widget area.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 */
function _widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', '' ),
		'id'            => 'sidebar-1',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h1 class="widget-title">',
		'after_title'   => '</h1>',
	) );
}
add_action( 'widgets_init', '_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function _scripts() {
	//wp_enqueue_style( '-style', get_stylesheet_uri() );
	if (get_post_type() == 'posts') {
		$this_tax = 'events_category';
	} else if (get_post_type() == 'careers') {
		$this_tax = 'careers_category';
	} else {
		$this_tax = '';
	}

	$pageTemplate = get_page_template();
	$pageArray = explode("/", $pageTemplate); 
	$pageTemplate = end($pageArray);

	wp_enqueue_script('jquery');
	wp_enqueue_script( 'js-core', get_template_directory_uri() . '/build/js/core.min.js', array(), '20120206', true );
	wp_enqueue_script( 'js-app', get_template_directory_uri() . '/build/js/app.min.js', array(), '20130115', true );

	wp_localize_script( 'js-app', 'MyAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'resturl' => get_bloginfo('wpurl').'/api/' ) );
    wp_localize_script( 'js-app', 'Directory', array( 'url' => get_bloginfo('template_directory'), 'site' => get_bloginfo('wpurl'), 'home' => get_bloginfo('url')) );
    wp_localize_script( 'js-app', 'post_type', get_post_type() );
    wp_localize_script( 'js-app', 'this_tax', $this_tax );
    wp_localize_script( 'js-app', 'is_archive', is_archive() );
    wp_localize_script( 'js-app', 'is_home', is_home() );
    wp_localize_script( 'js-app', 'is_front', is_page_template('page.php' ) );
    wp_localize_script( 'js-app', 'is_device', wpmd_is_device() );

    if($pageTemplate == 'page.php') :
    	wp_localize_script( 'js-app', 'is_news', true );
    else:
    	wp_localize_script( 'js-app', 'is_news', false );
    endif;


	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	// wp_enqueue_style( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' );
}
add_action( 'wp_enqueue_scripts', '_scripts' );

/**
 * Implement the Custom Header feature.
 */
//require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';



/**
 * Register required ACF
 */
require get_template_directory() . '/inc/setup/acf-reg.php';


// Grav forms placeholder support
add_action("gform_field_standard_settings", "my_standard_settings", 10, 2);

function my_standard_settings($position, $form_id){
	// Create settings on position 25 (right after Field Label)
	if($position == 25){
?>

<li class="admin_label_setting field_setting" style="display: list-item; ">
	<label for="field_placeholder">Placeholder Text
		<a href="javascript:void(0);" class="tooltip tooltip_form_field_placeholder" tooltip="&lt;h6&gt;Placeholder&lt;/h6&gt;Enter the placeholder/default text for this field.">(?)</a>
	</label>
	<input type="text" id="field_placeholder" class="fieldwidth-3" size="35" onkeyup="SetFieldProperty('placeholder', this.value);">
</li>

<?php
	}
}

/* Now we execute some javascript technicalitites for the field to load correctly */
add_action("gform_editor_js", "my_gform_editor_js");

function my_gform_editor_js(){
?>

<script>
//binding to the load field settings event to initialize the checkbox
jQuery(document).bind("gform_load_field_settings", function(event, field, form){
	jQuery("#field_placeholder").val(field["placeholder"]);
});
</script>

<?php
}

/* We use jQuery to read the placeholder value and inject it to its field */
add_action('gform_enqueue_scripts',"my_gform_enqueue_scripts", 10, 2);

function my_gform_enqueue_scripts($form, $is_ajax=false){
?>
<script>

jQuery(function(){
<?php

/* Go through each one of the form fields */

foreach($form['fields'] as $i => $field) {

/* Check if the field has an assigned placeholder */

if(isset($field['placeholder']) && !empty($field['placeholder'])){

/* If a placeholder text exists, inject it as a new property to the field using jQuery */

?>

jQuery('#input_<?php echo $form['id']?>_<?php echo $field['id']?>').attr('placeholder','<?php echo $field['placeholder']?>');

<?php
}
}
?>
});
</script>
<?php
}

// *** CREATE BESKPOKE GFORM BUTTONS ***
add_filter( 'gform_submit_button', 'club_form_submit_button', 10, 2 );
function club_form_submit_button( $button, $form ) {
    return "<button class='b-button b-button--tertiary b-button--submit'>Request a callback</button>";
}

// *** IMAGE SIZES ***
if(function_exists('add_image_size') ) {
	add_image_size('archive_thumb', 350, 250, true);
}

add_filter('json_prepare_post', 'json_api_encode_acf');

function json_api_encode_acf($post) {
	$thumb_id = get_post_thumbnail_id($post['ID']);
	$thumb_url_array = wp_get_attachment_image_src($thumb_id, 'archive_thumb', true);
	$thumb_url = $thumb_url_array[0];

    $acf   = get_fields($post['ID']);

    if (isset($post)) {
    	$post['thumb_url'] = $thumb_url;
    	$post['acf'] = $acf;
    }

    return $post;
}

function get_twitter_feed($q)
{
    $twitterPath = locate_template('tweets.php' );

    if(empty($twitterPath)) return;

    require_once($twitterPath);

    $tweets = get_latest_tweets($q,
        "0iHLv05OwZjMsmONaNOGN35sf",                             // Customer Key
        "h0OqzS8OhEg6LGtozqiQiJAVgYJmdSIbaiZ9POrfH5CrqzSQkY",    // Customer Secret
        "227463482-Ebh3iflZHPebyUsvTr4DTzZJPOtx81lwZH5RcMZ8",    // Access Token
        "6rJ2G7ykbYMztNbrm4Bkqu9deHvk1q6wp3tc4NwwfQKtQ",         // Access Token Secret
        null,                                                    // Cache file (null = default)
        0,                                                       // Seconds to cache feed (Default : 10 minute)
        4,                                                       // Number of tweets you would like to display. (Default : 5)
        true,                                                    // Ignore replies from the timeline. (Default : false)
        true                                                     // Include retweets. (Default : false)
    );

    return $tweets;
}
