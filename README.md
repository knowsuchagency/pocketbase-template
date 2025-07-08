# PocketBase Template

A modern full-stack template featuring a Go-based [PocketBase](https://pocketbase.io/) backend and React Router v7 SPA frontend with Tailwind CSS and DaisyUI.

## Features

- 🚀 PocketBase backend-as-a-service framework (v0.28+)
- ⚛️ React Router v7 SPA with Tailwind CSS v4 and DaisyUI
- 🐳 Docker and Docker Compose configuration with multi-stage builds
- 📦 Database migration system with automatic migrations in development
- 🛠️ Task automation with `just` for concurrent development
- 🔐 Environment-based superuser initialization
- 🏥 Health check endpoint at `/health`

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

## Available Commands

### Initial Setup
- `just init` - Initialize project: install dependencies, create .env (if needed) with prompted credentials, configure direnv
- `just install-deps` - Install frontend and backend dependencies

### Development
- `just dev` - Run both frontend and backend concurrently
- `just dev-pb` - Start PocketBase development server with --dev flag
- `just dev-bun` - Run bun development server
- `just build` - Build both frontend and backend

### Frontend Development
```bash
cd frontend
bun run dev        # Start development server
bun run build      # Build static files (outputs to frontend/build/client)
bun run start      # Start production server
bun run typecheck  # Run TypeScript type checking
```


### Database Migrations
- `just makemigration "name"` - Create new migration file
- `just migrate` - Run pending migrations
- `just migratedown` - Rollback last migration
- `just show-collections` - Show all collections in human/LLM readable format (use `--show-hidden` flag to include hidden collections)
- `just reset` - Reset the database (WARNING: deletes all data)

### Testing
- `just test` - Run all tests

### Dependency Management
- `just update-deps` - Update all Go dependencies
- `just update-pocketbase` - Update PocketBase to latest version
- `just check-updates` - Check for available updates to all dependencies

## Project Structure

```
├── main.go                 # Application entry point
├── migrations/             # Database migrations
│   └── 1749628624_initial_superuser.go
├── pb_data/               # PocketBase data (gitignored)
├── frontend/              # React Router v7 SPA
│   ├── app/              # Application routes and components
│   ├── public/           # Static assets
│   ├── build/            # Build output (gitignored)
│   │   └── client/       # Static files served by PocketBase
│   ├── package.json      # Frontend dependencies
│   ├── tailwind.config.ts # Tailwind CSS v4 configuration
│   └── react-router.config.ts # React Router configuration
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Container orchestration
├── justfile              # Task automation
└── go.mod                # Go module definition
```

## Architecture

### Backend
- **PocketBase Application**: Single binary with embedded SQLite database
- **Auto-migration**: Enabled only during development (detected via `go run` execution)
- **Static File Serving**: Frontend build served from `frontend/build/client/`
- **Custom Routes**: Register via `app.OnServe().BindFunc()` callback
- **Environment-based Configuration**: Superuser credentials via `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD`
- **Documentation**: Use `go doc` to view PocketBase documentation (e.g., `go doc github.com/pocketbase/pocketbase/core`)

### Frontend
- **Framework**: React Router v7 with SSR disabled for SPA deployment
- **Styling**: Tailwind CSS v4 with DaisyUI component library
- **Build Output**: Static files built to `frontend/build/client/`
- **SPA Mode**: Client-side routing with SSR disabled
- **Environment-based Configuration**: Backend URL via `VITE_BACKEND_URL` environment variable
- **Configuration**: Constants centralized in `frontend/app/config/constants.ts` module

### Docker Setup
- Multi-stage build with:
  - `oven/bun:1` for frontend build
  - `golang:1.24-alpine` for backend build
  - `alpine:latest` for runtime
- Volume mount: `./pb_data:/app/pb_data` for data persistence
- Static binary: Built with `CGO_ENABLED=0` for Alpine compatibility

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
