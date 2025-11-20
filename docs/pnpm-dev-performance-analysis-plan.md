# Performance Analysis Plan: `pnpm dev` System Lag Investigation

## Executive Summary

This document outlines a comprehensive plan to identify and resolve performance bottlenecks causing system lag when running `pnpm dev` during WordPress theme development. The plan includes diagnostic steps, optimization strategies, and measurable success criteria.

---

## Current State Analysis

### Current Setup
- **Build Tool**: Vite 6.0.1
- **Package Manager**: pnpm 10.22.0
- **Node Version**: v20.19.5
- **Development Command**: `vite build --watch --mode development`
- **Entry Points**: 6 distinct entries (main, CSS files, 3 block scripts)
- **Plugins**: Tailwind CSS 4 (beta), vite-plugin-static-copy
- **Dependencies**: 520MB node_modules, 20MB vendor (PHP)

### Identified Issues
1. **Architecture Mismatch**: Using production build mode (`vite build --watch`) instead of development server (`vite serve`)
2. **Full Rebuild Cycles**: Watch mode triggers complete rebuilds vs. HMR incremental updates
3. **Multiple Entry Points**: 6 separate entries may cause parallel compilation overhead
4. **Tailwind CSS 4 Beta**: New architecture may have unoptimized watch patterns
5. **File Copy Operations**: `vite-plugin-static-copy` runs on every rebuild
6. **Large node_modules**: 520MB could slow file watching
7. **Asset Manifest Generation**: Regenerating manifest.json on every change

---

## Diagnostic Phase

### Phase 1: Baseline Performance Measurement

#### 1.1 Collect Build Metrics
```bash
# Measure initial build time
time pnpm build

# Measure rebuild time in watch mode
# Terminal 1:
pnpm dev

# Terminal 2 (after initial build):
touch src/main.ts && time until [ -f assets/main.*.js ]; do sleep 0.1; done
```

**Metrics to Capture:**
- Initial build duration
- Rebuild duration on file change
- CPU usage during watch
- Memory consumption
- File system events count
- Time to detect change → time to complete rebuild

#### 1.2 System Resource Monitoring
```bash
# Monitor system resources during dev
pnpm dev &
PID=$!

# In another terminal:
pidstat -p $PID -u -r 1 10 > performance-baseline.log
```

#### 1.3 Vite Build Analysis
Add debug flags to measure internal timings:
```bash
DEBUG=vite:* pnpm dev 2>&1 | tee vite-debug.log
```

### Phase 2: Component Isolation Testing

#### 2.1 Test Without Tailwind Plugin
Create `vite.config.minimal.ts`:
```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		manifest: true,
		outDir: 'assets',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/main.ts'),
			},
		},
	},
});
```

Test: `vite build --watch --mode development --config vite.config.minimal.ts`

#### 2.2 Test Without Static Copy Plugin
Remove `viteStaticCopy` from main config temporarily.

#### 2.3 Test With Reduced Entry Points
Comment out block entries, test with only `main.ts`.

#### 2.4 Test File Watcher Scope
Add explicit include/exclude to limit watched files:
```typescript
server: {
	watch: {
		include: ['src/**', 'blocks/**'],
		exclude: ['node_modules/**', 'vendor/**', 'assets/**', '.git/**'],
	},
}
```

---

## Root Cause Hypotheses

### Primary Suspects (High Probability)

#### H1: Production Build Mode in Watch
**Symptom**: Using `vite build --watch` instead of `vite` (dev server)
**Impact**: Complete rebuild cycles instead of incremental HMR
**Probability**: 95% - This is the primary issue

#### H2: Tailwind CSS 4 Beta Plugin Performance
**Symptom**: Beta software with potentially unoptimized watch patterns
**Impact**: Slow CSS processing on every change
**Probability**: 70%

#### H3: Multiple Entry Point Overhead
**Symptom**: 6 entry points built in parallel
**Impact**: CPU thrashing, memory pressure
**Probability**: 60%

### Secondary Suspects (Medium Probability)

#### H4: Static Copy Plugin on Every Rebuild
**Symptom**: Copying block.json files on every change
**Impact**: Unnecessary I/O operations
**Probability**: 50%

#### H5: Manifest Generation Overhead
**Symptom**: Regenerating hash-based manifest constantly
**Impact**: Extra I/O and processing
**Probability**: 40%

#### H6: File Watcher Scope Too Broad
**Symptom**: Watching node_modules, vendor, .git
**Impact**: Excessive file system events
**Probability**: 50%

### Tertiary Suspects (Lower Probability)

#### H7: TypeScript Type Checking
**Symptom**: Full type check on every rebuild
**Impact**: CPU overhead
**Probability**: 30% (noEmit is set)

#### H8: Large Dependency Graph
**Symptom**: WordPress + React dependencies
**Impact**: Slow module resolution
**Probability**: 20%

---

## Optimization Strategy

### Quick Wins (Immediate Impact)

#### Q1: Switch to Vite Dev Server Mode ⭐️ CRITICAL
**Current**: `vite build --watch --mode development`
**Proposed**: `vite` (standard dev server)

**Implementation:**
1. Update `package.json`:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build"
   }
   ```

2. Update `vite.config.ts` to support both modes:
   ```typescript
   export default defineConfig(({ mode }) => ({
     plugins: [tailwindcss(), viteStaticCopy(...)],
     
     // Dev server config
     server: {
       port: 3000,
       strictPort: false,
       watch: {
         usePolling: false,
         include: ['src/**', 'blocks/**'],
         exclude: ['node_modules/**', 'vendor/**', 'assets/**'],
       },
     },
     
     // Build config (production)
     build: mode === 'production' ? {
       manifest: true,
       outDir: 'assets',
       // ... existing build config
     } : {
       // Lighter build for development
       manifest: true,
       outDir: 'assets',
       minify: false,
       sourcemap: true,
       // ... simplified config
     },
   }));
   ```

**Expected Impact**: 70-90% reduction in rebuild time

#### Q2: Scope File Watchers
Add explicit watcher configuration:
```typescript
server: {
	watch: {
		usePolling: false, // Use native file watching
		include: ['src/**/*.{ts,tsx,css,scss}', 'blocks/**/*.{ts,tsx,json}'],
		exclude: [
			'node_modules/**',
			'vendor/**',
			'assets/**',
			'.git/**',
			'**/*.log',
		],
	},
},
```

**Expected Impact**: 20-30% reduction in CPU usage

#### Q3: Optimize Static Copy Plugin
Modify to only copy on relevant changes:
```typescript
viteStaticCopy({
	targets: [
		{
			src: 'blocks/*/block.json',
			dest: '../blocks',
		},
	],
	structured: true,
	// Only watch block.json files
	watch: {
		reloadPageOnChange: false,
	},
})
```

**Expected Impact**: 10-15% reduction in rebuild time

### Medium-Term Optimizations

#### M1: Implement Build Caching
Add filesystem cache:
```typescript
export default defineConfig({
	cacheDir: 'node_modules/.vite',
	optimizeDeps: {
		include: [
			'@wordpress/blocks',
			'@wordpress/block-editor',
			'@wordpress/components',
			'react',
			'react-dom',
		],
	},
});
```

#### M2: Separate Block Builds
Consider splitting block builds into separate Vite instances or using dynamic imports to reduce initial bundle size.

#### M3: Upgrade Tailwind CSS from Beta
Once Tailwind CSS 4 is stable, upgrade and test performance improvements.

#### M4: Add Build Performance Plugin
Install and configure:
```bash
pnpm add -D vite-plugin-inspect
```

```typescript
import Inspect from 'vite-plugin-inspect';

plugins: [
	Inspect(), // Visit http://localhost:5173/__inspect/
	tailwindcss(),
	// ...
]
```

### Long-Term Improvements

#### L1: Migrate to Vite Dev Server with WordPress Integration
Research and implement proper WordPress + Vite dev server integration:
- Use `@vitejs/plugin-react` for HMR
- Configure WordPress to load from dev server in development
- Update asset enqueuing to detect dev server vs. build mode

#### L2: Module Federation for Blocks
Implement module federation to lazy-load blocks:
```typescript
build: {
	rollupOptions: {
		output: {
			manualChunks: {
				'wordpress-vendor': [
					'@wordpress/blocks',
					'@wordpress/block-editor',
					'@wordpress/components',
				],
				'react-vendor': ['react', 'react-dom'],
			},
		},
	},
}
```

#### L3: Parallel TypeScript Checking
Move TypeScript checking to separate process:
```bash
pnpm add -D vite-plugin-checker
```

```typescript
import checker from 'vite-plugin-checker';

plugins: [
	checker({ typescript: true }),
	// ...
]
```

---

## Implementation Roadmap

### Week 1: Diagnosis & Quick Wins

**Day 1-2: Baseline Measurement**
- [ ] Run all diagnostic tests from Phase 1
- [ ] Document current performance metrics
- [ ] Identify top 3 bottlenecks

**Day 3-4: Critical Fix - Dev Server**
- [ ] Implement Q1: Switch to Vite dev server
- [ ] Update PHP asset enqueuing to support dev server
- [ ] Test WordPress integration
- [ ] Measure performance improvement

**Day 5: Quick Wins**
- [ ] Implement Q2: Scope file watchers
- [ ] Implement Q3: Optimize static copy
- [ ] Measure combined impact
- [ ] Document results

### Week 2: Medium-Term Optimizations

**Day 1-2: Build Caching**
- [ ] Implement M1: Filesystem cache
- [ ] Configure dependency pre-bundling
- [ ] Test cache effectiveness

**Day 3-4: Block Build Optimization**
- [ ] Analyze block build patterns
- [ ] Implement M2: Separate or optimize block builds
- [ ] Test block hot-reload performance

**Day 5: Monitoring & Documentation**
- [ ] Set up M4: Build performance plugin
- [ ] Create performance monitoring dashboard
- [ ] Document optimization results

### Week 3+: Long-Term Improvements
- [ ] Research WordPress + Vite HMR integration
- [ ] Implement module federation
- [ ] Add parallel type checking
- [ ] Create automated performance regression tests

---

## Success Metrics

### Target Performance Goals

| Metric | Current (Baseline) | Target | Critical |
|--------|-------------------|--------|----------|
| Initial build time | TBD | < 5s | < 10s |
| Rebuild on change | TBD | < 1s | < 2s |
| CPU usage (avg) | TBD | < 30% | < 50% |
| Memory usage | TBD | < 500MB | < 1GB |
| File change detection | TBD | < 100ms | < 500ms |

### Key Performance Indicators (KPIs)

1. **Developer Experience**: Time from file save to browser refresh
2. **System Responsiveness**: Can developer continue working during rebuild?
3. **Build Stability**: Zero crashes or hangs during 8-hour workday
4. **Resource Efficiency**: No system-wide slowdown

---

## Testing Protocol

### Before Each Change
1. Record baseline metrics (3 runs, average)
2. Document system state (running processes, free memory)
3. Clear Vite cache: `rm -rf node_modules/.vite`

### After Each Change
1. Test initial build (3 runs, average)
2. Test 10 consecutive rebuilds
3. Test under load (rapid file changes)
4. Monitor system resources
5. Document any regressions

### Regression Testing
Create automated test:
```bash
#!/bin/bash
# test-build-performance.sh

echo "Testing build performance..."

# Clear cache
rm -rf node_modules/.vite assets

# Initial build
echo "Initial build:"
time pnpm build

# Watch mode rebuild
echo "Starting watch mode..."
pnpm dev &
DEV_PID=$!
sleep 5

# Trigger rebuild
echo "Triggering rebuild..."
touch src/main.ts
time until grep -q "built in" vite.log 2>/dev/null; do sleep 0.1; done

# Cleanup
kill $DEV_PID
```

---

## Risk Assessment

### High Risk Changes
- **Switching to dev server**: May break WordPress asset loading
  - **Mitigation**: Create feature flag to toggle between modes
  - **Rollback**: Revert package.json script change

### Medium Risk Changes
- **File watcher scope**: May miss important file changes
  - **Mitigation**: Test all file types (TS, CSS, JSON)
  - **Rollback**: Remove watch config

### Low Risk Changes
- **Cache configuration**: May cause stale builds
  - **Mitigation**: Document cache clearing command
  - **Rollback**: Remove cache config

---

## Alternative Approaches

### Alternative 1: Use Webpack Instead of Vite
**Pros**: More mature WordPress tooling
**Cons**: Slower builds, older architecture
**Recommendation**: NOT RECOMMENDED - Vite is superior when configured correctly

### Alternative 2: Split Dev and Build Workflows
**Pros**: Optimize each workflow independently
**Cons**: Complexity, potential drift
**Recommendation**: CONSIDER after quick wins

### Alternative 3: Reduce Build Scope in Dev
**Pros**: Faster rebuilds
**Cons**: May miss cross-module issues
**Recommendation**: IMPLEMENT as part of Q1

---

## Monitoring & Continuous Improvement

### Daily Monitoring
- Check Vite debug logs for warnings
- Monitor system resource usage
- Track developer feedback

### Weekly Review
- Analyze performance trends
- Review new Vite/Tailwind releases
- Identify new optimization opportunities

### Monthly Audit
- Benchmark against latest tooling
- Review dependency updates
- Test performance on different hardware

---

## Appendix A: Diagnostic Commands

### System Resource Monitoring
```bash
# CPU and memory usage
top -b -n 1 -p $(pgrep -f "vite") | tail -n +7

# File descriptor count
lsof -p $(pgrep -f "vite") | wc -l

# I/O statistics
iostat -x 1 10

# Real-time file system events
fswatch -l 0.1 src blocks
```

### Vite-Specific Debugging
```bash
# Enable all Vite debug logs
DEBUG=vite:* pnpm dev

# Profile Node.js performance
node --prof node_modules/.bin/vite build --watch

# Analyze Rollup build
ROLLUP_WATCH=1 DEBUG=rollup:* pnpm dev

# Bundle analyzer
pnpm add -D rollup-plugin-visualizer
```

### Build Analysis
```bash
# Measure TypeScript compilation
time tsc --noEmit

# Measure individual plugin performance
# (requires custom instrumentation in vite.config.ts)

# Check file watcher limits
cat /proc/sys/fs/inotify/max_user_watches
```

---

## Appendix B: Configuration Templates

### Development-Optimized vite.config.ts
```typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
	const isDev = mode === 'development';
	
	return {
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
		
		server: {
			port: 3000,
			strictPort: false,
			watch: {
				usePolling: false,
				include: ['src/**', 'blocks/**'],
				exclude: ['node_modules/**', 'vendor/**', 'assets/**', '.git/**'],
			},
		},
		
		build: {
			manifest: true,
			outDir: 'assets',
			emptyOutDir: true,
			minify: isDev ? false : 'esbuild',
			sourcemap: isDev ? true : false,
			rollupOptions: {
				input: {
					main: resolve(__dirname, 'src/main.ts'),
					'main-css': resolve(__dirname, 'src/main.css'),
					editor: resolve(__dirname, 'src/editor.css'),
					'example-static-editor': resolve(__dirname, 'blocks/example-static/editor.tsx'),
					'example-static-view': resolve(__dirname, 'blocks/example-static/view.tsx'),
					'example-dynamic-editor': resolve(__dirname, 'blocks/example-dynamic/editor.tsx'),
				},
				output: {
					entryFileNames: '[name].[hash].js',
					chunkFileNames: '[name].[hash].js',
					assetFileNames: '[name].[hash].[ext]',
				},
			},
		},
		
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
			},
		},
		
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
		
		cacheDir: 'node_modules/.vite',
	};
});
```

### Performance-Focused package.json Scripts
```json
{
	"scripts": {
		"dev": "vite",
		"dev:build": "vite build --watch --mode development",
		"dev:legacy": "vite build --watch",
		"build": "vite build",
		"build:analyze": "vite build --mode production && npx vite-bundle-visualizer",
		"clean": "rm -rf assets node_modules/.vite",
		"perf:test": "./scripts/test-build-performance.sh",
		"perf:monitor": "pidstat -p $(pgrep -f vite) -u -r 1"
	}
}
```

---

## Appendix C: WordPress Dev Server Integration

### Problem: Asset Enqueuing with Vite Dev Server
WordPress needs to load assets from Vite dev server (http://localhost:3000) in development, but from built files in production.

### Solution: Environment-Aware Asset Loading

**inc/enqueue-assets.php** (Modified):
```php
<?php
/**
 * Enqueue theme assets with Vite dev server support
 */

function cwp_is_vite_dev_server_running(): bool {
	$dev_server_url = 'http://localhost:3000';
	$headers = @get_headers($dev_server_url);
	return $headers && strpos($headers[0], '200') !== false;
}

function cwp_enqueue_vite_assets() {
	$is_dev = cwp_is_vite_dev_server_running();
	
	if ($is_dev) {
		// Load from Vite dev server
		wp_enqueue_script(
			'cwp-vite-client',
			'http://localhost:3000/@vite/client',
			array(),
			null,
			true
		);
		
		wp_enqueue_script(
			'cwp-main',
			'http://localhost:3000/src/main.ts',
			array('cwp-vite-client'),
			null,
			true
		);
		
		wp_enqueue_style(
			'cwp-main-css',
			'http://localhost:3000/src/main.css',
			array(),
			null
		);
	} else {
		// Load from built assets (existing manifest logic)
		$manifest_path = get_stylesheet_directory() . '/assets/.vite/manifest.json';
		if (file_exists($manifest_path)) {
			$manifest = json_decode(file_get_contents($manifest_path), true);
			// ... existing manifest-based enqueuing
		}
	}
}
add_action('wp_enqueue_scripts', 'cwp_enqueue_vite_assets');
```

---

## Appendix D: Expected Outcomes

### Scenario 1: Quick Wins Only (Week 1)
**Changes**: Dev server + scoped watchers + optimized copy
**Expected Results**:
- Rebuild time: 70-85% faster
- CPU usage: 40-50% reduction
- Developer satisfaction: Significantly improved

### Scenario 2: Medium-Term Complete (Week 2)
**Changes**: All quick wins + caching + block optimization
**Expected Results**:
- Initial build: 50-60% faster
- Rebuild time: 80-90% faster
- Memory usage: 30-40% reduction
- Zero system lag during development

### Scenario 3: Full Implementation (Week 3+)
**Changes**: All optimizations including HMR and module federation
**Expected Results**:
- Near-instant rebuilds (< 500ms)
- True hot module replacement
- Minimal system resource usage
- Best-in-class WordPress theme dev experience

---

## Contact & Escalation

**Document Owner**: Development Team  
**Last Updated**: 2024-11-20  
**Review Cycle**: Weekly during implementation, monthly after completion

**Escalation Path**:
1. Developer experiencing issues → Team Lead
2. Persistent performance issues → Architecture Review
3. Tooling limitations → Evaluate alternative solutions

---

## Conclusion

The primary performance bottleneck is the use of `vite build --watch` instead of the Vite development server. Switching to `vite` (dev server mode) combined with scoped file watchers and optimized plugin configuration should resolve 70-90% of the system lag issues.

The remaining optimizations (caching, build splitting, HMR integration) will further improve the development experience and ensure long-term performance sustainability.

**Next Step**: Begin Phase 1 baseline measurement and proceed with Week 1 implementation plan.
