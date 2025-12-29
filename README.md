# PocketBase + React Router v7 Template

A Copier template for creating full-stack applications with a PocketBase backend and React Router v7 frontend.

## Features

- **Backend**: PocketBase (Go) with SQLite database
- **Frontend**: React Router v7 in SPA mode with Tailwind CSS and shadcn/ui
- **Authentication**: Built-in PocketBase auth with TanStack Query integration
- **Testing**: Playwright for E2E tests, Go testing for backend
- **Deployment**: Single Docker container serving both backend and frontend
- **Task Runner**: mise for development workflow automation

## Prerequisites

- [Copier](https://copier.readthedocs.io/) v9.0.0+
- [mise](https://mise.jdx.dev/) task runner
- Docker (for deployment)

## Usage

### Create a new project

```bash
copier copy gh:username/this-repo my-project
```

Or from a local clone:

```bash
copier copy /path/to/template my-project
```

### Template variables

| Variable | Description | Default |
|----------|-------------|---------|
| `project_name` | Project name (e.g., "My App") | - |
| `project_slug` | URL/module-safe name | Derived from project_name |
| `project_description` | Short description | "A full-stack application..." |
| `allowed_hosts` | Vite dev server allowed hosts (comma-separated) | "" (allow all) |
| `superuser_email` | Initial admin email | "" |
| `superuser_password` | Initial admin password | "" |

### Update an existing project

```bash
cd my-project
copier update
```

## What's Included

- PocketBase backend with:
  - Health check endpoint
  - OpenAPI documentation
  - SMTP configuration via environment variables
  - Database migration system

- React Router v7 frontend with:
  - Authentication flow (login, signup, logout)
  - TanStack Query for server state
  - Zustand for UI state
  - shadcn/ui components
  - Dark/light theme support

- Development tooling:
  - mise tasks for common operations
  - Playwright E2E testing
  - Docker deployment configuration

## After Generation

1. Navigate to your project:
   ```bash
   cd my-project
   ```

2. Initialize the project:
   ```bash
   mise run init
   ```

3. Start development:
   ```bash
   mise run dev
   ```

4. Access the app:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8090
   - Admin UI: http://localhost:8090/_/

## License

MIT
