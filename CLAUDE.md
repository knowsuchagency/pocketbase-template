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

Check PocketBase docs before writing migrations - breaking changes exist pre-1.0. https://pocketbase.io/docs/go-collections/

### PocketBase Migration Syntax (v0.29+)

#### Field Types and Common Issues
- Use `"github.com/pocketbase/pocketbase/tools/types"` for `types.Pointer()` (only needed for pointers, not regular int values)
- Use `core.URLField` instead of `core.TextField` with URL validators
- For date fields that aren't auto-generated, use `core.DateField` instead of `core.AutodateField` with `OnCreate: false, OnUpdate: false`
- AutodateField requires at least one of `OnCreate` or `OnUpdate` to be true
- EditorField uses `MaxSize` not `Max` property
- RelationField uses `MaxSelect` (int) not `Max` property
- NumberField with `OnlyInt: true` needs `Min: types.Pointer(0.0)` for min value

#### Collection Relations
- For self-referencing relations, save the collection first, then add the relation field in a separate migration
- MaxSelect for SelectField cannot exceed the number of available values
- Relation fields should use actual collection IDs:
  - Users collection: use `"_pb_users_auth_"` not `"users"`
  - Other collections: use `collection.Id` after finding/creating them
- When creating relations between collections that don't exist yet:
  1. Create all base collections first
  2. Add relations in a separate migration after all collections exist
  3. For complex dependencies, use placeholder text fields then replace in later migration

#### Migration Order and Dependencies
- Migrations run in filename order (timestamp prefix)
- Create collections in dependency order:
  1. Independent collections first (users, categories, tags)
  2. Collections with one-way relations (posts, newsletter)
  3. Collections with complex relations (comments)
  4. Relation fix-up migrations last
- Use `app.FindCollectionByNameOrId()` to get existing collections
- Always check for errors when finding collections

#### Collection Rules
- Use `types.Pointer("")` for empty/public rules
- Use `types.Pointer("@request.auth.id != ''")` for authenticated-only access
- Common rule patterns:
  - Public read: `ListRule = types.Pointer("")`
  - Owner-only edit: `UpdateRule = types.Pointer("author = @request.auth.id")`
  - Published content: `ViewRule = types.Pointer("status = 'published' || author = @request.auth.id")`

## Tooling Recommendations

- Use bun over npm

## Development Workflow

- For common development tasks, check whether a mise task exists with `mise t`. If it's something that's likely to be done often, create a mise task and execute it via mise

## Best Practices

- Whenever communicating with an external service such as PocketBase, ensure the interaction is abstracted behind a TanStack query or mutation

## shadcn/ui Guidelines

- For basic UI components which have a shadcn implementation always install them using the shadcn cli i.e. `bunx --bun shadcn@latest add button` as opposed to writing them from scratch
