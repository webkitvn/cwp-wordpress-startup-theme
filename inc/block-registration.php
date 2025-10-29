<?php
/**
 * Register custom Gutenberg blocks
 *
 * @package StartupTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all custom blocks
 */
function cwp_register_blocks() {
	$blocks = array(
		'example-static',
		'example-dynamic',
	);

	foreach ( $blocks as $block ) {
		$block_path = get_template_directory() . '/blocks/' . $block;
		if ( file_exists( $block_path ) ) {
			register_block_type( $block_path );
		}
	}
}
add_action( 'init', 'cwp_register_blocks' );
