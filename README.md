# PocketBase Template

A modern Go template for building applications with [PocketBase](https://pocketbase.io/), featuring Docker support, database migrations, and development tooling.

## Features

- 🚀 PocketBase backend-as-a-service framework
- 🐳 Docker and Docker Compose configuration
- 📦 Database migration system with automatic migrations in development
- 🛠️ Task automation with `just`
- 🔐 Environment-based superuser initialization
- 🏥 Health check endpoint at `/health`

## Prerequisites

- Go 1.24 or higher
- Docker and Docker Compose (for containerized deployment)
- [just](https://github.com/casey/just) task runner (optional but recommended)

## Quick Start

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd pocketbase-template
```

2. Install dependencies
```bash
go mod download
```

3. Set environment variables for the initial superuser
```bash
export SUPERUSER_EMAIL="admin@example.com"
export SUPERUSER_PASSWORD="your-secure-password"
```

4. Run the development server
```bash
just serve
# or
go run main.go serve
```

The PocketBase admin UI will be available at `http://localhost:8090/_/`

### Docker Deployment

1. Create a `.env` file with your configuration
```env
SUPERUSER_EMAIL=admin@example.com
SUPERUSER_PASSWORD=your-secure-password
```

2. Build and run with Docker Compose
```bash
docker-compose up -d
```

## Available Commands

### Development
- `just serve` - Start PocketBase development server
- `just init [name]` - Initialize new Go project

### Database Migrations
- `just makemigration "name"` - Create new migration file
- `just migrate` - Run pending migrations
- `just migratedown` - Rollback last migration

### Dependency Management
- `just update-deps` - Update all Go dependencies
- `just update-pocketbase` - Update PocketBase to latest version
- `just check-updates` - Check for available updates

## Project Structure

```
├── main.go                 # Application entry point
├── migrations/             # Database migrations
│   └── 1749628624_initial_superuser.go
├── pb_data/               # PocketBase data (gitignored)
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Container orchestration
├── justfile              # Task automation
└── go.mod                # Go module definition
```

## Extending the Template

### Adding Custom Routes

Add routes in the `OnServe` callback in `main.go`:

```go
app.OnServe().BindFunc(func(se *core.ServeEvent) error {
    se.Router.GET("/custom", func(re *core.RequestEvent) error {
        return re.JSON(200, map[string]string{"message": "Custom endpoint"})
    })
    return se.Next()
})
```

### Creating Migrations

Generate a new migration:
```bash
just makemigration "add_custom_collection"
```

Then edit the generated file in the `migrations/` directory.

## Environment Variables

- `SUPERUSER_EMAIL` - Email for the initial admin user
- `SUPERUSER_PASSWORD` - Password for the initial admin user

## License

MIT License - see LICENSE file for details
