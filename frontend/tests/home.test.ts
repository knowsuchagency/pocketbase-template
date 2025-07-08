import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  
  test('should render login form', async ({ page }) => {
    await page.goto('/');
    
    // Check for login heading
    const loginHeading = page.getByRole('heading', { level: 2, name: 'Login' });
    await expect(loginHeading).toBeVisible();
    
    // Check for form inputs
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Check for login button
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });
});
