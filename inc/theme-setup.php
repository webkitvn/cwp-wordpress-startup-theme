<?php
/**
 * Theme setup and configuration
 *
 * @package StartupTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Setup theme support and features
 */
function cwp_setup() {
	load_theme_textdomain( 'cwp', get_template_directory() . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/editor.css' );

	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary Menu', 'cwp' ),
		)
	);
}
add_action( 'after_setup_theme', 'cwp_setup' );

/**
 * Set the content width in pixels
 */
function cwp_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'cwp_content_width', 1200 );
}
add_action( 'after_setup_theme', 'cwp_content_width', 0 );
