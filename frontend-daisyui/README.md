# PocketBase Template - Frontend

React Router v7 SPA frontend for the PocketBase template project.

## Features

- ⚛️ React Router v7 configured as SPA (SSR disabled)
- 🎨 Tailwind CSS v4 with DaisyUI components
- 🔒 TypeScript by default
- ⚡️ Hot Module Replacement (HMR)
- 📦 Optimized production builds
- 🔗 PocketBase SDK integration
- 📱 Responsive design with DaisyUI

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or npm
- PocketBase backend running at `http://localhost:8090`

### Installation

Install the dependencies:

```bash
bun install
# or npm install
```

### Development

Start the development server with HMR:

```bash
bun run dev
# or npm run dev
```

Your application will be available at `http://localhost:5173`.

For concurrent frontend and backend development, use from the project root:

```bash
just dev
```

## Building for Production

Create a production build:

```bash
bun run build
# or npm run build
```

This outputs static files to `build/client/` which are served by PocketBase in production.

## Project Structure

```
├── app/                    # Application source code
│   ├── routes/            # React Router routes
│   ├── components/        # Reusable components
│   └── root.tsx          # Root component
├── public/                # Static assets
├── build/                 # Build output (gitignored)
│   └── client/           # Static files for production
├── components.json        # shadcn/ui configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── react-router.config.ts # React Router configuration
```

## Key Configuration

### React Router SPA Mode

The application is configured as a Single Page Application in `react-router.config.ts`:

```typescript
export default {
  ssr: false,  // Disables server-side rendering
}
```

### PocketBase Integration

The frontend connects to PocketBase API at:
- Development: `http://localhost:8090` (configured via `VITE_BACKEND_URL`)
- Production: Same origin (served by PocketBase)

Backend URL configuration is centralized in `app/config/constants.ts`.

## Available Scripts

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server (for testing)
bun run typecheck  # Run TypeScript type checking
```

## Styling

This project uses:
- [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling
- [DaisyUI](https://daisyui.com/) for pre-built components
- CSS-in-JS support via Tailwind

### Using DaisyUI Components

```tsx
// Example button using DaisyUI classes
<button className="btn btn-primary">Click me</button>

// Example card component
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content</p>
  </div>
</div>
```

## Environment Variables

Create a `.env` file for local development:

```env
VITE_BACKEND_URL=http://localhost:8090
```

## Deployment

The frontend is designed to be served as static files by PocketBase. After building:

1. The `build/client/` directory contains all static assets
2. These files are copied to the Docker container during build
3. PocketBase serves them at the root path using `apis.Static()`

For standalone deployment, you can serve the `build/client/` directory with any static file server.
