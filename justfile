set dotenv-load

# Install backend dependencies
install-deps:
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

# Run frontend dev server (run from frontend directory)
dev-frontend:
    cd frontend && bun run dev

# Start the PocketBase development server
dev-pb:
    go run main.go serve --dev

# Run backend in dev mode (frontend should be run separately)
dev:
    npx concurrently --names "frontend,backend" --prefix-colors "cyan,magenta" "cd frontend && bun run dev" "go run main.go serve --dev"

# Build backend only (frontend built separately for Cloudflare deployment)
build:
    go build -o pocketbase main.go
    cd frontend && bun run build

# Run backend tests
test-backend:
    go test -v ./...

# Run frontend tests (run from frontend directory)
test-frontend:
    cd frontend && bun run test

# Run all tests
test: test-backend test-frontend

# Create a new database migration with the specified name (defaults to "initial_superuser")
makemigration name:
    echo "y" | go run . migrate create "{{name}}"

# Run all pending database migrations
migrate:
    go run . migrate up

# Rollback the last database migration
migratedown:
    go run . migrate down

# Update all dependencies to their latest versions
update-deps:
    go get -u ./...
    go mod tidy
    cd frontend && bun update --latest

# Update PocketBase to the latest version
update-pocketbase:
    go get github.com/pocketbase/pocketbase@latest
    go mod tidy

# Check for available updates to all dependencies
check-updates:
    go list -m -u all

# Show collections in a human and LLM readable format (use --show-hidden to include hidden collections)
show-collections *FLAGS:
    @go run cmd/show-collections.go show-collections {{FLAGS}} 2>&1 | grep -v -E '^\[[0-9]+(\.[0-9]+)?ms\]'

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

# Deploy to Cloudflare
deploy:
    cd frontend && bun run deploy
