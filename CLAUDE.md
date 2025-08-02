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
- shadcn/ui imports: `import { Button } from '~/components/ui/button'`
- PocketBase client configured in `frontend/app/lib/pocketbase.ts`

## Migration Notes

Check PocketBase docs before writing migrations - breaking changes exist pre-1.0.