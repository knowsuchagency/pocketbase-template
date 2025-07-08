<script lang="ts">
  import { goto } from '$app/navigation';
  import pb from '$lib/pocketbase';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let isLoading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    isLoading = true;

    try {
      if (!pb) {
        throw new Error('PocketBase client not initialized');
      }
      await pb.collection('users').authWithPassword(email, password);
      await goto('/dashboard');
    } catch (err: any) {
      error = err.message || 'Login failed';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Login</h2>
    
    {#if error}
      <div class="alert alert-error">
        <span>{error}</span>
      </div>
    {/if}

    <form onsubmit={handleSubmit} class="space-y-6">
      <div class="form-control w-full">
        <label class="label pb-1" for="email">
          <span class="label-text text-sm font-medium">Email</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="email@example.com"
          class="input input-bordered w-full"
          bind:value={email}
          required
          disabled={isLoading}
        />
      </div>

      <div class="form-control w-full">
        <label class="label pb-1" for="password">
          <span class="label-text text-sm font-medium">Password</span>
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          class="input input-bordered w-full"
          bind:value={password}
          required
          disabled={isLoading}
        />
      </div>

      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary" disabled={isLoading}>
          {#if isLoading}
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