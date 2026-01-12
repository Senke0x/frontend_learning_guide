# Repository Guidelines

## Project Structure & Module Organization
`client/` is the Vite + React + TypeScript app. `client/src` holds `pages/`, `components/`, `hooks/`, `contexts/`, `data/`, and `lib/`. `server/` contains an Express entry point that serves the built SPA. `shared/` holds shared constants, and `day1/` contains learning notes and demos. Build artifacts land in `dist/public` (client) and `dist/index.js` (server); treat them as generated.

## Build, Test, and Development Commands
Use pnpm (see `package.json`).
- `pnpm dev` Start the Vite dev server (binds host; defaults to 3000).
- `pnpm build` Build the client and bundle the server to `dist/`.
- `pnpm preview` Preview the client build with Vite.
- `pnpm start` Run the production server from `dist/index.js`.
- `pnpm check` Type-check with `tsc --noEmit`.
- `pnpm format` Format with Prettier.

## Coding Style & Naming Conventions
- TypeScript + React; use Prettier for formatting (2-space indent, semicolons, trailing commas).
- Components use `PascalCase` filenames (e.g., `client/src/components/DayContent.tsx`); hooks use `useCamelCase`.
- Prefer path aliases: `@` for `client/src`, `@shared` for `shared`, and `@assets` for `attached_assets`.
- Styling is Tailwind CSS (see `client/src/index.css`); prefer utility classes over new CSS files.

## Testing Guidelines
- No automated tests are present; Vitest is listed but not wired to a `test` script.
- If you add tests, place them near the code (`*.test.tsx`) and document how to run them.

## Commit & Pull Request Guidelines
- Git history is not available in this workspace; use short imperative commits (e.g., "Add day 4 content").
- PRs should include a summary, testing notes (e.g., `pnpm check`), and screenshots for UI changes; link related issues.

## Configuration & Content Notes
- Vite's root is `client/`; the server serves `dist/public` and reads `PORT` or defaults to 3000.
- Course content lives in `client/src/data` and `day1/`; follow existing naming patterns like `day8Content.ts`.
