import { expect, test } from '@playwright/test';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the parent directory's .env file
config({ path: resolve(__dirname, '../../.env') });

// Helper function to check if PocketBase is running
async function isPocketBaseRunning(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8090/api/health');
    return response.ok;
  } catch {
    return false;
  }
}

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Check if PocketBase is running
    const isRunning = await isPocketBaseRunning();
    if (!isRunning) {
      console.warn('\n⚠️  PocketBase is not running on http://localhost:8090');
      console.warn('Please start PocketBase with: just dev-pb');
      console.warn('Skipping authentication tests...\n');
      test.skip();
    }

    // Ensure we have the required environment variables
    if (!process.env.SUPERUSER_EMAIL || !process.env.SUPERUSER_PASSWORD) {
      console.warn('\n⚠️  Missing SUPERUSER_EMAIL or SUPERUSER_PASSWORD in .env file');
      console.warn('Please ensure your .env file contains these variables');
      console.warn('Skipping authentication tests...\n');
      test.skip();
    }
  });

  test('should login with superuser credentials', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Check that we're on the login page
    await expect(page.locator('h2')).toHaveText('Login');

    // Fill in the login form
    await page.fill('input[type="email"]', process.env.SUPERUSER_EMAIL!);
    await page.fill('input[type="password"]', process.env.SUPERUSER_PASSWORD!);

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');

    // Verify we're logged in
    await expect(page.locator('h1')).toHaveText('Dashboard');
    await expect(page.locator('text=Welcome, ' + process.env.SUPERUSER_EMAIL)).toBeVisible();
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();

    // Verify user information is displayed
    await expect(page.locator('text=User Information')).toBeVisible();
    // Use a more specific selector to avoid multiple matches
    await expect(page.locator('.card-body').filter({ hasText: 'User Information' })).toContainText(process.env.SUPERUSER_EMAIL!);
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/');
    await page.fill('input[type="email"]', process.env.SUPERUSER_EMAIL!);
    await page.fill('input[type="password"]', process.env.SUPERUSER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Click logout button
    await page.click('button:has-text("Logout")');

    // Should redirect to home page
    await page.waitForURL('/');
    await expect(page.locator('h2')).toHaveText('Login');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');

    // Try to login with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('.alert-error')).toBeVisible();
    await expect(page.locator('.alert-error')).toContainText(/failed|invalid/i);

    // Should still be on the login page
    await expect(page.url()).toBe('http://localhost:5173/');
  });

  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    // Try to access dashboard directly
    await page.goto('/dashboard');

    // Should redirect to home/login page
    await page.waitForURL('/');
    await expect(page.locator('h2')).toHaveText('Login');
  });
});
