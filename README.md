# Skeleton SPA

A single-page application starter built with React 19, TanStack Router, and Vite, running on [Bun](https://bun.sh). It ships with file-based routing, auto code-splitting, Tailwind CSS v4, and integrated TanStack devtools.

## Tech stack

- **Runtime / package manager** — Bun
- **Build tool** — Vite 7
- **Framework** — React 19
- **Routing** — TanStack Router (file-based, auto code-splitting)
- **Styling** — Tailwind CSS v4
- **Devtools** — TanStack devtools (router + hotkeys)
- **Lint / format** — Biome + TypeScript (`tsgo`)

## Requirements

- [Bun](https://bun.sh) (latest)

## Getting started

```bash
# Install dependencies
bun install

# Start the dev server on http://localhost:3000
bun run dev
```

### Environment

Environment variables are read from `.env` at the project root. Only variables prefixed with `VITE_` are exposed to the client:

```env
VITE_EXAMPLE_KEY=...
```

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `bun run dev`     | Start the Vite dev server on port 3000       |
| `bun run build`   | Build for production into `dist/`            |
| `bun run preview` | Preview the production build locally         |
| `bun run lint`    | Type-check (`tsgo`) and lint with Biome      |
| `bun run test`    | Run the test suite with `bun test`           |

## Project structure

```
src/
  bootstrap/      App entry point, HTML template, generated route tree
    app.tsx       Router setup and React root render
  routes/         File-based routes (TanStack Router)
    __root.tsx    Root layout and devtools
    index.tsx     Index route ("/")
  features/       Feature modules
  shared/         Shared code across features
  styles/         Global styles (app.css)
public/           Static assets (favicon, logo)
```

The Vite root is `src/bootstrap`, with the project root used for env files and the `public/` directory. The `@` alias maps to `src/`.

## Routing

Routes live in `src/routes` and are compiled into `src/bootstrap/routeTree.gen.ts` by the TanStack Router plugin. Add a file there to create a new route — the route tree regenerates automatically during development.
