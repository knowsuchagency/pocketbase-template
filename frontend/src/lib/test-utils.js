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
    // We need admin privileges to create users since the collection has no public create rule
    const adminPb = createTestPb();
    await loginAsSuperuser(adminPb);
    
    // Generate a more unique email with timestamp and random string
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const defaultData = {
        email: `test-${timestamp}-${random}@example.com`,
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        emailVisibility: true
    };
    
    // If userData includes an email, use that instead
    const finalData = {
        ...defaultData,
        ...userData
    };
    
    try {
        const user = await adminPb.collection('users').create(finalData);
        return { user, password: finalData.password };
    } catch (error) {
        console.error('Failed to create user:', error.response?.data || error);
        throw error;
    }
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