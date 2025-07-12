import { test, expect } from '@playwright/test';

const SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL || 'foo@bar.com';
const SUPERUSER_PASSWORD = process.env.SUPERUSER_PASSWORD || 'changeme';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    // Check that login form is visible
    await expect(page.getByText('Login').first()).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check for error notification
    await expect(page.getByText('Login failed')).toBeVisible();
  });

  test('should redirect to dashboard on successful login', async ({ page }) => {
    // Note: This test requires a valid test user in your PocketBase instance
    // You may want to set up test data or mock the API response
    
    // Fill in valid credentials from .env
    await page.getByLabel('Email').fill(SUPERUSER_EMAIL);
    await page.getByLabel('Password').fill(SUPERUSER_PASSWORD);
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    
    // Check that dashboard is displayed
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login with superuser credentials
    await page.getByLabel('Email').fill(SUPERUSER_EMAIL);
    await page.getByLabel('Password').fill(SUPERUSER_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/dashboard');
    
    // Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Should redirect to login page
    await page.waitForURL('/');
    await expect(page.getByText('Login').first()).toBeVisible();
    
    // Check for logout notification
    await expect(page.getByRole('heading', { name: 'Logged out' })).toBeVisible();
  });
});