<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import pb from '$lib/pocketbase';
  import { currentUser } from '$lib/stores/auth';

  let user = $derived($currentUser);

  onMount(() => {
    if (!$currentUser) {
      goto('/');
    }
  });

  function handleLogout() {
    pb?.authStore.clear();
    goto('/');
  }
</script>

{#if user}
  <div class="min-h-screen bg-base-100">
    <div class="navbar bg-base-200">
      <div class="flex-1">
        <a href="/dashboard" class="btn btn-ghost text-xl">Dashboard</a>
      </div>
      <div class="flex-none gap-4">
        <span class="text-sm">Welcome, {user.email}</span>
        <button class="btn btn-outline btn-sm" onclick={handleLogout}>
          Logout
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">User Information</h2>
          <div class="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Created:</strong> {new Date(user.created).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}