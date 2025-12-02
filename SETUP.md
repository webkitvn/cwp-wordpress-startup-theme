# Setup Guide

This guide will help you set up your development environment for the WordPress starter theme.

## Prerequisites

Before you begin, ensure you have the following installed:

- **PHP >= 8.3** with standard extensions
- **Node.js >= 18** (LTS version recommended)
- **Composer** (latest version)
- **pnpm** (recommended) or npm
- **WordPress >= 6.2**

### Installing Prerequisites

**Install pnpm:**
```bash
npm install -g pnpm
```

**Verify installations:**
```bash
php --version
node --version
composer --version
pnpm --version
```

## Initial Setup

### 1. Clone or Download Theme

Place the theme in your WordPress installation:
```
wp-content/themes/startuptheme/
```

### 2. Install PHP Dependencies

```bash
composer install
```

This installs:
- WordPress Coding Standards (WPCS)
- PHP CodeSniffer
- PHP Compatibility checker

### 3. Install JavaScript Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

This installs:
- Vite build tool
- Tailwind CSS v4
- React & React DOM
- WordPress packages
- TypeScript
- ESLint & Prettier

### 4. Build Assets

**Production build:**
```bash
pnpm build
```

**Or start development mode:**
```bash
pnpm dev
```

### 5. Activate Theme

1. Log in to WordPress admin
2. Navigate to Appearance → Themes
3. Activate "StartupTheme"

## Development Workflow

### Option A: HMR Development (Recommended)

Start the Vite dev server with Hot Module Replacement:

```bash
pnpm dev
```

- Dev server runs on `http://localhost:3000`
- Changes instantly reflect in browser (HMR)
- Theme auto-detects dev server and loads assets from it
- No manual refresh needed for most changes

**How it works:**
- WordPress checks if Vite dev server is running
- If yes: loads assets from `http://localhost:3000/@vite/client`
- If no: loads from manifest in `/assets/.vite/manifest.json`

### Option B: Watch Build Mode

Build and watch without dev server:

```bash
pnpm build:watch
```

- Watches source files and rebuilds on changes
- Outputs to `/assets` directory
- Requires manual browser refresh
- Better for testing production-like builds

### Option C: Manual Build

Build once without watching:

```bash
pnpm build
```

Use this for:
- Production deployments
- Testing final builds
- CI/CD pipelines

## Local Development Environment

### WordPress Development Options

Choose one of these local WordPress environments:

#### 1. Local by Flywheel (Recommended for Beginners)
- Download: https://localwp.com/
- GUI-based, easy setup
- Built-in SSL support

#### 2. WordPress VIP Dev Environment
```bash
npm install -g @automattic/vip
vip dev-env create
```

#### 3. Docker with wp-env
```bash
npm install -g @wordpress/env
wp-env start
```

#### 4. XAMPP/MAMP/WAMP
- Traditional Apache/MySQL stack
- Manual configuration required

### Theme Location

Place theme at:
```
/path/to/wordpress/wp-content/themes/startuptheme/
```

### Running Commands

Navigate to theme directory before running commands:
```bash
cd wp-content/themes/startuptheme
pnpm dev
```

## Configuration

### Environment Variables (Optional)

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Available options:
- `VITE_DEV_SERVER_PORT` - Dev server port (default: 3000)
- `VITE_WP_URL` - WordPress URL for CORS
- `VITE_THEME_NAME` - Theme directory name

### Vite Configuration

Edit `vite.config.ts` to:
- Change dev server port
- Add/remove build entries
- Configure chunk splitting
- Adjust optimization settings

### PHP Configuration

Edit `inc/enqueue-assets.php` to:
- Change dev server URL
- Modify asset loading logic
- Add custom scripts/styles

## Code Quality

### Before Committing

Run these checks:

```bash
# PHP linting
composer lint:php

# PHP coding standards
composer phpcs

# JavaScript linting
pnpm lint:js

# TypeScript type checking
pnpm type-check

# Format code
pnpm format
```

### Auto-fix Issues

```bash
# Fix PHP formatting
composer phpcbf

# Fix JS/TS formatting
pnpm format
```

### IDE Integration

#### VS Code Extensions

Install these recommended extensions:

1. **PHP Intelephense** - PHP language support
2. **PHP CS Fixer** - PHP formatting
3. **ESLint** - JavaScript linting
4. **Prettier - Code formatter** - Code formatting
5. **Tailwind CSS IntelliSense** - Tailwind autocomplete

#### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Troubleshooting

### Dev Server Not Detected

If assets don't load during development:

1. Verify dev server is running: `http://localhost:3000`
2. Check firewall/ports (port 3000 must be accessible)
3. Review browser console for errors
4. Check PHP function `cwp_is_vite_dev_server_running()`

### Build Errors

**Error: Cannot find module**
```bash
# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Error: Out of memory**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

### PHP Errors

**Error: Manifest not found**
- Run `pnpm build` to generate manifest
- Check `/assets/.vite/manifest.json` exists

**Error: Theme not appearing**
- Verify `style.css` exists in theme root
- Check theme folder name matches configuration

### Permission Issues

```bash
# Fix permissions (Linux/Mac)
chmod -R 755 assets/
chmod -R 775 vendor/
```

## Creating New Blocks

See [README.md](./README.md#creating-new-blocks) for detailed block creation guide.

Quick steps:
1. Create `blocks/my-block/` directory
2. Add `block.json` with metadata
3. Create `editor.tsx` with React components
4. Add entry to `vite.config.ts`
5. Register in `inc/block-registration.php`
6. Build and test

## Deployment

### Production Checklist

- [ ] Run `pnpm build`
- [ ] Run `composer install --no-dev --optimize-autoloader`
- [ ] Run `composer phpcs`
- [ ] Run `pnpm lint:js:strict`
- [ ] Test on staging environment
- [ ] Verify all blocks work
- [ ] Check mobile responsiveness
- [ ] Test page load performance

### Files to Deploy

**Include:**
- All PHP files (root + `/inc`, `/template-parts`)
- `/assets` directory (compiled)
- `/vendor` directory
- `/blocks` directory
- `style.css`, `screenshot.png`, `theme.json`

**Exclude:**
- `/src` (source files)
- `/node_modules` (unless rebuilding on server)
- Build config files (`vite.config.ts`, `tsconfig.json`, etc.)
- `.git` directory
- `.env` files
- Development files

### Server Build (Alternative)

If your server has Node.js:

1. Upload all files including `/src`
2. SSH into server
3. Run `npm install` (or `pnpm install`)
4. Run `npm run build`
5. Remove `/node_modules` and `/src` after build

## Support

For issues or questions:

1. Check documentation: [README.md](./README.md)
2. Review existing issues on GitHub
3. Consult WordPress documentation: https://developer.wordpress.org/
4. Review Vite documentation: https://vitejs.dev/

## Next Steps

- Read [README.md](./README.md) for complete documentation
- Review example blocks in `/blocks`
- Customize Tailwind styles in `/src/main.css`
- Create your first custom block
- Configure theme settings in `inc/theme-setup.php`

Happy coding! 🚀
