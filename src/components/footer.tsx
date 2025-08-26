import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground mb-2">
              © 2024 HealthCheck. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Professional health calculators for better wellness planning.
            </p>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link
              href="/disclaimer"
              className="text-sm text-muted-foreground hover:text-neon transition-colors duration-200 relative group"
            >
              Disclaimer
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-neon-secondary transition-colors duration-200 relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link
              href="/health-check"
              className="text-sm text-muted-foreground hover:text-neon-green transition-colors duration-200 relative group"
            >
              Health Check
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-green group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}