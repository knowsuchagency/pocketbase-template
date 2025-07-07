set dotenv-load

# Install all dependencies
install-deps:
    cd frontend && bun install
    go mod tidy

# Initialize the project
init: install-deps
    #!/bin/bash
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Setting up superuser credentials..."
        echo -n "Enter superuser email: "
        read -r email
        echo -n "Enter superuser password: "
        read -rs password
        echo
        # Use sed to replace the values in .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/SUPERUSER_EMAIL=.*/SUPERUSER_EMAIL=$email/" .env
            sed -i '' "s/SUPERUSER_PASSWORD=.*/SUPERUSER_PASSWORD=$password/" .env
        else
            # Linux
            sed -i "s/SUPERUSER_EMAIL=.*/SUPERUSER_EMAIL=$email/" .env
            sed -i "s/SUPERUSER_PASSWORD=.*/SUPERUSER_PASSWORD=$password/" .env
        fi
        echo "✅ .env file created with your credentials"
    else
        echo "✅ .env file already exists"
    fi
    direnv allow

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

# Run all tests
test:
    go test -v ./...

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

# Reset the database
reset:
    #!/bin/bash
    echo "⚠️  WARNING: This will permanently delete all database data!"
    echo -n "Are you sure you want to reset the database? (y/N): "
    read -r confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        rm -rf ./pb_data/*
        echo "✅ Database reset complete."
    else
        echo "Reset cancelled."
    fi
