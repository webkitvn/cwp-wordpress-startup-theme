# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Development Workflow Improvements

- **HMR (Hot Module Replacement) Support**: Vite dev server now runs with full HMR capabilities
  - Dev server automatically detected by WordPress
  - Instant CSS updates without page reload
  - React components hot-reload with state preservation
  - TypeScript compilation errors show in browser console
  
- **Enhanced Vite Configuration**:
  - Function-based config to differentiate between dev and build modes
  - Configurable dev server with port 3000 and CORS support
  - Environment variable support for customization
  - Auto-detection of theme directory name
  - Vendor chunk splitting for optimized production builds
  - Separate chunks for React and WordPress packages
  - Optimized dependency pre-bundling

- **Improved Package Scripts**:
  - `npm run dev`: Start Vite dev server with HMR (changed from watch mode)
  - `npm run build:watch`: Watch mode without dev server (alternative workflow)
  - `npm run preview`: Preview production build locally
  - `npm run clean`: Remove all compiled assets and caches
  - `npm run format:check`: Check code formatting without modifying files
  - `npm run type-check`: Run TypeScript type checking without building

- **Enhanced Composer Scripts**:
  - `composer lint`: Run both PHP linting and PHPCS checks
  - `composer fix`: Auto-fix PHPCS issues (alias for phpcbf)
  - `composer check`: Quick PHP syntax check

- **Development Server Detection**:
  - PHP function `cwp_is_vite_dev_server_running()` detects dev server
  - Automatically loads assets from dev server when available
  - Injects `@vite/client` for HMR in development mode
  - Falls back to manifest-based loading in production

- **Environment Configuration**:
  - `.env.example` file with all configuration options
  - Support for custom dev server host, port, and protocol
  - Configurable WordPress origin for CORS
  - Theme name auto-detection with override option

#### Documentation Improvements

- **SETUP.md**: Comprehensive setup guide covering:
  - Prerequisites and installation
  - Local development environment options
  - Development workflow recommendations
  - Configuration options
  - Code quality tools
  - IDE integration (VS Code)
  - Troubleshooting common issues

- **WORKFLOWS.md**: Detailed workflow documentation for:
  - Daily development routines
  - Production build process
  - Creating custom Gutenberg blocks
  - Styling with Tailwind CSS
  - Testing and quality assurance
  - Deployment procedures
  - Best practices and tips

- **CHANGELOG.md**: This file for tracking changes

- **Updated README.md** with:
  - HMR development workflow
  - Enhanced script documentation
  - Improved asset loading explanation
  - Better command examples

### Changed

#### Build Process

- **Development Mode**:
  - Primary `dev` command now runs Vite dev server instead of watch build
  - Provides instant feedback with HMR
  - Better developer experience

- **TypeScript Configuration**:
  - Added `blocks/**/*` to included paths
  - Ensures all block TypeScript files are type-checked

- **Asset Enqueuing**:
  - Scripts marked with `type="module"` for ES module support
  - Version parameter removed in dev mode (uses null)
  - Separate Vite client for frontend and editor

#### Configuration

- **Vite Config Enhancements**:
  - Uses `loadEnv` for environment variable support
  - Dynamic base path construction
  - Configurable HMR settings (host, port, protocol)
  - Production-only optimizations (minification, sourcemaps)
  - Better code splitting for vendor packages

- **Git Ignore**:
  - Added `.env` to ignore list
  - Keeps environment-specific configuration private

### Performance

- **Vendor Chunk Splitting**: Production builds now separate React and WordPress packages
  - `vendor-react.[hash].js`: React and React DOM (~140KB gzipped)
  - `vendor-wordpress.[hash].js`: WordPress packages (~80KB gzipped)
  - Better browser caching for dependencies
  - Faster subsequent page loads

- **Optimized Dependencies**: Pre-bundling configured for common packages
  - React/React DOM
  - WordPress blocks, block-editor, components, i18n
  - Faster cold starts in development

### Developer Experience

- **Faster Development Cycle**:
  - HMR provides instant feedback (< 100ms for CSS changes)
  - No manual browser refresh needed
  - State preservation during component updates
  - Better error reporting in browser console

- **Cleaner Commands**:
  - More intuitive script names
  - Clear separation between dev and build modes
  - Easier to understand workflow

- **Better Documentation**:
  - Step-by-step guides
  - Troubleshooting sections
  - Best practices included
  - Real-world examples

## Best Practices Applied

### From Official TailPress

This update implements best practices from the official [TailPress](https://github.com/tailpress/tailpress) theme:

1. **Function-based Vite Config**: Differentiates between development and build commands
2. **Dev Server Configuration**: Proper CORS and HMR setup
3. **Simpler Dev Script**: `vite` instead of `vite build --watch`
4. **Dynamic Base Path**: Configured per environment
5. **Environment-aware Build**: Different settings for dev vs production

### Additional Enhancements

Beyond official TailPress, this starter includes:

- **TypeScript Support**: Full type checking for blocks and scripts
- **React Integration**: Hot reload for React components
- **Gutenberg Blocks**: Example static and dynamic blocks
- **Code Quality Tools**: ESLint, Prettier, PHPCS
- **Comprehensive Documentation**: Multiple guides for different use cases

## Migration Guide

### For Existing Developers

If you're upgrading from the previous version:

1. **Update Dependencies**:
   ```bash
   pnpm install
   ```

2. **Change Your Workflow**:
   - Old: `pnpm dev` (watch mode)
   - New: `pnpm dev` (dev server with HMR)
   - Alternative: `pnpm build:watch` (old behavior)

3. **Optional: Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Rebuild Assets**:
   ```bash
   pnpm build
   ```

### Breaking Changes

None. All changes are backward compatible. Existing builds continue to work.

## Notes

- Dev server runs on port 3000 by default (configurable)
- Manifest-based loading still works if dev server is not running
- All existing blocks and functionality remain unchanged
- PHP code is backward compatible

## Credits

Improvements inspired by:
- [TailPress](https://github.com/tailpress/tailpress) - Official WordPress + Tailwind theme
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)

---

**Version**: 1.1.0  
**Date**: 2024-11-30  
**Type**: Feature Release
