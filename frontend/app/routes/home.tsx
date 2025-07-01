import type { Route } from "./+types/home";
import LoginForm from "../components/LoginForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - PocketBase App" },
    { name: "description", content: "Login to your account" },
  ];
}

export default function Home() {
  return <LoginForm />;
}
