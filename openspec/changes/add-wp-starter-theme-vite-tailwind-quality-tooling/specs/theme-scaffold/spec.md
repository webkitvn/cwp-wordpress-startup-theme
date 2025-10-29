## ADDED Requirements

### Requirement: Theme Skeleton Layout
The theme SHALL provide a modern skeleton with `/src` for sources and `/assets` for built artifacts, including core WordPress entry points and `inc/` for modular PHP.

#### Scenario: Theme files present
- **WHEN** the repository is cloned
- **THEN** the theme contains `style.css`, `functions.php`, `index.php`, `screenshot.png` (placeholder), and an `inc/` directory
- **AND** authoring sources exist under `/src` with `ts/`, `tsx/`, and `scss/` (Tailwind imported via CSS `@import "tailwindcss"`)
- **AND** build outputs are emitted under `/assets` and are not committed to source control

### Requirement: Text Domain and i18n
The theme MUST use the text domain `cwp`, declare it in the theme header, and load translations from `/languages`.

#### Scenario: Text domain declared and loaded
- **WHEN** the theme initializes
- **THEN** `style.css` header includes `Text Domain: cwp`
- **AND** `load_theme_textdomain( 'cwp', get_template_directory() . '/languages' );` is called during setup

### Requirement: Asset Enqueueing
The theme MUST enqueue built CSS/JS using the Vite manifest for all environments (no dev server/HMR).

#### Scenario: Enqueue via manifest
- **WHEN** `wp_enqueue_scripts` runs
- **THEN** the theme resolves URLs from `assets/manifest.json` and enqueues versioned assets with `wp_enqueue_style` and `wp_enqueue_script`

#### Scenario: Dev workflow uses compiled assets
- **WHEN** `pnpm dev` is running and files change
- **THEN** updated compiled assets are written to `/assets` and picked up via the manifest


