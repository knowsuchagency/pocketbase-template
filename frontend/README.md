# PocketBase Project Frontend

This is the frontend for the PocketBase Project project, built with React Router v7 in SPA mode.

## Architecture

- **Framework**: React Router v7 (SPA mode with SSR disabled)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**:
  - **Server State**: TanStack Query (React Query) for API data and auth
  - **UI State**: Zustand for local UI state (theme, notifications)
- **Authentication**: PocketBase SDK with React Query integration
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
│   ├── hooks/         # React Query hooks
│   │   ├── queries/   # Data fetching hooks
│   │   └── mutations/ # Data mutation hooks
│   ├── lib/           # Utilities
│   ├── providers/     # React providers (QueryClient)
│   ├── routes/        # Route components
│   ├── services/      # API service layers
│   └── stores/        # Zustand stores (UI state only)
├── tests/             # Playwright tests
├── public/            # Static assets
└── build/             # Build output (gitignored)
```

## State Management

The frontend uses a hybrid approach to state management:

### Server State (TanStack Query)

- Authentication state and user data
- API responses and cache management
- Automatic background refetching
- Optimistic updates for mutations

### UI State (Zustand)

- Theme preferences
- Notification system
- Local UI state that doesn't need server sync

## Authentication

Authentication is handled through a combination of:

- PocketBase SDK for the actual auth operations
- TanStack Query for state management and caching
- Custom hooks (`useAuth`) for easy access throughout the app

Example usage:

```typescript
const { user, isAuthenticated, login, logout, isLoading } = useAuth();
```
