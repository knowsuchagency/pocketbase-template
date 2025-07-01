// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

// This tells SvelteKit that this app is an SPA
export const ssr = false;

// The fallback page is rendered when a request for a page that doesn't
// exist is made. This is the SPA behavior.
export const trailingSlash = 'always';