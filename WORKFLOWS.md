# Development Workflows

This document describes optimized workflows for common development tasks, following TailPress best practices.

## Table of Contents

- [Daily Development](#daily-development)
- [Building for Production](#building-for-production)
- [Creating Custom Blocks](#creating-custom-blocks)
- [Styling with Tailwind](#styling-with-tailwind)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Deployment](#deployment)

## Daily Development

### Starting Your Day

1. **Navigate to theme directory:**
```bash
cd wp-content/themes/startuptheme
```

2. **Start development server:**
```bash
pnpm dev
```

3. **Open WordPress in browser:**
```
http://your-local-site.test
```

The Vite dev server will:
- Run on `http://localhost:3000`
- Enable Hot Module Replacement (HMR)
- Automatically inject `@vite/client` for live updates
- Detect changes and update browser instantly

### Development Server Benefits

**HMR (Hot Module Replacement):**
- CSS changes reflect instantly (no page reload)
- JavaScript changes update automatically
- React components hot-reload with state preservation
- TypeScript compilation errors show in browser console

**Fast Feedback Loop:**
```
Edit file → Save → See changes instantly
```

No need to:
- Manually refresh browser
- Wait for full rebuild
- Lose application state

### Working with Different File Types

**Editing CSS (Tailwind):**
```bash
# Edit src/main.css
# Save → Changes appear instantly
```

**Editing JavaScript/TypeScript:**
```bash
# Edit src/main.ts or blocks/*/editor.tsx
# Save → Module hot-reloads
```

**Editing PHP:**
```bash
# Edit *.php files
# Save → Refresh browser manually
```

**Editing block.json:**
```bash
# Edit blocks/*/block.json
# Save → Rebuild required
pnpm build
```

### Ending Your Day

```bash
# Stop dev server with Ctrl+C
# Commit your changes
git add .
git commit -m "Descriptive commit message"
```

## Building for Production

### Before Building

**Run quality checks:**
```bash
# Type check
pnpm type-check

# Lint JavaScript
pnpm lint:js

# Check formatting
pnpm format:check

# Lint PHP
composer lint:php

# Check coding standards
composer phpcs
```

### Production Build

```bash
# Clean previous builds
pnpm clean

# Build optimized assets
pnpm build
```

**What happens during build:**
1. TypeScript compiled to JavaScript
2. React JSX transformed
3. Tailwind CSS processed and purged
4. Assets minified (esbuild)
5. Vendor chunks split:
   - `vendor-react.[hash].js` - React & React DOM
   - `vendor-wordpress.[hash].js` - WordPress packages
6. Hashed filenames for cache busting
7. Manifest generated at `assets/.vite/manifest.json`

### Build Output

```
assets/
├── .vite/
│   └── manifest.json
├── main.[hash].js
├── main-css.[hash].css
├── editor.[hash].css
├── vendor-react.[hash].js
├── vendor-wordpress.[hash].js
└── [block-name]-editor.[hash].js
```

### Verify Production Build

```bash
# Preview the build
pnpm preview

# Check output sizes
ls -lh assets/

# Test manifest loading
cat assets/.vite/manifest.json | jq
```

## Creating Custom Blocks

### Full Block Creation Workflow

**1. Plan your block:**
- Name: `my-custom-block`
- Purpose: Display custom content
- Type: Static or Dynamic
- Attributes: What data to store

**2. Create block structure:**
```bash
mkdir -p blocks/my-custom-block
touch blocks/my-custom-block/block.json
touch blocks/my-custom-block/editor.tsx
```

**3. Configure block.json:**
```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "cwp/my-custom-block",
	"version": "1.0.0",
	"title": "My Custom Block",
	"category": "text",
	"icon": "smiley",
	"description": "A custom block for special content",
	"textdomain": "cwp",
	"editorScript": "file:./editor.js",
	"attributes": {
		"content": {
			"type": "string",
			"default": ""
		}
	}
}
```

**4. Create React editor component:**
```typescript
// blocks/my-custom-block/editor.tsx
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

interface Attributes {
	content: string;
}

registerBlockType<Attributes>('cwp/my-custom-block', {
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps();
		
		return (
			<div {...blockProps}>
				<RichText
					tagName="p"
					value={attributes.content}
					onChange={(content) => setAttributes({ content })}
					placeholder={__('Enter content...', 'cwp')}
				/>
			</div>
		);
	},
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save();
		
		return (
			<div {...blockProps}>
				<RichText.Content tagName="p" value={attributes.content} />
			</div>
		);
	},
});
```

**5. Add to Vite config:**

Edit `vite.config.ts`:
```typescript
rollupOptions: {
	input: {
		// ... existing entries
		'my-custom-block-editor': resolve(
			__dirname,
			'blocks/my-custom-block/editor.tsx'
		),
	},
}
```

**6. Register block in PHP:**

Edit `inc/block-registration.php`:
```php
$blocks = array(
	'example-static',
	'example-dynamic',
	'my-custom-block', // Add this
);
```

**7. Build and test:**
```bash
pnpm build
```

**8. Activate and verify:**
1. Refresh WordPress admin
2. Create/edit a post
3. Find "My Custom Block" in inserter
4. Insert and test the block
5. Preview on frontend

### Dynamic Block Workflow

For server-rendered blocks:

**1. Add render.php:**
```php
<?php
/**
 * My Custom Block - Server Render
 */

$content = $attributes['content'] ?? '';
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<p><?php echo esc_html( $content ); ?></p>
</div>
```

**2. Update block.json:**
```json
{
	"render": "file:./render.php"
}
```

**3. Remove save function from editor.tsx:**
```typescript
registerBlockType<Attributes>('cwp/my-custom-block', {
	edit: ({ attributes, setAttributes }) => {
		// ... editor code
	},
	// No save function for dynamic blocks
});
```

## Styling with Tailwind

### Using Tailwind Classes

**In React blocks:**
```typescript
<div className="p-4 bg-blue-500 text-white rounded-lg">
	Content
</div>
```

**In PHP templates:**
```php
<div class="container mx-auto px-4">
	<?php the_content(); ?>
</div>
```

**In CSS files:**
```css
@import "tailwindcss";

.custom-component {
	@apply flex items-center gap-4 p-4;
}
```

### Customizing Tailwind

Edit `src/main.css`:
```css
@import "tailwindcss";

@theme {
	/* Custom colors */
	--color-primary: #3b82f6;
	--color-secondary: #8b5cf6;
	
	/* Custom spacing */
	--spacing-section: 4rem;
}

/* Custom utilities */
@layer utilities {
	.text-balance {
		text-wrap: balance;
	}
}
```

### Editor Styles

Match editor to frontend:

Edit `src/editor.css`:
```css
@import "tailwindcss";

/* Override Gutenberg defaults */
.editor-styles-wrapper {
	font-family: inherit;
	font-size: 16px;
}

/* Custom block styles */
.wp-block {
	max-width: 720px;
}
```

## Testing and Quality Assurance

### Pre-Commit Checklist

Run before every commit:

```bash
# 1. Type check
pnpm type-check

# 2. Lint and format JavaScript
pnpm lint:js
pnpm format

# 3. Lint PHP
composer lint

# 4. Build successfully
pnpm build
```

### Automated Testing

Add to your workflow:

**package.json:**
```json
"scripts": {
	"test": "pnpm type-check && pnpm lint:js && pnpm build",
	"test:php": "composer lint",
	"test:all": "pnpm test && pnpm test:php"
}
```

**Run all tests:**
```bash
pnpm test:all
```

### Manual Testing

**Block editor testing:**
1. Create new post
2. Insert each custom block
3. Test all block settings
4. Save draft
5. Preview post
6. Publish and view

**Frontend testing:**
1. View published posts
2. Test responsive layouts (mobile, tablet, desktop)
3. Check browser console for errors
4. Verify all assets load correctly

**Cross-browser testing:**
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

## Deployment

### Deployment Workflow

**1. Prepare for deployment:**
```bash
# Pull latest changes
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader
pnpm install

# Run tests
pnpm test:all

# Build production assets
pnpm clean
pnpm build
```

**2. Create deployment package:**
```bash
# Exclude development files
tar -czf startuptheme.tar.gz \
	--exclude='.git' \
	--exclude='node_modules' \
	--exclude='src' \
	--exclude='.env' \
	--exclude='*.config.ts' \
	--exclude='tsconfig.json' \
	--exclude='.eslintrc.cjs' \
	--exclude='.prettierrc.json' \
	--exclude='pnpm-lock.yaml' \
	.
```

**3. Deploy to server:**
```bash
# Upload via FTP/SFTP or SSH
scp startuptheme.tar.gz user@server:/path/to/wp-content/themes/

# SSH into server
ssh user@server

# Extract
cd /path/to/wp-content/themes/
tar -xzf startuptheme.tar.gz -C startuptheme/
```

**4. Verify deployment:**
- Check WordPress admin loads
- Activate theme
- Test all pages load correctly
- Verify all blocks render
- Check console for errors

### Continuous Deployment

**Using GitHub Actions:**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Theme

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          
      - name: Install dependencies
        run: |
          composer install --no-dev --optimize-autoloader
          npm install -g pnpm
          pnpm install
          
      - name: Run tests
        run: |
          pnpm type-check
          pnpm lint:js:strict
          composer phpcs
          
      - name: Build assets
        run: pnpm build
        
      - name: Deploy
        # Add your deployment step here
        run: echo "Deploy to server"
```

### Rollback Procedure

If deployment fails:

1. **Keep previous version:**
```bash
# Before deploying, backup current version
mv startuptheme startuptheme-backup
```

2. **Rollback if needed:**
```bash
# Remove failed deployment
rm -rf startuptheme

# Restore backup
mv startuptheme-backup startuptheme
```

3. **Fix issues locally:**
```bash
# Fix the issue
# Test thoroughly
# Rebuild and redeploy
```

## Best Practices

### Code Organization

- Keep blocks focused and single-purpose
- Use TypeScript interfaces for attributes
- Extract reusable components to `src/`
- Follow WordPress coding standards for PHP
- Use Tailwind utilities over custom CSS

### Performance

- Use Vite's code splitting (already configured)
- Lazy load heavy components
- Optimize images before adding
- Test on slow connections
- Monitor bundle sizes

### Maintainability

- Document complex logic
- Use meaningful variable/function names
- Keep functions small and focused
- Write self-documenting code
- Update README when adding features

### Version Control

- Commit working code frequently
- Write descriptive commit messages
- Use feature branches for new features
- Review changes before committing
- Don't commit built assets (they're in .gitignore)

## Troubleshooting Common Issues

### Dev Server Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port in vite.config.ts
```

**Assets not loading:**
- Check dev server is running: `curl http://localhost:3000`
- Verify `cwp_is_vite_dev_server_running()` returns true
- Check browser console for CORS errors

### Build Issues

**Out of memory:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

**Module not found:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### WordPress Issues

**Block not appearing:**
- Run `pnpm build` after changes
- Clear WordPress caches
- Deactivate and reactivate theme
- Check PHP error logs

**Styles not applying:**
- Verify Tailwind classes are correct
- Check browser DevTools for CSS
- Rebuild assets: `pnpm build`
- Hard refresh browser (Ctrl+Shift+R)

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Need help?** Check [SETUP.md](./SETUP.md) for initial setup instructions or [README.md](./README.md) for complete documentation.
