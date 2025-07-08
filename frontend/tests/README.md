# Tests

This directory contains all Playwright tests for the frontend application.

## Prerequisites

For authentication tests:
1. Ensure PocketBase is running on http://localhost:8090:
   ```bash
   just dev-pb
   ```

2. Ensure you have a `.env` file in the project root with:
   ```
   SUPERUSER_EMAIL=your-email@example.com
   SUPERUSER_PASSWORD=your-password
   ```

## Running Tests

From the frontend directory:

```bash
# Run all tests (headless)
bun run test

# Run tests in UI mode (interactive with browser)
bun run test:ui

# Run tests with headed browser (see browser window)
bunx playwright test --headed

# Run a specific test file
bunx playwright test tests/auth.test.ts

# Run tests with a specific reporter
bunx playwright test --reporter=list
```

## Test Coverage

### Home Page Tests (`home.test.ts`)
- ✅ Welcome heading renders correctly
- ✅ Login form displays with all elements

### Authentication Tests (`auth.test.ts`)
- ✅ Login with superuser credentials
- ✅ Logout functionality
- ✅ Invalid credentials error handling
- ✅ Protected route redirect when not authenticated
- ✅ Automatic skip if PocketBase is not running

## Notes

- All tests run in Chromium by default
- Tests run headless by default for CI/CD compatibility
- Authentication tests will automatically skip if PocketBase is not running
- The development server (port 5173) is automatically started when running tests