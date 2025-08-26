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
description: Implement a complete feature for this PocketBase + React Router v7 project, from data model to frontend with tests
model: claude-opus-4-1
---

## Overview

This command implements features end-to-end in this specific project architecture:

- **Backend**: PocketBase (Go) with migration system
- **Frontend**: React Router v7 with TanStack Query, Zustand client state management, shadcn/ui components
- **Testing**: Playwright for end-to-end tests

## Prerequisites

Before running:

1. If `requirements.md` exists, read it
2. Ensure `layout.md` exists with wireframes and navigation flows (if not, stop and tell the user to generate the layout file)
3. Ensure `.env` file exists (if not, stop and tell user to run `mise run init`)
4. Project dependencies are installed

## Implementation Process

### Step 1: Initialize Implementation Plan

1. Check prerequisites:

   - Verify `.env` file exists. If not, stop and inform user:
     ```
     Error: .env file not found. Please run 'mise run init' to set up the project first.
     ```
   - Read `requirements.md` if it exists
   - Verify `layout.md` exists

2. Read `requirements.md` and `layout.md`
3. Create implementation todos:
   - [ ] Design and create database schema/collections
   - [ ] Generate and apply migrations
   - [ ] Implement frontend components
   - [ ] Implement frontend routes
   - [ ] Implement TanStack Query mutations and queries
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

**Use the pocketbase-migration-expert agent** for all migration tasks:

Use the Task tool to invoke the pocketbase-migration-expert subagent with a detailed description of the collections and fields you need. The agent will:
- Generate migration files using `mise run makemigration`
- Create properly structured migration files with correct syntax
- Handle field types, relations, and validation
- Follow PocketBase best practices and latest syntax
- Include proper rollback logic
- Apply migrations using `mise run migrate`
- Verify collections are created correctly using `mise run show-collections`

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

#### 4.1 Create TanStack Query Hooks

Create query and mutation hooks in `frontend/app/hooks/`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@TanStack/react-query";
import pb from "~/lib/pocketbase";
import type { RecordModel } from "pocketbase";

// Query hook for fetching data
export function useFeatureItems() {
  return useQuery({
    queryKey: ["feature-items"],
    queryFn: async () => {
      return await pb.collection("items").getFullList({
        sort: "-created",
      });
    },
  });
}

// Query hook for single item
export function useFeatureItem(id: string) {
  return useQuery({
    queryKey: ["feature-items", id],
    queryFn: async () => {
      return await pb.collection("items").getOne(id);
    },
    enabled: !!id,
  });
}

// Mutation hook for creating items
export function useCreateFeatureItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<RecordModel>) => {
      return await pb.collection("items").create(data);
    },
    onSuccess: () => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: ["feature-items"] });
    },
  });
}

// Mutation hook for updating items
export function useUpdateFeatureItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RecordModel> }) => {
      return await pb.collection("items").update(id, data);
    },
    onSuccess: (_, { id }) => {
      // Invalidate both the item and the list
      queryClient.invalidateQueries({ queryKey: ["feature-items"] });
      queryClient.invalidateQueries({ queryKey: ["feature-items", id] });
    },
  });
}

// Mutation hook for deleting items
export function useDeleteFeatureItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await pb.collection("items").delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-items"] });
    },
  });
}
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

1. **Create Playwright tests** in `frontend/tests/` that:

   - Cover all acceptance criteria from requirements.md
   - Test all user journeys from layout.md
   - Verify data persistence and proper permissions
   - Test error states and edge cases
   - Check responsive design on mobile/desktop viewports

   ```typescript
   import { test, expect } from "@playwright/test";

   test.describe("Feature Name", () => {
     test("acceptance criteria 1", async ({ page }) => {
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

### Step 6: Final Checks

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

- Use the pocketbase-migration-expert agent for all migration tasks
- Use PocketBase's built-in auth system - don't reinvent
- Leverage PocketBase's realtime subscriptions when appropriate
- Use the PocketBase SDK on the frontend for all standard CRUD operations
- Only create custom backend routes for complex business logic that can't be handled by PocketBase
- PocketBase auto-generates REST APIs for all collections - use them!

### Frontend Architecture

- Use TanStack Query for data fetching and server state
- Use Zustand for client state management
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

## Migration Notes

Use the pocketbase-migration-expert agent for all migration tasks. The agent has up-to-date knowledge of PocketBase syntax and handles version compatibility automatically.

## Tooling Recommendations

- Use bun over npm

## Development Workflow

- For common development tasks, check whether a mise task exists with `mise t`. If it's something that's likely to be done often, create a mise task and execute it via mise

## Best Practices

- Whenever communicating with an external service such as PocketBase, ensure the interaction is abstracted behind a TanStack query or mutation

## shadcn/ui Guidelines

- For basic UI components which have a shadcn implementation always install them using the shadcn cli i.e. `bunx --bun shadcn@latest add button` as opposed to writing them from scratch


$ARGUMENTS
