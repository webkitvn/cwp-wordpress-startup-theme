import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: 'blocks/*/block.json',
					dest: '../blocks',
				},
			],
		}),
	],
	build: {
		manifest: true,
		outDir: 'assets',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/main.ts'),
				'main-css': resolve(__dirname, 'src/main.css'),
				editor: resolve(__dirname, 'src/editor.css'),
				'example-static-editor': resolve(
					__dirname,
					'blocks/example-static/editor.tsx'
				),
				'example-static-view': resolve(
					__dirname,
					'blocks/example-static/view.tsx'
				),
				'example-dynamic-editor': resolve(
					__dirname,
					'blocks/example-dynamic/editor.tsx'
				),
			},
			output: {
				entryFileNames: '[name].[hash].js',
				chunkFileNames: '[name].[hash].js',
				assetFileNames: '[name].[hash].[ext]',
			},
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
});
