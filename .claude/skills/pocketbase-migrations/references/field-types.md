# PocketBase Field Types Reference

Complete reference for all PocketBase field types and their configurations.

## Text Fields

```go
&core.TextField{
    Name:     "title",
    Required: true,
    Min:      1,          // minimum character length
    Max:      100,        // maximum character length
    Pattern:  "^[a-z]+$", // regex validation (optional)
}
```

**Common use cases:**
- Titles, names, short descriptions
- Slugs with pattern validation
- Any text with length constraints

## Number Fields

```go
&core.NumberField{
    Name:       "price",
    Required:   true,
    Min:        types.Pointer(0.0),    // use types.Pointer for min
    Max:        types.Pointer(999.99), // use types.Pointer for max
    OnlyInt:    false,                 // restrict to integers only
    NoDecimal:  false,                 // allow decimal values
}
```

**Important notes:**
- Use `types.Pointer()` for min/max values
- Set `OnlyInt: true` for integer-only fields
- Default allows decimal values

**Common use cases:**
- Prices, quantities, ratings
- Counts, scores, measurements
- Any numeric data

## Boolean Fields

```go
&core.BoolField{
    Name:     "isActive",
    Required: false,
}
```

**Common use cases:**
- Feature flags, status indicators
- Toggles, checkboxes
- Yes/no fields

## Email Fields

```go
&core.EmailField{
    Name:     "email",
    Required: true,
}
```

**Common use cases:**
- Contact emails
- User emails (in non-auth collections)
- Any email with validation

## URL Fields

```go
&core.URLField{
    Name:       "website",
    OnlyDomain: false,  // true = require domain only, no path
}
```

**Common use cases:**
- Website links
- Social media profiles
- External references

## Date Fields

### Manual Date Field

```go
&core.DateField{
    Name: "publishedAt",
    Min:  types.Pointer(time.Now()),
    Max:  types.Pointer(time.Now().AddDate(1, 0, 0)),
}
```

**Common use cases:**
- Event dates, deadlines
- Birth dates, expiration dates
- Any user-entered date

### Auto-managed Date Field

```go
&core.AutodateField{
    Name:     "created",
    OnCreate: true,  // set when record is created
    OnUpdate: false, // don't update on record updates
}

&core.AutodateField{
    Name:     "modified",
    OnCreate: false,
    OnUpdate: true,  // update when record is modified
}
```

**Common use cases:**
- Creation timestamps
- Last modified timestamps
- Automated tracking fields

## Select Fields

### Single Select

```go
&core.SelectField{
    Name:      "status",
    Required:  true,
    Values:    []string{"draft", "published", "archived"},
    MaxSelect: 1,  // cannot exceed number of values
}
```

### Multi-select

```go
&core.SelectField{
    Name:      "tags",
    Values:    []string{"tech", "design", "business", "marketing"},
    MaxSelect: 3,  // allow up to 3 selections
}
```

**Common use cases:**
- Status fields, categories
- Tags, labels
- Any predefined options

## File Fields

```go
&core.FileField{
    Name:      "avatar",
    MaxSelect: 1,                                    // number of files
    MaxSize:   5242880,                             // 5MB in bytes
    MimeTypes: []string{"image/jpeg", "image/png"}, // allowed types
    Protected: false,                                // require auth to access
}
```

**File size reference:**
- 1MB = 1,048,576 bytes
- 5MB = 5,242,880 bytes
- 10MB = 10,485,760 bytes

**Common mime types:**
- Images: `"image/jpeg"`, `"image/png"`, `"image/gif"`, `"image/webp"`
- Documents: `"application/pdf"`, `"application/msword"`
- Archives: `"application/zip"`, `"application/x-rar-compressed"`

**Common use cases:**
- Profile pictures, thumbnails
- Document uploads
- Media attachments

## Relation Fields

```go
// Single relation
authorsCollection, err := app.FindCollectionByNameOrId("authors")
if err != nil {
    return err
}

&core.RelationField{
    Name:          "author",
    Required:      true,
    CollectionId:  authorsCollection.Id,
    MaxSelect:     1,           // Note: MaxSelect, not Max
    CascadeDelete: true,        // delete related records when this is deleted
}

// Multiple relations
&core.RelationField{
    Name:         "categories",
    CollectionId: categoriesCollection.Id,
    MaxSelect:    5,  // allow up to 5 selections
}

// System users relation
&core.RelationField{
    Name:         "creator",
    CollectionId: "_pb_users_auth_",  // system users collection
    MaxSelect:    1,
}
```

**Important notes:**
- Use `MaxSelect`, not `Max`
- Fetch target collection first to get its ID
- System users collection: `"_pb_users_auth_"`
- `CascadeDelete: true` removes related records

**Common use cases:**
- User associations
- Category/tag relationships
- Parent-child relationships
- Many-to-many links

## JSON Fields

```go
&core.JSONField{
    Name:    "metadata",
    MaxSize: 65535,  // in bytes
}
```

**Common use cases:**
- Flexible metadata
- Configuration objects
- Dynamic structured data

## Editor Fields (Rich Text)

```go
&core.EditorField{
    Name:        "content",
    Required:    true,
    ConvertURLs: true,      // convert URLs to links
    MaxSize:     1048576,   // Note: MaxSize, not Max (1MB)
}
```

**Size reference:**
- 100KB = 102,400 bytes
- 1MB = 1,048,576 bytes
- 5MB = 5,242,880 bytes

**Important notes:**
- Use `MaxSize`, not `Max`
- Stores rich text/HTML content
- `ConvertURLs: true` auto-links URLs

**Common use cases:**
- Blog post content
- Article bodies
- Rich text descriptions

## Field Validation Patterns

### Text Patterns (Regex)

```go
// Alphanumeric only
Pattern: "^[a-zA-Z0-9]+$"

// Lowercase letters only
Pattern: "^[a-z]+$"

// URL slug
Pattern: "^[a-z0-9-]+$"

// Phone number (US)
Pattern: "^\\d{3}-\\d{3}-\\d{4}$"

// Hex color
Pattern: "^#[0-9A-Fa-f]{6}$"
```

## Complete Field Type Examples

### Blog Post Collection

```go
collection := core.NewBaseCollection("posts")

collection.Fields.Add(&core.TextField{
    Name:     "title",
    Required: true,
    Max:      200,
})

collection.Fields.Add(&core.TextField{
    Name: "slug",
    Required: true,
    Max: 200,
    Pattern: "^[a-z0-9-]+$",
})

collection.Fields.Add(&core.EditorField{
    Name:     "content",
    Required: true,
    MaxSize:  2097152, // 2MB
})

collection.Fields.Add(&core.SelectField{
    Name:      "status",
    Required:  true,
    Values:    []string{"draft", "published", "archived"},
    MaxSelect: 1,
})

collection.Fields.Add(&core.RelationField{
    Name:         "author",
    Required:     true,
    CollectionId: "_pb_users_auth_",
    MaxSelect:    1,
})

collection.Fields.Add(&core.DateField{
    Name: "publishedAt",
})

collection.Fields.Add(&core.AutodateField{
    Name:     "created",
    OnCreate: true,
})

collection.Fields.Add(&core.AutodateField{
    Name:     "updated",
    OnUpdate: true,
})
```

### E-commerce Product Collection

```go
collection := core.NewBaseCollection("products")

collection.Fields.Add(&core.TextField{
    Name:     "name",
    Required: true,
    Max:      200,
})

collection.Fields.Add(&core.TextField{
    Name: "description",
    Max:  1000,
})

collection.Fields.Add(&core.NumberField{
    Name:     "price",
    Required: true,
    Min:      types.Pointer(0.0),
})

collection.Fields.Add(&core.NumberField{
    Name:    "stock",
    OnlyInt: true,
    Min:     types.Pointer(0.0),
})

collection.Fields.Add(&core.FileField{
    Name:      "images",
    MaxSelect: 5,
    MaxSize:   5242880, // 5MB per image
    MimeTypes: []string{"image/jpeg", "image/png", "image/webp"},
})

collection.Fields.Add(&core.SelectField{
    Name:      "category",
    Required:  true,
    Values:    []string{"electronics", "clothing", "home", "books"},
    MaxSelect: 1,
})

collection.Fields.Add(&core.BoolField{
    Name: "featured",
})

collection.Fields.Add(&core.JSONField{
    Name:    "specifications",
    MaxSize: 32768, // 32KB
})
```

## Field Updates

### Adding Fields

```go
collection, err := app.FindCollectionByNameOrId("posts")
if err != nil {
    return err
}

collection.Fields.Add(&core.TextField{
    Name: "subtitle",
    Max:  200,
})

return app.Save(collection)
```

### Removing Fields

```go
collection, err := app.FindCollectionByNameOrId("posts")
if err != nil {
    return err
}

collection.Fields.RemoveByName("oldField")

return app.Save(collection)
```

### Modifying Fields

To modify a field, you need to remove it and re-add it with new settings:

```go
collection, err := app.FindCollectionByNameOrId("posts")
if err != nil {
    return err
}

// Remove old field
collection.Fields.RemoveByName("title")

// Add with new settings
collection.Fields.Add(&core.TextField{
    Name:     "title",
    Required: true,
    Max:      300, // changed from 200
})

return app.Save(collection)
```

**Warning:** Removing and re-adding fields may result in data loss. Consider data migration if field contains important data.
