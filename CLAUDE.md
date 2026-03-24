# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Type-check and build for production (tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

This is a React 19 + TypeScript + Vite project. The entry point is `src/main.tsx`, which mounts `src/App.tsx` into `index.html`.

SVG icons are sprite-based and served from `public/icons.svg` — reference them via `<use href="/icons.svg#icon-name">`.

## TypeScript Config

Strict mode is enabled with additional checks: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`. The build will fail on any of these violations. `verbatimModuleSyntax` is on, so use `import type` for type-only imports.
