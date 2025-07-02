set dotenv-load

# Run bun dev server
dev-bun:
    cd frontend && bun run dev

# Start the PocketBase development server
dev-pb:
    go run main.go serve --dev

# Run bun and pocketbase in dev mode
dev:
    npx concurrently --names "FRONTEND,BACKEND" --prefix-colors "cyan,magenta" "just dev-bun" "just dev-pb"

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

# Show all collections in a human and LLM readable format
show-collections:
    go run cmd/show-collections.go serve
