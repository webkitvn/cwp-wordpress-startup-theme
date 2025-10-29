# blocks Specification

## Purpose
TBD - created by archiving change add-wp-starter-theme-vite-tailwind-quality-tooling. Update Purpose after archive.
## Requirements
### Requirement: Basic Gutenberg Blocks
The starter MUST include at least two example blocks: one static (save returns markup) and one dynamic (rendered via PHP), each with `block.json` and build-integrated assets authored in TypeScript.

#### Scenario: Block registration
- **WHEN** the theme is activated
- **THEN** both example blocks are registered and appear in the editor inserter

#### Scenario: Editor and frontend assets
- **WHEN** editing a post and viewing on the frontend
- **THEN** the correct editor and frontend scripts/styles are loaded for each block via Vite-built assets

### Requirement: Build Integration for Blocks
Blocks MUST be compiled through the same Vite pipeline (TypeScript + Tailwind v4 via Vite plugin), producing editor/frontend bundles discoverable in the manifest.

#### Scenario: Blocks built with Vite
- **WHEN** running the build command
- **THEN** block TypeScript files are compiled and output to the assets directory with hashed filenames

### Requirement: Block Text Domain
All block `block.json` files MUST set `"textdomain": "cwp"` and all translatable strings MUST use the `cwp` domain in PHP and JS.

#### Scenario: Block text domain present
- **WHEN** registering blocks
- **THEN** each `block.json` includes `"textdomain": "cwp"` and translations resolve under `cwp`

#### Scenario: Manifest lists block assets
- **WHEN** the production build completes
- **THEN** the manifest contains entries for each block’s editor and frontend assets

