"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-nav border-b border-border/50 shadow-lg' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:px-16">
        <Link href="/" className="flex items-center space-x-2 group">
          <Activity className="h-8 w-8 text-neon group-hover:text-neon-secondary transition-colors" />
          <span className="text-2xl font-bold bg-gradient-to-r from-neon to-neon-secondary bg-clip-text text-transparent group-hover:from-neon-secondary group-hover:to-neon transition-all duration-300">
            HealthCheck
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            href="/" 
            className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-neon transition-colors duration-200 group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon to-neon-secondary group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-sm font-medium text-foreground hover:text-neon hover:bg-neon/10 transition-all duration-200 group relative"
              >
                Calculators
                <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon to-neon-secondary group-hover:w-full transition-all duration-300"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl">
              <DropdownMenuItem asChild className="hover:bg-neon/10 hover:text-neon transition-colors">
                <Link href="/calculators/bmi" className="w-full">BMI Calculator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-neon-secondary/10 hover:text-neon-secondary transition-colors">
                <Link href="/calculators/calories" className="w-full">Calorie Calculator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-neon-green/10 hover:text-neon-green transition-colors">
                <Link href="/calculators/macros" className="w-full">Macro Calculator</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            href="/health-check" 
            className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-neon transition-colors duration-200 group"
          >
            Health Check
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon to-neon-secondary group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            href="/pricing" 
            className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-neon transition-colors duration-200 group"
          >
            Pricing
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon to-neon-secondary group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Mobile menu button - for future implementation */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" className="text-foreground hover:text-neon">
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}