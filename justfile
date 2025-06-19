set dotenv-load

# Initialize a new Go project with the specified name (defaults to "app")
init project="app":
    go mod init {{project}}
    go mod tidy

# Start the PocketBase development server
serve:
    go run main.go serve

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

# Build Docker image
build:
    docker compose build

# Run Docker image
up:
    docker compose up
