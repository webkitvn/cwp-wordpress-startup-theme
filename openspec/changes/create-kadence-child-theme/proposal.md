## Why
The current theme is a standalone starter theme, but there's a need for a Kadence Child theme variant that inherits from the Kadence parent theme while maintaining the modern build tooling and development workflow.

## What Changes
- **BREAKING**: Convert standalone theme to Kadence child theme
- Remove unnecessary theme files (header.php, footer.php, theme-setup.php)
- Update theme header to declare Kadence as parent theme
- Modify functions.php to remove theme setup and use Kadence's functionality
- Maintain existing build tooling and development workflow
- Keep only essential files needed for child theme functionality

## Impact
- Affected specs: theme-scaffold
- Affected code: style.css, functions.php, inc/theme-setup.php, header.php, footer.php
- New structure: Minimal child theme with Kadence parent dependency
