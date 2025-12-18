import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useAuth } from "@/hooks";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  const title = "PocketBase Project";
  const description = "A modern full-stack application with PocketBase backend and React Router v7 frontend";
  const siteUrl = "https://your-domain.com";
  const imageUrl = `${siteUrl}/og-image.png`;

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: "PocketBase, React Router, TypeScript, Full Stack" },
    { name: "author", content: "Your Name" },

    // OpenGraph tags
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: title },
    { property: "og:site_name", content: "PocketBase Project" },
    { property: "og:locale", content: "en_US" },

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: title },

    // Additional meta tags
    { name: "theme-color", content: "#000000" },
    { name: "robots", content: "index, follow" },
  ];
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            PocketBase Project
          </h1>
          {isAuthenticated ? (
            <>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                Welcome back, {user?.email}!
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                You're logged in and ready to go.
              </p>
            </>
          ) : (
            <>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                A modern full-stack application template with PocketBase and React Router v7
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
