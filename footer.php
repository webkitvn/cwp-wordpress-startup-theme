<?php
/**
 * The footer template
 *
 * @package StartupTheme
 */

?>

	<footer id="colophon" class="site-footer">
		<div class="site-info">
			<?php
			printf(
				/* translators: %s: WordPress link */
				esc_html__( 'Powered by %s', 'cwp' ),
				'<a href="' . esc_url( __( 'https://wordpress.org/', 'cwp' ) ) . '">WordPress</a>'
			);
			?>
		</div>
	</footer>
</div>

<?php wp_footer(); ?>

</body>
</html>
