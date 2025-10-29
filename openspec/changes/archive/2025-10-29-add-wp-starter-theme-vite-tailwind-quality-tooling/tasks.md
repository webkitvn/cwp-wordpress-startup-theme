## 1. Implementation
- [x] 1.1 Initialize Composer with PHPCS, WPCS, and PHP lint scripts (PHP 8.3)
- [x] 1.2 Initialize Node with Vite, Tailwind v4 via `@tailwindcss/vite` (no PostCSS), ESLint (@wordpress/eslint-plugin), Prettier with tabs, using pnpm
- [x] 1.3 Create theme skeleton: `style.css`, `functions.php`, `index.php`, `inc/`
- [x] 1.3.1 Set `Text Domain: cwp` in `style.css` header
- [x] 1.4 Add `/src` structure (TypeScript `ts/tsx`, SCSS/CSS with `@import "tailwindcss"`)
- [x] 1.5 Configure `vite.config.ts` for manifest output and watch mode (no dev server)
- [x] 1.6 Implement enqueue logic (manifest in all environments; no dev server)
- [x] 1.7 Add example Gutenberg blocks (static + dynamic) with `block.json` (TypeScript sources)
- [x] 1.7.1 Ensure each `block.json` sets `"textdomain": "cwp"`
- [x] 1.8 Integrate block editor/frontend builds into Vite pipeline
- [x] 1.9 Add pnpm scripts: `dev`, `build`, `lint:js`, `lint:js:strict`, `format`, and Composer scripts: `phpcs`, `lint:php`
    - `lint:js` warns on 400 lines, scoped to `/src`: configure `max-lines` with `{ max: 400, skipBlankLines: true, skipComments: true }`
    - `lint:js:strict` errors on 500 lines: use CLI rule override `--rule "max-lines:[2,{max:500,skipBlankLines:true,skipComments:true}]" --max-warnings=0`
    - `format` runs Prettier with tab indentation

## 2. Validation
- [x] 2.1 Run `openspec validate add-wp-starter-theme-vite-tailwind-quality-tooling --strict`
- [x] 2.2 Verify PHPCS passes on scaffold
- [x] 2.3 Verify ESLint passes on scaffold (scoped to `/src`)
    - Standard lint warns on files > 400 lines; strict lint errors at > 500 lines
- [x] 2.4 Verify Prettier formats code with tabs
- [x] 2.5 Verify `pnpm dev` watch writes to `/assets` and WordPress serves updates
- [x] 2.6 Verify production build generates manifest and assets
- [x] 2.7 Verify blocks register and load assets in editor and frontend

## 3. Docs
- [x] 3.1 Write README with setup, dev, build, deploy, and coding standards
- [x] 3.2 Document block scaffolding workflow


