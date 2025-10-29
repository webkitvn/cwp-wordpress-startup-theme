## MODIFIED Requirements
### Requirement: Theme Skeleton Layout
The theme SHALL provide a minimal child theme structure that inherits from Kadence parent theme, with `/src` for sources and `/assets` for built artifacts, including core WordPress entry points and `inc/` for modular PHP.

#### Scenario: Child theme files present
- **WHEN** the repository is cloned
- **THEN** the theme contains `style.css` with parent theme declaration, `functions.php`, and an `inc/` directory
- **AND** authoring sources exist under `/src` with `ts/`, `tsx/`, and `scss` (Tailwind imported via CSS `@import "tailwindcss"`)
- **AND** build outputs are emitted under `/assets` and are not committed to source control
- **AND** header.php and footer.php are removed (inherited from parent)

#### Scenario: Parent theme dependency
- **WHEN** the theme is activated
- **THEN** Kadence parent theme must be installed and active
- **AND** child theme inherits all parent theme functionality

## MODIFIED Requirements
### Requirement: Text Domain
The theme MUST use the text domain `cwp` and declare it in the theme header along with the parent theme declaration.

#### Scenario: Text domain and parent declared
- **WHEN** the theme initializes
- **THEN** `style.css` header includes `Text Domain: cwp` and `Template: kadence`

## REMOVED Requirements
### Requirement: Theme Setup Functions
**Reason**: Child themes inherit setup from parent theme
**Migration**: Remove `inc/theme-setup.php` and related setup functions from `functions.php`

### Requirement: Header and Footer Templates
**Reason**: Child themes inherit header and footer from parent theme
**Migration**: Remove `header.php` and `footer.php` files
