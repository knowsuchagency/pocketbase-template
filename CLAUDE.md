# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router + Hono fullstack application template designed for Cloudflare Workers. It combines:
- **Frontend**: React with React Router (SPA mode)
- **Backend**: Hono framework on Cloudflare Workers
- **UI**: shadcn/ui components with Tailwind CSS
- **Build**: Vite with Cloudflare plugin

## Development Commands

```bash
# Start development server
bun run dev

# Build the application
bun run build

# Deploy to Cloudflare Workers
bun run deploy

# Preview built application
bun run preview

# Run TypeScript type checking
bun run typecheck

# Generate Cloudflare types
bun run cf-typegen
```

## Architecture

### Backend (Hono)
- **Entry point**: `/workers/app.ts` - Main Hono application that handles all routes
- **API routes**: Define API endpoints under `/api/*` paths
- **Context**: Access Cloudflare bindings via `c.env` in Hono handlers

### Frontend (React Router)
- **Root**: `/app/root.tsx` - Application layout with error boundary
- **Routes**: `/app/routes/` - File-based routing (e.g., `home.tsx`)
- **Entry**: `/app/entry.server.tsx` - Server-side rendering entry point
- **Loaders**: Access Cloudflare context via `context.cloudflare` in route loaders

### UI Components
- **Location**: `/app/components/ui/` - shadcn/ui components
- **Utils**: `/app/components/lib/utils.ts` - Utility functions
- **Adding components**: Use shadcn/ui CLI or copy from documentation

## Type Safety

- TypeScript configuration uses path aliases: `~/components/*` maps to `/app/components/*`
- Cloudflare types are generated in `/workers-env.d.ts`
- The `Env` interface defines Cloudflare bindings (KV, R2, etc.)

## Deployment Configuration

- **Wrangler config**: `/wrangler.jsonc` - Cloudflare Workers settings
- **Environment variables**: Access via `context.cloudflare.env` in React Router loaders
- **Static assets**: Handled automatically by Vite Cloudflare plugin

## Key Patterns

1. **Full-stack data flow**: 
   - Define API endpoints in Hono (`/workers/app.ts`)
   - Call APIs from React Router loaders or components
   - Access shared Cloudflare bindings in both frontend and backend

2. **Adding new routes**:
   - Frontend: Create new file in `/app/routes/`
   - Backend API: Add Hono routes in `/workers/app.ts`

3. **Component development**:
   - Use existing shadcn/ui components where possible
   - Follow Tailwind CSS conventions for styling
   - Components should be placed in `/app/components/`