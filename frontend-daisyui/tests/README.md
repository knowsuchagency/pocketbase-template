# Frontend Testing with Playwright

This project uses Playwright for end-to-end functional testing.

## Setup

Playwright has been configured with:
- Test runner: @playwright/test
- Browsers: Chromium, Firefox, and WebKit
- Base URL: http://localhost:8090 (PocketBase server)
- Automatic server startup before tests

## Prerequisites

Before running tests, ensure the frontend is built:

```bash
# Build the frontend
bun run build
```

PocketBase will be started automatically when running tests (see `webServer` config in `playwright.config.ts`).

## Running Tests

```bash
# Run all tests headlessly
bun run test

# Run tests with UI mode (recommended for development)
bun run test:ui

# Run tests in headed mode (see browser)
bun run test:headed

# Debug tests interactively
bun run test:debug

# Run specific test file
bun run test tests/login.spec.ts

# Run tests in specific browser
bun run test --project=chromium

# Open the HTML report after tests
bun run test:report
```

Note: The HTML report is generated after each test run but won't open automatically. Use `test:report` to view it.

## Test Structure

- Test files: `tests/*.spec.ts`
- Configuration: `playwright.config.ts`
- Test reports: `playwright-report/` (generated after test runs)

## Available Tests

### Login Tests (`tests/login.spec.ts`)

Tests the complete login flow:
1. **Successful login** - Uses superuser credentials from `.env`
2. **Failed login** - Verifies error handling with invalid credentials
3. **Loading state** - Ensures UI shows loading state during authentication
4. **Auth redirect** - Verifies authenticated users are redirected from login page

## Writing Tests

Example test structure:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await page.click('button');
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

## Tips

1. Use `test:ui` mode during development for the best experience
2. Playwright automatically waits for elements, no need for manual waits
3. Use semantic selectors when possible (roles, text content)
4. Tests run against the built frontend served by PocketBase
5. The server is automatically started before tests (unless already running)

## Debugging Failed Tests

1. Run with `--debug` flag for step-by-step debugging
2. Check `playwright-report/` for detailed failure information
3. Use `page.screenshot()` or `page.pause()` for debugging
4. Enable video recording in config for CI environments