import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { basename, resolve } from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isBuild = command === 'build';
	const isDevMode = mode !== 'production';

	const devServerHost = env.VITE_DEV_SERVER_HOST ?? 'localhost';
	const devServerPort = Number(env.VITE_DEV_SERVER_PORT ?? '3000');
	const devServerProtocol = env.VITE_DEV_SERVER_PROTOCOL ?? 'http';
	const wpOrigin = env.VITE_WP_URL ?? 'http://localhost';
	const themeDirName = env.VITE_THEME_NAME ?? basename(process.cwd());

	const basePath = `/wp-content/themes/${themeDirName}/assets/`;

	return {
		base: isBuild ? basePath : '/',
		server: {
			host: devServerHost,
			port: devServerPort,
			strictPort: false,
			cors: true,
			origin: wpOrigin,
			hmr: {
				host: devServerHost,
				port: devServerPort,
				protocol: devServerProtocol === 'https' ? 'wss' : 'ws',
			},
		},
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
			sourcemap: isDevMode ? 'inline' : false,
			minify: !isDevMode ? 'esbuild' : false,
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
					manualChunks: isBuild
						? {
								'vendor-react': ['react', 'react-dom'],
								'vendor-wordpress': [
									'@wordpress/blocks',
									'@wordpress/block-editor',
									'@wordpress/components',
									'@wordpress/i18n',
								],
						  }
						: undefined,
				},
			},
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
			},
		},
		optimizeDeps: {
			include: [
				'react',
				'react-dom',
				'@wordpress/blocks',
				'@wordpress/block-editor',
				'@wordpress/components',
				'@wordpress/i18n',
			],
		},
	};
});
