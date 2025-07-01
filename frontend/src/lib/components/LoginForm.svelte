<script>
    import { pb } from '$lib/pocketbase';
    
    let email = '';
    let password = '';
    let loading = false;
    let error = '';
    
    async function handleLogin() {
        loading = true;
        error = '';
        
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            console.log('Login successful:', authData);
        } catch (err) {
            console.error('Login failed:', err);
            error = err.message || 'Login failed. Please check your credentials.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title text-2xl font-bold text-center mb-6">Login</h2>
            
            <form on:submit|preventDefault={handleLogin}>
                <div class="form-control w-full">
                    <label class="label" for="email">
                        <span class="label-text">Email</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        class="input input-bordered w-full"
                        bind:value={email}
                        required
                        disabled={loading}
                    />
                </div>
                
                <div class="form-control w-full mt-4">
                    <label class="label" for="password">
                        <span class="label-text">Password</span>
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        class="input input-bordered w-full"
                        bind:value={password}
                        required
                        disabled={loading}
                    />
                </div>
                
                {#if error}
                    <div class="alert alert-error mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                {/if}
                
                <div class="form-control mt-6">
                    <button 
                        type="submit" 
                        class="btn btn-primary"
                        disabled={loading}
                    >
                        {#if loading}
                            <span class="loading loading-spinner"></span>
                            Logging in...
                        {:else}
                            Login
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>