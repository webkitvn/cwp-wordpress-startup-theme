import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
	const isDev = mode === 'development';

	return {
		plugins: [
			tailwindcss(),
			viteStaticCopy({
				targets: [
					{
						src: 'src/images/*',
						dest: 'images',
					},
				],
			}),
		],
		css: {
			devSourcemap: isDev,
		},
		build: {
			manifest: true,
			outDir: 'assets',
			emptyOutDir: true,
			minify: !isDev,
			sourcemap: isDev,
			rollupOptions: {
				input: {
					main: resolve(__dirname, 'src/main.ts'),
					'main-css': resolve(__dirname, 'src/main.css'),
					editor: resolve(__dirname, 'src/editor.css'),
				},
				output: {
					entryFileNames: isDev ? '[name].js' : '[name].[hash].js',
					chunkFileNames: isDev ? '[name].js' : '[name].[hash].js',
					assetFileNames: isDev ? '[name].[ext]' : '[name].[hash].[ext]',
				},
			},
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
			},
		},
	};
});
