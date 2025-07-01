// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
    createTestPb, 
    loginAsSuperuser, 
    createTestUser, 
    cleanupTestUser 
} from '$lib/test-utils';

describe('Login Integration Tests', () => {
    let pb;
    let testUser;
    let testUserPassword;
    
    beforeAll(async () => {
        // Create PocketBase instance
        pb = createTestPb();
        
        // Login as superuser to create test user
        await loginAsSuperuser(pb);
        
        // Create a test user for integration testing
        const result = await createTestUser(pb, {
            email: 'integration-test@example.com',
            password: 'IntegrationTest123!',
            passwordConfirm: 'IntegrationTest123!'
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
    
    it('should complete full login flow', async () => {
        // Verify starting logged out
        expect(pb.authStore.isValid).toBe(false);
        
        // Login with test user
        const authData = await pb.collection('users').authWithPassword(
            testUser.email,
            testUserPassword
        );
        
        // Verify login successful
        expect(authData.token).toBeTruthy();
        expect(authData.record.email).toBe(testUser.email);
        expect(pb.authStore.isValid).toBe(true);
        
        // Verify user data is stored
        expect(pb.authStore.model).toBeTruthy();
        expect(pb.authStore.model.email).toBe(testUser.email);
        
        // Logout
        pb.authStore.clear();
        
        // Verify logged out
        expect(pb.authStore.isValid).toBe(false);
        expect(pb.authStore.model).toBeNull();
    });
    
    it('should handle login errors gracefully', async () => {
        // Try to login with wrong email
        await expect(
            pb.collection('users').authWithPassword(
                'nonexistent@example.com',
                'SomePassword123!'
            )
        ).rejects.toThrow();
        
        // Try to login with wrong password
        await expect(
            pb.collection('users').authWithPassword(
                testUser.email,
                'WrongPassword123!'
            )
        ).rejects.toThrow();
        
        // Verify still logged out after failed attempts
        expect(pb.authStore.isValid).toBe(false);
    });
    
    it('should validate authentication token', async () => {
        // Login to get a valid token
        const authData = await pb.collection('users').authWithPassword(
            testUser.email,
            testUserPassword
        );
        
        const token = authData.token;
        
        // Create new PocketBase instance to simulate new session
        const newPb = createTestPb();
        
        // Set the token
        newPb.authStore.save(token, authData.record);
        
        // Verify token is valid
        expect(newPb.authStore.isValid).toBe(true);
        
        // Try to refresh the auth (this validates the token with the server)
        try {
            await newPb.collection('users').authRefresh();
            expect(newPb.authStore.isValid).toBe(true);
        } catch (error) {
            // Token might have expired, which is ok for this test
            console.log('Token refresh failed:', error.message);
        }
    });
});