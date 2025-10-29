## ADDED Requirements

### Requirement: Vite Build (no dev server)
The system SHALL use Vite for bundling TypeScript modules and SCSS/CSS, with a watch-based development workflow that writes compiled assets to `/assets`, and manifest-driven assets for all environments.

#### Scenario: Dev workflow (watch)
- **WHEN** running the dev command
- **THEN** Vite runs in watch mode, writing compiled assets to `/assets` and updating the manifest which WordPress consumes

#### Scenario: Production build
- **WHEN** running the build command
- **THEN** Vite outputs hashed assets to `/assets` and generates `assets/manifest.json`

### Requirement: Tailwind Integration (v4 via Vite plugin)
The system MUST integrate Tailwind CSS v4 using the official Vite plugin `@tailwindcss/vite` with CSS `@import "tailwindcss"` and no PostCSS configuration.

#### Scenario: Tailwind classes compiled
- **WHEN** building assets
- **THEN** Tailwind utility classes referenced in `/src` are included in the final CSS bundle

### Requirement: Source Structure
Authoring code MUST reside under `/src` for TypeScript (ts/tsx) and SCSS/CSS, and block sources under `/blocks` with per-block directories.

#### Scenario: Source discoverability
- **WHEN** a new developer opens the repository
- **THEN** all source entries are under `/src` and `/blocks`, and build outputs under `/assets` only


