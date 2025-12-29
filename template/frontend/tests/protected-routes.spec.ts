import { test, expect } from '@playwright/test';

const SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL || 'foo@bar.com';
const SUPERUSER_PASSWORD = process.env.SUPERUSER_PASSWORD || 'changeme';

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    // Try to navigate directly to dashboard
    await page.goto('/dashboard');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Login').first()).toBeVisible();
  });

  test('should redirect authenticated users from login to dashboard', async ({ page }) => {
    // First login
    await page.goto('/');
    await page.getByLabel('Email').fill(SUPERUSER_EMAIL);
    await page.getByLabel('Password').fill(SUPERUSER_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/dashboard');
    
    // Try to go back to login page
    await page.goto('/');
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});