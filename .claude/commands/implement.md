---
allowed-tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - Grep
  - Glob
  - WebFetch
  - TodoWrite
  - Task
description: Implement a complete feature for this PocketBase + React Router v7 + Cloudflare Workers project, from data model to frontend with tests
---

## Overview

This command implements features end-to-end in this specific project architecture:
- **Backend**: PocketBase (Go) with migration system
- **Frontend**: React Router v7 with SSR for Cloudflare Workers, Zustand state management, shadcn/ui components
- **Testing**: Playwright for end-to-end tests

## Prerequisites

Before running, ensure:
1. `requirements.md` exists with clear feature requirements
2. `layout.md` exists with wireframes and navigation flows
3. `.env` file exists (if not, stop and tell user to run `mise run init`)
4. Project dependencies are installed

## Implementation Process

### Step 1: Initialize Implementation Plan

1. Check prerequisites:
   - Verify `.env` file exists. If not, stop and inform user:
     ```
     Error: .env file not found. Please run 'mise run init' to set up the project first.
     ```
   - Verify `requirements.md` exists
   - Verify `layout.md` exists

2. Read `requirements.md` and `layout.md`
3. Create implementation todos:
   - [ ] Design and create database schema/collections
   - [ ] Generate and apply migrations
   - [ ] Implement frontend components
   - [ ] Implement frontend routes
   - [ ] Integrate with Zustand stores
   - [ ] Write and run Playwright tests
   - [ ] Verify all acceptance criteria are met

### Step 2: Design Data Model

Based on requirements, design PocketBase collections:
1. Identify entities and relationships
2. Define collection schemas with:
   - Field types and validation rules
   - List/View/Create/Update/Delete permissions
   - Indexes for performance
   - Relations between collections

### Step 3: Create and Apply Migrations

1. **Check PocketBase syntax** - ALWAYS read the latest documentation before writing migrations:
   - Read https://pocketbase.io/docs/go-collections/
   - Extract the current Go syntax for creating collections, fields, and relations
   - Pay attention to Collection(), Schema.AddField(), and relation field types

2. **Generate migration files**:
   ```bash
   mise run makemigration "create_[feature]_collections"
   ```

3. **Write migration code** following the latest PocketBase syntax:
   ```go
   package migrations

   import (
       "github.com/pocketbase/pocketbase/core"
       m "github.com/pocketbase/pocketbase/migrations"
   )

   func init() {
       m.Register(func(app core.App) error {
           // Create collections here
           return nil
       }, func(app core.App) error {
           // Rollback logic here
           return nil
       })
   }
   ```

4. **Apply migrations**:
   ```bash
   mise run migrate
   ```

5. **Verify collections**:
   ```bash
   mise run show-collections
   ```

### Step 4: Implement Frontend

**IMPORTANT**: Use the PocketBase SDK directly in the frontend for all data operations. PocketBase automatically generates REST APIs for all collections with built-in:
- CRUD operations (create, read, update, delete)
- Filtering, sorting, and pagination
- Real-time subscriptions
- File uploads
- Authentication and authorization

Only create custom backend routes if you need:
- Complex business logic that can't be handled by PocketBase rules
- Integration with external services
- Custom data transformations
- Batch operations across multiple collections

#### 4.1 Create Zustand Store (if needed)

Create stores in `frontend/app/stores/`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import pb from '~/lib/pocketbase';

interface FeatureStore {
  // State
  items: any[];
  loading: boolean;
  
  // Actions
  fetchItems: () => Promise<void>;
  createItem: (data: any) => Promise<void>;
}

export const useFeatureStore = create<FeatureStore>()(
  persist(
    (set, get) => ({
      // Implementation
    }),
    {
      name: 'feature-store',
    }
  )
);
```

#### 4.2 Create UI Components

1. Use shadcn/ui components from `~/components/ui/`
2. Create feature-specific components in `frontend/app/components/`
3. Follow existing component patterns for consistency

#### 4.3 Create Routes

1. Add route files in `frontend/app/routes/`
2. Update `frontend/routes.ts` with new route definitions:
   ```typescript
   {
     path: "/feature",
     lazy: () => import("./app/routes/feature"),
   }
   ```

3. Implement route components with:
   - Proper loading states
   - Error boundaries
   - Authentication checks (using ProtectedRoute wrapper)
   - Responsive design for mobile/desktop

#### 4.4 Update Navigation

Update relevant navigation components to include links to new features.

### Step 5: Write and Run Tests

1. **Create Playwright tests** in `frontend/tests/`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Feature Name', () => {
     test('acceptance criteria 1', async ({ page }) => {
       // Test implementation
     });
   });
   ```

2. **Run tests** (Playwright will automatically start frontend and backend servers):
   ```bash
   mise run test-frontend
   ```

3. **Debug failing tests**:
   ```bash
   mise run test-debug
   ```

Note: The Playwright configuration automatically starts both the PocketBase backend and frontend dev server before running tests, so you don't need to manually start them.

### Step 6: Verify Implementation

The Playwright tests from Step 5 serve as the primary verification method. They should:

1. **Cover all acceptance criteria** from requirements.md
2. **Test all user journeys** from layout.md
3. **Verify data persistence** and proper permissions
4. **Test error states** and edge cases
5. **Check responsive design** on mobile/desktop viewports

If any tests fail, debug and fix issues before proceeding.

### Step 7: Final Checks

1. **Run type checking**:
   ```bash
   mise run typecheck
   ```

2. **Run all tests**:
   ```bash
   mise run test
   ```

3. **Build for production**:
   ```bash
   mise run build
   ```

4. **Update TodoWrite** to mark all tasks as completed

## Important Reminders

### PocketBase Specifics
- Always check latest PocketBase documentation for migration syntax
- Use PocketBase's built-in auth system - don't reinvent
- Leverage PocketBase's realtime subscriptions when appropriate
- Use the PocketBase SDK on the frontend for all standard CRUD operations
- Only create custom backend routes for complex business logic that can't be handled by PocketBase
- PocketBase auto-generates REST APIs for all collections - use them!

### Frontend Architecture
- Use Hono app context in Cloudflare Workers
- Leverage React Router v7's SSR capabilities
- Use Zustand for state management, not Context API
- Import shadcn components from `~/components/ui/`
- Follow existing patterns for consistency

### Testing
- Playwright tests should cover all acceptance criteria
- Use proper test data cleanup
- Test both happy paths and error scenarios
- Verify responsive behavior in tests

### Common Pitfalls to Avoid
- Don't forget to apply migrations before testing
- Don't hardcode URLs - use environment variables
- Don't skip error handling in frontend
- Don't forget loading states
- Don't skip mobile responsive design

## Command Completion

When implementation is complete:
1. All todos should be marked as completed
2. All acceptance criteria should be met
3. All tests should be passing
4. The feature should work end-to-end in development

Alert the user of completion:
```bash
klaxon --title "🚀 Claude Code" --subtitle "✅ Implementation Complete" --message "Feature successfully implemented with passing tests"
```

$ARGUMENTS
