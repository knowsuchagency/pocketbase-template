import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
    createTestPb, 
    loginAsSuperuser, 
    createTestUser, 
    cleanupTestUser 
} from '$lib/test-utils';

describe('Login Flow', () => {
    let pb;
    let testUser;
    let testUserPassword;
    
    beforeAll(async () => {
        // Create PocketBase instance
        pb = createTestPb();
        
        // Login as superuser to create test user
        await loginAsSuperuser(pb);
        
        // Create a test user
        const result = await createTestUser(pb, {
            email: 'test-login@example.com',
            password: 'TestLogin123!',
            passwordConfirm: 'TestLogin123!'
        });
        
        testUser = result.user;
        testUserPassword = result.password;
        
        // Clear auth to simulate logged out state
        pb.authStore.clear();
    });
    
    afterAll(async () => {
        // Cleanup test user
        await cleanupTestUser(pb, testUser?.id);
    });
    
    it('should authenticate a user with valid credentials', async () => {
        // Attempt to login with test user credentials
        const authData = await pb.collection('users').authWithPassword(
            testUser.email,
            testUserPassword
        );
        
        // Verify authentication was successful
        expect(authData.token).toBeTruthy();
        expect(authData.record).toBeTruthy();
        expect(authData.record.email).toBe(testUser.email);
        expect(pb.authStore.isValid).toBe(true);
        expect(pb.authStore.model?.id).toBe(testUser.id);
    });
    
    it('should fail authentication with invalid credentials', async () => {
        // Clear any existing auth
        pb.authStore.clear();
        
        // Attempt to login with wrong password
        await expect(
            pb.collection('users').authWithPassword(
                testUser.email,
                'WrongPassword123!'
            )
        ).rejects.toThrow();
        
        // Verify auth store remains empty
        expect(pb.authStore.isValid).toBe(false);
        expect(pb.authStore.model).toBeNull();
    });
    
    it('should clear authentication on logout', async () => {
        // First login
        await pb.collection('users').authWithPassword(
            testUser.email,
            testUserPassword
        );
        
        // Verify logged in
        expect(pb.authStore.isValid).toBe(true);
        
        // Logout
        pb.authStore.clear();
        
        // Verify logged out
        expect(pb.authStore.isValid).toBe(false);
        expect(pb.authStore.model).toBeNull();
        expect(pb.authStore.token).toBe('');
    });
    
    it('should persist authentication across page reloads', async () => {
        // Login
        const authData = await pb.collection('users').authWithPassword(
            testUser.email,
            testUserPassword
        );
        
        const originalToken = authData.token;
        const originalModel = authData.record;
        
        // Simulate creating a new PocketBase instance (like on page reload)
        const newPb = createTestPb();
        
        // Manually set the auth data (simulating localStorage persistence)
        newPb.authStore.save(originalToken, originalModel);
        
        // Verify auth is still valid
        expect(newPb.authStore.isValid).toBe(true);
        expect(newPb.authStore.model?.id).toBe(testUser.id);
        expect(newPb.authStore.token).toBe(originalToken);
    });
});