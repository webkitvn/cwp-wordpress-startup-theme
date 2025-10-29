<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
Sources live in `src/` (Vite entry `main.ts`, Tailwind styles) and `blocks/` (block.json metadata plus React scripts per block). PHP hooks sit under `inc/`, reusable partials in `template-parts/`, and root templates follow WordPress hierarchy. Compiled assets land in `assets/`; rebuild instead of editing output.

## Build, Test & Development Commands
Run `npm install` once per environment, `npm run dev` for watch builds, and `npm run build` for production bundles. Lint with `npm run lint:js` or the stricter variant before merge, format via `npm run format`, and enforce PHP standards with `composer run phpcs` plus syntax checks through `composer run lint:php`.

## Coding Style & Naming Conventions
PHP follows WordPress PHPCS defaults: tab indentation, snake_case functions prefixed with `cwp_`, and escaped output using core helpers. Front-end code favors ES modules, functional React components, and kebab-case filenames matching block slugs. Prettier manages JS/TS formatting—avoid manual spacing tweaks—and colocate custom SCSS with the component using it.

## Testing Guidelines
Linting serves as baseline automation; both JS/TS and PHP checks must pass before opening a PR. Exercise new blocks in a local WordPress sandbox (Local, wp-env, etc.), confirm editor registration and front-end rendering, then capture reproduction or verification steps in the PR description.

## Commit & Pull Request Guidelines
Write imperative, sentence-case commit subjects (e.g., `Update theme metadata in style.css`) with concise bodies explaining motivation. Keep PRs focused, summarise the change, note test results, and attach before/after visuals for UI adjustments. Link Jira or GitHub issues and flag reviewers on both PHP and front-end when the work spans stacks.

## Security & Configuration Tips
Never commit secrets, uploads, or environment exports—confirm `.gitignore` coverage and scrub local artifacts. Sanitize and escape dynamic output in PHP and JSX via WordPress helpers, and review `npm audit` plus `composer outdated`, documenting any required configuration follow-up in the PR.

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase