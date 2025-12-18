import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme.store";
import { NotificationList } from "@/components/NotificationList";
import { QueryProvider } from "@/providers";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Primary Meta Tags */}
        <title>PocketBase Project</title>
        <meta name="title" content="PocketBase Project" />
        <meta name="description" content="A modern full-stack application with PocketBase backend and React Router v7 frontend" />
        <meta name="keywords" content="PocketBase, React Router, TypeScript, Full Stack" />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta property="og:title" content="PocketBase Project" />
        <meta property="og:description" content="A modern full-stack application with PocketBase backend and React Router v7 frontend" />
        <meta property="og:image" content="https://your-domain.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="PocketBase Project" />
        <meta property="og:site_name" content="PocketBase Project" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://your-domain.com" />
        <meta name="twitter:title" content="PocketBase Project" />
        <meta name="twitter:description" content="A modern full-stack application with PocketBase backend and React Router v7 frontend" />
        <meta name="twitter:image" content="https://your-domain.com/og-image.png" />
        <meta name="twitter:image:alt" content="PocketBase Project" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { effectiveTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  return (
    <QueryProvider>
      <Outlet />
      <NotificationList />
    </QueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
