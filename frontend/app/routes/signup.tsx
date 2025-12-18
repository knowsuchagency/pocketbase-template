import { useEffect } from "react";
import { useNavigate } from "react-router";
import { SignupForm } from "@/components/SignupForm";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks";
import type { Route } from "./+types/signup";

export function meta({}: Route.MetaArgs) {
  const title = "Sign Up - PocketBase Project";
  const description = "Create your account";
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

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <SignupForm />
      </main>
    </div>
  );
}
