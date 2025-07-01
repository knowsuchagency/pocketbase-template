import { beforeAll, afterAll } from 'vitest';
import { setupPocketBaseForTests, teardownPocketBaseForTests } from './src/lib/pocketbase-test-server.js';

// Global setup for all tests
beforeAll(async () => {
    await setupPocketBaseForTests();
}, 30000); // 30 second timeout

// Global teardown for all tests
afterAll(async () => {
    await teardownPocketBaseForTests();
}, 30000); // 30 second timeout