/**
 * Frontend JavaScript for static block
 */

document.addEventListener('DOMContentLoaded', () => {
	const blocks = document.querySelectorAll('.wp-block-cwp-example-static');
	blocks.forEach((block) => {
		console.log('Static block loaded:', block);
	});
});
