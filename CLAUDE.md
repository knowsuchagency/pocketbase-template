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

#### Creating Collections
- Use `core.NewBaseCollection("name")` to create a new collection
- Use `collection.Fields.Add()` to add fields to the collection
- Collections must be saved with `app.Save(collection)`
- For auth collections, use `core.NewAuthCollection("name")`

#### Field Types and Common Issues
- Use `"github.com/pocketbase/pocketbase/tools/types"` for `types.Pointer()` (only needed for pointers, not regular int values)
- Use `core.URLField` instead of `core.TextField` with URL validators
- For date fields that aren't auto-generated, use `core.DateField` instead of `core.AutodateField` with `OnCreate: false, OnUpdate: false`
- AutodateField requires at least one of `OnCreate` or `OnUpdate` to be true
- EditorField uses `MaxSize` not `Max` property
- RelationField uses `MaxSelect` (int) not `Max` property (no `MinSelect` field exists)
- NumberField with `OnlyInt: true` needs `Min: types.Pointer(0.0)` for min value
- TextField uses `Min` and `Max` for character length constraints
- SelectField requires `Values` array and `MaxSelect` int
- FileField uses `MimeTypes` array, `MaxSize` in bytes, and `MaxSelect` int
- EmailField, BoolField, and JSONField are also available

#### Collection Relations
- For self-referencing relations, save the collection first, then add the relation field in a separate migration
- MaxSelect for SelectField cannot exceed the number of available values
- Relation fields should use actual collection IDs:
  - Users collection: use `"_pb_users_auth_"` not `"users"`
  - Other collections: use `collection.Id` after finding/creating them
- When creating relations between collections that don't exist yet:
  1. Create all base collections first with placeholder TextField instead of RelationField
  2. Create a fix_relations migration to:
     - Remove placeholder fields: `collection.Fields.RemoveByName("fieldname")`
     - Add proper RelationField with correct CollectionId
  3. Update rules that reference relations in a separate migration after relations are fixed
- IMPORTANT: Rules that reference relation fields (e.g., `author.user = @request.auth.id`) will fail if the field is not yet a proper relation

#### Migration Order and Dependencies
- Migrations run in filename order (timestamp prefix)
- Create collections in dependency order:
  1. Independent collections first (users, categories, tags)
  2. Collections with one-way relations (posts, newsletter)
  3. Collections with complex relations (comments)
  4. Relation fix-up migrations (convert text fields to relations)
  5. Rule update migrations (add rules that reference relations)
- Use `app.FindCollectionByNameOrId()` to get existing collections
- Always check for errors when finding collections
- Each migration needs both up and down functions (down can return nil if not reversible)

#### Collection Rules
- Use `types.Pointer("")` for empty/public rules
- Use `types.Pointer("@request.auth.id != ''")` for authenticated-only access
- Common rule patterns:
  - Public read: `ListRule = types.Pointer("")`
  - Owner-only edit: `UpdateRule = types.Pointer("author = @request.auth.id")`
  - Published content: `ViewRule = types.Pointer("status = 'published' || author = @request.auth.id")`

#### Migration Example Pattern
When creating related collections, follow this pattern:
```go
// 1_create_posts.go - Create with placeholder text field
collection := core.NewBaseCollection("posts")
collection.Fields.Add(
    &core.TextField{Name: "author", Required: true}, // Placeholder
    // ... other fields
)

// 2_fix_relations.go - Convert to proper relation
postsCollection, _ := app.FindCollectionByNameOrId("posts")
authorsCollection, _ := app.FindCollectionByNameOrId("authors")
postsCollection.Fields.RemoveByName("author")
postsCollection.Fields.Add(
    &core.RelationField{
        Name: "author",
        Required: true,
        MaxSelect: 1,
        CollectionId: authorsCollection.Id,
    },
)

// 3_update_rules.go - Add rules that reference relations
postsCollection.UpdateRule = types.Pointer("author.user = @request.auth.id")
```

## Tooling Recommendations

- Use bun over npm

## Development Workflow

- For common development tasks, check whether a mise task exists with `mise t`. If it's something that's likely to be done often, create a mise task and execute it via mise

## Best Practices

- Whenever communicating with an external service such as PocketBase, ensure the interaction is abstracted behind a TanStack query or mutation

## shadcn/ui Guidelines

- For basic UI components which have a shadcn implementation always install them using the shadcn cli i.e. `bunx --bun shadcn@latest add button` as opposed to writing them from scratch
