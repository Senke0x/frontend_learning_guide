# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a frontend learning guide application - an interactive educational platform for teaching JavaScript/TypeScript and React development. The app displays structured course content across multiple days (Day 0-7), with markdown rendering, code examples, and interactive components.

## Development Commands

**Package Manager**: Use `pnpm` for all package operations.

- `pnpm dev` - Start Vite dev server (binds to host, defaults to port 3000)
- `pnpm build` - Build client to `dist/public` and bundle server to `dist/index.js`
- `pnpm start` - Run production server from `dist/index.js`
- `pnpm preview` - Preview the production build with Vite
- `pnpm check` - Type-check with TypeScript (no emit)
- `pnpm format` - Format code with Prettier

## Architecture

### Monorepo Structure

The project uses a monorepo structure with three main directories:

- **`client/`** - Vite + React + TypeScript SPA
  - `client/src/pages/` - Route pages (Home, About, Resources, NotFound)
  - `client/src/components/` - React components including UI library (shadcn/ui)
  - `client/src/data/` - Course content data files (`day0Content.ts` through `day7Content.ts`)
  - `client/src/hooks/` - Custom React hooks
  - `client/src/contexts/` - React contexts (ThemeContext)
  - `client/src/lib/` - Utility functions

- **`server/`** - Express server that serves the built SPA
  - Simple static file server with client-side routing support
  - Serves from `dist/public` in production

- **`shared/`** - Shared constants between client and server

- **`day0/` and `day1/`** - Learning materials and demo code
  - Contains markdown documentation and TypeScript demo files
  - Not part of the built application

### Key Technologies

- **Frontend**: React 19, TypeScript, Vite, Wouter (routing)
- **UI Components**: shadcn/ui (Radix UI primitives), Tailwind CSS v4
- **Styling**: Tailwind CSS with custom theme via CSS variables
- **Forms**: React Hook Form with Zod validation
- **Markdown**: react-markdown with remark-gfm
- **Code Highlighting**: react-syntax-highlighter

### Path Aliases

Configured in both `vite.config.ts` and `tsconfig.json`:
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Routing

Uses Wouter for client-side routing. Routes defined in `client/src/App.tsx`:
- `/` - Home page with course overview
- `/about` - About page
- `/resources` - Resources page
- `/404` - Not found page (fallback)

Server handles client-side routing by serving `index.html` for all routes.

## Content Management

### Adding New Course Content

Course content is structured as TypeScript files in `client/src/data/`:

1. Create a new file following the pattern `dayXContent.ts`
2. Export a `DayContent` object with the structure:
   ```typescript
   {
     day: number,
     title: string,
     subtitle: string,
     overview: string,
     sections: Section[],
     homework: Homework[]
   }
   ```
3. Import and add to the `courseContent` array in `client/src/data/courseContent.ts`

Each section supports:
- Markdown content rendering
- Code examples with syntax highlighting
- Key points (bullet list)
- External references with URLs

## Styling Conventions

- **Tailwind CSS v4** with utility-first approach
- Theme colors defined via CSS variables in `client/src/index.css`
- Dark mode support via `next-themes` (ThemeProvider in App.tsx)
- Component styling uses shadcn/ui patterns (variants via class-variance-authority)
- Prefer utility classes over custom CSS

## Component Patterns

### UI Components

Located in `client/src/components/ui/` - these are shadcn/ui components:
- Pre-built, accessible components from Radix UI
- Customized via Tailwind classes
- Managed via `components.json` configuration

### Custom Components

- **DayContent.tsx** - Renders structured course content for a specific day
- **MarkdownRenderer.tsx** - Renders markdown with custom styling
- **CodeBlock.tsx** - Syntax-highlighted code blocks
- **ErrorBoundary.tsx** - Error boundary wrapper

## Build Output

- Client builds to `dist/public/`
- Server bundles to `dist/index.js` (ESM format via esbuild)
- Production server reads `PORT` env var or defaults to 3000

## TypeScript Configuration

- Strict mode enabled
- Module resolution: "bundler"
- JSX preserved (handled by Vite)
- No emit (Vite handles compilation)
- Includes: `client/src`, `shared`, `server`

## Known Issues

See `rendering_issues.md` and `rendering_fix_summary.md` for documented rendering issues and their fixes.

## Notes

- No automated tests currently configured (Vitest is installed but not wired)
- Uses pnpm patches for `wouter@3.7.1` (see `patches/` directory)
- Vite dev server allows specific hosts for Manus platform deployment
