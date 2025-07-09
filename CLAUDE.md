# PocketBase Template

A modern full-stack template featuring a Go-based [PocketBase](https://pocketbase.io/) backend and React Router v7 SPA frontend with Tailwind CSS and DaisyUI.

This file also provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Features

- 🚀 PocketBase backend-as-a-service framework (v0.28+)
- ⚛️ React Router v7 SPA with Tailwind CSS v4 and DaisyUI
- 🐳 Docker and Docker Compose configuration with multi-stage builds
- 📦 Database migration system with automatic migrations in development
- 🛠️ Task automation with `just` for concurrent development
- 🔐 Environment-based superuser initialization
- 🏥 Health check endpoint at `/health`
- 🗄️ State Management with Zustand
- 🧪 End-to-end testing with Playwright

## Prerequisites

- Go 1.24 or higher
- [Bun](https://bun.sh/) for frontend development
- Docker and Docker Compose (for containerized deployment)
- [just](https://github.com/casey/just) task runner (optional but recommended)

## Quick Start

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd pocketbase-template
```

2. Initialize the project
```bash
just init
```

This will:
- Install all dependencies (frontend and backend)
- Create a `.env` file if it doesn't exist
- Prompt you to set superuser credentials
- Configure direnv for automatic environment loading

3. Run the development server (frontend and backend concurrently)
```bash
just dev
```

This will start:
- PocketBase server at `http://localhost:8090` (admin UI at `http://localhost:8090/_/`)
- Frontend dev server at `http://localhost:5173`

### Docker Deployment

1. Initialize the project and create configuration
```bash
just init
```

Or manually create a `.env` file:
```env
SUPERUSER_EMAIL=admin@example.com
SUPERUSER_PASSWORD=your-secure-password
```

2. Build and run with Docker Compose
```bash
docker-compose up -d
```

## Essential Commands

### Initial Setup

```bash
just init                    # Initialize project: install dependencies, create .env (if needed) with prompted credentials, configure direnv
just install-deps            # Install frontend and backend dependencies
```

### Development

```bash
just dev                     # Run both frontend and backend concurrently
just dev-pb                  # Start PocketBase development server with --dev flag
just dev-bun                 # Run bun development server
just build                   # Build both frontend and backend
```

### Frontend Development

```bash
cd frontend
bun run dev                  # Start development server
bun run build                # Build static files (outputs to frontend/build/client)
bun run start                # Start production server
bun run typecheck            # Run TypeScript type checking
bun run test                 # Run Playwright tests
bun run test:ui              # Run tests with interactive UI mode
bun run test:headed          # Run tests in headed browser mode
bun run test:debug           # Debug tests interactively
bun run test:report          # Open HTML test report
```

### Database Migrations

```bash
just makemigration "name"    # Create new migration file
just migrate                 # Run pending migrations
just migratedown             # Rollback last migration
just show-collections        # Show all collections in human/LLM readable format (use --show-hidden flag to include hidden collections)
just reset                   # Reset the database (WARNING: deletes all data)
```

### Testing

```bash
just test                    # Run all tests (backend and frontend)
just test-backend            # Run Go backend tests  
just test-frontend           # Run Playwright frontend tests
```

### Dependency Management

```bash
just update-deps             # Update all Go dependencies
just update-pocketbase       # Update PocketBase to latest version
just check-updates           # Check for available updates to all dependencies
```

### Docker Operations

```bash
docker-compose up -d         # Start container in background
docker-compose down          # Stop container
docker-compose build         # Rebuild image
```

## Architecture

### Core Structure

- **PocketBase Application**: Single binary with embedded SQLite database
- **Frontend Serving**: Static files served from `frontend/build/client/` directory at root path
- **Migration System**: Automatic migration support with `migratecmd` plugin
- **Module Import**: Migrations imported as `_ "app/migrations"` in main.go
- **Environment-based Configuration**:
  - Backend: Superuser credentials via `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD` (see `.env.example`)
  - Frontend: Backend URL via `VITE_BACKEND_URL` environment variable

### Frontend Architecture

- **Framework**: React Router v7 with SSR disabled for SPA deployment
- **Styling**: Tailwind CSS v4 with DaisyUI component library
- **State Management**: Zustand for global state management
- **Testing**: Playwright for end-to-end functional testing
- **Build Output**: Static files built to `frontend/build/client/` directory
- **Deployment**: React Router SPA served directly from `frontend/build/client/` in container
- **SPA Mode**: Client-side routing with SSR disabled in react-router.config.ts
- **Configuration**: Constants centralized in `frontend/app/config/constants.ts` module

#### State Management with Zustand

The frontend uses Zustand for global state management with the following stores:

- **Auth Store** (`frontend/app/stores/auth.store.ts`): 
  - Manages user authentication state
  - Handles login/logout operations
  - Persists auth state across sessions
  - Syncs with PocketBase's authStore

- **App Store** (`frontend/app/stores/app.store.ts`):
  - Manages global application state
  - Handles notifications system
  - Manages loading states

Key features:
- TypeScript support with proper typing
- DevTools integration for debugging
- Persistence middleware for auth state
- Automatic PocketBase auth synchronization

#### Testing with Playwright

The frontend includes comprehensive end-to-end testing using Playwright:

- **Test Configuration**: `frontend/playwright.config.ts` configures test settings
- **Automatic Server Startup**: PocketBase server starts automatically before tests
- **Browser Support**: Tests run in Chromium, Firefox, and WebKit
- **Test Location**: Test specs in `frontend/tests/` directory
- **Base URL**: Tests run against `http://localhost:8090` (built frontend served by PocketBase)

### Key Implementation Details

1. **Auto-migration**: Enabled only during development (detected via `go run` execution)
2. **Custom Routes**: Register via `app.OnServe().BindFunc()` callback
3. **Migration Pattern**: Each migration has up/down functions for apply/revert operations
4. **Data Persistence**: `pb_data/` directory for database and uploaded files
5. **PocketBase Documentation**: When implementing features involving PocketBase, use `go doc` to view the relevant documentation. For example: `go doc github.com/pocketbase/pocketbase/core`.

### Docker Setup

- Multi-stage build:
  - `oven/bun:1` for frontend build
  - `golang:1.24-alpine` for backend build
  - `alpine:latest` for runtime
- Volume mount: `./pb_data:/app/pb_data` for data persistence
- Static binary: Built with `CGO_ENABLED=0` for Alpine compatibility
- Frontend served from `frontend/build/client/` directory using PocketBase's apis.Static() handler

### Migrations

- Use the `just makemigration` recipe to create a migration
- For migrations that create or update Collections, read the latest documentation on https://pocketbase.io/docs/go-collections/ before writing any code

## Project Structure

```
├── main.go                 # Application entry point
├── migrations/             # Database migrations
│   └── 1749628624_initial_superuser.go
├── pb_data/               # PocketBase data (gitignored)
├── frontend/              # React Router v7 SPA
│   ├── app/              # Application routes and components
│   │   ├── stores/       # Zustand state management
│   │   ├── components/   # React components
│   │   ├── routes/       # Route components
│   │   └── lib/          # Utilities and PocketBase client
│   ├── public/           # Static assets
│   ├── build/            # Build output (gitignored)
│   │   └── client/       # Static files served by PocketBase
│   ├── tests/            # Playwright end-to-end tests
│   ├── package.json      # Frontend dependencies
│   ├── playwright.config.ts # Playwright test configuration
│   ├── tailwind.config.ts # Tailwind CSS v4 configuration
│   └── react-router.config.ts # React Router configuration
├── Dockerfile             # Multi-stage Docker build
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

## Environment Variables

### Backend
- `SUPERUSER_EMAIL` - Email for the initial admin user
- `SUPERUSER_PASSWORD` - Password for the initial admin user

### Frontend
- `VITE_BACKEND_URL` - Backend URL for development (defaults to `http://localhost:8090`)

## License

MIT License - see LICENSE file for details
