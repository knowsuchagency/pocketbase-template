# PocketBase Template

A modern full-stack template featuring a Go-based [PocketBase](https://pocketbase.io/) backend API and React Router v7 frontend with SSR for Cloudflare Workers, styled with Tailwind CSS and shadcn/ui components.

This file also provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

- **Backend**: PocketBase API server (Go) - serves only API endpoints, no static files
- **Frontend**: React Router v7 with SSR for Cloudflare Workers - deployed separately
- **Authentication**: PocketBase auth with Zustand state management
- **Deployment**: Backend on any server/Docker, Frontend on Cloudflare Workers

## Features

- 🚀 PocketBase backend-as-a-service framework (v0.28+)
- ⚛️ React Router v7 with SSR and Hono for Cloudflare Workers deployment
- 🐳 Docker configuration for backend deployment
- 📦 Database migration system with automatic migrations in development
- 🛠️ Task automation with `mise` for development workflow
- 🔐 Environment-based superuser initialization
- 🏥 Health check endpoint at `/health`
- 🗄️ State Management with Zustand
- 🧪 End-to-end testing with Playwright
- 🎨 Tailwind CSS v4 with shadcn/ui components

## Prerequisites

- Docker and Docker Compose (for containerized backend deployment)
- [mise](https://mise.jdx.dev/) task runner and tool version manager

## Quick Start

### Backend Development

1. Clone the repository
```bash
git clone <repository-url>
cd pocketbase-template
```

2. Initialize the backend
```bash
mise run init
```

This will:
- Install all dependencies
- Create a `.env` file if it doesn't exist
- Prompt you to set superuser credentials
- Configure direnv for automatic environment loading

3. Run the backend development server
```bash
mise run dev-pb
```

The PocketBase server will start at `http://localhost:8090` (admin UI at `http://localhost:8090/_/`)

### Frontend Development

1. Navigate to the frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
bun install
```

3. Create a `.env` file for the frontend (optional - defaults to localhost:8090)
```bash
cp .env.example .env
# or manually create:
echo "VITE_BACKEND_URL=http://localhost:8090" > .env
```

4. Run the development server
```bash
bun run dev
```

The frontend will start at `http://localhost:5173`

### Docker Deployment (Backend Only)

1. Create a `.env` file:
```env
SUPERUSER_EMAIL=admin@example.com
SUPERUSER_PASSWORD=your-secure-password
```

2. Build and run with Docker Compose
```bash
docker-compose up -d
```

## Essential Commands

### Backend Commands

```bash
mise run dev-pb                  # Start PocketBase development server with --dev flag
mise run dev                     # Run both frontend and backend concurrently with named output
mise run build                   # Build the backend binary
mise run makemigration "name"    # Create new migration file
mise run migrate                 # Run pending migrations
mise run migratedown             # Rollback last migration
mise run show-collections        # Show all collections in human/LLM readable format
mise run reset                   # Reset the database (WARNING: deletes all data)
mise run test-backend            # Run Go backend tests
mise run update-deps             # Update all Go and frontend dependencies to latest versions
mise run deploy                  # Deploy frontend to Cloudflare Workers
```

### Frontend Commands

```bash
cd frontend
bun run dev                  # Start development server
bun run build                # Build for production
bun run preview              # Preview production build
bun run typecheck            # Run TypeScript type checking
bun run test                 # Run Playwright tests
bun run test:ui              # Run tests with interactive UI
bun run test:headed          # Run tests in headed browser mode
bun run test:debug           # Debug tests interactively
bun run test:report          # Show HTML test report
bun run deploy               # Deploy to Cloudflare Workers
```

### Testing Commands

```bash
mise run test                    # Run all tests (backend and frontend)
mise run test-backend            # Run Go backend tests
mise run test-frontend           # Run Playwright frontend tests
```

#### Playwright Configuration

The frontend tests are configured to:
- Automatically start both PocketBase backend and frontend dev server
- Run tests against Chromium by default (Firefox and WebKit are commented out)
- Use environment variables from `.env` for test credentials
- Generate HTML reports for test results

## Architecture Details

### Backend Structure

- **PocketBase Application**: Single binary with embedded SQLite database
- **Migration System**: Automatic migration support with `migratecmd` plugin
- **No Frontend Serving**: Backend serves only API endpoints, not static files
- **Index Route**: Root path (`/`) serves a DaisyUI-styled HTML page that shows links to the frontend url (if FRONTEND_URL is set) and admin panel
- **Environment Variables**:
  - `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD` for initial admin setup
  - `FRONTEND_URL` for frontend application link (optional)

### Frontend Architecture

- **Framework**: React Router v7 with SSR enabled for Cloudflare Workers
- **Backend Framework**: Hono for API routing in Workers environment
- **Styling**: Tailwind CSS v4 with shadcn/ui components (New York style)
- **State Management**: Zustand for global state and auth persistence
- **Testing**: Playwright for end-to-end testing
- **Build Output**: Cloudflare Workers bundle
- **Deployment**: Cloudflare Workers for global edge computing
- **Configuration**: Environment variables via `VITE_BACKEND_URL`
- **TypeScript**: Full TypeScript support with strict type checking

#### Key Frontend Components

- **Hono App** (`frontend/workers/app.ts`):
  - Configures Hono framework for Cloudflare Workers
  - Handles React Router SSR with `createRequestHandler`
  - Provides request context to React components

- **Routes Configuration** (`frontend/routes.ts`):
  - Explicit route definitions for React Router v7
  - Lazy loading for route components
  - Configured in `react-router.config.ts` with SSR enabled

- **Auth Store** (`frontend/app/stores/auth.store.ts`): 
  - Manages user authentication state
  - Handles login/logout operations
  - Persists auth state across sessions
  - Syncs with PocketBase's authStore

- **App Store** (`frontend/app/stores/app.store.ts`):
  - Manages global application state
  - Handles notifications system
  - Manages loading states

- **PocketBase Client** (`frontend/app/lib/pocketbase.ts`):
  - Configured PocketBase SDK instance
  - Auto-cancellation disabled for better control
  - Backend URL from environment variable

- **Protected Routes** (`frontend/app/components/ProtectedRoute.tsx`): Wrapper for auth-required pages
- **Login Form** (`frontend/app/components/LoginForm.tsx`): Full authentication flow with error handling
- **Notifications** (`frontend/app/components/NotificationList.tsx`): Toast-style notifications with auto-dismiss

#### Component Import Paths

When importing shadcn/ui components, use these standard paths:
```typescript
// UI Components
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

// Utilities
import { cn } from '~/lib/utils';
```

## Deployment

### Backend Deployment

The backend can be deployed using Docker:

```bash
# Build the image
docker build -t pocketbase-app .

# Run with environment variables
docker run -d \
  -p 8090:8090 \
  -v ./pb_data:/app/pb_data \
  -e SUPERUSER_EMAIL=admin@example.com \
  -e SUPERUSER_PASSWORD=secure-password \
  pocketbase-app
```

### Frontend Deployment

The frontend is configured for Cloudflare Workers:

```bash
cd frontend
bun run build
bun run deploy
```

This will deploy the application to Cloudflare Workers using wrangler.

Configuration is managed via `wrangler.jsonc`:
- Set your Cloudflare account ID
- Configure environment variables and secrets
- Adjust worker settings as needed

For production, ensure you set the backend URL:
```bash
wrangler secret put VITE_BACKEND_URL
# Enter your production PocketBase URL when prompted
```

## Project Structure

```
├── main.go                 # Backend entry point
├── migrations/             # Database migrations
├── routes/                 # Backend route handlers
│   ├── health.go          # Health check endpoint
│   ├── index.go           # Index route with DaisyUI landing page
│   └── routes.go          # Route registration
├── tests/                 # Backend Go tests
│   └── routes/            # Route handler tests
│       ├── health_test.go # Health endpoint tests
│       ├── index_test.go  # Index route tests
│       └── static_test.go # Static file serving tests
├── pb_data/               # PocketBase data (gitignored)
├── frontend/              # React Router v7 with Cloudflare Workers
│   ├── app/              
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   └── *.tsx     # App-specific components
│   │   ├── config/       # Configuration constants
│   │   ├── lib/          # Utilities and PocketBase client
│   │   ├── routes/       # Route components
│   │   └── stores/       # Zustand state stores
│   ├── workers/          # Cloudflare Workers entry
│   │   └── app.ts       # Hono app configuration
│   ├── tests/            # Playwright tests
│   ├── build/            # Build output (gitignored)
│   ├── .env.example      # Example environment variables
│   ├── react-router.config.ts # React Router configuration
│   ├── routes.ts         # React Router routes definition
│   ├── components.json   # shadcn/ui configuration
│   └── package.json      # Frontend dependencies
├── Dockerfile             # Backend Docker build
├── docker-compose.yml     # Container orchestration
├── mise.toml             # Task automation and tool version management
└── go.mod                # Go module definition
```

## Extending the Template

### Adding Custom Backend Routes

Add routes in the `OnServe` callback in `main.go`:

```go
app.OnServe().BindFunc(func(se *core.ServeEvent) error {
    se.Router.GET("/api/custom", func(re *core.RequestEvent) error {
        return re.JSON(200, map[string]string{"message": "Custom endpoint"})
    })
    return se.Next()
})
```

### Creating Frontend Routes

Add new routes in `frontend/app/routes/`:
```tsx
// frontend/app/routes/dashboard.tsx
export default function Dashboard() {
  return <div>Dashboard Page</div>;
}
```

### Creating Migrations

Generate a new migration:
```bash
mise run makemigration "add_custom_collection"
```

Then edit the generated file in the `migrations/` directory. For collection migrations, refer to the [PocketBase documentation](https://pocketbase.io/docs/go-collections/).

## Environment Variables

### Backend
- `SUPERUSER_EMAIL` - Email for the initial admin user
- `SUPERUSER_PASSWORD` - Password for the initial admin user
- `FRONTEND_URL` - Frontend application URL (optional, used for root path redirects)

### Frontend
- `VITE_BACKEND_URL` - Backend API URL (defaults to `http://localhost:8090`)

