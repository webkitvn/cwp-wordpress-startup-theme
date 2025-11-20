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
 *
 * Automatically registers any block with a block.json file in the blocks/ directory.
 */
function cwp_register_blocks() {
	$blocks_dir = get_stylesheet_directory() . '/blocks';

	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	$block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

	if ( empty( $block_folders ) ) {
		return;
	}

	foreach ( $block_folders as $block_path ) {
		if ( file_exists( $block_path . '/block.json' ) ) {
			register_block_type( $block_path );
		}
	}
}
add_action( 'init', 'cwp_register_blocks' );
