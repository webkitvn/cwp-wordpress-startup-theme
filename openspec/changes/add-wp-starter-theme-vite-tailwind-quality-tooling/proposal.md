## Why
A modern WordPress starter theme is needed to standardize development with fast builds, modular ES6, SCSS, and the latest Tailwind CSS. Enforcing WordPress coding standards (PHPCS), ESLint, and PHP linting ensures code quality across PHP, JS, and styles. Including basic Gutenberg block examples with proper registration and builds accelerates adoption and reduces boilerplate.

## What Changes
- Scaffold a WordPress starter theme structured for `/src` authoring (TypeScript modules, SCSS) and `/assets` outputs.
- Integrate Vite for build-only workflows (no dev server/HMR) and production builds, including WordPress-appropriate asset manifest handling.
- Add Tailwind CSS v4 using the official Vite plugin (no PostCSS), with CSS `@import "tailwindcss"`.
- Provide basic Gutenberg block examples (dynamic and static) with proper `block.json`, registration, editor/frontend assets, and build integration.
- Configure PHPCS using WordPress Coding Standards, ESLint with `@wordpress/eslint-plugin`, and PHP linting via Composer (target PHP 8.3).
- Configure ESLint file length policy: warn at 400 lines in standard `lint:js`, error at 500 lines in strict/CI using CLI rule override.
- Enforce official WordPress coding standards via CI-compatible scripts and pnpm-based workflows.
 - Set theme text domain to `cwp` and load translations from `/languages`.

## Impact
- Affected specs: `theme-scaffold`, `build-tooling`, `code-quality`, `blocks`.
- Affected code: new theme skeleton files under theme root (`functions.php`, `style.css`, `index.php`, `inc/`), build config (`vite.config.ts`, Tailwind via Vite plugin), Composer + Node manifests (pnpm), and example blocks under `/blocks`. Dev uses `pnpm dev` (Vite watch) to emit assets to `/assets` and WordPress serves compiled assets via the manifest.
 - i18n: `load_theme_textdomain( 'cwp', get_template_directory() . '/languages' );` and `Text Domain: cwp` in `style.css` header; block `block.json` files use `"textdomain": "cwp"`.

## References (primary sources)
- [Tailwind CSS v4 with Vite plugin](https://tailwindcss.com/docs/installation/using-vite)
- Vite docs (build, manifest, HMR)
- WordPress Coding Standards (WPCS) and PHPCS usage
- @wordpress/eslint-plugin docs
- Gutenberg Block Editor Handbook (block.json, asset loading)


