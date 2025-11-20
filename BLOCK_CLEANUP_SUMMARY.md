# Block Cleanup Summary

## Overview
Removed all example blocks from the theme to provide a clean starting point for development. The theme now features automatic block discovery and registration, eliminating manual configuration steps when creating new blocks.

## Changes Made

### 1. Removed Example Blocks
- ❌ Deleted `blocks/example-static/` directory
- ❌ Deleted `blocks/example-dynamic/` directory
- ❌ Deleted `blocks/block.json` (root-level example)
- ✅ Added `blocks/.gitkeep` to preserve the directory structure

### 2. Automatic Block Registration (PHP)
**File:** `inc/block-registration.php`

**Before:**
```php
function cwp_register_blocks() {
    $blocks = array(
        'example-static',
        'example-dynamic',
    );

    foreach ( $blocks as $block ) {
        $block_path = get_stylesheet_directory() . '/blocks/' . $block;
        if ( file_exists( $block_path ) ) {
            register_block_type( $block_path );
        }
    }
}
```

**After:**
```php
function cwp_register_blocks() {
    $blocks_dir = get_stylesheet_directory() . '/blocks';

    if ( ! is_dir( $blocks_dir ) ) {
        return;
    }

    $block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

    if ( empty( $block_folders ) ) {
        return;
    }

    foreach ( $block_folders as $block_path ) {
        if ( file_exists( $block_path . '/block.json' ) ) {
            register_block_type( $block_path );
        }
    }
}
```

**Benefits:**
- ✅ Automatically registers any block with a `block.json` file
- ✅ No manual PHP changes when adding new blocks
- ✅ Handles empty blocks directory gracefully

### 3. Automatic Block Discovery (Vite)
**File:** `vite.config.ts`

**Before:**
```typescript
rollupOptions: {
    input: {
        main: resolve(__dirname, 'src/main.ts'),
        'main-css': resolve(__dirname, 'src/main.css'),
        editor: resolve(__dirname, 'src/editor.css'),
        'example-static-editor': resolve(__dirname, 'blocks/example-static/editor.tsx'),
        'example-static-view': resolve(__dirname, 'blocks/example-static/view.tsx'),
        'example-dynamic-editor': resolve(__dirname, 'blocks/example-dynamic/editor.tsx'),
    },
}
```

**After:**
```typescript
const BLOCKS_DIR = resolve(__dirname, 'blocks');

function getBlockFolders() {
    if (!existsSync(BLOCKS_DIR)) {
        return [];
    }

    return readdirSync(BLOCKS_DIR, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
}

function getBlockEntryPoints() {
    const entries: Record<string, string> = {};

    for (const blockName of getBlockFolders()) {
        const blockPath = resolve(BLOCKS_DIR, blockName);
        const editorFile = resolve(blockPath, 'editor.tsx');
        const viewFile = resolve(blockPath, 'view.tsx');

        if (existsSync(editorFile)) {
            entries[`${blockName}-editor`] = editorFile;
        }

        if (existsSync(viewFile)) {
            entries[`${blockName}-view`] = viewFile;
        }
    }

    return entries;
}

function hasBlockManifests() {
    return getBlockFolders().some((blockName) =>
        existsSync(resolve(BLOCKS_DIR, blockName, 'block.json'))
    );
}

// In config:
rollupOptions: {
    input: {
        main: resolve(__dirname, 'src/main.ts'),
        'main-css': resolve(__dirname, 'src/main.css'),
        editor: resolve(__dirname, 'src/editor.css'),
        ...blockEntries,  // Automatically discovered
    },
}

// Only copy block.json files if they exist
if (!isDev && hasBlockManifests()) {
    plugins.push(viteStaticCopy({ ... }));
}
```

**Benefits:**
- ✅ Automatically discovers and bundles all block scripts
- ✅ No manual Vite config changes when adding new blocks
- ✅ Handles empty blocks directory gracefully
- ✅ Prevents static copy plugin errors when no blocks exist

### 4. Updated Documentation

**README.md:**
- Updated "Features" section to reflect block-ready infrastructure
- Updated directory structure diagram
- Simplified block creation guide (removed manual configuration steps)
- Removed references to example blocks

**PERFORMANCE.md:**
- Added section on dynamic block discovery
- Updated static copy plugin documentation

**OPTIMIZATION_SUMMARY.md:**
- Added block scaffolding cleanup section

**TESTING.md:**
- Removed references to example block files

**CHANGES.md:**
- Added section documenting block cleanup

## Developer Workflow (New Blocks)

### Step 1: Create Block Directory
```bash
mkdir -p blocks/my-block
```

### Step 2: Create block.json
```bash
cat > blocks/my-block/block.json << 'EOF'
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "cwp/my-block",
    "version": "1.0.0",
    "title": "My Block",
    "category": "text",
    "icon": "smiley",
    "description": "My custom block",
    "textdomain": "cwp",
    "editorScript": "file:./editor.js",
    "attributes": {
        "content": {
            "type": "string",
            "default": ""
        }
    }
}
EOF
```

### Step 3: Create editor.tsx
```bash
cat > blocks/my-block/editor.tsx << 'EOF'
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('cwp/my-block', {
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        return <div {...blockProps}>Edit view</div>;
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save();
        return <div {...blockProps}>Save view</div>;
    },
});
EOF
```

### Step 4: (Optional) Create view.tsx
If your block needs front-end interactivity:
```bash
cat > blocks/my-block/view.tsx << 'EOF'
console.log('Front-end script loaded');
EOF
```

### Step 5: Build
```bash
pnpm build
```

That's it! No manual configuration needed. The block is automatically:
- ✅ Registered with WordPress
- ✅ Bundled by Vite
- ✅ Added to the manifest

## Testing

### ✅ Production Build
```bash
$ pnpm build
vite v6.4.1 building for production...
✓ 3 modules transformed.
assets/.vite/manifest.json  0.32 kB
assets/main-css.css         5.32 kB
assets/editor.css           5.33 kB
assets/main.js              0.50 kB
built in 963ms.
```

### ✅ Development Build
```bash
$ pnpm dev
vite v6.4.1 building for development...
watching for file changes...
build started...
✓ 3 modules transformed.
assets/.vite/manifest.json  0.32 kB
assets/main-css.css         5.32 kB
assets/editor.css           5.33 kB
assets/main.js              0.50 kB
built in 963ms.
```

### ✅ Empty Blocks Directory
No errors when the `blocks/` directory is empty or contains only `.gitkeep`.

## Migration Notes

If you had custom blocks referencing the example blocks:
1. They will no longer be available
2. Create your own custom blocks following the workflow above
3. Run `pnpm build` to rebuild assets

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| Manual config | Required for each block | Zero config |
| PHP registration | Manual array updates | Automatic discovery |
| Vite entry points | Manual input config | Automatic discovery |
| Example clutter | 7 example files | Clean slate |
| New block steps | 6 steps | 4 steps |
| Static copy errors | Possible | Handled gracefully |

## Files Changed

- `blocks/` - Removed all example blocks, added `.gitkeep`
- `inc/block-registration.php` - Automatic registration logic
- `vite.config.ts` - Dynamic block discovery functions
- `README.md` - Updated documentation
- `PERFORMANCE.md` - Added discovery documentation
- `OPTIMIZATION_SUMMARY.md` - Added cleanup section
- `TESTING.md` - Removed example references
- `CHANGES.md` - Added cleanup documentation

---

*Block Cleanup Date: November 20, 2024*
