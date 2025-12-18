import { ThemeToggle } from "@/components/ThemeToggle";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end">
        <ThemeToggle />
      </div>
    </footer>
  );
}