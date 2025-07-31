# PocketBase Template Frontend

This is the frontend for the PocketBase Template project, built with React Router v7 in SPA mode.

## Architecture

- **Framework**: React Router v7 (SPA mode with SSR disabled)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand
- **Authentication**: PocketBase SDK
- **Testing**: Playwright

## Development

The frontend runs on a separate dev server during development:

```bash
# From project root
mise run dev-frontend

# Or directly
cd frontend && bun run dev
```

The dev server runs at `http://localhost:5173` and proxies API requests to the PocketBase backend.

## Production Build

The frontend is built as static files and served directly by PocketBase:

```bash
# From project root
mise run build-frontend

# Or directly
cd frontend && bun run build
```

Build output goes to `frontend/build/client/` which is served by PocketBase at the root path.

## Testing

Run Playwright tests:

```bash
# From project root
mise run test-frontend

# Or directly
cd frontend && bun run test
```

## Project Structure

```
frontend/
├── app/
│   ├── components/     # React components
│   ├── config/        # Configuration
│   ├── lib/           # Utilities
│   ├── routes/        # Route components
│   └── stores/        # Zustand stores
├── tests/             # Playwright tests
├── public/            # Static assets
└── build/             # Build output (gitignored)
```