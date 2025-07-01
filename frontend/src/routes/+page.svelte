
<script>
    import { currentUser, pb } from '$lib/pocketbase';
    import LoginForm from '$lib/components/LoginForm.svelte';
    
    function handleLogout() {
        pb.authStore.clear();
    }
</script>

{#if $currentUser}
    <div class="min-h-screen bg-base-200">
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <a href="/" class="btn btn-ghost text-xl">PocketBase App</a>
            </div>
            <div class="flex-none gap-2">
                <div class="dropdown dropdown-end">
                    <div class="flex items-center gap-4">
                        <span class="text-sm">Welcome, {$currentUser.email}</span>
                        <button class="btn btn-ghost btn-sm" on:click={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="container mx-auto p-8">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h1 class="card-title text-3xl">Welcome to your PocketBase App!</h1>
                    <p class="mt-4">You are successfully logged in.</p>
                    <div class="mt-6">
                        <h2 class="text-xl font-semibold mb-2">User Details:</h2>
                        <pre class="bg-base-200 p-4 rounded-lg overflow-x-auto">{JSON.stringify($currentUser, null, 2)}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else}
    <LoginForm />
{/if}
