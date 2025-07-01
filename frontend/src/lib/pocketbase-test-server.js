import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use a global to ensure we only start one instance
const globalKey = '__pocketbase_test_server__';
if (!global[globalKey]) {
    global[globalKey] = {
        process: null,
        weStartedIt: false,
        startPromise: null
    };
}

// Check if PocketBase is running
async function isPocketBaseRunning() {
    try {
        const response = await fetch('http://localhost:8090/health');
        return response.ok && await response.text() === 'OK';
    } catch (error) {
        return false;
    }
}

// Wait for PocketBase to be ready
async function waitForPocketBase(maxAttempts = 30, delayMs = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
        if (await isPocketBaseRunning()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    return false;
}

// Start PocketBase server
export async function startPocketBaseIfNeeded() {
    const state = global[globalKey];
    
    // If already starting, wait for that promise
    if (state.startPromise) {
        return state.startPromise;
    }
    
    // Create the start promise
    state.startPromise = (async () => {
        // Check if already running
        if (await isPocketBaseRunning()) {
            console.log('PocketBase is already running on port 8090');
            state.weStartedIt = false;
            return;
        }

        console.log('Starting PocketBase server for tests...');
        
        // Path to the main.go file in the parent directory
        const projectRoot = resolve(__dirname, '../../..');
        
        // Start PocketBase process
        state.process = spawn('go', ['run', 'main.go', 'serve', '--dev'], {
            cwd: projectRoot,
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: false
        });

        state.weStartedIt = true;

        // Handle process output
        state.process.stdout.on('data', (data) => {
            const output = data.toString();
            // Only log if it's an important message
            if (output.includes('Server started') || output.includes('error')) {
                console.log(`PocketBase: ${output.trim()}`);
            }
        });

        state.process.stderr.on('data', (data) => {
            console.error(`PocketBase Error: ${data.toString().trim()}`);
        });

        state.process.on('error', (error) => {
            console.error('Failed to start PocketBase:', error);
        });

        // Wait for server to be ready
        const isReady = await waitForPocketBase();
        if (!isReady) {
            throw new Error('PocketBase failed to start within timeout period');
        }

        console.log('PocketBase server started successfully');
    })();
    
    return state.startPromise;
}

// Stop PocketBase server if we started it
export async function stopPocketBaseIfWeStartedIt() {
    const state = global[globalKey];
    
    if (!state.weStartedIt || !state.process) {
        return;
    }

    console.log('Stopping PocketBase server...');
    
    return new Promise((resolve) => {
        state.process.on('exit', () => {
            console.log('PocketBase server stopped');
            state.process = null;
            state.weStartedIt = false;
            state.startPromise = null;
            resolve();
        });

        // Try graceful shutdown first
        state.process.kill('SIGTERM');

        // Force kill after 5 seconds if still running
        setTimeout(() => {
            if (state.process) {
                state.process.kill('SIGKILL');
            }
        }, 5000);
    });
}

// Setup function for tests
export async function setupPocketBaseForTests() {
    await startPocketBaseIfNeeded();
}

// Teardown function for tests
export async function teardownPocketBaseForTests() {
    await stopPocketBaseIfWeStartedIt();
}