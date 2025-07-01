import PocketBase from 'pocketbase';

// Create a PocketBase instance for testing
export function createTestPb() {
    return new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090');
}

// Login as superuser for admin operations
export async function loginAsSuperuser(pb) {
    const email = import.meta.env.VITE_SUPERUSER_EMAIL;
    const password = import.meta.env.VITE_SUPERUSER_PASSWORD;
    
    if (!email || !password) {
        throw new Error('SUPERUSER_EMAIL and SUPERUSER_PASSWORD must be set in environment variables');
    }
    
    return await pb.admins.authWithPassword(email, password);
}

// Create a test user
export async function createTestUser(pb, userData = {}) {
    const defaultData = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        emailVisibility: true
    };
    
    const user = await pb.collection('users').create({
        ...defaultData,
        ...userData
    });
    
    return { user, password: userData.password || defaultData.password };
}

// Delete a test user
export async function deleteTestUser(pb, userId) {
    try {
        await pb.collection('users').delete(userId);
    } catch (error) {
        console.warn('Failed to delete test user:', error);
    }
}

// Cleanup function for tests
export async function cleanupTestUser(pb, userId) {
    if (userId) {
        // Login as superuser to ensure we have permission to delete
        await loginAsSuperuser(pb);
        await deleteTestUser(pb, userId);
    }
}