# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PocketBase template project with:
- **Backend**: Go-based backend-as-a-service (BaaS) application built on PocketBase
- **Frontend**: SvelteKit static SPA (Single Page Application) with Tailwind CSS and DaisyUI

**NOTE:** The version of pocketbase used is greater than v0.28 which introduced several breaking changes.

## Essential Commands

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
bun install                  # Install dependencies
bun run dev                  # Start development server
bun run build                # Build static files (outputs to frontend/build)
bun run preview              # Preview production build
bun run lint                 # Run ESLint
bun run test                 # Run tests
```

### Database Migrations
```bash
just makemigration "name"    # Create new migration file
just migrate                 # Run pending migrations
just migratedown             # Rollback last migration
just show-schema             # Display current database schema
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
- **Frontend Serving**: Static files served from `pb_public/` directory at root path
- **Migration System**: Automatic migration support with `migratecmd` plugin
- **Module Import**: Migrations imported as `_ "app/migrations"` in main.go
- **Environment-based Configuration**: Superuser credentials via `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD`

### Frontend Architecture
- **Framework**: SvelteKit with static adapter for SPA deployment
- **Styling**: Tailwind CSS v4 with DaisyUI component library
- **Build Output**: Static files built to `frontend/build/` directory
- **Deployment**: Files copied to `pb_public/` in Docker container
- **SPA Mode**: Client-side routing with fallback to index.html

### Key Implementation Details
1. **Auto-migration**: Enabled only during development (detected via `go run` execution)
2. **Custom Routes**: Register via `app.OnServe().BindFunc()` callback
3. **Migration Pattern**: Each migration has up/down functions for apply/revert operations
4. **Data Persistence**: `pb_data/` directory for database and uploaded files

### Docker Setup
- Multi-stage build: 
  - `oven/bun:1` for frontend build
  - `golang:1.24-alpine` for backend build
  - `alpine:latest` for runtime
- Volume mount: `./pb_data:/app/pb_data` for data persistence
- Static binary: Built with `CGO_ENABLED=0` for Alpine compatibility
- Frontend served from `pb_public/` directory

### Migrations
- Use the `just makemigration` recipe to create a migration
- For migrations that create or update Collections, read the latest documentation on https://pocketbase.io/docs/go-collections/ before writing any code
