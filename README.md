# PocketBase Project

A modern full-stack application featuring a Go-based [PocketBase](https://pocketbase.io/) backend API and React Router v7 frontend styled with Tailwind CSS and shadcn/ui components.

## Architecture Overview

- **Backend**: PocketBase API server (Go) - serves both API endpoints and frontend static files
- **Frontend**: React Router v7 in SPA mode, served directly from PocketBase
- **Authentication**: PocketBase auth with TanStack Query for server state management
- **Deployment**: Single Docker container serving both backend and frontend

## Features

- 🚀 PocketBase backend-as-a-service framework (v0.29+)
- ⚛️ React Router v7 in SPA mode, served directly from PocketBase
- 🐳 Docker configuration for full-stack deployment (backend + frontend)
- 📦 Database migration system with automatic migrations in development
- 🛠️ Task automation with `mise` for development workflow
- 🔐 Environment-based superuser initialization
- 🏥 Health check endpoint at `/health`
- 🗄️ State Management with TanStack Query (server state) and Zustand (UI state)
- 🧪 End-to-end testing with Playwright
- 🎨 Tailwind CSS v4 with shadcn/ui components

## Prerequisites

- Docker and Docker Compose (for containerized backend deployment)
- [mise](https://mise.jdx.dev/) task runner and tool version manager

## Quick Start

1. Clone the repository
```bash
git clone <repository-url>
cd pocketbase-project
```

2. Initialize the project
```bash
mise run init
```

This will:
- Install all dependencies (backend and frontend)
- Create a `.env` file if it doesn't exist
- Prompt you to set superuser credentials (with proper interactive input handling)

3. Run the development servers
```bash
mise run dev
```

This starts both:
- PocketBase backend at `http://localhost:8090` (admin UI at `http://localhost:8090/_/`)
- React frontend at `http://localhost:3000`

To run services individually:
```bash
mise run dev-backend    # Backend only
mise run dev-frontend   # Frontend only
```

### Docker Deployment

1. Create a `.env` file:
```env
SUPERUSER_EMAIL=admin@example.com
SUPERUSER_PASSWORD=your-secure-password
```

2. Build frontend and backend, then run with Docker Compose
```bash
mise run build
docker-compose up -d
```

This will serve both the API and frontend from a single container at `http://localhost:8090`.

## Essential Commands

All commands are run from the project root:

### Development
```bash
mise run init                    # Initialize project (install deps, setup env)
mise run dev                     # Run both frontend and backend concurrently
mise run dev-backend             # Start PocketBase development server only
mise run dev-frontend            # Start frontend development server only
```

### Building & Deployment
```bash
mise run build                   # Build both backend binary and frontend
mise run build-frontend          # Build frontend for production
mise run preview-frontend        # Preview frontend production build
mise run deploy                  # Deploy using Docker Compose
```

### Database Management
```bash
mise run makemigration "name"    # Create new migration file
mise run migrate                 # Run pending migrations
mise run migratedown             # Rollback last migration
mise run show-collections        # Show all collections in human/LLM readable format (use --hidden to include hidden collections)
mise run reset                   # Reset the database (WARNING: deletes all data)
```

### Testing
```bash
mise run test                    # Run all tests (backend and frontend)
mise run test-backend            # Run Go backend tests
mise run test-frontend           # Run Playwright frontend tests
mise run test-ui                 # Run tests with interactive UI
mise run test-headed             # Run tests in headed browser mode
mise run test-debug              # Debug tests interactively
mise run test-report             # Show HTML test report
```

### Code Quality
```bash
mise run typecheck               # Run TypeScript type checking
```

### Dependencies
```bash
mise run update-deps             # Update all dependencies to latest versions
mise run update-pocketbase       # Update PocketBase to latest version
mise run check-updates           # Check for available dependency updates
```

#### Playwright Configuration

The frontend tests are configured to:
- Automatically start both PocketBase backend and frontend dev server
- Run tests against Chromium by default (Firefox and WebKit are commented out)
- Use environment variables from `.env` for test credentials
- Generate HTML reports for test results
- Include improved error handling and diagnostics for auth flows

## Architecture Details

### Backend Structure

- **PocketBase Application**: Single binary with embedded SQLite database
- **Migration System**: Automatic migration support with `migratecmd` plugin
- **Static File Serving**: Backend serves frontend static files from `frontend/build/client`
- **SPA Routing**: All routes fall back to index.html for client-side routing
- **Environment Variables**:
  - `SUPERUSER_EMAIL` and `SUPERUSER_PASSWORD` for initial admin setup

### Frontend Architecture

- **Framework**: React Router v7 in SPA mode (SSR disabled)
- **Styling**: Tailwind CSS v4 with shadcn/ui components (radix-vega style)
- **State Management**: 
  - **Server State**: TanStack Query for API data, auth, and caching
  - **UI State**: Zustand for local UI state (theme, notifications)
- **Testing**: Playwright for end-to-end testing
- **Build Output**: Static files in `frontend/build/client`
- **Deployment**: Served directly from PocketBase
- **Configuration**: Automatic backend URL detection (relative in production, localhost:8090 in dev)
- **TypeScript**: Full TypeScript support with strict type checking

#### Key Frontend Components

- **Routes Configuration** (`frontend/app/routes.ts`):
  - Explicit route definitions for React Router v7
  - Lazy loading for route components
  - Configured in `react-router.config.ts` with SSR disabled (SPA mode)

- **PocketBase Service** (`frontend/app/services/pocketbase.service.ts`):
  - Configured PocketBase SDK instance
  - Auto-cancellation disabled for better control
  - Automatic backend URL detection based on environment

- **Auth Hooks** (`frontend/app/hooks/use-auth.ts`):
  - React Query-based authentication hooks
  - Provides `useAuth()` for easy auth access
  - Automatic caching and state synchronization

- **Query/Mutation Hooks** (`frontend/app/hooks/mutations/` & `frontend/app/hooks/queries/`):
  - TanStack Query mutations for login, logout, refresh
  - User data queries with automatic caching
  - Centralized API state management

- **App Store** (`frontend/app/stores/app.store.ts`):
  - Manages global application state
  - Handles notifications system
  - Manages loading states

- **Theme Store** (`frontend/app/stores/theme.store.ts`):
  - Dark/light theme persistence
  - System theme detection

- **Protected Routes** (`frontend/app/components/ProtectedRoute.tsx`): Wrapper for auth-required pages
- **Login Form** (`frontend/app/components/LoginForm.tsx`): Full authentication flow with error handling
- **Notifications** (`frontend/app/components/NotificationList.tsx`): Toast-style notifications with auto-dismiss

#### Component Import Paths

When importing shadcn/ui components, use these standard paths:
```typescript
// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Utilities
import { cn } from '@/lib/utils';
```

#### SEO and Meta Tags

This template uses a dual-layer approach for SEO meta tags to ensure proper crawling and social sharing:

**1. Static Meta Tags** (`frontend/app/root.tsx`):
- Placed directly in the Layout component's `<head>` section
- Always present in the initial HTML (critical for web crawlers and social media bots)
- Provide default/fallback values for the entire site
- Include: title, description, keywords, Open Graph tags, Twitter Card tags, and favicon links

**2. Route-Specific Meta Tags** (e.g., `frontend/app/routes/index.tsx`):
- Exported via the `meta` function in each route file
- Rendered by React Router's `<Meta />` component
- Override static tags on a per-route basis for specific pages
- Allow dynamic meta tags based on route data

**Why Both?**
- Static tags ensure SEO tags are always present in the initial HTML
- Route-specific meta exports allow customization per page
- React Router's `<Meta />` component alone may not be sufficient for crawlers that don't execute JavaScript

**Customizing Meta Tags:**
1. Update the static tags in `frontend/app/root.tsx` with your site's default information
2. Customize route-specific tags in each route file's `meta` export function
3. Replace placeholder URLs (`https://your-domain.com`) with your actual domain
4. Add a social sharing image at `/public/og-image.png` (1200x630px recommended)

## Deployment

### Backend Deployment

The backend can be deployed using Docker:

```bash
# Build the image
docker build -t pocketbase-app .

# Run with environment variables
docker run -d \
  -p 8090:8090 \
  -v ./pb_data:/app/pb_data \
  -e SUPERUSER_EMAIL=admin@example.com \
  -e SUPERUSER_PASSWORD=secure-password \
  pocketbase-app
```

### Unified Deployment

Both frontend and backend are deployed together:

```bash
# Build everything
mise run build

# Deploy with Docker
docker-compose up -d
```

The frontend is automatically served from PocketBase at the root path (`/`), while API endpoints are available at `/api/*`.

## Project Structure

```
├── main.go                 # Backend entry point
├── .claude/               # Claude Code configuration and commands
│   └── settings.local.json # Local Claude settings
├── migrations/             # Database migrations
├── routes/                 # Backend route handlers
│   ├── health.go          # Health check endpoint
│   ├── static.go          # Static file serving for frontend
│   └── routes.go          # Route registration
├── tests/                 # Backend Go tests
│   └── routes/            # Route handler tests
│       ├── health_test.go # Health endpoint tests
│       └── static_test.go # Static file serving tests
├── pb_data/               # PocketBase data (gitignored)
├── frontend/              # React Router v7
│   ├── app/              
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   └── *.tsx     # App-specific components
│   │   ├── hooks/        # React hooks
│   │   │   ├── mutations/# TanStack Query mutations
│   │   │   ├── queries/  # TanStack Query queries
│   │   │   └── use-auth.ts # Auth hook
│   │   ├── lib/          # Utilities
│   │   ├── providers/    # React providers
│   │   ├── routes/       # Route components
│   │   ├── services/     # Service layer
│   │   │   └── pocketbase.service.ts # PocketBase client
│   │   ├── stores/       # Zustand state stores
│   │   │   ├── app.store.ts    # App state (notifications)
│   │   │   └── theme.store.ts  # Theme state
│   │   ├── root.tsx      # Root component
│   │   └── routes.ts     # Route definitions
│   ├── tests/            # Playwright tests
│   ├── build/            # Build output (gitignored)
│   ├── .env.example      # Example environment variables
│   ├── components.json   # shadcn/ui configuration
│   ├── package.json      # Frontend dependencies
│   ├── playwright.config.ts # Playwright configuration
│   ├── react-router.config.ts # React Router configuration
│   ├── tsconfig.json     # TypeScript configuration
│   └── vite.config.ts    # Vite configuration
├── Dockerfile             # Full-stack Docker build
├── docker-compose.yml     # Container orchestration
├── mise.toml             # Task automation and tool version management
└── go.mod                # Go module definition
```

## Extending the Project

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
mise run makemigration "add_custom_collection"
```

Then edit the generated file in the `migrations/` directory. For collection migrations, refer to the [PocketBase documentation](https://pocketbase.io/docs/go-collections/).

## Environment Variables

### Backend
- `SUPERUSER_EMAIL` - Email for the initial admin user
- `SUPERUSER_PASSWORD` - Password for the initial admin user

### Frontend
- No environment variables needed - the frontend automatically connects to the correct backend URL
