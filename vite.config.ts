import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    return {
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
            // Don't empty output directory in watch mode to avoid unnecessary file system churn
            emptyOutDir: !isDev,
            // Faster builds in development
            minify: isDev ? false : 'esbuild',
            // Don't generate sourcemaps in production, only in dev for debugging
            sourcemap: isDev ? 'inline' : false,
            // Optimize chunk size strategy
            chunkSizeWarningLimit: 2000,
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
                    // Use consistent names in dev mode for faster cache hits
                    entryFileNames: isDev ? '[name].js' : '[name].[hash].js',
                    chunkFileNames: isDev ? 'chunks/[name].js' : '[name].[hash].js',
                    assetFileNames: isDev ? '[name].[ext]' : '[name].[hash].[ext]',
                    // Better code splitting
                    manualChunks(id) {
                        // Vendor chunk for node_modules
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom')) {
                                return 'vendor-react';
                            }
                            if (id.includes('@wordpress')) {
                                return 'vendor-wordpress';
                            }
                            return 'vendor';
                        }
                    },
                },
                // Suppress warnings about circular dependencies in WordPress packages
                onwarn(warning, warn) {
                    if (
                        warning.code === 'CIRCULAR_DEPENDENCY' &&
                        warning.message.includes('@wordpress')
                    ) {
                        return;
                    }
                    warn(warning);
                },
            },
            // Optimize watch mode performance
            watch: isDev
                ? {
                        // Reduce CPU usage by excluding unnecessary files
                        exclude: ['node_modules/**', 'vendor/**', 'assets/**'],
                        // Use native file system events (faster on most systems)
                        ...(process.platform !== 'win32' && { usePolling: false }),
                  }
                : null,
            // Target modern browsers in dev, broader support in prod
            target: isDev ? 'esnext' : 'es2015',
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            },
        },
        // Optimize dependency pre-bundling
        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                '@wordpress/blocks',
                '@wordpress/block-editor',
                '@wordpress/components',
                '@wordpress/i18n',
            ],
            // Force re-optimize if needed
            force: false,
        },
        // Enable esbuild for faster transpilation
        esbuild: {
            // Use target that matches our build target
            target: isDev ? 'esnext' : 'es2015',
            // Drop console and debugger in production
            drop: isDev ? [] : ['console', 'debugger'],
            // Faster builds
            logOverride: { 'this-is-undefined-in-esm': 'silent' },
        },
        // Improve caching
        cacheDir: 'node_modules/.vite',
        // Disable clearScreen for better terminal output in watch mode
        clearScreen: false,
        // Log level
        logLevel: isDev ? 'info' : 'warn',
    };
});
