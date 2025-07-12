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
- 🛠️ Task automation with `just` for development workflow
- 🔐 Environment-based superuser initialization
- 🏥 Health check endpoint at `/health`
- 🗄️ State Management with Zustand
- 🧪 End-to-end testing with Playwright

## Prerequisites

- Go 1.24 or higher
- [Bun](https://bun.sh/) for frontend development
- Docker and Docker Compose (for containerized backend deployment)
- [just](https://github.com/casey/just) task runner (optional but recommended)

## Quick Start

### Backend Development

1. Clone the repository
```bash
git clone <repository-url>
cd pocketbase-template
```

2. Initialize the backend
```bash
just init
```

This will:
- Install all dependencies
- Create a `.env` file if it doesn't exist
- Prompt you to set superuser credentials
- Configure direnv for automatic environment loading

3. Run the backend development server
```bash
just dev-pb
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

3. Create a `.env` file for the frontend
```bash
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
just dev-pb                  # Start PocketBase development server with --dev flag
just build                   # Build the backend binary
just makemigration "name"    # Create new migration file
just migrate                 # Run pending migrations
just migratedown             # Rollback last migration
just show-collections        # Show all collections in human/LLM readable format
just reset                   # Reset the database (WARNING: deletes all data)
just test-backend            # Run Go backend tests
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
just test                    # Run all tests (backend and frontend)
just test-backend            # Run Go backend tests
just test-frontend           # Run Playwright frontend tests
```

#### Playwright Configuration

The frontend tests are configured to:
- Automatically start both PocketBase backend and frontend dev server
- Run tests against all major browsers (Chromium, Firefox, WebKit)
- Use environment variables from `.env` for test credentials
- Generate HTML reports for test results

## Architecture Details

### Backend Structure

- **PocketBase Application**: Single binary with embedded SQLite database
- **Migration System**: Automatic migration support with `migratecmd` plugin
- **CORS**: PocketBase handles CORS automatically (allows all origins by default since it's stateless)
- **No Frontend Serving**: Backend serves only API endpoints, not static files
- **Environment Variables**:
  - `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD` for initial admin setup

### Frontend Architecture

- **Framework**: React Router v7 with SSR enabled for Cloudflare Workers
- **Backend Framework**: Hono for API routing in Workers environment
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand for global state and auth persistence
- **Testing**: Playwright for end-to-end testing
- **Build Output**: Cloudflare Workers bundle
- **Deployment**: Cloudflare Workers for global edge computing
- **Configuration**: Environment variables via `VITE_BACKEND_URL`

#### Key Frontend Components

- **Hono App** (`frontend/workers/app.ts`):
  - Configures Hono framework for Cloudflare Workers
  - Handles React Router SSR with `createRequestHandler`
  - Provides request context to React components

- **Routes Configuration** (`frontend/app/routes.ts`):
  - Explicit route definitions for React Router
  - File-based routing with lazy loading support

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

- **Protected Routes**: Components wrapped with authentication checks
- **Login Form**: Full authentication flow with error handling
- **Notifications**: Toast-style notifications with auto-dismiss

#### Component Import Paths

When importing shadcn/ui components, use the correct nested path:
```typescript
// Correct
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

// Incorrect - will fail
import { Button } from '~/components/components/ui/button';
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

Configuration is managed via `wrangler.json`:
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
│   └── routes.go          # Route registration
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
│   ├── app.ts            # App routes configuration
│   ├── routes.ts         # React Router routes definition
│   └── package.json      # Frontend dependencies
├── frontend-daisyui/      # Old DaisyUI frontend (archived)
├── Dockerfile             # Backend Docker build
├── docker-compose.yml     # Container orchestration
├── justfile              # Task automation
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
just makemigration "add_custom_collection"
```

Then edit the generated file in the `migrations/` directory. For collection migrations, refer to the [PocketBase documentation](https://pocketbase.io/docs/go-collections/).

Example migration for creating a test user:
```go
package migrations

import (
    "os"
    "github.com/pocketbase/pocketbase/core"
    m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
    m.Register(func(app core.App) error {
        // Only create test user in development mode
        if os.Getenv("GO_ENV") == "production" {
            return nil
        }

        collection, err := app.FindCollectionByNameOrId("users")
        if err != nil {
            return err
        }

        // Check if test user already exists
        record, _ := app.FindAuthRecordByEmail("users", os.Getenv("SUPERUSER_EMAIL"))
        if record != nil {
            return nil // User already exists
        }

        // Create test user with same credentials as superuser
        record = core.NewRecord(collection)
        record.Set("email", os.Getenv("SUPERUSER_EMAIL"))
        record.Set("emailVisibility", true)
        record.SetPassword(os.Getenv("SUPERUSER_PASSWORD"))

        return app.Save(record)
    }, func(app core.App) error {
        // Rollback: Remove test user
        record, err := app.FindAuthRecordByEmail("users", os.Getenv("SUPERUSER_EMAIL"))
        if err != nil {
            return nil
        }
        return app.Delete(record)
    })
}
```

## Environment Variables

### Backend
- `SUPERUSER_EMAIL` - Email for the initial admin user
- `SUPERUSER_PASSWORD` - Password for the initial admin user

### Frontend
- `VITE_BACKEND_URL` - Backend API URL (defaults to `http://localhost:8090`)

## Security Considerations

1. **CORS**: PocketBase allows all origins by default (stateless API)
2. **Authentication**: All API requests should include PocketBase auth tokens
3. **HTTPS**: Use HTTPS in production for both frontend and backend
4. **Environment Variables**: Never commit sensitive values to version control

## License

MIT License - see LICENSE file for details

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.