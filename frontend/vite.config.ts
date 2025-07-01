import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from parent directory
config({ path: resolve(__dirname, '../.env') });

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	define: {
		'import.meta.env.VITE_SUPERUSER_EMAIL': JSON.stringify(process.env.SUPERUSER_EMAIL),
		'import.meta.env.VITE_SUPERUSER_PASSWORD': JSON.stringify(process.env.SUPERUSER_PASSWORD),
		'import.meta.env.VITE_POCKETBASE_URL': JSON.stringify(process.env.VITE_POCKETBASE_URL || 'http://localhost:8090')
	},
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					setupFiles: ['./vitest.setup.ts']
				}
			}
		]
	}
});
