import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page where login form is located
    await page.goto('/');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill in the login form with credentials from .env
    await page.fill('input[placeholder="email@example.com"]', 'knowsuchagency@gmail.com');
    await page.fill('input[placeholder="Enter your password"]', 'P@ssword89');
    
    // Click the login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');
    
    // Verify we're on the dashboard
    expect(page.url()).toContain('/dashboard');
    
    // Verify dashboard content is visible
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should display error message with invalid credentials', async ({ page }) => {
    // Fill in the login form with invalid credentials
    await page.fill('input[placeholder="email@example.com"]', 'invalid@example.com');
    await page.fill('input[placeholder="Enter your password"]', 'wrongpassword');
    
    // Click the login button
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    const errorAlert = page.locator('.alert-error').first();
    await expect(errorAlert).toBeVisible();
    
    // Verify error message contains expected text
    await expect(errorAlert).toContainText('Failed to authenticate');
  });

  test('should have disabled submit button while loading', async ({ page }) => {
    // Fill in valid credentials
    await page.fill('input[placeholder="email@example.com"]', 'knowsuchagency@gmail.com');
    await page.fill('input[placeholder="Enter your password"]', 'P@ssword89');
    
    // Start intercepting the login request to delay it
    await page.route('**/api/collections/_/auth-with-password', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
      await route.continue();
    });
    
    // Click the login button
    const submitButton = page.getByRole('button', { name: /login/i });
    await submitButton.click();
    
    // Check that button shows loading state
    await expect(page.getByRole('button', { name: /logging in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  test('should redirect to dashboard if already authenticated', async ({ page, context }) => {
    // First, login successfully
    await page.fill('input[placeholder="email@example.com"]', 'knowsuchagency@gmail.com');
    await page.fill('input[placeholder="Enter your password"]', 'P@ssword89');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Now try to navigate back to home (where login form is)
    await page.goto('/');
    
    // Should be redirected to dashboard
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });
});