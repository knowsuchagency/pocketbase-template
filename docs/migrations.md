# PocketBase Migration Guide

This guide covers PocketBase migrations for versions 0.20+ using the Go-based migration system.

## Core Concepts

### Collection Methods
- `app.FindCollectionByNameOrId(nameOrId)` - Retrieve a single collection
- `app.FindAllCollections()` - Retrieve all collections
- `app.FindAllCollections(types...)` - Retrieve collections by type (core.CollectionTypeBase, core.CollectionTypeAuth, core.CollectionTypeView)
- `app.Save(collection)` - Save new or update existing collection
- `app.Delete(collection)` - Delete a collection
- `core.NewBaseCollection(name)` - Create new base collection
- `core.NewAuthCollection(name)` - Create new auth collection
- `core.NewViewCollection(name, viewQuery)` - Create new view collection

### Field Management
- Field initialization: `collection.Fields.Add(&core.FieldType{...})`
- Field removal: `collection.Fields.RemoveByName(name)`
- Field updates: Modify existing field properties directly

## Migration Structure

```go
package migrations

import (
    "github.com/pocketbase/pocketbase/core"
    "github.com/pocketbase/pocketbase/tools/types"
    m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
    m.Register(func(app core.App) error {
        // Up migration logic
        return nil
    }, func(app core.App) error {
        // Down migration logic
        return nil
    })
}
```

## Field Types Reference

### Text Fields
```go
&core.TextField{
    Name:     "title",
    Required: true,
    Min:      1,      // minimum character length
    Max:      100,    // maximum character length
    Pattern:  "^[a-z]+$", // regex validation
}
```

### Number Fields
```go
&core.NumberField{
    Name:     "price",
    Required: true,
    Min:      types.Pointer(0.0),  // use types.Pointer for min value
    Max:      types.Pointer(999.99),
    OnlyInt:  false,
    NoDecimal: false,
}
```

### Boolean Fields
```go
&core.BoolField{
    Name: "isActive",
    Required: false,
}
```

### Email Fields
```go
&core.EmailField{
    Name: "email",
    Required: true,
}
```

### URL Fields
```go
&core.URLField{
    Name: "website",
    OnlyDomain: false,
}
```

### Date Fields
```go
// Manual date field
&core.DateField{
    Name: "publishedAt",
    Min: types.Pointer(time.Now()),
    Max: types.Pointer(time.Now().AddDate(1, 0, 0)),
}

// Auto-managed date field
&core.AutodateField{
    Name: "created",
    OnCreate: true,
    OnUpdate: false,
}
```

### Select Fields
```go
&core.SelectField{
    Name: "status",
    Required: true,
    Values: []string{"draft", "published", "archived"},
    MaxSelect: 1,  // cannot exceed number of values
}
```

### File Fields
```go
&core.FileField{
    Name: "avatar",
    MaxSelect: 1,
    MaxSize: 5242880, // 5MB in bytes
    MimeTypes: []string{"image/jpeg", "image/png"},
    Protected: false,
}
```

### Relation Fields
```go
&core.RelationField{
    Name: "author",
    Required: true,
    CollectionId: "collection_id_here",
    MaxSelect: 1,  // Note: use MaxSelect, not Max
    CascadeDelete: true,
}
```

### JSON Fields
```go
&core.JSONField{
    Name: "metadata",
    MaxSize: 65535, // in bytes
}
```

### Editor Fields
```go
&core.EditorField{
    Name: "content",
    Required: true,
    ConvertURLs: true,
    MaxSize: 1048576,  // Note: use MaxSize, not Max
}
```

## Collection Operations

### Creating a New Base Collection
```go
collection := core.NewBaseCollection("posts")
collection.Fields.Add(&core.TextField{
    Name: "title",
    Required: true,
    Max: 100,
})
collection.Fields.Add(&core.EditorField{
    Name: "content",
    Required: true,
})

// For relations to system users collection
collection.Fields.Add(&core.RelationField{
    Name: "author",
    CollectionId: "_pb_users_auth_", // System users collection ID
    CascadeDelete: true,
})

// Set collection rules
collection.ViewRule = types.Pointer("@request.auth.id != ''")
collection.ListRule = types.Pointer("@request.auth.id != ''")
collection.CreateRule = types.Pointer("@request.auth.id != ''")
collection.UpdateRule = types.Pointer("@request.auth.id = author")
collection.DeleteRule = types.Pointer("@request.auth.id = author")

return app.Save(collection)
```

### Updating an Existing Collection
```go
collection, err := app.FindCollectionByNameOrId("posts")
if err != nil {
    return err
}

collection.Fields.Add(&core.DateField{
    Name: "publishedAt",
})

collection.UpdateRule = types.Pointer("@request.auth.id = author")
return app.Save(collection)
```

### Creating a View Collection
```go
viewQuery := `
SELECT 
    posts.id,
    posts.title,
    users.name as author_name
FROM posts
JOIN users ON posts.author = users.id
`
collection := core.NewViewCollection("posts_with_authors", viewQuery)
return app.Save(collection)
```

## Working with Relations

### Best Practices
1. For self-referencing relations, save the collection first, then add the relation field in a separate migration
2. Use actual collection IDs for relations:
   - Users collection: `"_pb_users_auth_"`
   - Other collections: fetch them first and use `collection.Id`

### Fetching Collections for Relations
```go
authorsCollection, err := app.FindCollectionByNameOrId("authors")
if err != nil {
    return err
}

categoriesCollection, err := app.FindCollectionByNameOrId("categories")
if err != nil {
    return err
}

collection := core.NewBaseCollection("posts")
collection.Fields.Add(&core.RelationField{
    Name: "author",
    Required: true,
    MaxSelect: 1,
    CollectionId: authorsCollection.Id,
})
collection.Fields.Add(&core.RelationField{
    Name: "categories",
    MaxSelect: 5,
    CollectionId: categoriesCollection.Id,
})

// Rules can reference relations immediately
collection.UpdateRule = types.Pointer("author.user = @request.auth.id")
```

## Migration Order and Dependencies

Migrations run in filename order (timestamp prefix). Create collections in this order:

1. **Independent collections** (categories, newsletter)
2. **Collections depending only on system collections** (authors depends on users)
3. **Collections with relations to other custom collections** (posts depends on authors & categories)
4. **Collections with complex dependencies** (comments depends on posts & users)
5. **Self-referencing relations** in separate migrations

### Example Migration Order
```
1_create_categories.go       # Independent
2_create_authors.go          # Depends on system users
3_create_posts.go           # Depends on authors and categories
4_create_comments.go        # Depends on posts and users
5_add_parent_to_comments.go # Self-referencing relation
```

## Collection Rules Patterns

### Common Patterns
- **Empty/public rules**: `types.Pointer("")`
- **Authenticated-only**: `types.Pointer("@request.auth.id != ''")`
- **Owner-only edit**: `UpdateRule = types.Pointer("author = @request.auth.id")`
- **Published content**: `ViewRule = types.Pointer("status = 'published' || author = @request.auth.id")`
- **Through relations**: `UpdateRule = types.Pointer("author.user = @request.auth.id")`

### Rule Types
- `ListRule` - Controls who can list records
- `ViewRule` - Controls who can view individual records
- `CreateRule` - Controls who can create records
- `UpdateRule` - Controls who can update records
- `DeleteRule` - Controls who can delete records

For auth collections:
- `AuthRule` - Controls authentication
- `ManageRule` - Controls management operations

## Error Handling

Always check for errors after operations:
```go
collection, err := app.FindCollectionByNameOrId("posts")
if err != nil {
    return err
}

// Continue with collection operations...
```

## Best Practices

1. **Always check if collections exist** before creating relations
2. **Use `types.Pointer()`** for nullable rule assignments and pointer values
3. **Import types package**: `"github.com/pocketbase/pocketbase/tools/types"`
4. **Handle errors immediately** after operations
5. **Use transactions** for complex multi-collection operations
6. **Validate field names** don't conflict with system fields (id, created, updated)
7. **Create indexes** for frequently queried fields
8. **Use `SaveNoValidate()` sparingly** - only when validation must be bypassed
9. **Check PocketBase docs** for breaking changes in pre-1.0 versions

## Task Automation

Use these mise tasks for migration workflows:

- `mise run makemigration <name>` - Create a new migration file
- `mise run migrate` - Run all pending migrations
- `mise run migratedown` - Rollback the last migration
- `mise run show-collections` - Display current collections
- `mise run backup` - Backup database to /tmp

### Critical Workflow

1. **Write ONE migration at a time**
2. **Execute immediately** with `mise run migrate`
3. **Verify it worked** before writing the next migration
4. **Never write multiple migrations** without running them in between
5. **Always run `mise run backup`** before destructive changes

## Collection Properties Reference

### System Fields (automatically managed)
- `Id` - Unique record identifier
- `Created` - Record creation timestamp
- `Updated` - Last update timestamp

### Collection Properties
- `Name` - Collection name
- `Type` - Collection type (base, auth, view)
- `System` - Whether it's a system collection
- `Fields` - Collection fields
- `Indexes` - Collection indexes

### Auth Collection Extras
- `AuthRule` - Authentication rule
- `ManageRule` - Management rule
- `OAuth2` - OAuth2 settings
- `PasswordAuth` - Password authentication settings
- `AuthToken` - Auth token settings

## Additional Resources

- Official documentation: https://pocketbase.io/docs/go-collections/
- For complex migration scenarios, consult the pocketbase-migration-expert agent