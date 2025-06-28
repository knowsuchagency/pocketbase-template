# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PocketBase template project - a Go-based backend-as-a-service (BaaS) application built on PocketBase.

**NOTE:** The version of pocketbase used is greater than v0.28 which introduced several breaking changes.

## Essential Commands

### Development
```bash
just serve                    # Start PocketBase development server on port 8090
go run main.go serve         # Alternative: direct Go command
```

### Database Migrations
```bash
just makemigration "name"    # Create new migration file
just migrate                 # Run pending migrations
just migratedown            # Rollback last migration
```

### Dependency Management
```bash
just update-deps             # Update all Go dependencies
just update-pocketbase       # Update PocketBase to latest version
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
- **Migration System**: Automatic migration support with `migratecmd` plugin
- **Module Import**: Migrations imported as `_ "app/migrations"` in main.go
- **Environment-based Configuration**: Superuser credentials via `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD`

### Key Implementation Details
1. **Auto-migration**: Enabled only during development (detected via `go run` execution)
2. **Custom Routes**: Register via `app.OnServe().BindFunc()` callback
3. **Migration Pattern**: Each migration has up/down functions for apply/revert operations
4. **Data Persistence**: `pb_data/` directory for database and uploaded files

### Docker Setup
- Multi-stage build: `golang:1.22-alpine` for building, `alpine:latest` for runtime
- Volume mount: `./pb_data:/app/pb_data` for data persistence
- Static binary: Built with `CGO_ENABLED=0` for Alpine compatibility

### Migrations
- Use the `just makemigration` recipe to create a migration
- For migrations that create or update Collections, read the latest documentation on https://pocketbase.io/docs/go-collections/ before writing any code
