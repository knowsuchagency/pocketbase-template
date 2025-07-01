set dotenv-load

# Initialize a new Go project with the specified name (defaults to "app")
init project="app":
    go mod init {{project}}
    go mod tidy

# Run bun dev server
dev-bun:
    cd frontend && bun run dev

# Start the PocketBase development server
dev-pb:
    go run main.go serve --dev

# Run bun and pocketbase in dev mode
dev:
    npx concurrently "bun run dev" "go run main.go serve --dev"

# Build frontend and backend
build:
    cd frontend && bun run build
    go build -o pocketbase main.go

# Create a new database migration with the specified name (defaults to "initial_superuser")
makemigration name:
    echo "y" | go run . migrate create "{{name}}"

# Run all pending database migrations
migrate:
    go run . migrate up

# Rollback the last database migration
migratedown:
    go run . migrate down

# Update all Go dependencies to their latest versions
update-deps:
    go get -u ./...
    go mod tidy

# Update PocketBase to the latest version
update-pocketbase:
    go get github.com/pocketbase/pocketbase@latest
    go mod tidy

# Check for available updates to all dependencies
check-updates:
    go list -m -u all

# Show database schema
show-schema:
    sqlite3 pb_data/data.db ".schema"
