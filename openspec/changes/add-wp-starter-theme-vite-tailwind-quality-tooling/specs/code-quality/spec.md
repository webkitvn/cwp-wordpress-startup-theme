## ADDED Requirements

### Requirement: PHPCS with WordPress Coding Standards
The project MUST include PHPCS configured with WordPress Coding Standards via Composer, runnable locally and in CI, targeting PHP 8.3.

#### Scenario: PHPCS succeeds on clean code
- **WHEN** running `composer phpcs`
- **THEN** PHP files are checked against `WordPress-Core`, `WordPress-Docs`, and `WordPress-Extra` as configured

### Requirement: ESLint with @wordpress/eslint-plugin
TypeScript MUST be linted using `@wordpress/eslint-plugin` with rules compatible with ES modules and WordPress best practices, scoped to `/src` directory only.

#### Scenario: ESLint catches issues
- **WHEN** running `npm run lint:js`
- **THEN** violations are reported per the configured plugin and rules for files in `/src` only

### Requirement: File Length Limits for JS/TS
Linting MUST warn on files exceeding 400 lines and error on files exceeding 500 lines.

#### Scenario: 400-line warning
- **WHEN** running the standard lint script
- **THEN** files over 400 lines produce warnings using `max-lines` (development feedback)

#### Scenario: 500-line error
- **WHEN** running the strict/CI lint script
- **THEN** files over 500 lines produce errors by overriding the rule via CLI (e.g., `eslint --rule "max-lines:[2,{max:500,skipBlankLines:true,skipComments:true}]"`) and CI fails the build

### Requirement: PHP Linting
The project MUST provide a fast PHP syntax lint (e.g., `php -l` or `php-parallel-lint`) via Composer script, compatible with PHP 8.3.

#### Scenario: PHP lint fails on syntax errors
- **WHEN** running `composer lint:php`
- **THEN** non-zero exit code is returned on PHP syntax errors

### Requirement: Prettier Code Formatting
The project MUST include Prettier with tab indentation for consistent code formatting.

#### Scenario: Prettier formats code
- **WHEN** running `npm run format`
- **THEN** TypeScript and CSS files are formatted with tabs and consistent style


