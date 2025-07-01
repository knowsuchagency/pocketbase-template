import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render login form when not authenticated', async () => {
		render(Page);
		
		// Check for login form heading
		const heading = page.getByRole('heading', { level: 2 });
		await expect.element(heading).toHaveTextContent('Login');
		
		// Check for email input
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		await expect.element(emailInput).toBeInTheDocument();
		
		// Check for password input
		const passwordInput = page.getByLabelText('Password');
		await expect.element(passwordInput).toBeInTheDocument();
		
		// Check for login button
		const loginButton = page.getByRole('button', { name: 'Login' });
		await expect.element(loginButton).toBeInTheDocument();
	});
});
