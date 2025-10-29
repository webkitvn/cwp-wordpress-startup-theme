## 1. Implementation
- [ ] 1.1 Initialize Composer with PHPCS, WPCS, and PHP lint scripts (PHP 8.3)
- [ ] 1.2 Initialize Node with Vite, Tailwind v4 via `@tailwindcss/vite` (no PostCSS), ESLint (@wordpress/eslint-plugin), using pnpm
- [ ] 1.3 Create theme skeleton: `style.css`, `functions.php`, `index.php`, `inc/`
- [ ] 1.3.1 Set `Text Domain: cwp` in `style.css` header; create `/languages`
- [ ] 1.3.2 Add theme setup to call `load_theme_textdomain( 'cwp', get_template_directory() . '/languages' );`
- [ ] 1.4 Add `/src` structure (TypeScript `ts/tsx`, SCSS/CSS with `@import "tailwindcss"`)
- [ ] 1.5 Configure `vite.config.ts` for manifest output and watch mode (no dev server)
- [ ] 1.6 Implement enqueue logic (manifest in all environments; no dev server)
- [ ] 1.7 Add example Gutenberg blocks (static + dynamic) with `block.json` (TypeScript sources)
- [ ] 1.7.1 Ensure each `block.json` sets `"textdomain": "cwp"`
- [ ] 1.8 Integrate block editor/frontend builds into Vite pipeline
- [ ] 1.9 Add pnpm scripts: `dev`, `build`, `lint:js`, `format`, and Composer scripts: `phpcs`, `lint:php`
    - `lint:js` warns on 400 lines: configure `max-lines` with `{ max: 400, skipBlankLines: true, skipComments: true }`
    - `lint:js:strict` errors on 500 lines: use CLI rule override `--rule "max-lines:[2,{max:500,skipBlankLines:true,skipComments:true}]"` and `--max-warnings=0`

## 2. Validation
- [ ] 2.1 Run `openspec validate add-wp-starter-theme-vite-tailwind-quality-tooling --strict`
- [ ] 2.2 Verify PHPCS passes on scaffold
- [ ] 2.3 Verify ESLint passes on scaffold
    - Standard lint warns on files > 400 lines; strict lint errors at > 500 lines
- [ ] 2.4 Verify `pnpm dev` watch writes to `/assets` and WordPress serves updates
- [ ] 2.5 Verify production build generates manifest and assets
- [ ] 2.6 Verify blocks register and load assets in editor and frontend

## 3. Docs
- [ ] 3.1 Write README with setup, dev, build, deploy, and coding standards
- [ ] 3.2 Document block scaffolding workflow


