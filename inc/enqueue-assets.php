<?php
/**
 * Enqueue scripts and styles
 *
 * @package StartupTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get asset from manifest
 *
 * @param string $asset Asset path.
 * @return string|false Asset URL or false if not found.
 */
function cwp_get_asset( $asset ) {
	$manifest_path = get_stylesheet_directory() . '/assets/.vite/manifest.json';

	if ( ! file_exists( $manifest_path ) ) {
		return false;
	}

	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$manifest = json_decode( file_get_contents( $manifest_path ), true );

	if ( ! isset( $manifest[ $asset ] ) ) {
		return false;
	}

	return get_stylesheet_directory_uri() . '/assets/' . $manifest[ $asset ]['file'];
}

/**
 * Enqueue theme scripts and styles
 */
function cwp_enqueue_assets() {
	$main_css = cwp_get_asset( 'src/main.css' );
	if ( $main_css ) {
		wp_enqueue_style( 'cwp-main', $main_css, array(), THEME_VERSION );
	}

	$main_js = cwp_get_asset( 'src/main.ts' );
	if ( $main_js ) {
		wp_enqueue_script( 'cwp-main', $main_js, array(), THEME_VERSION, true );
	}
}
add_action( 'wp_enqueue_scripts', 'cwp_enqueue_assets', 999 );

/**
 * Enqueue block editor assets
 */
function cwp_enqueue_block_editor_assets() {
	$editor_css = cwp_get_asset( 'src/editor.css' );
	if ( $editor_css ) {
		wp_enqueue_style( 'cwp-editor', $editor_css, array(), THEME_VERSION );
	}
}
add_action( 'enqueue_block_editor_assets', 'cwp_enqueue_block_editor_assets' );
