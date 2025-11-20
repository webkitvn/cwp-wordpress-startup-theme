import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { existsSync, readdirSync } from 'fs';

const BLOCKS_DIR = resolve(__dirname, 'blocks');

function getBlockFolders() {
    if (!existsSync(BLOCKS_DIR)) {
        return [];
    }

    return readdirSync(BLOCKS_DIR, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
}

// Dynamically discover block entry points
function getBlockEntryPoints() {
    const entries: Record<string, string> = {};

    for (const blockName of getBlockFolders()) {
        const blockPath = resolve(BLOCKS_DIR, blockName);
        const editorFile = resolve(blockPath, 'editor.tsx');
        const viewFile = resolve(blockPath, 'view.tsx');

        if (existsSync(editorFile)) {
            entries[`${blockName}-editor`] = editorFile;
        }

        if (existsSync(viewFile)) {
            entries[`${blockName}-view`] = viewFile;
        }
    }

    return entries;
}

function hasBlockManifests() {
    return getBlockFolders().some((blockName) =>
        existsSync(resolve(BLOCKS_DIR, blockName, 'block.json'))
    );
}

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    const plugins = [tailwindcss()];

    // Only add static copy plugin in production if there are blocks to copy
    if (!isDev && hasBlockManifests()) {
        plugins.push(
            viteStaticCopy({
                targets: [
                    {
                        src: 'blocks/*/block.json',
                        dest: '../blocks',
                    },
                ],
            })
        );
    }

    const blockEntries = getBlockEntryPoints();

    return {
        plugins,
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
                    ...blockEntries,
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
