<?php
/**
 * Theme functions and definitions
 *
 * @package StartupTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'THEME_VERSION', '1.0.0' );

require_once get_template_directory() . '/inc/theme-setup.php';
require_once get_template_directory() . '/inc/enqueue-assets.php';
require_once get_template_directory() . '/inc/block-registration.php';
