# Frontend Task — Card Game (Snap)

A card-drawing game built with React 19, TypeScript, and Vite. The app fetches a shuffled deck from the [Deck of Cards API](https://deckofcardsapi.com/), lets you draw cards one by one, and detects when two consecutively drawn cards share the same value (a "Snap").

**Live demo:** https://gentlecodes-fe.hopo.online/

**Repository:** https://github.com/hopogc/frontend-task

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **Redux Toolkit** — state management
- **React Router v7** — routing
- **Tailwind CSS v4** + **shadcn/ui** — styling
- **Vitest** + **Testing Library** + **MSW** — unit and component testing

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Getting started

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev
```

### Other commands

| Command | Description |
|---|---|
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run coverage` | Run tests and generate a coverage report |

---

## Running the tests

```bash
# Single run (no watch)
npm run test:run

# Watch mode (re-runs on file changes)
npm test

# With coverage report
npm run coverage
```

The test suite covers:

- **API layer** — `src/api/deckApi.test.ts` — deck fetching and card-draw logic via MSW mocks
- **Hooks** — `src/hooks/useDelayedFlag.test.ts`, `src/hooks/useNetworkAlert.test.ts`
- **Components** — `CardSlot`, `GameSummary`, `LoadingOverlay`, `SnapMessage`, `Spinner`
- **Page** — `src/pages/GamePage.test.tsx` — full page integration with Redux store and router
