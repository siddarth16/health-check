import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 HealthCheck. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="/disclaimer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Disclaimer
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}