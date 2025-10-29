<?php
/**
 * Dynamic block render callback
 *
 * @package StartupTheme
 * @param array    $attributes Block attributes.
 * @param string   $content Block content.
 * @param WP_Block $block Block instance.
 * @return string Block HTML output.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$block_title              = isset( $attributes['title'] ) ? $attributes['title'] : __( 'Dynamic Block Title', 'cwp' );
$block_wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo wp_kses_post( $block_wrapper_attributes ); ?>>
	<h3><?php echo esc_html( $block_title ); ?></h3>
	<p><?php esc_html_e( 'This is dynamically rendered on the server.', 'cwp' ); ?></p>
	<p>
		<?php
		/* translators: %s: Current timestamp */
		printf( esc_html__( 'Current time: %s', 'cwp' ), esc_html( current_time( 'mysql' ) ) );
		?>
	</p>
</div>
