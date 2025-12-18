# PocketBase Project

This is a PocketBase project with a React Router v7 frontend.

## Project Structure

- **Backend**: PocketBase (Go) in project root
- **Frontend**: React Router v7 with shadcn/ui in `frontend/`
- **Database**: SQLite via PocketBase
- **State Management**: TanStack Query (server state) and Zustand (UI state)
- **Testing**: Playwright for E2E tests
- **Build Tool**: mise for task automation

## Key Commands

```bash
mise run dev          # Run both frontend and backend
mise run test         # Run all tests
mise run build        # Build for production
```

## Frontend Conventions

- Components in `frontend/app/components/`
- Routes in `frontend/app/routes/`
- shadcn/ui imports: `import { Button } from '@/components/ui/button'`
- PocketBase client configured in `frontend/app/lib/pocketbase.ts`

## Database Migrations

For PocketBase migration details and best practices, use the pocketbase-migration-expert agent via the Task tool. The agent has comprehensive knowledge of:
- PocketBase migration syntax (v0.29+)
- Field types and common issues
- Collection relations and dependencies
- Migration ordering and best practices

See the official docs: https://pocketbase.io/docs/go-collections/

## Tooling Recommendations

- Use bun over npm

## Development Workflow

- For common development tasks, check whether a mise task exists with `mise t`. If it's something that's likely to be done often, create a mise task and execute it via mise

## Best Practices

- Whenever communicating with an external service such as PocketBase, ensure the interaction is abstracted behind a TanStack query or mutation

## shadcn/ui Guidelines

- For basic UI components which have a shadcn implementation always install them using the shadcn cli i.e. `bunx --bun shadcn@latest add button` as opposed to writing them from scratch

## Miscellaneous

- The `show-collections` mise task can be flaky
