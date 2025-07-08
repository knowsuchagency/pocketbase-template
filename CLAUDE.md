# PocketBase Template

A modern full-stack template featuring a Go-based [PocketBase](https://pocketbase.io/) backend and SvelteKit SPA frontend with Tailwind CSS and DaisyUI.

This file serves as both project documentation and guidance for Claude Code (claude.ai/code) when working with code in this repository.

## Features

- 🚀 PocketBase backend-as-a-service framework (v0.28+)
- ⚡ SvelteKit SPA with Tailwind CSS v4 and DaisyUI
- 🐳 Docker and Docker Compose configuration with multi-stage builds
- 📦 Database migration system with automatic migrations in development
- 🛠️ Task automation with `just` for concurrent development
- 🔐 Environment-based superuser initialization
- 🏥 Health check endpoint at `/health`
- 🧪 Unified Playwright test suite for frontend testing

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
VITE_BACKEND_URL=http://localhost:8090
```

2. Build and run with Docker Compose
```bash
docker-compose up -d
```

## Essential Commands

### Initial Setup

```bash
just init                    # Initialize project: install dependencies, create .env (if needed) with prompted credentials, configure direnv
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
bun run build                # Build static files (outputs to frontend/build)
bun run preview              # Preview production build
bun run check                # Run svelte-check for type checking
bun run test                 # Run all Playwright tests
bun run test:ui              # Run tests in interactive UI mode
```

### Database Migrations

```bash
just makemigration "name"    # Create new migration file
just migrate                 # Run pending migrations
just migratedown             # Rollback last migration
just show-collections        # Show all collections in human/LLM readable format
just reset                   # Reset the database (WARNING: deletes all data)
```

### Testing

```bash
just test                    # Run all tests (Go backend + Playwright frontend)
cd frontend && bun run test  # Run frontend tests only
cd frontend && bun run test:ui # Run frontend tests in UI mode
```

### Environment Variables

#### Backend
- `SUPERUSER_EMAIL` - Email for the initial admin user
- `SUPERUSER_PASSWORD` - Password for the initial admin user

#### Frontend
- `VITE_BACKEND_URL` - Backend URL for development (defaults to `http://localhost:8090`)

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

## Project Structure

```
├── main.go                 # Application entry point
├── migrations/             # Database migrations
├── pb_data/               # PocketBase data (gitignored)
├── frontend/              # SvelteKit SPA
│   ├── src/              # Application source
│   │   ├── routes/       # SvelteKit routes
│   │   ├── lib/          # Shared components and utilities
│   │   └── app.css       # Global styles
│   ├── static/           # Static assets
│   ├── tests/            # Playwright test suite
│   ├── build/            # Build output (gitignored)
│   ├── package.json      # Frontend dependencies
│   ├── svelte.config.js  # SvelteKit configuration
│   └── vite.config.ts    # Vite build configuration
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Container orchestration
├── justfile              # Task automation
└── go.mod                # Go module definition
```

## Architecture

### Core Structure

- **PocketBase Application**: Single binary with embedded SQLite database
- **Frontend Serving**: Static files served from `frontend/build/` directory at root path
- **Migration System**: Automatic migration support with `migratecmd` plugin
- **Module Import**: Migrations imported as `_ "app/migrations"` in main.go
- **Environment-based Configuration**:
  - Backend: Superuser credentials via `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD` (see `.env.example`)
  - Frontend: Backend URL via `VITE_BACKEND_URL` environment variable

### Frontend Architecture

- **Framework**: SvelteKit with static adapter for SPA deployment
- **Styling**: Tailwind CSS v4 with DaisyUI component library  
- **Build Output**: Static files built to `frontend/build/` directory
- **Deployment**: SvelteKit SPA served directly from `frontend/build/` in container
- **SPA Mode**: Client-side routing with SSR disabled in `+layout.ts`
- **Configuration**: Constants centralized in `frontend/src/lib/config/constants.ts` module
- **Testing**: Unified Playwright test suite for all frontend tests
- **State Management**: Use explicit `$state` and `$derived` runes for reactive state

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
- Frontend served from `frontend/build/` directory using PocketBase's apis.Static() handler

### Migrations

- Use the `just makemigration` recipe to create a migration
- For migrations that create or update Collections, read the latest documentation on https://pocketbase.io/docs/go-collections/ before writing any code

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

Add new routes in `frontend/src/routes/`:
```svelte
<!-- frontend/src/routes/dashboard/+page.svelte -->
<script lang="ts">
  // Use explicit $state runes for reactive state
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<div>Dashboard Page</div>
```

### State Management Guidelines

Always use explicit Svelte 5 runes for state management:

1. **Local State**: Use `$state()` for reactive values
```svelte
<script lang="ts">
  let email = $state('');
  let isLoading = $state(false);
</script>
```

2. **Derived Values**: Use `$derived()` for computed values
```svelte
<script lang="ts">
  let user = $derived($currentUser);
  let isValid = $derived(email.length > 0 && password.length > 0);
</script>
```

3. **Effects**: Use `$effect()` instead of lifecycle functions when possible
```svelte
<script lang="ts">
  $effect(() => {
    // React to state changes
    console.log('User changed:', user);
  });
</script>
```

### Creating Migrations

Generate a new migration:
```bash
just makemigration "add_custom_collection"
```

Then edit the generated file in the `migrations/` directory. For collection migrations, refer to the [PocketBase documentation](https://pocketbase.io/docs/go-collections/).

## Claude Code Tips

- You can use the show-collections (`just show-collections`) recipe at any time to determine which pocketbase collections have been created and their fields

## License

MIT License - see [LICENSE](LICENSE) file for details
