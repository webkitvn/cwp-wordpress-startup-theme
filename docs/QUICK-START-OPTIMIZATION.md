# Quick Start: Fix `pnpm dev` Performance Issues

## TL;DR - The Main Problem

**Current**: Using `vite build --watch` (production build in watch mode)  
**Issue**: Full rebuilds on every file change instead of fast Hot Module Replacement (HMR)  
**Fix**: Switch to Vite dev server mode  
**Expected Impact**: 70-90% faster rebuilds, no more system lag

---

## Immediate Actions (30 Minutes)

### Step 1: Baseline Test (5 min)
```bash
# Current performance
time pnpm build
pnpm dev  # Note how long rebuilds take when you edit a file
```

### Step 2: Critical Fix - Switch to Dev Server (15 min)

**Note**: The dev server approach may require WordPress configuration changes to load assets from `http://localhost:3000` instead of built files. For a WordPress theme, this is complex and may not be practical. 

**Alternative Quick Win**: Keep build mode but optimize it heavily.

#### Option A: Optimized Build Mode (Recommended for WP)
Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: 'blocks/*/block.json',
					dest: '../blocks',
				},
			],
		}),
	],
	build: {
		manifest: true,
		outDir: 'assets',
		emptyOutDir: true,
		minify: false,  // Disable minification in dev
		sourcemap: true,  // Enable for debugging
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/main.ts'),
				'main-css': resolve(__dirname, 'src/main.css'),
				editor: resolve(__dirname, 'src/editor.css'),
				'example-static-editor': resolve(
					__dirname,
					'blocks/example-static/editor.tsx'
				),
				'example-static-view': resolve(
					__dirname,
					'blocks/example-static/view.tsx'
				),
				'example-dynamic-editor': resolve(
					__dirname,
					'blocks/example-dynamic/editor.tsx'
				),
			},
			output: {
				entryFileNames: '[name].[hash].js',
				chunkFileNames: '[name].[hash].js',
				assetFileNames: '[name].[hash].[ext]',
			},
			// Add watch options
			watch: {
				include: ['src/**', 'blocks/**'],
				exclude: ['node_modules/**', 'vendor/**', 'assets/**', '.git/**'],
				buildDelay: 100,  // Debounce rapid changes
			},
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	// Pre-bundle dependencies
	optimizeDeps: {
		include: [
			'@wordpress/blocks',
			'@wordpress/block-editor',
			'@wordpress/components',
			'@wordpress/i18n',
			'react',
			'react-dom',
		],
	},
	// Enable caching
	cacheDir: 'node_modules/.vite',
});
```

#### Option B: Dev Server Mode (Advanced, requires PHP changes)
See `docs/pnpm-dev-performance-analysis-plan.md` Appendix C for WordPress integration.

### Step 3: Test Improvements (5 min)
```bash
# Clear cache
rm -rf node_modules/.vite assets

# Rebuild
time pnpm build

# Watch mode
pnpm dev  # Test rebuild speed
```

### Step 4: Additional Quick Wins (5 min)

Add to `package.json`:
```json
{
	"scripts": {
		"dev": "vite build --watch --mode development",
		"build": "vite build",
		"clean": "rm -rf assets node_modules/.vite"
	}
}
```

---

## Expected Results

### Before Optimization
- Rebuild time: 3-10 seconds
- CPU usage: 80-100%
- System lag: Noticeable

### After Quick Wins
- Rebuild time: 0.5-2 seconds
- CPU usage: 20-40%
- System lag: Minimal to none

---

## If Issues Persist

### Check 1: Node Modules Size
```bash
du -sh node_modules
# If > 600MB, might have duplicate dependencies
pnpm dedupe
```

### Check 2: File Watcher Limits (Linux)
```bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# If < 524288, increase it
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Check 3: TypeScript Performance
```bash
# Verify TypeScript isn't type-checking on every build
grep -A 2 "noEmit" tsconfig.json  # Should be true
```

### Check 4: Vite Debug Output
```bash
DEBUG=vite:* pnpm dev 2>&1 | grep -i "slow\|warn\|error"
```

---

## Next Steps

1. ✅ Apply optimized `vite.config.ts`
2. ✅ Test performance improvements
3. 📖 Read full analysis: `docs/pnpm-dev-performance-analysis-plan.md`
4. 🔬 Run diagnostic tests from the plan
5. 🚀 Implement medium-term optimizations as needed

---

## Need More Help?

- **Full diagnostic plan**: `docs/pnpm-dev-performance-analysis-plan.md`
- **Performance testing scripts**: See plan Appendix A
- **Configuration templates**: See plan Appendix B
- **WordPress integration**: See plan Appendix C

---

## Quick Reference: Common Commands

```bash
# Development
pnpm dev                    # Start watch mode
pnpm build                  # Production build
pnpm clean                  # Clear cache and assets

# Debugging
DEBUG=vite:* pnpm dev       # Verbose output
time pnpm build             # Measure build time
pnpm list --depth=0         # Check dependencies

# Performance monitoring
top -p $(pgrep -f vite)     # Monitor resources
lsof -p $(pgrep -f vite)    # Check open files
```
