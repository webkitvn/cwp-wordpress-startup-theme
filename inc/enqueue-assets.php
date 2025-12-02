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
 * Check if Vite dev server is running
 *
 * @return bool True if dev server is running.
 */
function cwp_is_vite_dev_server_running() {
	static $is_running = null;

	if ( null !== $is_running ) {
		return $is_running;
	}

	$dev_server_url = 'http://localhost:3000';
	$response       = wp_remote_get(
		$dev_server_url,
		array(
			'timeout'    => 1,
			'sslverify'  => false,
			'user-agent' => 'WordPress',
		)
	);

	$is_running = ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response );

	return $is_running;
}

/**
 * Get asset from manifest
 *
 * @param string $asset Asset path.
 * @return string|false Asset URL or false if not found.
 */
function cwp_get_asset( $asset ) {
	if ( cwp_is_vite_dev_server_running() ) {
		return 'http://localhost:3000/' . $asset;
	}

	$manifest_path = get_template_directory() . '/assets/.vite/manifest.json';

	if ( ! file_exists( $manifest_path ) ) {
		return false;
	}

    // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$manifest = json_decode( file_get_contents( $manifest_path ), true );

	if ( ! isset( $manifest[ $asset ] ) ) {
		return false;
	}

	return get_template_directory_uri() . '/assets/' . $manifest[ $asset ]['file'];
}

/**
 * Enqueue theme scripts and styles
 */
function cwp_enqueue_assets() {
	$is_dev = cwp_is_vite_dev_server_running();

	if ( $is_dev ) {
		wp_enqueue_script( 'cwp-vite-client', 'http://localhost:3000/@vite/client', array(), null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- dev server handles cache busting
		wp_script_add_data( 'cwp-vite-client', 'type', 'module' );
	}

	$main_css = cwp_get_asset( 'src/main.css' );
	if ( $main_css ) {
		wp_enqueue_style( 'cwp-main', $main_css, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- hashed filenames provide cache busting
	}

	$main_js = cwp_get_asset( 'src/main.ts' );
	if ( $main_js ) {
		wp_enqueue_script( 'cwp-main', $main_js, array(), null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- hashed filenames provide cache busting
		wp_script_add_data( 'cwp-main', 'type', 'module' );
	}
}
add_action( 'wp_enqueue_scripts', 'cwp_enqueue_assets' );

/**
 * Enqueue block editor assets
 */
function cwp_enqueue_block_editor_assets() {
	$is_dev = cwp_is_vite_dev_server_running();

	if ( $is_dev ) {
		wp_enqueue_script( 'cwp-vite-client-editor', 'http://localhost:3000/@vite/client', array(), null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- dev server handles cache busting
		wp_script_add_data( 'cwp-vite-client-editor', 'type', 'module' );
	}

	$editor_css = cwp_get_asset( 'src/editor.css' );
	if ( $editor_css ) {
		wp_enqueue_style( 'cwp-editor', $editor_css, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- hashed filenames provide cache busting
	}
}
add_action( 'enqueue_block_editor_assets', 'cwp_enqueue_block_editor_assets' );
